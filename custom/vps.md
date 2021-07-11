更新 unix 密码 sudo password
生成 ssh-key ssh-keygen
cat /root/.ssh/id_rsa.pub
修改主机名 sudo /etc/hostname sudo reboot
安装宝塔面板 https://www.bt.cn

- 开放端口 修改密码
- 安装 nginx

-

迁移博客

- 下载 typecho 源码
- 新服务安装 MySQL，并新建同名数据库
- 备份旧数据库，导入新数据库，安装 typecho 并选择使用旧数据
- 替换 usr 文件夹

搭建 v2ray

安装 maven
访问 https://downloads.apache.org/maven/maven-3/ download
tar zxvf apache-maven-<version>-bin.tar.gz
sudo mv apache-maven-<version>/ /opt/apache-maven-<version>/

安装 jdk
sudo apt-get install openjdk-8-jdk
export M2_HOME=/opt/maven/apache-maven-3.6.3
export CLASSPATH=$CLASSPATH:$M2_HOME/lib
export PATH=$PATH:$M2_HOME/bin
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=$JAVA_HOME/lib:$JRE_HOME/lib:$CLASSPATH
export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH

ps -aux | grep spring-boot:run

