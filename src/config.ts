export const SITE = {
  website: "https://koukyo.site/",
  author: "koukyo",
  profile: "https://koukyo.site/",
  desc: "毕业即创业，探索财务自由与人生自主权的个人博客。",
  title: "koukyo.",
  ogImage: "og-image.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/xiaosongmaki/koukyo_blog/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh-CN",
  timezone: "Asia/Shanghai",
} as const;
