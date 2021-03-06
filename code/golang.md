# Golang

func main(){

a := []string{xxx}

xxx(a)

a 未改变？

}

func xxx(a []string){

a = []string{xxx} ? append

}

## Slice

如果你需要测试一个 slice 是否是空的，使用 len(s) == 0 来判断，而不应该用 s == nil 来判断。

## Signal 包

Notify 函数 https://blog.csdn.net/chuanglan/article/details/80750119

## flag 包

### os.Args

简单获取命令行参数的方式，演示代码如下：

```go
func main() {
	for index, arg := range os.Args {
		fmt.Printf("arg[%v]=[%v]", index, arg)
	}
}
```

执行 ``$ go build -o "main"` 编译，后运行输出结果：

```shell
$ ./main os.Args demo
arg[0]=[./main]
arg[1]=[os.Args]
arg[2]=[demo]
```

```go
// A Flag represents the state of a flag.
type Flag struct {
	Name     string // name as it appears on command line
	Usage    string // help message
	Value    Value  // value as set
	DefValue string // default value (as text); for usage message
}
```

```go
// A FlagSet represents a set of defined flags. The zero value of a FlagSet
// has no name and has ContinueOnError error handling.
type FlagSet struct {
	// Usage is the function called when an error occurs while parsing flags.
	// The field is a function (not a method) that may be changed to point to
	// a custom error handler. What happens after Usage is called depends
	// on the ErrorHandling setting; for the command line, this defaults
	// to ExitOnError, which exits the program after calling Usage.
	Usage func()

	name          string
	parsed        bool
	actual        map[string]*Flag
	formal        map[string]*Flag
	args          []string // arguments after flags
	errorHandling ErrorHandling
	output        io.Writer // nil means stderr; use out() accessor
}
```

## 自定义类型与类型别名

### 自定义类型

```go
//自定义类型是定义了一个全新的类型
//将MyInt定义为int类型
type MyInt int
```

### 类型别名

```go
//类型别名规定：TypeAlias只是Type的别名，本质上TypeAlias与Type是同一个类型。
type TypeAlias = Type
type byte = uint8
type rune = int32
```

### 区别

```go
//类型定义
type NewInt int

//类型别名
type MyInt = int

func main() {
    var a NewInt
    var b MyInt

    fmt.Printf("type of a:%T\n", a) //type of a:main.NewInt
    fmt.Printf("type of b:%T\n", b) //type of b:int
}
//区别
//结果显示a的类型是main.NewInt，表示main包下定义的NewInt类型。b的类型是int。MyInt类型只会在代码中存在，编译完成时并不会有MyInt类型。
```

## [unsafe](https://golang.org/pkg/unsafe/)

### Pointer

Go 是一门强类型静态语言。强类型意味着类型一旦定义了就无法改变，静态意味着类型检查在运行前就完成了。

#### 指针类型转换

> 如果 Type1 与 Type2 一样大，并且两者有相同的内存结构；那么就允许把一个类型的数据，重新定义成另一个类型的数据。

#### 处理系统调用

4 个规则

- 任何指针都可以转换为 `unsafe.Pointer`
- `unsafe.Pointer` 可以转换为任何指针
- `uintptr`可以转换为 `unsafe.Pointer`
- `unsafe.Pointer` 可以转换为 `uintptr`

## 克隆 深浅拷贝

[golang 通过反射克隆数据](https://studygolang.com/articles/26514)

[Golang 之情非得已的 DeepCopy](https://www.jianshu.com/p/f1cdb1bc1b74)

[Go 语言如何深度拷贝对象](https://studygolang.com/articles/6984)

## Context

https://blog.csdn.net/yzf279533105/article/details/107292247

https://gitlab.********.com/mai/********/issues/24

context 只读

[Go Context 的踩坑经历](https://studygolang.com/articles/12566)

[gRPC and Deadlines](https://gitlab.********.com/mai/********/issues/24)

### Context 接口

```go
type Context interface {
    // Deadline returns the time when work done on behalf of this context
    // should be canceled. Deadline returns ok==false when no deadline is
    // set.
    Deadline() (deadline time.Time, ok bool)
    // Done returns a channel that's closed when work done on behalf of this
    // context should be canceled.
    Done() <-chan struct{}
    // Err returns a non-nil error value after Done is closed.
    Err() error
    // Value returns the value associated with this context for key.
    Value(key interface{}) interface{}
}
```

- `Done`会返回一个 channel，当该 context 被取消的时候，该 channel 会被关闭，同时对应的使用该 context 的 routine 也应该结束并返回。
- `Context`中的方法是协程安全的，这也就代表了在父 routine 中创建的 context，可以传递给任意数量的 routine 并让他们同时访问。
- `Deadline`会返回一个超时时间，routine 获得了超时时间后，可以对某些 io 操作设定超时时间。
- `Value`可以让 routine 共享一些数据，当然获得数据是协程安全的。

在请求处理的过程中，会调用各层的函数，每层的函数会创建自己的 routine，是一个 routine 树。所以，context 也应该反映并实现成一棵树。

要创建 context 树，第一步是要有一个根结点。`context.Background`函数的返回值是一个空的 context，经常作为树的根结点，它一般由接收请求的第一个 routine 创建，不能被取消、没有值、也没有过期时间。

```go
func Background() Context
```

之后该怎么创建其它的子孙节点呢？context 包为我们提供了以下函数：

```go
func WithCancel(parent Context) (ctx Context, cancel CancelFunc)
func WithDeadline(parent Context, deadline time.Time) (Context, CancelFunc)
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc)
func WithValue(parent Context, key interface{}, val interface{}) Context
```

这四个函数的第一个参数都是父 context，返回一个 Context 类型的值，这样就层层创建出不同的节点。子节点是从复制父节点得到的，并且根据接收的函数参数保存子节点的一些状态值，然后就可以将它传递给下层的 routine 了。

`WithCancel`函数，返回一个额外的 CancelFunc 函数类型变量，该函数类型的定义为：

```go
type CancelFunc func()
```

调用 CancelFunc 对象将撤销对应的 Context 对象，这样父结点的所在的环境中，获得了撤销子节点 context 的权利，当触发某些条件时，可以调用 CancelFunc 对象来终止子结点树的所有 routine。在子节点的 routine 中，需要用类似下面的代码来判断何时退出 routine：

```go
select {
    case <-cxt.Done():
        // do some cleaning and return
}
```

根据 cxt.Done()判断是否结束。当顶层的 Request 请求处理结束，或者外部取消了这次请求，就可以 cancel 掉顶层 context，从而使整个请求的 routine 树得以退出。

`WithDeadline`和`WithTimeout`比`WithCancel`多了一个时间参数，它指示 context 存活的最长时间。如果超过了过期时间，会自动撤销它的子 context。所以 context 的生命期是由父 context 的 routine 和`deadline`共同决定的。

`WithValue`返回 parent 的一个副本，该副本保存了传入的 key/value，而调用 Context 接口的 Value(key)方法就可以得到 val。注意在同一个 context 中设置 key/value，若 key 相同，值会被覆盖。

### 原理

#### 上下文数据的存储与查询

```go
type valueCtx struct {
    Context
    key, val interface{}
}

func WithValue(parent Context, key, val interface{}) Context {
    if key == nil {
        panic("nil key")
    }
    ......
    return &valueCtx{parent, key, val}
}

func (c *valueCtx) Value(key interface{}) interface{} {
    if c.key == key {
        return c.val
    }
    return c.Context.Value(key)
}
```

context 上下文数据的存储就像一个树，每个结点只存储一个 key/value 对。`WithValue()`保存一个 key/value 对，它将父 context 嵌入到新的子 context，并在节点中保存了 key/value 数据。`Value()`查询 key 对应的 value 数据，会从当前 context 中查询，如果查不到，会递归查询父 context 中的数据。

值得注意的是，**context 中的上下文数据并不是全局的，它只查询本节点及父节点们的数据，不能查询兄弟节点的数据。**

#### 手动 cancel 和超时 cancel

`cancelCtx`中嵌入了父 Context，实现了 canceler 接口：

```go
type cancelCtx struct {
    Context      // 保存parent Context
    done chan struct{}
    mu       sync.Mutex
    children map[canceler]struct{}
    err      error
}

// A canceler is a context type that can be canceled directly. The
// implementations are *cancelCtx and *timerCtx.
type canceler interface {
    cancel(removeFromParent bool, err error)
    Done() <-chan struct{}
}
```

`cancelCtx`结构体中`children`保存它的所有`子canceler`， 当外部触发 cancel 时，会调用`children`中的所有`cancel()`来终止所有的`cancelCtx`。`done`用来标识是否已被 cancel。当外部触发 cancel、或者父 Context 的 channel 关闭时，此 done 也会关闭。

```go
type timerCtx struct {
    cancelCtx     //cancelCtx.Done()关闭的时机：1）用户调用cancel 2）deadline到了 3）父Context的done关闭了
    timer    *time.Timer
    deadline time.Time
}

func WithDeadline(parent Context, deadline time.Time) (Context, CancelFunc) {
    ......
    c := &timerCtx{
        cancelCtx: newCancelCtx(parent),
        deadline:  deadline,
    }
    propagateCancel(parent, c)
    d := time.Until(deadline)
    if d <= 0 {
        c.cancel(true, DeadlineExceeded) // deadline has already passed
        return c, func() { c.cancel(true, Canceled) }
    }
    c.mu.Lock()
    defer c.mu.Unlock()
    if c.err == nil {
        c.timer = time.AfterFunc(d, func() {
            c.cancel(true, DeadlineExceeded)
        })
    }
    return c, func() { c.cancel(true, Canceled) }
}
```

`timerCtx`结构体中`deadline`保存了超时的时间，当超过这个时间，会触发`cancel`。

PIC

可以看出，**cancelCtx 也是一棵树，当触发 cancel 时，会 cancel 本结点和其子树的所有 cancelCtx**。

## 空 interface type

## map

## 常见坑

[go 圣经](https://chai2010.cn/advanced-go-programming-book/appendix/appendix-a-trap.html)

## 风格

### Panic

虽然 Go 的 panic 机制类似于其他语言的异常，但是 panic 的适用场景有一些不同。由于 panic 会引起程序的崩溃，因此 panic 一般用于严重的错误，如程序内部的逻辑不一致，所以对应大部分漏洞，应该使用 Go 提供错误机制，而不是 panic，尽量避免程序的崩溃。在健壮的程序中，任何可以预料到的错误，如不正确的输入、错误的配置或是失败的 I/O 操作都应该被优雅的处理。

## defer

[深入理解 Go defer](https://segmentfault.com/a/1190000019303572)

## 竞争条件

[竞争条件](https://books.studygolang.com/gopl-zh/ch9/ch9-01.html)

## GC

[GC](http://guileen.github.io/2016/06/15/how-did-i-optimize-golang-gc/)

## 方法的结构指针接收者和结构值接收者

## 时间输出

go 1.13.4 源码中的注释如下：

```go
stdFracSecond0  // ".0", ".00", ... , trailing zeros included
stdFracSecond9  // ".9", ".99", ..., trailing zeros omitted
```

```go
...
case stdFracSecond0:  // stdFracSecond0 requires the exact number of digits as specified in the layout.
...
case stdFracSecond9:  // Take any number of digits, even more than asked for, because it is what the stdSecond case would do.
...
```

`.9` 可以适配任意长度的毫秒，`.0` 需要保持位数一致。

## golang 读取文件性能对比

## GVM 安装 Golang

```shell
bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)
```

```shell
gvm install go1.4
gvm use go1.4 [--default]
```

[gvm]([GitHub - moovweb/gvm: Go Version Manager](https://github.com/moovweb/gvm))

## go install

http://c.biancheng.net/view/122.html

## Golang 大杀器之性能剖析 PProf

https://segmentfault.com/a/1190000016412013

https://www.cnblogs.com/TimLiuDream/p/10038239.html

## golang cond唤醒锁

https://blog.csdn.net/u010066807/article/details/80307484
