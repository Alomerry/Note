# Git 常用命令

## 删除 Git 中的历史文件或敏感信息

Git 仓库中每一个修改都会保存记录，所以如果仅仅是删除敏感信息，然后 commit，那么那个敏感信息至少会在两个历史 commit 里面出现，也就是出现和删除的两次 commit，可以使用以下命令搜索：

`git log -S 'sensitive string' -p --all`

https://git-scm.com/docs/git-filter-branch

### 重写历史 commit

例如将代码中的 alomerry 全部替换成 **\*\*\*\***

`git filter-branch -f --tree-filter 'find . -type f ! -path "./.git*" -exec sed -i "s/admin888/********/g" {} \;' HEAD --all`

_无论使用 rebase 还是 filter-branch，都会在本地 reflog 里面留下一下信息可以回溯到修改之前的状态，但是 reflog 是可以清空的，而且不会随着 push 传输到远程仓库的，可以放心使用。_

### 清空 reflog

```shell
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now
```

### 上传代码

`git push --force --all`

### 删除文件

```shel
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch *.go' --prune-empty --tag-name-filter cat -- --all
```

- `--prune-empty` 表示如果修改后的提交如果为空则扔掉不要

> _Some kinds of filters will generate empty commits that leave the tree untouched. This switch allows_ `git-filter-branch` _to ignore such commits …_

## 强制同步远程分支

```shell
git fetch --all
git reset --hard origin/develop
git pull
```

## 撤销 commit

```shell
git reset --soft HEAD^
```

https://www.cnblogs.com/zhaoyingjie/p/10259715.html

git reset --soft HEAD@{1}

https://blog.csdn.net/hudashi/article/details/7664631/

## 本地仓库推送到多个远程仓库

### 使用 git remote add 命令

```shell
git remote add origin <url 1>
git remote add alomerry <url 2>

git push origin
git push alomerry
```

### 使用 git remote set-url add 命令

```shell
git remote set-url --add origin <url>

git push origin
```

`git remote set-url --add origin` 就是在当前 git 项目的 config 文件中增加一行记录。

使用 `git config -e` 查看：

```ini
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
        ignorecase = true
        precomposeunicode = true
[submodule]
        active = .
[remote "origin"]
        url = git@github.com:Alomerry/Note.git
        fetch = +refs/heads/*:refs/remotes/origin/*
        url = git@gitee.com:alomerry/Note.git
[branch "develop"]
        remote = origin
        merge = refs/heads/develop
```

使用 `git remote -v` 查看当前仓库的远程分支信息：

```shell
git remote -v
origin	git@github.com:Alomerry/Note.git (fetch)
origin	git@github.com:Alomerry/Note.git (push)
origin	git@gitee.com:alomerry/Note.git (push)
```

使用 `git push` 可以看到：

```shell
git push
Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Delta compression using up to 6 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (4/4), 945 bytes | 945.00 KiB/s, done.
Total 4 (delta 1), reused 0 (delta 0)
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
To github.com:Alomerry/Note.git
   896e0ca..dd63a8b  develop -> develop
Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Delta compression using up to 6 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (4/4), 945 bytes | 945.00 KiB/s, done.
Total 4 (delta 1), reused 0 (delta 0)
remote: Powered by GITEE.COM [GNK-5.0]
To gitee.com:alomerry/Note.git
   896e0ca..dd63a8b  develop -> develop
```

## Git 撤销某个提交的文件的变动

`git checkout <branchId / commitId> <fileName>`

## 修改全局属性

`git config --global user.email "alomerry@hotmail.com"`

## ssh-keygen

`ssh-keygen -t rsa -C "any comment can be here"`

- -t = The type of the key to generate
  密钥的类型
- -C = comment to identify the key
  用于识别这个密钥的注释

## 合并 Dev 分支并处理冲突

`git checkout develop`
`git pull origin develop`

`git checkout <your branch>`

这些命令会把你的"mywork"分支里的每个提交(commit)取消掉，并且把它们临时 保存为补丁(patch)(这些补丁放到".git/rebase"目录中),然后把"mywork"分支更新 为最新的"origin"分支，最后把保存的这些补丁应用到"mywork"分支上。

https://blog.csdn.net/hudashi/article/details/7664631/

`git rebase develop`

当'mywork'分支更新之后，它会指向这些新创建的提交(commit),而那些老的提交会被丢弃。 如果运行垃圾收集命令(pruning garbage collection), 这些被丢弃的提交就会删除. （请查看 git gc)

二、解决冲突

在 rebase 的过程中，也许会出现冲突(conflict). 在这种情况，Git 会停止 rebase 并会让你去解决 冲突；在解决完冲突后，用"git-add"命令去更新这些内容的索引(index), 然后，你无需执行 git-commit,只要执行:

$ git rebase --continue

这样 git 会继续应用(apply)余下的补丁。

git push -f

## 删除本地和远程分支后恢复

找到远程提交的 commit 哈希值后 `git checkout -b <hash code>`，然后 `git checkout -b <new branch>` 后重新 push origin

## clone 获取指定指定分支的指定 commit 版本

第一步： git clone [git-url] -b [branch-name]

第二步：git reset --hard [commit-number]

## cherry-pick 指定 commit 的部分文件

- 从 `master` 切出 hotfix 分支 `feat-hotfix-<commit_id>`
- `git cherry-pick -n <commit_hash>`，-n 是 `--no-commit,don't automatically commit`
- 移除不需要的文件，`git checkout <file_name>`
- 获取这个 commit 的提交信息：`git log --pretty=format:提交者：%an，提交时间：%ad，提交说明：%s <commit_id> -1`
- 使用旧的提交信息：`git commit --author="<author>" --date="<date>" -m "<message>"`

https://devblogs.microsoft.com/oldnewthing/20180312-00/?p=98215

http://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html

https://oschina.gitee.io/learn-git-branching/

## 案例

### 某个 MR 被 revert 了之后如何在此重建 MR 修改代码？

git log 查看提交 mr 的 commit 的 hash 值

```
commit 90bd4af583c9d5c2876dd3fdc3eba97e4713a452 (HEAD -> develop)
Author: Alomerry Wu <xxx@xxx.com>
Date:   Tue Feb 2 13:30:14 2021 +0800

    core: update grpc

commit 4becc71f2e504c0960e77df4d01c846117ce4c94
Author: Alomerry Wu <xxx@xxx.com>
Date:   Tue Feb 2 13:30:00 2021 +0800

    vendor: update grpc

commit 67a320491052a781e8c7f53a094a20f4fc3ade34
Merge: f2dd7dd23 b15b73788
Author: xxx <xxx@xxx.com>
Date:   Thu Feb 4 17:26:12 2021 +0800

    Merge branch 'feat-xxx' into 'develop'

    xxx: xxx

    See merge request xxx!7402

commit b15b73788feec28c8906dd0d61dc737b77b6017e
```

此时 4becc71f2e504c0960e77df4d01c846117ce4c94 和 90bd4af583c9d5c2876dd3fdc3eba97e4713a452 是想要提交新 MR 的 commit

git checkout 67a320491052a781e8c7f53a094a20f4fc3ade34

git checkout -b feat-grpc

git cherry-pick 4becc71f2e504c0960e77df4d01c846117ce4c94 90bd4af583c9d5c2876dd3fdc3eba97e4713a452

git push --set-up stream orgin feat-grpc

### 合并 commit

git rebase -i HEAD~2

### Git 如何修改一个过去的 Commit

git log 如下:

```
commit <commit_id_a> (HEAD -> trans, origin/trans)
Date:   Tue Nov 13 23:57:05 2018 +0800

    message a

commit <commit_id_b>
Date:   Sat Nov 10 23:22:19 2018 +0800

    message b

commit <commit_id_c>
Date:   Sat Nov 10 17:41:55 2018 +0800

    message c
```

需要回到第一个 commit commit_id_c 对文件进行修改:

- 将当前分支无关的工作状态进行暂存 git stash
- 将 HEAD 移动到需要修改的 commit 上 git rebase commit_id_c^ --interactive
- 找到需要修改的 commit ，将首行的 pick 改成 edit 后保存
- 修改文件内容
- 将改动文件添加到暂存 git add
- 追加改动到提交 git commit --amend
- 移动 HEAD 回到最新的 commit
- 恢复之前的工作状态 git stash pop

有什么用

最现实的用处是如果你不小心把密码等敏感信息上传了，需要删掉，但后面又已经有新的 commit 信息你又不希望丢掉的时候，这个方法就派上用场了。
我的使用场景则是在 github 上翻译文档，希望能保证每个 commit 都是原文和译文的对照，方便他人觉得译文有问题的时候能快速获取原文。
而译文的多次修改如果分开提 commit 的话会让寻找原文变得很麻烦。

缺点

被修改分支后的所有 commit 都会被重新提交一遍，此时 master 分支 merge 这个分支的话会出现 commit 重复的问题。所以也只能在没有其他分支的情况下在主分支干这事。

## Git 工具 - 高级合并

https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E9%AB%98%E7%BA%A7%E5%90%88%E5%B9%B6
