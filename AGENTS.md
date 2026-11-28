# 博客项目指南

## 创建新博客

使用 Makefile 命令创建新文章：

```bash
make new title="文章标题" tags="标签1,标签2" [description="描述"] [draft=true]
```

- `title`（必填）：文章标题，使用英文，单词之间用 `-` 隔开（如 `first-startup-lessons`）
- `tags`（可选）：逗号分隔的标签，默认为「随笔」
- `description`（可选）：文章描述，默认与标题相同
- `draft`（可选）：是否为草稿，默认 `false`

文件会创建在 `src/data/blog/_2026/` 目录下，frontmatter 中 `author` 固定为 `koukyo`。

## 文章归类

站点不再展示标签，也没有 `/tags` 页面（旧链接由 `vercel.json` 重定向到 `/map`）。按内容归类靠 Map：新文章写完后，在 `src/data/map.ts` 里把它加到对应的线上；不属于任何线的文章会出现在 Map 页底部，并在文末保留按时间的上一篇/下一篇。

## Notes（短想法）

短想法放在 `src/data/notes/`，用 `make note` 按当前时间建文件（如 `2026-11-28-1430.md`），frontmatter 只有 `pubDatetime`（可加 `draft: true`），正文直接写，不需要标题。

- 列表页 `/notes/` 显示全文，每条也有单独页面 `/notes/<文件名>/`，标题和描述取正文开头。
- 首页 Recent Posts 下方显示最近 3 条，两个区块末尾分别是「全部 Posts」（指向归档）和「全部 Notes」。
- 不进 Map、归档和主 RSS，单独的订阅地址是 `/notes/rss.xml`。
- 某条展开写成文章后，在这条末尾加一行链接指向文章。

## 友链

友链数据在 `src/data/friends.ts`，新朋友加在 `FRIENDS` 末尾（名称、链接、头像地址、一句话简介）。`/friends/` 是列表页，入口是首页简介区和页脚里与「开往」并排的「友链」按钮，不放导航。申请说明在 `/friends/apply/`，只从列表页底部进入。

frontmatter 的 `tags` 仍然保留（RSS 和以后可能用到），优先复用已有标签：`创业` `反思` `留学` `自我介绍` `自由` `日本生活` `财务自由` `被动收入` `自动化` `随笔`
