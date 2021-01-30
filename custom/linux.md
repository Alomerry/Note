# Linux

Linux 查看端口占用情况可以使用 **lsof** 和 **netstat** 命令。

## lsof

```
# lsof -i:8000
COMMAND   PID USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
nodejs  26993 root  10u   IPv4 37999514      0t0  TCP *:8000 (LISTEN)
```



- COMMAND 进程名称
- PID 进程标识符
- USER 进程所有者
- FD 文件描述符，应用程序通过文件描述符识别改文件。如 cwd、txt 等
- TYPE 文件类型，如 DIR、REG 等
- DEVICE 指定磁盘名称
- SIZE 文件大小
- NODE 索引节点
- NAME 打开文件的确切名称

## netstat

netstat -<option> | grep <port>

- -t (tcp) 仅显示 tcp 相关选项
- -u (udp) 仅显示 udp 相关选项
- -n 拒绝显示别名，能显示数字的全部转化为数字
- -l 仅列出在 Listen（监听）的服务状态
- -p 显示建立相关链接的程序名