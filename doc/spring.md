# Spring

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