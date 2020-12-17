(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{193:function(a,t,s){"use strict";s.r(t);var r=s(3),_=Object(r.a)({},(function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[s("h1",{attrs:{id:"clean-code"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#clean-code"}},[a._v("#")]),a._v(" Clean Code")]),a._v(" "),s("h2",{attrs:{id:"_2-有意义的命名"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-有意义的命名"}},[a._v("#")]),a._v(" 2 有意义的命名")]),a._v(" "),s("h3",{attrs:{id:"_2-2-名副其实"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-名副其实"}},[a._v("#")]),a._v(" 2.2 名副其实")]),a._v(" "),s("h3",{attrs:{id:"_2-3-避免误导"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-3-避免误导"}},[a._v("#")]),a._v(" 2.3 避免误导")]),a._v(" "),s("p",[a._v("代码需要简洁，但是不能模糊。")]),a._v(" "),s("p",[a._v("例如下面两个变量名：")]),a._v(" "),s("div",{staticClass:"language-js line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[a._v("XYZControllerForEfficientKeepingOfStrings\n\nXYZControllerForEfficientHoldingOfStrings\n")])]),a._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[a._v("1")]),s("br"),s("span",{staticClass:"line-number"},[a._v("2")]),s("br"),s("span",{staticClass:"line-number"},[a._v("3")]),s("br")])]),s("p",[a._v("在区分两个变量的意思时需要反复对比，是很痛苦的。避免细微之处有不同")]),a._v(" "),s("h3",{attrs:{id:"_2-6-使用搜索的名称"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-6-使用搜索的名称"}},[a._v("#")]),a._v(" 2.6 使用搜索的名称")]),a._v(" "),s("h3",{attrs:{id:"_2-9-类名"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-9-类名"}},[a._v("#")]),a._v(" 2.9 类名")]),a._v(" "),s("p",[a._v("类名和对象名应该是名词或名词短语，不应当是动词。")]),a._v(" "),s("h3",{attrs:{id:"_2-10-方法名"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-10-方法名"}},[a._v("#")]),a._v(" 2.10 方法名")]),a._v(" "),s("p",[a._v("方法名应该是动词或动词短语。属性访问器、修改器和断言应该根据其值命名。")]),a._v(" "),s("h3",{attrs:{id:"_2-16-添加有意义的语境"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-16-添加有意义的语境"}},[a._v("#")]),a._v(" 2.16 添加有意义的语境")]),a._v(" "),s("h2",{attrs:{id:"_3-函数"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-函数"}},[a._v("#")]),a._v(" 3 函数")]),a._v(" "),s("h3",{attrs:{id:"_3-2-只做一件事"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-只做一件事"}},[a._v("#")]),a._v(" 3.2 只做一件事")]),a._v(" "),s("p",[a._v("函数应该做一件事。做好这件事。只做这一件事。")]),a._v(" "),s("h3",{attrs:{id:"_3-3-每个函数一个抽象层级"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-3-每个函数一个抽象层级"}},[a._v("#")]),a._v(" 3.3 每个函数一个抽象层级")]),a._v(" "),s("h3",{attrs:{id:"_3-4-switch-语句"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-4-switch-语句"}},[a._v("#")]),a._v(" 3.4 switch 语句")]),a._v(" "),s("p",[a._v("单一权责原则")]),a._v(" "),s("p",[a._v("开放闭合原则")]),a._v(" "),s("h3",{attrs:{id:"_3-6-函数参数"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-6-函数参数"}},[a._v("#")]),a._v(" 3.6 函数参数")]),a._v(" "),s("p",[a._v("减少参数数量")]),a._v(" "),s("h4",{attrs:{id:"_3-6-2-标识参数"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-6-2-标识参数"}},[a._v("#")]),a._v(" 3.6.2 标识参数")]),a._v(" "),s("p",[a._v("避免使用标识参数，如 "),s("code",[a._v("bool")]),a._v(" 型参数，一旦使用，就表明方法中会因为 true 和 false 做不同的事")]),a._v(" "),s("h4",{attrs:{id:"_3-6-7-动词和关键词"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-6-7-动词和关键词"}},[a._v("#")]),a._v(" 3.6.7 动词和关键词")]),a._v(" "),s("p",[a._v("一元函数应当形成一种良好的动词/名词对形式，例如： "),s("code",[a._v("write(name)")]),a._v("、"),s("code",[a._v("writeField(name)")]),a._v("。")]),a._v(" "),s("p",[a._v("函数名称展示关键字形式可以减轻记忆参数顺序的负担，例如："),s("code",[a._v("assertEqual(expected,actual)")]),a._v(" 修改成 "),s("code",[a._v("assertExpectedEqualsActual(expected,actual)")]),a._v("。")]),a._v(" "),s("h3",{attrs:{id:"_3-7-无副作用"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-7-无副作用"}},[a._v("#")]),a._v(" 3.7 无副作用")]),a._v(" "),s("p",[a._v("避免做函数承诺的以外的事情。")]),a._v(" "),s("h3",{attrs:{id:"_3-8-分隔指令和询问"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-8-分隔指令和询问"}},[a._v("#")]),a._v(" 3.8 分隔指令和询问")]),a._v(" "),s("p",[a._v("函数应该修改某对象的状态，或是返回某对象的相关信息，但两者不可兼得。例如：")]),a._v(" "),s("p",[s("code",[a._v('if (set("usename","unclebob"))...')])]),a._v(" "),s("h3",{attrs:{id:"_3-9-使用异常代替返回错误码"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-9-使用异常代替返回错误码"}},[a._v("#")]),a._v(" 3.9 使用异常代替返回错误码")]),a._v(" "),s("h4",{attrs:{id:"_3-9-1-抽离-try-catch代码块"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-9-1-抽离-try-catch代码块"}},[a._v("#")]),a._v(" 3.9.1 抽离 Try/Catch代码块")]),a._v(" "),s("h4",{attrs:{id:"_3-9-3-error-java-依赖磁铁"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-9-3-error-java-依赖磁铁"}},[a._v("#")]),a._v(" 3.9.3 Error.java 依赖磁铁")]),a._v(" "),s("p",[a._v("返回错误码通常暗示某处有个类或是枚举，定义了所有错误码。")]),a._v(" "),s("div",{staticClass:"language-java line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("public")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("enum")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Error")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n  OK"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n  INVALID"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n  NO_SUCH"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n  LOCKED"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n  OUT_OF_RESOURCES"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n  WAITING_FOR_EVENT"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])]),a._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[a._v("1")]),s("br"),s("span",{staticClass:"line-number"},[a._v("2")]),s("br"),s("span",{staticClass:"line-number"},[a._v("3")]),s("br"),s("span",{staticClass:"line-number"},[a._v("4")]),s("br"),s("span",{staticClass:"line-number"},[a._v("5")]),s("br"),s("span",{staticClass:"line-number"},[a._v("6")]),s("br"),s("span",{staticClass:"line-number"},[a._v("7")]),s("br"),s("span",{staticClass:"line-number"},[a._v("8")]),s("br")])]),s("p",[a._v("这样的类就是一块"),s("strong",[a._v("依赖磁铁（dependency magnet）")]),a._v("。其它类都导入和使用它。当 Error 枚举修改时，所有这些其它的类需要重新编译和部署。")]),a._v(" "),s("p",[a._v("使用异常代替错误码，新异常就可以从异常类派生出来。")]),a._v(" "),s("h2",{attrs:{id:"_6-对象和数据结构"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_6-对象和数据结构"}},[a._v("#")]),a._v(" 6 对象和数据结构")]),a._v(" "),s("h3",{attrs:{id:"_6-2-数据、对象的反对称性"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_6-2-数据、对象的反对称性"}},[a._v("#")]),a._v(" 6.2 数据、对象的反对称性")]),a._v(" "),s("p",[a._v("过程式代码（使用数据结构的代码）便于在不改动既有的数据结构的前提下添加新函数。面向对象代码便于在不改动既有函数的前提下添加新类。")]),a._v(" "),s("p",[a._v("过程式代码难以添加新数据结构，因为必须修改所有函数。面向对象代码难以添加新函数，因为必须修改所有子类。")]),a._v(" "),s("h2",{attrs:{id:"_7-处理异常"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_7-处理异常"}},[a._v("#")]),a._v(" 7 处理异常")]),a._v(" "),s("h3",{attrs:{id:"_7-3-使用不可控异常"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_7-3-使用不可控异常"}},[a._v("#")]),a._v(" 7.3 使用不可控异常")]),a._v(" "),s("p",[a._v("可控异常的代价是违反开放封闭原则。如果在方法中抛出可控异常，就得在 catch 语句中和抛出异常处之间的每个方法签名中声明该异常。即意味着对软件较低层次的修改，都将波及较高层级的签名。")]),a._v(" "),s("h3",{attrs:{id:"_7-6-定义常规流程"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_7-6-定义常规流程"}},[a._v("#")]),a._v(" 7.6 定义常规流程")]),a._v(" "),s("p",[a._v("可以使用"),s("strong",[a._v("特例模式")]),a._v("。创建类或者配置对象处理特例，这样客户端就不用应付异常了。")]),a._v(" "),s("h3",{attrs:{id:"_7-7-不要返回-null-值"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_7-7-不要返回-null-值"}},[a._v("#")]),a._v(" 7.7 不要返回 null 值")]),a._v(" "),s("p",[a._v("给调用者添加麻烦，只要有一处没有检查 null 值，程序就会失控。")]),a._v(" "),s("h3",{attrs:{id:"_7-8-不要传递-null-值"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_7-8-不要传递-null-值"}},[a._v("#")]),a._v(" 7.8 不要传递 null 值")]),a._v(" "),s("h3",{attrs:{id:"_7-9-小结"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_7-9-小结"}},[a._v("#")]),a._v(" 7.9 小结")]),a._v(" "),s("p",[a._v("将错误处理隔离看待，独立于主要逻辑之外，就能写出强固而整洁的代码。做到这一步就能单独处理错误，提高了代码的可维护性。")]),a._v(" "),s("h2",{attrs:{id:"_10-类"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_10-类"}},[a._v("#")]),a._v(" 10 类")]),a._v(" "),s("h3",{attrs:{id:"_10-2-类应该短小"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_10-2-类应该短小"}},[a._v("#")]),a._v(" 10.2 类应该短小")]),a._v(" "),s("h4",{attrs:{id:"_10-2-1-单一权责原则"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_10-2-1-单一权责原则"}},[a._v("#")]),a._v(" 10.2.1 单一权责原则")]),a._v(" "),s("p",[a._v("类或模块应有且只有一个修改理由。")]),a._v(" "),s("p",[a._v("系统应该由许多短小的类而不是少量巨大的类。有大量短小类的系统并不比有少量庞大类的系统拥有更多移动部件。每个达到一定规模的系统都会包含大量逻辑和复杂性。管理这种复杂性的首要目标就是加以组织。")]),a._v(" "),s("h4",{attrs:{id:"_10-2-2-内聚"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_10-2-2-内聚"}},[a._v("#")]),a._v(" 10.2.2 内聚")]),a._v(" "),s("p",[a._v("保持函数和参数列表短小，有时会导致一组子集方法所用的实体变量数增加，这时尝试将变量和方法拆分到多个类中，让新的类更为内聚。")]),a._v(" "),s("h2",{attrs:{id:"_11-系统"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_11-系统"}},[a._v("#")]),a._v(" 11 系统")]),a._v(" "),s("h3",{attrs:{id:"_11-2-将系统的构造与使用分开"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_11-2-将系统的构造与使用分开"}},[a._v("#")]),a._v(" 11.2 将系统的构造与使用分开")]),a._v(" "),s("blockquote",[s("p",[a._v("软件系统应将起始启始过程和启始过程之后的运行时逻辑分离开，在启始过程中构建应用对象，也会存在互相缠结的依赖关系。")])]),a._v(" "),s("p",[a._v("多数程序没有做分离处理，启始过程代码很特殊，被混杂到运行时逻辑中。如下例：")]),a._v(" "),s("div",{staticClass:"language-java line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("public")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Service")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("getService")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("if")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("service "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("==")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("null")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("\n    service "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("new")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("MyServiceImpl")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// Good enought default for most case?")]),a._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("return")]),a._v(" service"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])]),a._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[a._v("1")]),s("br"),s("span",{staticClass:"line-number"},[a._v("2")]),s("br"),s("span",{staticClass:"line-number"},[a._v("3")]),s("br"),s("span",{staticClass:"line-number"},[a._v("4")]),s("br"),s("span",{staticClass:"line-number"},[a._v("5")]),s("br")])]),s("p",[a._v("这就是所谓 "),s("strong",[a._v("延时初始化/赋值")]),a._v("，也有一些好处。在真正用到对象前，无需操心这种架空构造，启始时间也会更短，还能保证永远不返回 null 值。")]),a._v(" "),s("p",[a._v("然而这样同时也得到了 MyServiceImp 及其构造器所需一切的硬编码依赖。不分解这些依赖关系就无法编译，即便是在运行时永远不使用这种类型的对象。")]),a._v(" "),s("p",[a._v("如果 MyServiceImpl 是个重型对象，则测试也会是个问题。首先必须要保证在单元测试调用方法之前，就给 Service 指派恰当的测试替身（TEST DOUBLE）或仿制对象（MOCK OBJECT）。由于构造逻辑与运行过程相混杂，我们必须测试所有的执行路径（例如， null 值测试及其代码块）。有了这些权责，说明方法做了不止一件事，这样就略微违反了"),s("strong",[a._v("单一权责原则")]),a._v("。")]),a._v(" "),s("p",[a._v("最糟糕的是不知道 MyServiceImpl 在所有的情形中是否都是正确的对象。为什么该方法的所属类必须要知道全局情景？我们是否正能知道在这里要用到的正确对象？是否真有可能存在一种放之四海而皆准的类型？")]),a._v(" "),s("p",[a._v("如果应用程序中有许多类似的情况，四散分布，缺乏模块组织性，就会有许多重复代码。")]),a._v(" "),s("p",[a._v("如果勤于打造有着良好格式并且强固的系统，就不应该让这类就手小技巧破坏模块组织性。对象构造的启始和设置过程也不例外。")]),a._v(" "),s("h4",{attrs:{id:"_11-2-2-工厂"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_11-2-2-工厂"}},[a._v("#")]),a._v(" 11.2.2 工厂")]),a._v(" "),s("h4",{attrs:{id:"_11-2-3-依赖注入"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_11-2-3-依赖注入"}},[a._v("#")]),a._v(" 11.2.3 依赖注入")]),a._v(" "),s("h3",{attrs:{id:"_11-3-扩容"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_11-3-扩容"}},[a._v("#")]),a._v(" 11.3 扩容")]),a._v(" "),s("p",[a._v("“一开始就做对系统”纯属神话。反之只应该去实现今天的用户故事，然后重构，明天再扩展系统、实现新的用户故事。这就是迭代和增量敏捷的精髓所在。测试驱动开发、重构以及它们打造出的整洁代码，在代码层面保证了这个过程的实现。")]),a._v(" "),s("blockquote",[s("p",[a._v("软件系统与物理系统可以类比。它们的架构都可以递增式地增长，只要我们持续将关注面恰当的切分。")])]),a._v(" "),s("h3",{attrs:{id:"_11-5-纯-java-aop-框架"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_11-5-纯-java-aop-框架"}},[a._v("#")]),a._v(" 11.5 纯 Java AOP 框架")]),a._v(" "),s("h3",{attrs:{id:"_11-6-aspectj-的方面"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_11-6-aspectj-的方面"}},[a._v("#")]),a._v(" 11.6 AspectJ 的方面")]),a._v(" "),s("h2",{attrs:{id:"_12-迭进"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_12-迭进"}},[a._v("#")]),a._v(" 12 迭进")]),a._v(" "),s("h3",{attrs:{id:"_12-4-不可重复"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_12-4-不可重复"}},[a._v("#")]),a._v(" 12.4 不可重复")]),a._v(" "),s("p",[a._v("小规模复用 => 大规模复用")]),a._v(" "),s("h3",{attrs:{id:"_12-5-表达力"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_12-5-表达力"}},[a._v("#")]),a._v(" 12.5 表达力")]),a._v(" "),s("blockquote",[s("p",[a._v("我们中的大多数人都经理过费解代码的纠缠。我们中的许多人自己就编写过费解的代码。写出自己能理解的代码很容易，因为在写这些代码时，我们正深入于要解决的问题中。代码的其它维护者不会那么深入，也就不易理解代码。")]),a._v(" "),s("p",[a._v("软件项目的主要成本在于长期维护。为了在修改时尽量降低出现缺陷的可能性，很有必要理解系统是做什么的。当系统变得越来越复杂，开发者就需要越来越多的时间来理解它，而且极有可能误解。所以，代码应当清晰地表达其作者的意图。作者把代码写的越清晰，其他人花在理解代码上的时间就越少，从而减少缺陷，缩减维护成本。")]),a._v(" "),s("p",[a._v("不过，做到有表达力的最重要方式却是 "),s("strong",[a._v("尝试")]),a._v("。有太多时间，我们写出能工作的代码，就转移到下一个问题上，没有下足功夫调整代码，让后来者易于阅读。记住，下一位读代码的人最有可能是你自己。")]),a._v(" "),s("p",[a._v("所以，多少尊重一下你的手艺吧。花一点时间在每个函数和类上。选用较好的名称，将大函数切分成小函数。时时照拂自己创建的东西。用心是最珍贵的资源。")])]),a._v(" "),s("h3",{attrs:{id:"_12-6-尽可能少的类和方法"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_12-6-尽可能少的类和方法"}},[a._v("#")]),a._v(" 12.6 尽可能少的类和方法")]),a._v(" "),s("p",[a._v("避免过度使用消除重复、代码表达力和 SRP 等基础的概念。目标是保持函数和类短小的同时，保持整个系统短小精悍。")]),a._v(" "),s("h2",{attrs:{id:"_13-并发编程"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_13-并发编程"}},[a._v("#")]),a._v(" 13 并发编程")]),a._v(" "),s("h3",{attrs:{id:"_13-1-为何要并发"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_13-1-为何要并发"}},[a._v("#")]),a._v(" 13.1 为何要并发")]),a._v(" "),s("ul",[s("li",[s("p",[a._v("并发总能改进性能。并发有时能改进性能，但只在多个线程或多处理器之间能分享大量等待时间的时候管用。事情没那么简单。")])]),a._v(" "),s("li",[s("p",[a._v("编写并发程序无需修改设计。事实上，并发算法的设计有可能与单线程系统的设计极不相同。目的与时机的解耦往往对系统结构产生巨大的影响。")])]),a._v(" "),s("li",[s("p",[a._v("并发会在性能和编写额外代码上增加一些开销；")])]),a._v(" "),s("li",[s("p",[a._v("正确的并发是复杂的，即使对于简单的问题也是如此；")])]),a._v(" "),s("li",[s("p",[a._v("并发的缺陷并非总能重现，所以常被看作偶发事件而忽略，未被当做真的缺陷看待；")])]),a._v(" "),s("li",[s("p",[a._v("并发常常需要对设计策略做根本性修改。")])])]),a._v(" "),s("h3",{attrs:{id:"_13-5-执行模型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_13-5-执行模型"}},[a._v("#")]),a._v(" 13.5 执行模型")]),a._v(" "),s("h4",{attrs:{id:"_13-5-1-生产者-消费者模型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_13-5-1-生产者-消费者模型"}},[a._v("#")]),a._v(" 13.5.1 生产者-消费者模型")]),a._v(" "),s("h4",{attrs:{id:"_13-5-2-读者-作者模型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_13-5-2-读者-作者模型"}},[a._v("#")]),a._v(" 13.5.2 读者-作者模型")]),a._v(" "),s("h4",{attrs:{id:"_13-5-3-哲学家就餐模型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_13-5-3-哲学家就餐模型"}},[a._v("#")]),a._v(" 13.5.3 哲学家就餐模型")]),a._v(" "),s("h3",{attrs:{id:"_13-7-保持同步区域微小"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_13-7-保持同步区域微小"}},[a._v("#")]),a._v(" 13.7 保持同步区域微小")]),a._v(" "),s("p",[a._v("关键字 "),s("code",[a._v("synchoronized")]),a._v(" 制造了锁。同一个锁维护的所有区域在任一时刻保证只有一个线程执行。锁是昂贵的，因为它们带来了延迟和额外的开销。所以不应将代码扔给 "),s("code",[a._v("synchronized")]),a._v(" 语句了事。临界区应该被保护起来，所以应该尽可能少地设计临界区。")]),a._v(" "),s("p",[a._v("将同步延展到最小临界区范围之外会增加资源争用、降低执行效率。")]),a._v(" "),s("h3",{attrs:{id:"_13-9-测试多线程"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_13-9-测试多线程"}},[a._v("#")]),a._v(" 13.9 测试多线程")]),a._v(" "),s("h4",{attrs:{id:"_13-9-3-编写可拔插的线程代码"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_13-9-3-编写可拔插的线程代码"}},[a._v("#")]),a._v(" 13.9.3 编写可拔插的线程代码")]),a._v(" "),s("h4",{attrs:{id:"_13-9-4-编写可调整的线程代码"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_13-9-4-编写可调整的线程代码"}},[a._v("#")]),a._v(" 13.9.4 编写可调整的线程代码")]),a._v(" "),s("h2",{attrs:{id:"_17"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_17"}},[a._v("#")]),a._v(" 17")]),a._v(" "),s("h3",{attrs:{id:"_17-4-一般性问题"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_17-4-一般性问题"}},[a._v("#")]),a._v(" 17.4 一般性问题")]),a._v(" "),s("h4",{attrs:{id:"g5-重复"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#g5-重复"}},[a._v("#")]),a._v(" G5 重复")]),a._v(" "),s("p",[a._v("DRY 原则（Don't Repeat Yourself）")]),a._v(" "),s("h4",{attrs:{id:"g10-垂直分隔"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#g10-垂直分隔"}},[a._v("#")]),a._v(" G10 垂直分隔")]),a._v(" "),s("p",[a._v("变量和函数应该在靠近被使用的地方定义。")]),a._v(" "),s("h4",{attrs:{id:"g13-人为耦合"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#g13-人为耦合"}},[a._v("#")]),a._v(" G13 人为耦合")]),a._v(" "),s("h4",{attrs:{id:"g15-算子参数"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#g15-算子参数"}},[a._v("#")]),a._v(" G15 算子参数")]),a._v(" "),s("h4",{attrs:{id:"g23-用多态代替-if-else-或-switch-case"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#g23-用多态代替-if-else-或-switch-case"}},[a._v("#")]),a._v(" G23 用多态代替 if/else 或 switch/case")]),a._v(" "),s("h4",{attrs:{id:"g28-封装条件"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#g28-封装条件"}},[a._v("#")]),a._v(" G28 封装条件")]),a._v(" "),s("p",[a._v("如果没有 if 或 while 语句的上下文，布尔逻辑就难以理解。")]),a._v(" "),s("p",[a._v("例如：")]),a._v(" "),s("p",[s("code",[a._v("if (shouldBeDeleted(timer))")])]),a._v(" "),s("p",[a._v("要好于")]),a._v(" "),s("p",[s("code",[a._v("if (timer.hasExpired()) && !timer.isRecurrent())")])]),a._v(" "),s("h4",{attrs:{id:"g29-避免否定性条件"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#g29-避免否定性条件"}},[a._v("#")]),a._v(" G29 避免否定性条件")]),a._v(" "),s("p",[a._v("否定式肯定比肯定式难明白一些，所以尽可能用肯定形式。例如：")]),a._v(" "),s("p",[s("code",[a._v("if (buffer.shouldCompact())")])]),a._v(" "),s("p",[a._v("要好于")]),a._v(" "),s("p",[s("code",[a._v("if (!buffer.shouldNotCompact())")])]),a._v(" "),s("h4",{attrs:{id:"g33-封装边界条件"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#g33-封装边界条件"}},[a._v("#")]),a._v(" G33 封装边界条件")]),a._v(" "),s("h4",{attrs:{id:"g35-在较高层级放置可配置数据"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#g35-在较高层级放置可配置数据"}},[a._v("#")]),a._v(" G35 在较高层级放置可配置数据")]),a._v(" "),s("h4",{attrs:{id:"g36-避免传递浏览"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#g36-避免传递浏览"}},[a._v("#")]),a._v(" G36 避免传递浏览")]),a._v(" "),s("h3",{attrs:{id:"_17-5-java"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_17-5-java"}},[a._v("#")]),a._v(" 17.5 Java")]),a._v(" "),s("h4",{attrs:{id:"j2-不要继承常量"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#j2-不要继承常量"}},[a._v("#")]),a._v(" J2 不要继承常量")]),a._v(" "),s("h3",{attrs:{id:"_17-6-名称"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_17-6-名称"}},[a._v("#")]),a._v(" 17.6 名称")]),a._v(" "),s("h4",{attrs:{id:"n1-采用描述性名称"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#n1-采用描述性名称"}},[a._v("#")]),a._v(" N1：采用描述性名称")]),a._v(" "),s("blockquote",[s("p",[a._v("不要太快取名。确认名称具有描述性。记住，事物的意义随着软件的演化而变化，所以，要经常性地重新估量名称是否恰当。")]),a._v(" "),s("p",[a._v("仔细取好的名字的威力在于，它用描述性信息覆盖了代码。这种信息覆盖设定了读者对于模块其它函数行为的期待。通过阅读代码你就能推断出方法的实现。读完方法时，你会感到它“深和你意”。")])]),a._v(" "),s("h4",{attrs:{id:"n5-为较大作用范围选用较长名称"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#n5-为较大作用范围选用较长名称"}},[a._v("#")]),a._v(" N5 为较大作用范围选用较长名称")]),a._v(" "),s("blockquote",[s("p",[a._v("名称的长度应与作用范围的广泛度相关。对于较小的作用范围，可以用很短的名称，而对于较大作用范围就该用较长的名称。")])]),a._v(" "),s("h4",{attrs:{id:"n6-名称应该说明副作用"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#n6-名称应该说明副作用"}},[a._v("#")]),a._v(" N6 名称应该说明副作用")]),a._v(" "),s("blockquote",[s("p",[a._v("名称应该说明函数、变量或类的一切信息。不要用名称掩蔽副作用。不要用简单的动词来描述一个做了不止一个简单动作的函数。例如，请看以下来自 TestNG 的代码：")]),a._v(" "),s("div",{staticClass:"language-java line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("public")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("ObjectOutputStream")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("getOos")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("throw")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("IOException")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("if")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("m_oos "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("==")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("null")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    m_oos "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("new")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("ObjectOutputStream")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("m_socket"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("getOutputStream")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("return")]),a._v(" m_oos"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])]),a._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[a._v("1")]),s("br"),s("span",{staticClass:"line-number"},[a._v("2")]),s("br"),s("span",{staticClass:"line-number"},[a._v("3")]),s("br"),s("span",{staticClass:"line-number"},[a._v("4")]),s("br"),s("span",{staticClass:"line-number"},[a._v("5")]),s("br"),s("span",{staticClass:"line-number"},[a._v("6")]),s("br")])]),s("p",[a._v("该函数不只是获取了一个 oos，如果 oos 不存在，还会创建一个。所以，更好的名字大概是 "),s("code",[a._v("createOrReturnOos")]),a._v("。")])])])}),[],!1,null,null,null);t.default=_.exports}}]);