# docker

## Ubuntu 删除 docker

```she
# 查询相关软件包
dpkg -l | grep docker
# 删除这个包
sudo apt remove --purge dock.ec
```

## docker 避免一直 sudo

`sudo groupadd docker`创建 组

`sudo gpasswd -a ${USER} docker`将用户添加到该 组，例如 xxx 用户

`sudo systemctl restart docker`重启 docker-daemon

## 拷贝容器文件到宿主机

`docker cp <containerId>:<fileName> <hostPath>`
