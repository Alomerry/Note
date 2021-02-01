module.exports = {
    title: 'Alomerry Note',
    description: 'Just playing around',
    evergreen: true,
    patterns: [
        '**/*.md',
    ],
    themeConfig: {
        lastUpdated: 'Last Updated',
        nextLinks: true,
        prevLinks: true,
        repo: 'http://alomerry.com',
        repoLabel: '查看源码',
        smoothScroll: true,
        sidebarDepth: 5,
        sidebar: [
            {
                title: '书籍笔记',
                children: [
                    'books/cleanCode',
                    'books/csapp',
                    'books/gopl'
                ]
            },
            {
                title: '算法解析',
                children: [
                    'algorithm/note',
                    'algorithm/leetcode',
                    'algorithm/pat',
                ]
            },
            {
                title: '其它笔记',
                children: [
                    'custom/keyMap',
                    'custom/note',
                ]
            },
            {
                title: '语言心得',
                children: [
                    'code/golang',
                    'code/java',
                ]
            },
            {
                title: '文档工具',
                children: [
                    'doc/mongodb',
                    'doc/spring',
                    'doc/docker',
                    'doc/git',
                    'doc/qmgo',
                    'doc/redis',
                    'doc/grpc',
                ]
            },
        ]
    },
    markdown: {
        lineNumbers: true,
        toc: {includeLevel: [1, 2, 3, 4, 5]},
        replaceLink: "http://alomerry.com/",
        extendMarkdown: md => {
            md.set({
                breaks: true,
                linkify: true,
            });
            md.use(require('markdown-it-sup')),
                md.use(require('markdown-it-sub')),
                md.use(require('markdown-it-footnote')),
                md.use(require('markdown-it-replace-link')),
                md.use(require('markdown-it-attrs'))
        }
    },
    plugins: ['@vuepress/back-to-top']
}