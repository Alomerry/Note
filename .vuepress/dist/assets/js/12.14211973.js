(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{199:function(t,e,_){"use strict";_.r(e);var a=_(3),v=Object(a.a)({},(function(){var t=this,e=t.$createElement,_=t._self._c||e;return _("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[_("h1",{attrs:{id:"csapp"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#csapp"}},[t._v("#")]),t._v(" CSAPP")]),t._v(" "),_("h2",{attrs:{id:"_2-信息的表示和处理"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#_2-信息的表示和处理"}},[t._v("#")]),t._v(" 2 信息的表示和处理")]),t._v(" "),_("h3",{attrs:{id:"_2-1-信息存储"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-信息存储"}},[t._v("#")]),t._v(" 2.1 信息存储")]),t._v(" "),_("h4",{attrs:{id:"_2-1-2-字数据大小"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-2-字数据大小"}},[t._v("#")]),t._v(" 2.1.2 字数据大小")]),t._v(" "),_("p",[t._v("每台计算机都有一个字长（word size），指明指针数据的标称大小（nominal size）。因为虚拟地址是以这样的一个字来编码的，所以字长决定的最重要的系统参数就是虚拟地址空间的大小。也就是说，对于一个字长为 w 位的机器而言，虚拟地址的范围为 0 ~ 2"),_("sup",[t._v("w")]),t._v(" - 1，程序最多访问 2"),_("sup",[t._v("w")]),t._v(" 个字节。")]),t._v(" "),_("p",[t._v("程序员应该力图使他们的程序在不同的机器和编译器上可移植。可移植性的一个方面就是使程序对不同的数据类型的确切大小不敏感。C 语言标准对不同的数据类型的数字范围设置了下界，但是却没有上界。在 1980 到 2010 年间，许多程序的编写都假设为 32 为程序的字节分配。在将这些程序移植到新机器上时，许多隐藏的对字长的依赖性对体现出来，成为错误。")]),t._v(" "),_("h4",{attrs:{id:"_2-1-3-寻址和字节顺序"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-3-寻址和字节顺序"}},[t._v("#")]),t._v(" 2.1.3 寻址和字节顺序")]),t._v(" "),_("p",[t._v("对于跨越多字节的程序对象，需要描述这个对象的地址什么，以及在内存中如何排列这些字节。")]),t._v(" "),_("p",[t._v("排列表示一个对象的字节有两种通用的规则。某些机器选择在内存中按照从最低有效字节到最高有效字节的顺序存储对象，而另一些机器则按照从最高有效字节到最低有效字节的顺序存储。前者称为 "),_("em",[t._v("小端法")]),t._v("（little endian），后一种规则称为 "),_("em",[t._v("大端法")]),t._v("（big endia）。")]),t._v(" "),_("p",[t._v("例如变量 x 的类型为 int，位于地址 0x100 处，它的十六进制为 0x01234567。地址的范围 0x100 ~ 0x103 的字节顺序依赖于机器的类型：")]),t._v(" "),_("p",[_("strong",[t._v("大端法")])]),t._v(" "),_("table",[_("thead",[_("tr",[_("th",{staticStyle:{"text-align":"center"}},[t._v("...")]),t._v(" "),_("th",{staticStyle:{"text-align":"center"}},[t._v("0x100")]),t._v(" "),_("th",{staticStyle:{"text-align":"center"}},[t._v("0x101")]),t._v(" "),_("th",{staticStyle:{"text-align":"center"}},[t._v("0x102")]),t._v(" "),_("th",{staticStyle:{"text-align":"center"}},[t._v("0x103")]),t._v(" "),_("th",[t._v("...")])])]),t._v(" "),_("tbody",[_("tr",[_("td",{staticStyle:{"text-align":"center"}},[t._v("...")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("01")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("23")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("45")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("67")]),t._v(" "),_("td",[t._v("...")])])])]),t._v(" "),_("p",[_("strong",[t._v("小端法")])]),t._v(" "),_("table",[_("thead",[_("tr",[_("th",{staticStyle:{"text-align":"center"}},[t._v("...")]),t._v(" "),_("th",{staticStyle:{"text-align":"center"}},[t._v("0x100")]),t._v(" "),_("th",{staticStyle:{"text-align":"center"}},[t._v("0x101")]),t._v(" "),_("th",{staticStyle:{"text-align":"center"}},[t._v("0x102")]),t._v(" "),_("th",{staticStyle:{"text-align":"center"}},[t._v("0x103")]),t._v(" "),_("th",[t._v("...")])])]),t._v(" "),_("tbody",[_("tr",[_("td",{staticStyle:{"text-align":"center"}},[t._v("...")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("67")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("45")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("23")]),t._v(" "),_("td",{staticStyle:{"text-align":"center"}},[t._v("01")]),t._v(" "),_("td",[t._v("...")])])])]),t._v(" "),_("p",[t._v("对于大多数应用程序员来说，其机器所使用的的字节顺序是完全不可见的。不过有时，字节顺序会成为问题。")]),t._v(" "),_("p",[t._v("首先是不同类型的机器之间通过网络传输二进制数据时，一个常见的问题当小端法机器产生的数据被发送到大端法机器或者反过来时，接受程序会发现，里面的字节成了反序的。")]),t._v(" "),_("p",[t._v("第二种情况当阅读表示整数数据的字节序列时字节顺序也很重要。通常发生在检查机器级程序时。作为一个示例，从某个文件中摘出了下面这行代码，该文件给出了一个针对 Intel x86-64 处理器的机器级代码的文本表示：")]),t._v(" "),_("div",{staticClass:"language- line-numbers-mode"},[_("pre",{pre:!0,attrs:{class:"language-text"}},[_("code",[t._v("4004d3:  01 05 43 0b 20 00    add %eax,0x200b43(%rip)\n")])]),t._v(" "),_("div",{staticClass:"line-numbers-wrapper"},[_("span",{staticClass:"line-number"},[t._v("1")]),_("br")])]),_("p",[t._v("这一行是由 "),_("strong",[t._v("反汇编器")]),t._v("（disassembler）生成的。十六进制字节串 "),_("code",[t._v("01 05 43 0b 20 00")]),t._v(" 是一条指令的字节级表示，这条指令是把一个字长的数据加到一个值上，该值得存储地址由 0x200b43 加上当前程序计数器的值得到，当前程序计数器的值即为下一条将要执行执行的地址。取出这个序列的最后四个字节：43 0b 20 00，并按照相反的顺序写得到 00 20 0b 43。去掉开头的 0，得到值 0x200b43，这就是右边的数值。")]),t._v(" "),_("p",[t._v("字节顺序变得重要的第三种情况是当编写规避正常的类型系统的程序时。在 C 语言中可以通过强制类型转化或联合来允许以一种数据类型引用一个对象，而这种数据类型与创建这个对象时定义数据类型不同，大多数应用编程都不推荐这种编码技巧，但是它们对系统级编程来说是非常有用的。")])])}),[],!1,null,null,null);e.default=v.exports}}]);