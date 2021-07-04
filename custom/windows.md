WSL2 设置代理

在 Ubuntu 子系统中，通过 `cat /etc/resolv.conf` 查看 DNS 服务器 IP

```bash
export ALL_PROXY="http://$host_ip:7890"
```

