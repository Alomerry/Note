# gRPC

## ？

http://www.likecs.com/show-124458.html

## 1.26



### gRPC服务注册发现及负载均衡的实现方案与源码解析

https://blog.csdn.net/kevin_tech/article/details/109281835

### RoundRobin

grpc client端创建连接时可以用WithBalancer来指定负载均衡组件，这里研究下grpc自带的RoundRobin（轮询调度）的实现。源码在google.golang.org/grpc/balancer.go中。

roundRobin结构体定义如下：

```
type roundRobin struct {
	r      naming.Resolver
	w      naming.Watcher
	addrs  []*addrInfo
	mu     sync.Mutex
	addrCh chan []Address
	next   int
	waitCh chan struct{}
	done   bool
}
```



- r是命名解析器，可以定义自己的命名解析器，如etcd命名解析器。如果r为nil，那么Dial中参数target将直接作为可请求地址添加到addrs中。
- w是命名解析器Resolve方法返回的watcher，该watcher可以监听命名解析器发来的地址信息变化，通知roundRobin对addrs中的地址进行动态的增删。
- addrs是从命名解析器获取地址信息数组，数组中每个地址不仅有地址信息，还有grpc与该地址是否已经创建了ready状态的连接。
- addrCh是地址数组的channel，该channel会在每次命名解析器发来地址信息变化后，将所有addrs通知到grpc内部的lbWatcher，lbWatcher是统一管理地址连接状态的协程，负责新地址的连接与被删除地址的关闭操作。
- next是roundRobin的Index，即轮询调度遍历到addrs数组中的哪个位置了。
- waitCh是当addrs中地址为空时，grpc调用Get()方法希望获取到一个到target的连接，如果设置了grpc的failfast为false，那么Get()方法会阻塞在此channel上，直到有ready的连接。

#### roundRobin启动

```go
func (rr *roundRobin) Start(target string, config BalancerConfig) error {
	rr.mu.Lock()
	defer rr.mu.Unlock()
	if rr.done {
		return ErrClientConnClosing
	}
	if rr.r == nil {
		// 如果没有解析器，那么直接将target加入addrs地址数组
		rr.addrs = append(rr.addrs, &addrInfo{addr: Address{Addr: target}})
		return nil
	}
	// Resolve接口会返回一个watcher，watcher可以监听解析器的地址变化
	w, err := rr.r.Resolve(target)
	if err != nil {
		return err
	}
	rr.w = w
	// 创建一个channel，当watcher监听到地址变化时，通知grpc内部lbWatcher去连接该地址
	rr.addrCh = make(chan []Address, 1)
	// go 出去监听watcher，监听地址变化。
	go func() {
		for {
			if err := rr.watchAddrUpdates(); err != nil {
				return
			}
		}
	}()
	return nil
}
```



#### 监听命名解析器的地址变化：

```go
func (rr *roundRobin) watchAddrUpdates() error {
	// watcher的next方法会阻塞，直至有地址变化信息过来，updates即为变化信息
	updates, err := rr.w.Next()
	if err != nil {
		return err
	}
	// 对于addrs地址数组的操作，显然是要加锁的，因为有多个goroutine在同时操作
	rr.mu.Lock()
	defer rr.mu.Unlock()
	for _, update := range updates {
		addr := Address{
			Addr:     update.Addr,
			Metadata: update.Metadata,
		}
		switch update.Op {
		case naming.Add:
		//对于新增类型的地址，注意这里不会重复添加。
			var exist bool
			for _, v := range rr.addrs {
				if addr == v.addr {
					exist = true
					break
				}
			}
			if exist {
				continue
			}
			rr.addrs = append(rr.addrs, &addrInfo{addr: addr})
		case naming.Delete:
		//对于删除的地址，直接在addrs中删除就行了
			for i, v := range rr.addrs {
				if addr == v.addr {
					copy(rr.addrs[i:], rr.addrs[i+1:])
					rr.addrs = rr.addrs[:len(rr.addrs)-1]
					break
				}
			}
		default:
			grpclog.Errorln("Unknown update.Op ", update.Op)
		}
	}
	// 这里复制了整个addrs地址数组，然后丢到addrCh channel中通知grpc内部lbWatcher，
	// lbWatcher会关闭删除的地址，连接新增的地址。
	// 连接ready后会有专门的goroutine调用Up方法修改addrs中地址的状态。
	open := make([]Address, len(rr.addrs))
	for i, v := range rr.addrs {
		open[i] = v.addr
	}
	if rr.done {
		return ErrClientConnClosing
	}
	select {
	case <-rr.addrCh:
	default:
	}
	rr.addrCh <- open
	return nil
}
```

#### Up方法：

up方法是grpc内部负载均衡watcher调用的，该watcher会读全局的连接状态改变队列，如果是ready状态的连接，会调用up方法来改变addrs地址数组中该地址的状态为**已连接**。

```go
func (rr *roundRobin) Up(addr Address) func(error) {
	rr.mu.Lock()
	defer rr.mu.Unlock()
	var cnt int
	//将地址数组中的addr置为已连接状态，这样这个地址就可以被client使用了。
	for _, a := range rr.addrs {
		if a.addr == addr {
			if a.connected {
				return nil
			}
			a.connected = true
		}
		if a.connected {
			cnt++
		}
	}
	// 当有一个可用地址时，之前可能是0个，可能要很多client阻塞在获取连接地址上，这里通知所有的client有可用连接啦。
	// 为什么只等于1时通知？因为可用地址数量>1时，client是不会阻塞的。
	if cnt == 1 && rr.waitCh != nil {
		close(rr.waitCh)
		rr.waitCh = nil
	}
	//返回禁用该地址的方法
	return func(err error) {
		rr.down(addr, err)
	}
}
```

#### down方法：
down方法就简单了, 直接找到addr置为不可用就行了。

```go
//如果addr1已经被连接上了，但是resolver通知删除了，grpc内部如何处理关闭的逻辑？
func (rr *roundRobin) down(addr Address, err error) {
	rr.mu.Lock()
	defer rr.mu.Unlock()
	for _, a := range rr.addrs {
		if addr == a.addr {
			a.connected = false
			break
		}
	}
}
```

#### Get()方法：

client 需要获取一个可用的地址，如果addrs为空，或者addrs不为空，但是地址都不可用（没连接），Get()方法会返回错误。但是如果设置了failfast = false，Get()方法会阻塞在waitCh channel上，直至Up方法给到通知，然后轮询调度可用的地址。

```go
func (rr *roundRobin) Get(ctx context.Context, opts BalancerGetOptions) (addr Address, put func(), err error) {
	var ch chan struct{}
	rr.mu.Lock()
	if rr.done {
		rr.mu.Unlock()
		err = ErrClientConnClosing
		return
	}

	if len(rr.addrs) > 0 {
		// addrs的长度可能变化，如果next值超出了，就置为0，从头开始调度。
		if rr.next >= len(rr.addrs) {
			rr.next = 0
		}
		next := rr.next
		//遍历整个addrs数组，直到选出一个可用的地址
		for {
			a := rr.addrs[next]
			// next值加一，当然是循环的，到len(addrs)后，变为0
			next = (next + 1) % len(rr.addrs)
			if a.connected {
				addr = a.addr
				rr.next = next
				rr.mu.Unlock()
				return
			}
			if next == rr.next {
				// 遍历完一圈了，还没找到，走下面逻辑
				break
			}
		}
	}
	if !opts.BlockingWait { //如果是非阻塞模式，如果没有可用地址，那么报错
		if len(rr.addrs) == 0 {
			rr.mu.Unlock()
			err = status.Errorf(codes.Unavailable, "there is no address available")
			return
		}
		// Returns the next addr on rr.addrs for failfast RPCs.
		addr = rr.addrs[rr.next].addr
		rr.next++
		rr.mu.Unlock()
		return
	}
	// Wait on rr.waitCh for non-failfast RPCs.
	// 如果是阻塞模式，那么需要阻塞在waitCh上，直到Up方法给通知
	if rr.waitCh == nil {
		ch = make(chan struct{})
		rr.waitCh = ch
	} else {
		ch = rr.waitCh
	}
	rr.mu.Unlock()
	for {
		select {
		case <-ctx.Done():
			err = ctx.Err()
			return
		case <-ch:
			rr.mu.Lock()
			if rr.done {
				rr.mu.Unlock()
				err = ErrClientConnClosing
				return
			}

			if len(rr.addrs) > 0 {
				if rr.next >= len(rr.addrs) {
					rr.next = 0
				}
				next := rr.next
				for {
					a := rr.addrs[next]
					next = (next + 1) % len(rr.addrs)
					if a.connected {
						addr = a.addr
						rr.next = next
						rr.mu.Unlock()
						return
					}
					if next == rr.next {
						// 遍历完一圈了，还没找到，可能刚Up的地址被down掉了，重新等待。
						break
					}
				}
			}
			// The newly added addr got removed by Down() again.
			if rr.waitCh == nil {
				ch = make(chan struct{})
				rr.waitCh = ch
			} else {
				ch = rr.waitCh
			}
			rr.mu.Unlock()
		}
	}
}
```

#### lbWatcher：

lbWatcher会监听地址变化信息，roundroubin每次有地址变化时，会将所有的地址通知给lbWatcher，lbWatcher本身维护了地址连接的map表，会找出新添加的地址和需要删除的地址，然后做连接、关闭操作，再调用roundRobin的Up/Down方法通知连接的状态。

```go
func (bw *balancerWrapper) lbWatcher() {
	notifyCh := bw.balancer.Notify()
	if notifyCh == nil {
		// 没有定义解析器，直接连接这个地址。
		a := resolver.Address{
			Addr: bw.targetAddr,
			Type: resolver.Backend,
		}
		sc, err := bw.cc.NewSubConn([]resolver.Address{a}, balancer.NewSubConnOptions{})
		if err != nil {
			grpclog.Warningf("Error creating connection to %v. Err: %v", a, err)
		} else {
			bw.mu.Lock()
			bw.conns[a] = sc
			bw.connSt[sc] = &scState{
				addr: Address{Addr: bw.targetAddr},
				s:    connectivity.Idle,
			}
			bw.mu.Unlock()
			sc.Connect()
		}
		return
	}

	for addrs := range notifyCh {
			var newAddrs []resolver.Address
			for _, a := range addrs {
				newAddr := resolver.Address{
					Addr:       a.Addr,
					Type:       resolver.Backend, // All addresses from balancer are all backends.
					ServerName: "",
					Metadata:   a.Metadata,
				}
				newAddrs = append(newAddrs, newAddr)
			}
			var (
				add []resolver.Address // Addresses need to setup connections.
				del []balancer.SubConn // Connections need to tear down.
			)
			resAddrs := make(map[resolver.Address]Address)
			for _, a := range addrs {
				resAddrs[resolver.Address{
					Addr:       a.Addr,
					Type:       resolver.Backend, // All addresses from balancer are all backends.
					ServerName: "",
					Metadata:   a.Metadata,
				}] = a
			}
			bw.mu.Lock()
			// 新添加的地址，需要去新建连接
			for a := range resAddrs {
				if _, ok := bw.conns[a]; !ok {
					add = append(add, a)
				}
			}
			// 要被删除的地址，需要去关闭连接
			for a, c := range bw.conns {
				if _, ok := resAddrs[a]; !ok {
					del = append(del, c)
					delete(bw.conns, a)
					// Keep the state of this sc in bw.connSt until its state becomes Shutdown.
				}
			}
			bw.mu.Unlock()
			for _, a := range add {
				sc, err := bw.cc.NewSubConn([]resolver.Address{a}, balancer.NewSubConnOptions{})
				if err != nil {
					grpclog.Warningf("Error creating connection to %v. Err: %v", a, err)
				} else {
					bw.mu.Lock()
					bw.conns[a] = sc
					bw.connSt[sc] = &scState{
						addr: resAddrs[a],
						s:    connectivity.Idle,
					}
					bw.mu.Unlock()
					sc.Connect()//  这一步真正做了连接的操作。
				}
			}
			for _, c := range del {
				bw.cc.RemoveSubConn(c)
			}
		}
	}
}
```

## 1.35

### 基于 gRPC 的服务注册与发现和负载均衡的原理与实战

https://blog.csdn.net/ra681t58cjxsgckj31/article/details/110675344



### gRPC 流程

#### Dial 流程

- 调用 DialContext

  - `cc.parsedTarget = grpcutil.ParseTarget(cc.target, cc.dopts.copts.Dialer != nil)` 根据传入的 target 选择 resolver
  - 调用 getResolver，使用 parsedTarget 中的 scheme 去 clientConn 和注册过的 resolver 中查找 builder。
  
- `rWrapper, err := newCCResolverWrapper(cc, resolverBuilder)` 在这步使用  builder 的 build 方法构建 resolver 

#### fileResolver 流程

- 创建 watcher 协程，并阻塞等待操作系统信号，或 context 关闭。
  - 接收到系统信号后，会读取并解析  `/etc/containerpilot/services.json` 文件中的活跃服务端节点列表。
  - 对比 resolver 中记录的活跃节点，查找出新节点和失效节点，调用 UpdateState 进行更新。
    - ResolverWrapper 中调用  updateResolverState
      - 首次进入 updateResolverState 方法会初始化 balanceWarpper，调用 maybeApplyDefaultServiceConfig 后调用 applyServiceConfigAndBalancer。
      - 调用 updateClientConnState

### resolver

当我们的服务刚刚成型时，可能一个服务只有一台实例，这时候client要建立grpc连接很简单，只需要指定server的ip就可以了。但是，当服务成熟了，业务量大了，这个时候，一个实例就就不够用了，我们需要部署一个服务集群。一个集群有很多实例，且可以随时的扩容，部分实例出现了故障也没关系，这样就提升了服务的处理能力和稳定性，但是也带来一个问题，grpc的client，如何和这个集群里的server建立连接？

这个问题可以一分为二，第一个问题：如何根据服务名称，返回实例的ip？这个问题有很多种解决方案，我们可以使用一些成熟的服务发现组件，例如consul或者zookeeper，也可以我们自己实现一个解析服务器；第二个问题，如何将我们选择的服务解析方式应用到grpc的连接建立中去？这个也不难，因为grpc的resolver，就是帮我们解决这个问题的，本篇，我们就来探讨一下，grpc的resolver是如何工作的，以及我们如何在项目中，使用resolver实现服务名称的解析。

#### resolver的工作原理

关于resolver，我们主要有两个问题：

- 程序启动时，客户端是如何从一个域名/服务名，获取到其对应的实例ip，然后与之建立连接的呢？

- 运行过程中，如果后端的实例挂了，grpc如何感知到，并重新建立连接呢？

接下来，我们就深入源码，搞清楚这两个问题。

#### 启动时的解析过程

我们在使用grpc的时候，首先要做的就是调用Dial或DialContext函数来初始化一个clientConn对象，而resolver是这个连接对象的一个重要的成员，所以我们首先看一看clientConn对象创建过程中，resolver是怎么设置进去的。

客户端启动时，一定会调用grpc的Dial或DialContext函数来创建连接，而这两个函数都需要传入一个名为target的参数，target，就是连接的目标，也就是server了，接下来，我们就看一看，DialContext函数里是如何处理这个target的。

首先，创建了一个clientConn对象，并把target赋给了对象中的target：

```go
	cc := &ClientConn{
		target:            target,
		csMgr:             &connectivityStateManager{},
		conns:             make(map[*addrConn]struct{}),
		dopts:             defaultDialOptions(),
		blockingpicker:    newPickerWrapper(),
		czData:            new(channelzData),
		firstResolveEvent: grpcsync.NewEvent(),
	}
```

接下来，对这个target进行解析

```go
cc.parsedTarget = grpcutil.ParseTarget(cc.target)
```

我们可以看看ParseTarget这个函数做了些什么：

```go
// ParseTarget splits target into a resolver.Target struct containing scheme,
// authority and endpoint.
//
// If target is not a valid scheme://authority/endpoint, it returns {Endpoint:
// target}.
func ParseTarget(target string) (ret resolver.Target) {
	var ok bool
	ret.Scheme, ret.Endpoint, ok = split2(target, "://")
	if !ok {
		return resolver.Target{Endpoint: target}
	}
	ret.Authority, ret.Endpoint, ok = split2(ret.Endpoint, "/")
	if !ok {
		return resolver.Target{Endpoint: target}
	}
	return ret
}
```

可以看到，这个函数对target这个string进行了拆分，"://"前面的是scheme，也就是解析方案，后面的又可以分为authority和endpoint，endpoint比较好理解，就是对端，也就是server的一个标识，authority的话，我们的项目中并没有用，我也并不能完全理解，所以这里贴上[官方文档](https://github.com/grpc/grpc/blob/master/doc/naming.md)给出的一行解释，大家自行体会去吧。。

```go
authority indicates the DNS server to use, although this is only supported by some implementations. (In C-core, the default DNS resolver does not support this, but the c-ares based resolver supports specifying this in the form "IP:port".)
```

那么解析出来的scheme有什么用呢？不要急，我们回到DialContext函数，接着往下看：

解析完target之后执行的是下面这一句：

```go
resolverBuilder := cc.getResolver(cc.parsedTarget.Scheme)
```

也就是在根据解析的结果，包括scheme和endpoint这两个参数，获取一个resolver的builder，我们来看看获取的逻辑是怎么样的：

```go
func (cc *ClientConn) getResolver(scheme string) resolver.Builder {
	for _, rb := range cc.dopts.resolvers {
		if scheme == rb.Scheme() {
			return rb
		}
	}
	return resolver.Get(scheme)
}
```

这里呢，其实就是在根据scheme进行查找，如果resolver已经在调用DialContext的时候通过opts参数传了进来，那我们就直接用，否则调用resolver.Get(scheme)去找，我们项目中就是用的resolver.Get(scheme)，所以我们再来看看这里是怎么做的：

```go
// Get returns the resolver builder registered with the given scheme.
//
// If no builder is register with the scheme, nil will be returned.
func Get(scheme string) Builder {
	if b, ok := m[scheme]; ok {
		return b
	}
	return nil
}
```

这里面，Get函数是通过m这个map，去查找有没有scheme对应的resolver的builder，那么m这个map是什么时候插入的值呢？这个在resolver的Register函数里：

```go
func Register(b Builder) {
	m[b.Scheme()] = b
}
```

那么谁会去调用这个Register函数，向map中写入resolver呢？有两个人会去调，首先，grpc实现了一个默认的解析器，也就是"passthrough"，这个看名字就理解了，就是透传，所谓透传就是，什么都不做，那么什么时候需要透传呢？当你调用DialContext的时候，如果传入的target本身就是一个ip+port，这个时候，自然就不需要再解析什么了。那么"passthrough"对应的这个默认的解析器是什么时候注册到m这个map中的呢？这个调用在passthrough包的init函数里

```go
func init() {
	resolver.Register(&passthroughBuilder{})
}
```

而grpc包会import这个_ "google.golang.org/grpc/internal/resolver/passthrough"包，所以，"passthrough"这个解析器在grpc初始化的时候就会被注册到m这个map中。

回到谁会去调用这个Register函数这个问题，事实上，服务名称的解析会根据我们项目使用的命名系统的不同，而存在多种不同的方案，如果我们是使用consul实现服务发现，那么我们就希望我们的解析器实现的是通过concul客户端获取服务信息，而如果我们用的是dns服务，那么我们的解析器就应该通过我们的dns服务器去获取指定域名对应的服务器ip，总而言之，实现服务名称解析的方式太多了，所以grpc无法为我们一一实现，因此，需要我们自己根据自己使用的命名系统，去实现可以满足我们项目需求的resolver，然后将其Register到m这个map中来，这个就涉及到resolver的具体用法了，我们下一节再详细讲，这里先记住，Register这个函数，是需要我们自己实现完resolver去调用的。

再回到DialContext这个函数，在通过getResolver获取resolver的builder之后，如果结果为nil，也就是没找到，会怎么样呢？

```go
	resolverBuilder := cc.getResolver(cc.parsedTarget.Scheme)
	if resolverBuilder == nil {
		// If resolver builder is still nil, the parsed target's scheme is
		// not registered. Fallback to default resolver and set Endpoint to
		// the original target.
		channelz.Infof(cc.channelzID, "scheme %q not registered, fallback to default scheme", cc.parsedTarget.Scheme)
		cc.parsedTarget = resolver.Target{
			Scheme:   resolver.GetDefaultScheme(),
			Endpoint: target,
		}
		resolverBuilder = cc.getResolver(cc.parsedTarget.Scheme)
		if resolverBuilder == nil {
			return nil, fmt.Errorf("could not get resolver for default scheme: %q", cc.parsedTarget.Scheme)
		}
	}
```

可以看到，scheme会被设置为默认的scheme，这个默认的scheme又是啥呢？

```go
defaultScheme = "passthrough"
```

是的，就是这个passthrough，也就是说，没有获取到对应的resolver的时候，我们就认为是直接传了ip+port进来，就不去解析就好了。

接下来，DialContext函数会使用获取到的resolver的builder，构建一个resolver，并将其赋给cc这个对象：

```go
    // Build the resolver.
	rWrapper, err := newCCResolverWrapper(cc, resolverBuilder)
	if err != nil {
		return nil, fmt.Errorf("failed to build resolver: %v", err)
	}
	cc.mu.Lock()
	cc.resolverWrapper = rWrapper
	cc.mu.Unlock()
```

而使用builder构建resolver的时候又做了什么呢？我们再来看看newCCResolverWrapper函数：

```go
// newCCResolverWrapper uses the resolver.Builder to build a Resolver and
// returns a ccResolverWrapper object which wraps the newly built resolver.
func newCCResolverWrapper(cc *ClientConn, rb resolver.Builder) (*ccResolverWrapper, error) {
	ccr := &ccResolverWrapper{
		cc:   cc,
		done: grpcsync.NewEvent(),
	}
 
	var credsClone credentials.TransportCredentials
	if creds := cc.dopts.copts.TransportCredentials; creds != nil {
		credsClone = creds.Clone()
	}
	rbo := resolver.BuildOptions{
		DisableServiceConfig: cc.dopts.disableServiceConfig,
		DialCreds:            credsClone,
		CredsBundle:          cc.dopts.copts.CredsBundle,
		Dialer:               cc.dopts.copts.Dialer,
	}
 
	var err error
	// We need to hold the lock here while we assign to the ccr.resolver field
	// to guard against a data race caused by the following code path,
	// rb.Build-->ccr.ReportError-->ccr.poll-->ccr.resolveNow, would end up
	// accessing ccr.resolver which is being assigned here.
	ccr.resolverMu.Lock()
	defer ccr.resolverMu.Unlock()
	ccr.resolver, err = rb.Build(cc.parsedTarget, ccr, rbo)
	if err != nil {
		return nil, err
	}
	return ccr, nil
}
```

这个函数最重要的一行，就是调用了我们传入的builder的Build方法，也就是这一行：

```go
ccr.resolver, err = rb.Build(cc.parsedTarget, ccr, rbo)
```

上面说过了，我们用的resolver还有resolver对应的builder都是需要我们自己实现的，所以Build方法里做了什么，这就要看你想让他做什么了，那么我们一般要在Build里完成哪些工作呢，这个我们下一节再探讨。

到这里，DialContext函数中关于resolver的部分我们就看完了，也知道了ClientConn对象的resolver是如何设置进去的，但是Dial函数只是创建了一个抽象的连接，实际的http2连接并没有在这里创建，所以我们接下来要探讨的就是，实际创建http2连接的时候，是如何利用resolver，获取到服务对应的ip的。

底层http2连接对应的是一个grpc的stream，而stream的创建有两种方式，一种就是我们主动去创建一个stream池，这样当有请求需要发送时，我们可以直接使用我们创建好的stream，关于stream池的用法，内容较多，本篇就先不探讨了，以后我会单独写一篇。除了我们自己创建，我们使用protoc为我们生成的客户端接口里，也会为我们实现stream的创建，也就是说这个完全是可以不用我们自己费心的，我们随便看一个protoc生成的客户端接口：

```go
func (c *greeterClient) SayHello(ctx context.Context, in *HelloRequest, opts ...grpc.CallOption) (*HelloReply, error) {
	out := new(HelloReply)
	err := c.cc.Invoke(ctx, "/helloworld.Greeter/SayHello", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}
```

这里，请求是通过Invoke函数发出的，所以接着看Invoke：

```go
func (cc *ClientConn) Invoke(ctx context.Context, method string, args, reply interface{}, opts ...CallOption) error {
	// allow interceptor to see all applicable call options, which means those
	// configured as defaults from dial option as well as per-call options
	opts = combine(cc.dopts.callOptions, opts)
 
	if cc.dopts.unaryInt != nil {
		return cc.dopts.unaryInt(ctx, method, args, reply, cc, invoke, opts...)
	}
	return invoke(ctx, method, args, reply, cc, opts...)
}
```

在没有设置拦截器的情况下，会直接调invoke：

```go
func invoke(ctx context.Context, method string, req, reply interface{}, cc *ClientConn, opts ...CallOption) error {
	cs, err := newClientStream(ctx, unaryStreamDesc, cc, method, opts...)
	if err != nil {
		return err
	}
	if err := cs.SendMsg(req); err != nil {
		return err
	}
	return cs.RecvMsg(reply)
}
```

这里我们看到，发送请求之前，会先创建一个stream，我们看看创建过程中的调用过程：

- newClientStream
- newAttemptLocked
- getTransport 
- pick
- getReadyTransport
- connect
- resetTransport
- tryAllAddrs
- createTransport
- NewClientTransport
- newHTTP2Client

这个过程看着还是挺长的，所以没有逐一的去贴代码，注意到最后，调用了newHTTP2Client，这就是我们想找的创建http2连接的地方了，再往底层我们就暂且不看了。

#### 运行过程中的更新过程

这一小节要搞明白的就是第二个问题：后端的实例挂了，client如何感知，并创建新的连接呢？

这要从上一小节最后给到到创建stream的调用过程继续说起，注意到，调用过程中，有一个函数是resetTransport，我们来看看这个函数的实现。

首先，这一段实现了连接的创建：

```go
newTr, addr, reconnect, err := ac.tryAllAddrs(addrs, connectDeadline)
		if err != nil {
			// After exhausting all addresses, the addrConn enters
			// TRANSIENT_FAILURE.
			ac.mu.Lock()
			if ac.state == connectivity.Shutdown {
				ac.mu.Unlock()
				return
			}
			ac.updateConnectivityState(connectivity.TransientFailure, err)
 
			// Backoff.
			b := ac.resetBackoff
			ac.mu.Unlock()
 
			timer := time.NewTimer(backoffFor)
			select {
			case <-timer.C:
				ac.mu.Lock()
				ac.backoffIdx++
				ac.mu.Unlock()
			case <-b:
				timer.Stop()
			case <-ac.ctx.Done():
				timer.Stop()
				return
			}
			continue
		}
```

这里调用的tryAllAddrs函数很好理解，就是把resolver解析结果中的addr全试一遍，知道和其中一个addr成功建立连接，如果失败，会等待一个退避时间，然后重试，需要注意的是，重试的时候，要经过resetTransport函数最开头的这段：

```go
if i > 0 {
			ac.cc.resolveNow(resolver.ResolveNowOptions{})
		}
```

也就是说，如果不是第一次创建连接，就要调用clientConn的resolveNow方法，重新获取一次解析的结果，这很重要，因为创建连接失败的原因很有可能就是上一次解析的结果对应的实例已经挂了。

上面说的是如果第一次连接就建立失败的情况，这种其实不太常见，常见的是连接建立之后，后端的服务因为网络故障或者升级之类的原因导致的连接断开，这种情况下grpc是如何发现的呢？要搞明白这个，就要看下tryAllAddrs函数里面调用的createTransport函数的内容了：

```go
onGoAway := func(r transport.GoAwayReason) {
		ac.mu.Lock()
		ac.adjustParams(r)
		once.Do(func() {
			if ac.state == connectivity.Ready {
				// Prevent this SubConn from being used for new RPCs by setting its
				// state to Connecting.
				//
				// TODO: this should be Idle when grpc-go properly supports it.
				ac.updateConnectivityState(connectivity.Connecting, nil)
			}
		})
		ac.mu.Unlock()
		reconnect.Fire()
	}
 
onClose := func() {
		ac.mu.Lock()
		once.Do(func() {
			if ac.state == connectivity.Ready {
				// Prevent this SubConn from being used for new RPCs by setting its
				// state to Connecting.
				//
				// TODO: this should be Idle when grpc-go properly supports it.
				ac.updateConnectivityState(connectivity.Connecting, nil)
			}
		})
		ac.mu.Unlock()
		close(onCloseCalled)
		reconnect.Fire()
	}
```

上面这两段，定义了连接goAway或者close的时候，该怎么处理，这两个函数会作为参数传入transport.NewClientTransport函数，进而设置到后面通过newHTTP2Client创建的http2client对象中，那么这两个函数何时会被触发呢？

以onGoAway函数为例，我们可以看看http2client的reader方法：

```go
func (t *http2Client) reader() {
	defer close(t.readerDone)
	// Check the validity of server preface.
	frame, err := t.framer.fr.ReadFrame()
	if err != nil {
		t.Close() // this kicks off resetTransport, so must be last before return
		return
	}
	t.conn.SetReadDeadline(time.Time{}) // reset deadline once we get the settings frame (we didn't time out, yay!)
	if t.keepaliveEnabled {
		atomic.StoreInt64(&t.lastRead, time.Now().UnixNano())
	}
	sf, ok := frame.(*http2.SettingsFrame)
	if !ok {
		t.Close() // this kicks off resetTransport, so must be last before return
		return
	}
	t.onPrefaceReceipt()
	t.handleSettings(sf, true)
 
	// loop to keep reading incoming messages on this transport.
	for {
		t.controlBuf.throttle()
		frame, err := t.framer.fr.ReadFrame()
		if t.keepaliveEnabled {
			atomic.StoreInt64(&t.lastRead, time.Now().UnixNano())
		}
		if err != nil {
			// Abort an active stream if the http2.Framer returns a
			// http2.StreamError. This can happen only if the server's response
			// is malformed http2.
			if se, ok := err.(http2.StreamError); ok {
				t.mu.Lock()
				s := t.activeStreams[se.StreamID]
				t.mu.Unlock()
				if s != nil {
					// use error detail to provide better err message
					code := http2ErrConvTab[se.Code]
					msg := t.framer.fr.ErrorDetail().Error()
					t.closeStream(s, status.Error(code, msg), true, http2.ErrCodeProtocol, status.New(code, msg), nil, false)
				}
				continue
			} else {
				// Transport error.
				t.Close()
				return
			}
		}
		switch frame := frame.(type) {
		case *http2.MetaHeadersFrame:
			t.operateHeaders(frame)
		case *http2.DataFrame:
			t.handleData(frame)
		case *http2.RSTStreamFrame:
			t.handleRSTStream(frame)
		case *http2.SettingsFrame:
			t.handleSettings(frame, false)
		case *http2.PingFrame:
			t.handlePing(frame)
		case *http2.GoAwayFrame:
			t.handleGoAway(frame)
		case *http2.WindowUpdateFrame:
			t.handleWindowUpdate(frame)
		default:
			errorf("transport: http2Client.reader got unhandled frame type %v.", frame)
		}
	}
}
```

可以看到，reader方法会读取连接上的所有消息，如果是GoAway类型，则会调用上面我们设置的onGoAway，而onGoAway函数里的reconnect.Fire()，会触发reconnect这个事件，这个事件被触发会怎么样呢？我们再回到resetTransport函数，这个函数在连接成功创建之后，会阻塞在这里：

```go
// Block until the created transport is down. And when this happens,
		// we restart from the top of the addr list.
		<-reconnect.Done()
```

也就是说，函数在等这个连接goAway或者close，当这两种情况发生时，程序就会接着走，也就是进入下一次循环，就会重新获取resolver的结果，然后建立连接，这样就说通了，我们再来捋一下：

- 首先，已经连接的后端发生了故障；
- 然后，已经建立的http2client读到了连接goAway；
- 再然后，resetTransport进入一次新的循环，重新获取解析结果；
- 最后，resetTransport里通过新获取到的地址，重新建立连接

到这里，我们就搞清楚了，grpc是如何保证连接一直是可用的了。

#### resolver的使用

明白了大致原理，我们再来看看如何使用，其实最关键的一点在上面已经说过了，就是我们自己实现满足我们自己业务要求的resolver，这里我就系统的举一个例子吧。

假设，我们后端的每一个服务都对应了一个域名，比如订单服务是service.order，支付服务是service.payment，然后我们自己的域名解析系统提供一个web api，url是http://myself.dns.xyz，当你想获取订单服务对应的实例的ip+port时，只需要发送一条：

GET http://myself.dns.xyz?service=service.order

欧克，接下来我们来实现这个解析器。

首先，我们创建一个单独的包，就叫mydns吧，注意在这个包里，我们要实现两个东西，一个是resolver，一个是resolver的builder

我们先来实现resolver：

```go
type mydnsResolver struct {
	domain       string
	port         string
	address      map[resolver.Address]struct{}
	ctx    context.Context
	cancel context.CancelFunc
	cc     resolver.ClientConn
	wg sync.WaitGroup
}
 
// ResolveNow resolves immediately
func (mr *mydnsResolver) ResolveNow(resolver.ResolveNowOptions) {
	select {
	case mr.rn <- struct{}{}:
	default:
	}
}
 
// Close stops resolving
func (mr *mydnsResolver) Close() {
	mr.cancel()
	mr.wg.Wait()
}
 
func (mr *mydnsResolver) watcher() {
	defer util.CheckPanic()
	defer mr.wg.Done()
 
	for {
		select {
		case <-mr.ctx.Done():
			return
		case <-mr.rn:
		}
		result, err := mr.resolveByHttpDNS()
		if err != nil || len(result) == 0 {
			continue
		}
		mr.cc.UpdateState(resolver.State{Addresses: result})
	}
}
 
func (mr *mydnsResolver) resolveByHttpDNS() ([]resolver.Address, error) {
	var items []string = make([]string, 0, 4)
 
	//这里实现通过向http://myself.dns.xyz发送get请求获取实例ip列表，并存入items中
 
	var addresses = make([]resolver.Address, 0, len(items))
	for _, v := range items {
		addr := net.JoinHostPort(v, mr.port)
		a := resolver.Address{
			Addr:       addr,
			ServerName: addr, // same as addr
			Type:       resolver.Backend,
		}
		addresses = append(addresses, a)
	}
 
	return addresses, nil
}
```

再来实现builder：

```go
type mydnsBuilder struct {
}
 
func NewBuilder() resolver.Builder {
	return &mydnsBuilder{}
}
 
// Scheme for mydns
func (mb *mydnsBuilder) Scheme() string {
	return "mydns"
}
 
// Build
func (mb *mydnsBuilder) Build(target resolver.Target, cc resolver.ClientConn, _ resolver.BuildOptions) (resolver.Resolver, error) {
	host, port, err := net.SplitHostPort(target.Endpoint)
	if err != nil {
		host = target.Endpoint
		port = "80"
	}
 
	ctx, cancel := context.WithCancel(context.Background())
	mr := &mydnsResolver{
		domain:       host,
		port:         port,
		cc:           cc,
		rn:           make(chan struct{}, 1),
		address:      make(map[resolver.Address]struct{}),
	}
	mr.ctx, pr.cancel = ctx, cancel
 
	mr.wg.Add(1)
	go mr.watcher()
 
	mr.ResolveNow(resolver.ResolveNowOptions{})
	return mr, nil
}
```

接下来我们还要实现，当这个包初始化时，将scheme注册到grpc的解析器map中：

```go
func init() {
	resolver.Register(NewBuilder())
}
```

实现好这个包之后，我们只需要在调用Dial的文件import mydns这个包，并且保证传入的target满足以下格式：

```go
mydns://service.order
```

grpc就会使用我们实现的解析器，向我们自己的dns服务器请求服务对应的ip地址了，就是这么简单～

Reference:[grpc进阶篇之resolver](https://blog.csdn.net/u013536232/article/details/108556544)

[grpc进阶篇之retry拦截器](https://blog.csdn.net/u013536232/article/details/108308504)


