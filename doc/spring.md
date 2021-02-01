# Spring

## Spring AOP

@Aspect 注解使用详解

```
@Aspect:作用是把当前类标识为一个切面供容器读取
 
@Pointcut：Pointcut是植入Advice的触发条件。每个Pointcut的定义包括2部分，一是表达式，二是方法签名。方法签名必须是 public及void型。可以将Pointcut中的方法看作是一个被Advice引用的助记符，因为表达式不直观，因此我们可以通过方法签名的方式为 此表达式命名。因此Pointcut中的方法只需要方法签名，而不需要在方法体内编写实际代码。
@Around：环绕增强，相当于MethodInterceptor
@AfterReturning：后置增强，相当于AfterReturningAdvice，方法正常退出时执行
@Before：标识一个前置增强方法，相当于BeforeAdvice的功能，相似功能的还有
@AfterThrowing：异常抛出增强，相当于ThrowsAdvice
```

Example:

```java
package com.aspectj.test.advice;
 
import java.util.Arrays;
 
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
 
@Aspect
public class AdviceTest {
    @Around("execution(* com.abc.service.*.many*(..))")
    public Object process(ProceedingJoinPoint point) throws Throwable {
        System.out.println("@Around：执行目标方法之前...");
        //访问目标方法的参数：
        Object[] args = point.getArgs();
        if (args != null && args.length > 0 && args[0].getClass() == String.class) {
            args[0] = "改变后的参数1";
        }
        //用改变后的参数执行目标方法
        Object returnValue = point.proceed(args);
        System.out.println("@Around：执行目标方法之后...");
        System.out.println("@Around：被织入的目标对象为：" + point.getTarget());
        return "原返回值：" + returnValue + "，这是返回结果的后缀";
    }
    
    @Before("execution(* com.abc.service.*.many*(..))")
    public void permissionCheck(JoinPoint point) {
        System.out.println("@Before：模拟权限检查...");
        System.out.println("@Before：目标方法为：" + 
                point.getSignature().getDeclaringTypeName() + 
                "." + point.getSignature().getName());
        System.out.println("@Before：参数为：" + Arrays.toString(point.getArgs()));
        System.out.println("@Before：被织入的目标对象为：" + point.getTarget());
    }
    
    @AfterReturning(pointcut="execution(* com.abc.service.*.many*(..))", 
        returning="returnValue")
    public void log(JoinPoint point, Object returnValue) {
        System.out.println("@AfterReturning：模拟日志记录功能...");
        System.out.println("@AfterReturning：目标方法为：" + 
                point.getSignature().getDeclaringTypeName() + 
                "." + point.getSignature().getName());
        System.out.println("@AfterReturning：参数为：" + 
                Arrays.toString(point.getArgs()));
        System.out.println("@AfterReturning：返回值为：" + returnValue);
        System.out.println("@AfterReturning：被织入的目标对象为：" + point.getTarget());
        
    }
    
    @After("execution(* com.abc.service.*.many*(..))")
    public void releaseResource(JoinPoint point) {
        System.out.println("@After：模拟释放资源...");
        System.out.println("@After：目标方法为：" + 
                point.getSignature().getDeclaringTypeName() + 
                "." + point.getSignature().getName());
        System.out.println("@After：参数为：" + Arrays.toString(point.getArgs()));
        System.out.println("@After：被织入的目标对象为：" + point.getTarget());
    }
}
```

Reference: https://blog.csdn.net/fz13768884254/article/details/83538709

## SpringWeb MVC



## Spring Data

## Spring-Mongodb

在类SpringbootdemoApplication上右键Run as选择Spring Boot App后Console输出报错日志如下：

```tex
com.mongodb.MongoSocketOpenException: Exception opening socket
	at com.mongodb.internal.connection.SocketStream.open(SocketStream.java:70) ~[mongo-java-driver-3.12.7.jar:na]
	at com.mongodb.internal.connection.InternalStreamConnection.open(InternalStreamConnection.java:128) ~[mongo-java-driver-3.12.7.jar:na]
	at com.mongodb.internal.connection.DefaultServerMonitor$ServerMonitorRunnable.run(DefaultServerMonitor.java:117) ~[mongo-java-driver-3.12.7.jar:na]
	at java.lang.Thread.run(Thread.java:748) [na:1.8.0_261]
Caused by: java.net.ConnectException: Connection refused: connect
	at java.net.DualStackPlainSocketImpl.waitForConnect(Native Method) ~[na:1.8.0_261]
	at java.net.DualStackPlainSocketImpl.socketConnect(DualStackPlainSocketImpl.java:81) ~[na:1.8.0_261]
	at java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:476) ~[na:1.8.0_261]
	at java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:218) ~[na:1.8.0_261]
	at java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:200) ~[na:1.8.0_261]
	at java.net.PlainSocketImpl.connect(PlainSocketImpl.java:162) ~[na:1.8.0_261]
	at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:394) ~[na:1.8.0_261]
	at java.net.Socket.connect(Socket.java:606) ~[na:1.8.0_261]
	at com.mongodb.internal.connection.SocketStreamHelper.initialize(SocketStreamHelper.java:64) ~[mongo-java-driver-3.12.7.jar:na]
	at com.mongodb.internal.connection.SocketStream.initializeSocket(SocketStream.java:79) ~[mongo-java-driver-3.12.7.jar:na]
	at com.mongodb.internal.connection.SocketStream.open(SocketStream.java:65) ~[mongo-java-driver-3.12.7.jar:na]
	... 3 common frames omitted
```

springboot 自动配置了 mongodb。在启动 springboo 时会自动实例化一个 mongo 实例，需要禁用自动配置 ，增加 `@SpringBootApplication(exclude = MongoAutoConfiguration.class)`

