# The Go Programming Language

## 入门

### 查找重复行

格式化字符串：

```
%d			十进制整数
%x,%0,%b	十六进制，八进制，二进制整数
%t			浮点数：3.14.1592 3.14159265389793 3.141593e+00
%c			布尔：true 或 false
%s			字符串
%q			带双引号的字符串 "abc" 或带单引号的字符 'c'
%v			变量的自然形式（natural format）
%T			变量的类型
%%			字面上的百分号标志（无操作数）
```

### 获取 URL



```go
func main() {
	urls := []string{"https://www.baidu.com"}
	for _, url := range urls {
		resp, err := http.Get(url)
		if err != nil {
			fmt.Fprintf(os.Stderr, "fetch: %v\n", err)
			os.Exit(1)
		}
		b, err := ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		if err != nil {
			fmt.Fprintf(os.Stderr, "fetch: reading %s: %v\n", url, err)
			os.Exit(1)
		}
		fmt.Printf("%s\n", b)
	}
}
```



### 并发获取多个 URL

```go
func main() {
	urls := []string{
		"https://qte.alomerry.com",
		"https://alomerry.com",
		"https://doc.cloudmo.top",
	}
	ch := make(chan string)
	for _, url := range urls {
		go fetch(url, ch)
	}
	for range urls {
		fmt.Println(<-ch)
	}
}

func fetch(url string, ch chan<- string) {
	start := time.Now()
	resp, err := http.Get(url)
	if err != nil {
		ch <- fmt.Sprint(err)
		return
	}
	nbytes, err := io.Copy(ioutil.Discard, resp.Body)
	resp.Body.Close()
	if err != nil {
		ch <- fmt.Sprintf("while reading %s: %v", url, err)
		return
	}
	sec := time.Since(start).Seconds()
	ch <- fmt.Sprintf("%.2fs\t%d\t%s", sec, nbytes, url)
}
```

## 程序结构

### 变量

#### 指针

每次对一个变量取地址或者复制指针，都是为原变量创建了新的别名。于此可以不用名字而访问一个变量，但同时是一把双刃剑：要找到一个变量的所有的访问者变得困难。

#### new 函数

```go
func newInt() *int {
    return new(int)
}
```



```go
func newInt() *int {
    var dummy int
    return &dummy
}
```

每次调用 new 函数都是返回一个新的变量的地址，因此下面两个地址是不同的：

```go
p := new(int)
q := new(int)
fmt.Println(q == p) // false
```

当然也可能有特殊情况：如果两个类型都是空的，即类型的大小是 0，例如 `struct{}` 和 `[0]int`，有可能有相同的地址（依赖具体的语言实现）。请谨慎使用大小为 0 的类型，因为如果类型的大小为 0 的话，可能导致 Go 语言的自动垃圾回收器有不同的行为，具体请查看 `runtime.SetFinalizer` 函数相关文档。

#### 变量的生命周期

> 变量的生命周期指的是在程序运行期间变量有效存在的时间间隔。对于在包一级声明的变量来说，他们的生命周期和整个程序运行周期是一致的。而相比之下，局部变量的生命周期则是动态的：每次从创建一个新变量的声明语句开始，知道该变量不再被引用为止，然后变量的存储空间可能被回收。函数的参数变量和返回值变量都是局部变量。它们在函数每次被调用的时候创建。
>
> 那么 GO 语言的自动垃圾收集器是如何知道一个变量是何时可以被回收的呢？基本的实现思路是，从每个包级的变量和每个当前运行函数的每一个局部变量开始，通过指针或引用的访问路径遍历，是否可以找到该变量。如果不存在这样的访问路径，那么说明该变量是不可达的，也就是说它是否存在并不会影响程序的后续计算结果。
>
> 因为一个变量的有效周期只取决于是否可达，因此一个循环迭代内部的局部变量的声明周期可能超出其局部作用域。同时，局部变量可能在函数返回之后依然存在。
>
> 编译器会自动选择在栈上还是堆上分配局部变量的存储空间，但可能令人惊讶的是，这个选择并不是由 var 还是 new 声明变量的方式决定的。
>
> ```go
> var global *int
> func f(){
>     var x int
>     x = 1
>     global = &x
> }
> 
> func g(){
>     y := new(int)
>     *y = 1
> }
> ```
>
> f 函数里的 x 变量必须在堆上分配，因为它在函数退出后依然可以通过包一级的 global 变量找到，虽然它是在函数内部定义的；用 GO 的术语说，这个 x 局部变量从函数 f 中逃逸了。相反，当 g 函数返回是，变量 *y 将是不可达的，也就是说可以马上被回收的。 因此，\*y 并没有从函数 g 中逃逸，编译器可以选择在栈上分配 \*y 的存储空间（也可以选择在堆上分配，然后由 GO 语言的 GC 回收这个变量的存储空间），虽然这里用的是 new 方式。
>
> 逃逸的变量需要额外分配内存，同时对性能的优化可能会产生细微的影响。
>
> GO 语言的自动垃圾收集器对编写正确的代码是一个巨大的帮助，但也并不是说你完全不用考虑内存了。虽然不需要显示地分配和释放内存，但是要编写高效的程序你依然需要了解变量的声明周期。例如将指向短生命周期对象的指针保存到具有长生命周期的对象中，特别是保存到全局变量时，会阻止对短生命对象的垃圾回收。

### 包和文件

#### 包的初始化

包的初始化首先是解决包级变量的依赖顺序，然后按照包级变量声明出现的顺序依次初始化：

```go
var a = b + c // a 第三个初始化，为 3
var b = f()   // b 第二个初始化，为 2，通过调用 f（依赖 c）
var c = 1     // c 第一个初始化，为 1

func f() int { return c + 1}
```

如果包中含有多个 .go 源文件，它们将按照发给编译器的顺序进行初始化，GO 语言的构建工具首先会将 .go 文件根据文件名排序，然后依次调用编译器编译。

### 作用域

作用域和生命周期并不是同一个概念，作用域是声明语句对应的源码文本范围；它是一个编译时的属性。变量的生命周期是只程序运行时变量存在的有效时间段，在此时间区间可被其他部分引用；是一个运行时的概念。

P78

## 基础数据类型

### 字符串

字符串的值是不可变的：一个字符串包含的字节序列永远不会被改变，当然也可以给一个字符串变量分配一个新的字符串值，但是并不会导致原始的字符串值被改变，变量会持有一个新的字符串值。

因为字符串是不可修改的，因此尝试修改字符串内部数据的操作也是被禁止的：

`s[0] = 'L' // compile error: cannot assign to s[0]`

不变性意味如果两个字符串共享相同的底层数据的也是安全的，这使得复制任何长度字符串的代价是低廉的。同样，一个字符串 S 和对应的子串切片 S[7:] 的操作也可以安全地共享相同的内存，因此字符串切片操作的代价也是低廉的。

#### 字符串和 Byte 切片

一个字符串是包含的只读字节数组，一旦创建，是不可变的。相比之下，一个字节 slice 的元素则可以自由地修改。

```go
s := "abc"
b := []byte(s)
s2 := string(b)
```

从概念上讲，一个 []byte(s) 转换是分配了一个新的字节数组用于保存字符串数据的拷贝，然后引用这个底层的字节数组。编译器的优化可以避免在一些场景下分配和复制字符串数据，但总的来说需要确保在变量 b 被修改的情况下，原始的 s 字符串也不会被改变。

为了避免转换中不必要的内存分配，bytes 包和 strings 包同时提供了许多实用函数：

```go
func Contains(s, substr string) bool
func Count(s, sep string) bool
func Fields(s string) []string
func HasPrefix(s, prefix string) bool
func Index(s, sep string) int
func Join(a []string, sep string) string
```

### 常量

#### iota 常量生成器

## 复合数据类型

### Slice

Slice 不支持比较运算符，因为 slice 的元素是间接引用的，一个 slice 甚至可以包含自身。一个固定的 slice 值在不同时刻可能包含不同的元素，因为底层数组的元素可能会被修改。例如 slice 的扩容，会导致其本身的值/地址变化。

判断一个 slice 是否为空时，使用 len(s) == 0 来判断，而不应该用 s == nil 来判断。所有的 Go 语言函数应该已相同的方式对待 nil 值的 slice 和 0 长度的 slice。

#### append 函数

TODO 内置 append 内存扩展策略。

通常我们并不知道 append 调用是否导致了内存的重新分配，因此不能确认新的 slice 和原始 slice 是否引用相同的底层数组。也无法确认在原先的 slice 上操作是否会影响到新的 slice。因此通常是将 append 的返回的结果直接赋值给输入的 slice 变量。

更新 slice 变量不仅对调用 append 函数是必要的，对任何可能导致长度、容量或底层数组变化的操作都是必要。尽管 slice 间接访问底层的数组，但是 slice 对应结构体本身的指针、长度和容量部分都是直接访问的。更新这些信息需要显示赋值。从这个角度看，slice 并不是一个纯粹的引用类型。

#### slice 内存技巧

slice 可以用来模拟 stack

### Map

map 中的元素并不是一个变量，因此不能对 map 的元素进行取址操作：

`_ = &ages["alomerry"] // compile error: cannot take address of map element`

禁止对 map 元素取址的原因是 map 可能随着元素数量的增长而重新分配更大的内存空间，从而可能导致之前的地址无效。

map 的迭代顺序是随机的，这是故意的，每次都使用随机的遍历顺序可以强制要求程序不会依赖具体的哈希函数实现。

map 类型的零值是 nil，也就是没有引用任何哈希表。查找、删除、len 和 range 循环都可以安全的工作在 nil 值的 map 上。但是向一个 nil 值的 map 存入元素将导致 panic 异常。

通过 key 作为索引下表来访问 map 将产生一个 value。如果 key 不存在，那么将得到 value 对应类型的零值。

### 结构体

如果要在函数内部修改结构体成员的话，必须使用指针。因为在 Go 语言中，所有的函数参数都是值拷贝传入的，函数参数将不再是函数调用时的原始变量。

##### 结构体嵌入和匿名成员

Go 语言有一个特性让我们只声明一个成员对应的数据类型而不指明成员的名字；这类成员就角匿名成员。匿名成员的数据类型必须是命名的类型或指向一个命名的类型的指针。下面的代码中，Circle 和 Wheel 各自都有一个匿名结构成员。

```go
type Point struct {
    X, Y int
}
type Circle struct {
	Point
    Radius int
}
type Wheel struct {
    Circle
    Spokes int
}
```

得意于匿名嵌入的特性，我们可以直接访问叶子属性而不需要给出完整的路径：

```go
var w Wheel
w.X = 8			// equivalent to w.Circle.Point.X = 8
w.Y = 8			// equivalent to w.Circle.Point.Y = 8
w.Radius = 5	// equivalent to w.Circle.Radius = 5
w.Spokes = 5
```

### JSON

### 文本和 HTML 模板

TODO

## 函数

### 函数声明

在函数体中，函数的形参作为局部变量，被初始化为调用者提供的值。函数的形参和有名返回值作为函数最外层的局部变量，被存储在相同的语法块中。

实参通过值的方式传递，因此函数的形参是实参的拷贝。对形参进行修改不会影响实参。但是如果实参包含引用类型，如指针、slice、map、function、channel 等类型，实参可能会由于函数的间接引用被修改。

### 错误

#### 错误处理策略

- 传播错误
- 重试
- 输出错误信息，结束程序
  - 需要注意的是，这种策略只应该在 main 中执行。对于库函数而言，应仅向上传播错误，除非该错误意味着程序内部包含不一致性，即遇到了 bug，才能在库函数中结束程序。
- sdaf 



## 方法



## 接口



## Goroutines 和 Channels



## 基于共享变量的并发



## 包和工具



## 测试



## 反射



## 底层编程

## 练习

### 入门

#### 命令行参数

练习 1.3 测量潜在低效的版本和使用了 `strings.Join` 的版本的运行事件差异。

```go
func main() {
	start := time.Now()

	array, result := []string{
		"a", "b", "c", "d", "e", "f", "g",
	}, ""

	for i := 0; i < 10000; i++ {
		for j := range array {
			result += array[j]
		}
	}
	sec := time.Since(start).Seconds()
	fmt.Println(sec)
}
```

0.376342

```go
func main() {
	start := time.Now()

	array, result := []string{
		"a", "b", "c", "d", "e", "f", "g",
	}, ""

	for i := 0; i < 10000; i++ {
		result = strings.Join(array, "")
	}
	sec := time.Since(start).Seconds()
	fmt.Println(sec)
}
```

0.0480443

#### 获取 URL

练习 1.7 调用 `io.Copy(dst,src)` 替换 `io.ReadAll` 来拷贝响应结构体到 `os.Stdout`，避免申请一个缓冲区来存储。

```go
func main() {
	urls := []string{"https://www.baidu.com"}
	for _, url := range urls {
		resp, err := http.Get(url)
		if err != nil {
			fmt.Fprintf(os.Stderr, "fetch: %v\n", err)
			os.Exit(1)
		}

		_, err = io.Copy(os.Stdout,resp.Body)
		resp.Body.Close()
		if err != nil {
			fmt.Fprintf(os.Stderr, "fetch: reading %s: %v\n", url, err)
			os.Exit(1)
		}
	}
}
```



练习 1.8 使用 strings.HasPrefix 函数在 url 没有 http:// 前缀时添加。

```go
func main() {
	urls := []string{"www.baidu.com"}
	for _, url := range urls {
		if !strings.HasPrefix(url, "https://") {
			url = "https://" + url
		}
		resp, err := http.Get(url)
		if err != nil {
			fmt.Fprintf(os.Stderr, "fetch: %v\n", err)
			os.Exit(1)
		}

		_, err = io.Copy(os.Stdout, resp.Body)
		resp.Body.Close()
		if err != nil {
			fmt.Fprintf(os.Stderr, "fetch: reading %s: %v\n", url, err)
			os.Exit(1)
		}
	}
}
```



练习 1.9 从 resp.Status 里打印出 HTTP 协议的状态码。

```go
func main() {
	urls := []string{"www.baidu.com"}
	for _, url := range urls {
		if !strings.HasPrefix(url, "https://") {
			url = "https://" + url
		}
		resp, err := http.Get(url)
		if err != nil {
			fmt.Fprintf(os.Stderr, "fetch: %v\n", err)
			os.Exit(1)
		}

		fmt.Printf("status:%v, code:%v", resp.Status, resp.StatusCode)
	}
}
```

