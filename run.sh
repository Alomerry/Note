#! /bin/bash
# author:alomerry

#如果文件夹不存在，创建文件夹
if [ ! -d "/home/ubuntu/projects/Note" ]; then
  cd /home/ubuntu/projects/
  git clone git@gitee.com:alomerry/Note.git
fi

cd /home/ubuntu/projects/Note

pwd

echo "start pull code..."

## https://github.com/Alomerry/Note.git
git pull

echo "repository update success! "

cp -r /home/ubuntu/projects/Note/.vuepress/dist/* /www/wwwroot/doc.cloudmo.top/

cp /home/ubuntu/projects/Note/custom/* /www/wwwroot/doc.cloudmo.top/

#echo "s! "
#parseconf() {
#  sed -e 's/^[ ;]*//' \
#      -e 's/[ ;]*$//' \
#      -e 's/\/\/.*//' \
#      -e 's/ *= */=/' $1 \
#  | while IFS="=" read -r name value
#  do
#    echo "$name"
#    [ -n "$name" ] && echo "name=$name value=$value"
#  done
#}
#file="./note.cfg"
##while IFS='' read -r line || [[ -n "$line" ]]; do
##  echo "$line"
##  parseconf "$line"
##done < "$file"
#parseconf "$file"
#
#echo "success! "