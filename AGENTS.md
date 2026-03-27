# 博客项目指南

## 创建新博客

使用 Makefile 命令创建新文章：

```bash
make new title="文章标题" tags="标签1,标签2" [description="描述"] [draft=true]
```

- `title`（必填）：文章标题
- `tags`（可选）：逗号分隔的标签，默认为「随笔」
- `description`（可选）：文章描述，默认与标题相同
- `draft`（可选）：是否为草稿，默认 `false`

文件会创建在 `src/data/blog/_2026/` 目录下，frontmatter 中 `author` 固定为 `koukyo`。
