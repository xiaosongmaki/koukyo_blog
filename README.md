# koukyo.

koukyo 的个人博客，地址 <https://koukyo.site/>。

毕业即创业，探索财务自由与人生自主权。文章主要写创业复盘、精益验证、被动收入和财务自由，也写留学和日本生活。

站点用 [Astro](https://astro.build/) 搭建，主题改自 [AstroPaper](https://github.com/satnaing/astro-paper)。

## 目录结构

```text
├── api/subscribe.ts      # 邮件订阅接口，把邮箱加入 Resend 的 General Audience；也负责感谢页的一键订阅
├── drafts/               # 同一篇文章发到知乎、公众号、即刻、电鸭等平台的改写稿
├── public/               # favicon、默认 OG 图等静态资源
├── src/
│   ├── config.ts         # 站点标题、描述、语言、时区、分页
│   ├── data/blog/_2026/  # 博客文章
│   ├── data/newsletters.ts # 感谢页「你可能也会感兴趣」里的其他邮件
│   ├── pages/about.md    # 关于页
│   └── components/       # 页面组件，Newsletter.astro 是订阅表单
└── Makefile              # make new 新建文章
```

## 写文章

```bash
make new title="first-startup-lessons" tags="创业,反思" description="文章描述" draft=true
```

`title` 必填，用英文单词加 `-`，同时作为文件名。`tags` 用逗号分隔，不填默认 `随笔`。`description` 不填就和标题一样。`draft` 默认 `false`。

文件生成在 `src/data/blog/_2026/`，生成后把 frontmatter 里的 `title` 改成正式标题。

现有标签：`创业` `反思` `留学` `自我介绍` `自由` `日本生活` `财务自由` `被动收入` `自动化` `随笔`。能复用就复用，少开新标签。

`draft: true` 的文章不会发布。`pubDatetime` 还没到的文章线上看不到，本地 `pnpm run dev` 下可以预览。

## 本地运行

```bash
pnpm install
pnpm run dev       # http://localhost:4321
```

| 命令 | 作用 |
| :--- | :--- |
| `pnpm run build` | 类型检查、构建到 `dist/`，并生成 Pagefind 搜索索引 |
| `pnpm run preview` | 预览构建结果 |
| `pnpm run format` | Prettier 格式化（`format:check` 只检查） |
| `pnpm run lint` | ESLint 检查 |
| `docker compose up -d` | 用 Docker 跑开发服务器 |

## 访问统计

Umami 自托管实例 https://umami.peguni.com ，网站 `blog_kyo`（ID `b259e1da-dadc-4168-83b8-e3aab495dd3f`）。跟踪脚本在 `src/layouts/Layout.astro`，`data-domains="koukyo.site"` 让本地和 Vercel 预览不计数；同一处加载的 `recorder.js` 负责会话回放和热力图。`script.js` 带 `data-performance="true"`，采集 Web Vitals（LCP、INP、CLS、FCP、TTFB），在 Performance 标签看。

自定义事件：

- `newsletter-subscribe`：Newsletter 订阅成功（`Newsletter.astro`），同时用邮箱 `identify` 会话。
- `offer-subscribe`：在感谢页一键订阅了其他邮件，带 `offer`（`newsletters.ts` 的 `id`）。点卡片链接走 `outbound`，目标站用 `ref=blog_thanks` 统计。
- `outbound`：点击站外链接，带 `url`、`host`、`page`（当前路径），监听器在 `Layout.astro`。

后台已保存的报表：Goals「订阅 newsletter-subscribe」「站外点击 outbound」，Funnels「首页 → 订阅」（`/` → `newsletter-subscribe`）和「文章详情 → 订阅」（`/posts/*` → `newsletter-subscribe`），步骤间隔上限 60 分钟。查询数据用 `.agents/skills/umami`。

## 订阅感谢页

订阅成功后跳到 `/thanks/`（`noindex`，不进 sitemap 和站内搜索）。页面内容：发信频率和垃圾箱提醒、回到原页面的链接、Map 的「从这里开始」和各条线、「你可能也会感兴趣」。

邮箱、来源路径和一次性 token 经 sessionStorage 的 `kyo-subscribed` 传过去，不放进 URL。token 是 `/api/subscribe` 订阅成功时用 `RESEND_API_KEY` 派生的 HMAC 签发的，一小时有效。感谢页点「用同一个邮箱订阅」时带 `also: <id>` 和 token 再请求一次 `/api/subscribe`，不再过人机验证。直接打开 `/thanks/` 时没有 token，只显示链接。

新增一份邮件：在 `src/data/newsletters.ts` 的 `OFFERS` 里加一项。只放链接时 `oneClick: false`；要一键订阅，再在 `api/subscribe.ts` 的 `OPTIN_TARGETS` 里登记同名 `id` 的订阅函数。

需求雷达的一键订阅调用 Windmill `f/passive_income/reddit_radar/reddit_radar_subscribe`（`ref=blog_thanks`），和雷达站自己的表单走同一个脚本，已退订的人不会被重新订阅。没配 `WINDMILL_RADAR_SUBSCRIBE_TOKEN` 时接口返回 503，页面提示改点链接。

## 环境变量

放在 `.env` 里，这个文件不会提交。

| 变量 | 用途 |
| :--- | :--- |
| `RESEND_API_KEY` | 订阅接口调用 Resend 时使用，也用来签发感谢页的一键订阅 token |
| `WINDMILL_RADAR_SUBSCRIBE_TOKEN` | 只能运行 `f/passive_income/reddit_radar/reddit_radar_subscribe` 的 Windmill token，感谢页一键订阅需求雷达时使用；可以和 reddit-radar 项目的 `WINDMILL_SUBSCRIBE_TOKEN` 用同一个值 |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | 可选，Google Search Console 站点验证 |

## 许可

代码沿用 AstroPaper 的 MIT License，见 [LICENSE](LICENSE)。文章版权归作者所有。
