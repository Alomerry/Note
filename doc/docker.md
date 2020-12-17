# docker

## Ubuntu 删除 docker

```she
# 查询相关软件包
dpkg -l | grep docker
# 删除这个包
sudo apt remove --purge dock.ec
```

## docker 避免一直sudo

`sudo groupadd docker`创建 组

`sudo gpasswd -a ${USER} docker`将用户添加到该 组，例如xxx用户

`sudo systemctl restart docker`重启docker-daemon

