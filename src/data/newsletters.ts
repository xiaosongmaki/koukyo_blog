export type NewsletterOffer = {
  /** With `oneClick`, must match a key of OPTIN_TARGETS in api/subscribe.ts */
  id: string;
  name: string;
  domain: string;
  /** Carries a ref so the target site can count signups from this page */
  href: string;
  cadence: string;
  body: string;
  /** Show the same-email subscribe button on /thanks */
  oneClick: boolean;
};

export const OFFERS: NewsletterOffer[] = [
  {
    id: "reddit_radar",
    name: "需求雷达",
    domain: "reddit-radar.koukyo.site",
    href: "https://reddit-radar.koukyo.site/?ref=blog_thanks",
    cadence: "有新卡片的那天上午发一封",
    body: "从 Reddit 上找美国从业者吐槽工作痛点的原话，整理成需求卡片，再用 7 项判据判断值不值得做。适合想做出海产品的小团队。",
    oneClick: true,
  },
];
