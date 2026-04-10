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

## 标签使用规范

优先复用已有标签，避免滥用新标签。新增标签前需斟酌是否确实没有合适的现有标签。

现有标签：`创业` `反思` `留学` `自我介绍` `自由` `日本生活` `财务自由` `被动收入` `自动化` `随笔`
