Ubuntu开放对外端口

1.查看已经开启的端口

sudo ufw status

2.打开80端口

sudo ufw allow 80

3.防火墙开启

sudo ufw enable

4.防火墙重启

sudo ufw reload

# [shell bash判断文件或文件夹是否存在](https://www.cnblogs.com/emanlee/p/3583769.html)

安装 zsh oh-my-zsh

sudo apt-get install -y zsh

sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

install [zsh-autosuggestions]([zsh-autosuggestions/INSTALL.md at master · zsh-users/zsh-autosuggestions · GitHub](https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md)) [zsh-syntax-highlighting]([zsh-syntax-highlighting/INSTALL.md at master · zsh-users/zsh-syntax-highlighting · GitHub](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md))

