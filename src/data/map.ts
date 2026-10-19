export type StationKind = "经历" | "方法";

export type MapStation = {
  /** Post slug, the last segment of `/posts/<slug>` */
  slug: string;
  /** One line on what the reader gets from this post */
  takeaway: string;
  kind: StationKind;
};

export type MapLine = {
  id: string;
  name: string;
  /** Used for rails and markers only, so it must stay legible on both themes */
  color: string;
  question: string;
  intro: string;
  stations: MapStation[];
};

export const MAP_INTRO =
  "我的文章主要有三条线：一是一路走来的经历，二是自己摸索出的创业理念，三是如何让收入不再绑死在时间上的财务规划。";

export const START_HERE = [
  "hello-world",
  "first-startup-lessons",
  "leverage-and-passive-income",
];

export const MAP_LINES: MapLine[] = [
  {
    id: "journey",
    name: "创业经历",
    color: "#e0582f",
    question: "从东京到广州，这一路发生了什么？",
    intro:
      "按时间顺序读，是我毕业创业、关掉日本公司、回国重新开始的过程。每一站都是一次试错。",
    stations: [
      {
        slug: "hello-world",
        kind: "经历",
        takeaway: "为什么毕业就创业，我想换回的是什么",
      },
      {
        slug: "first-startup-lessons",
        kind: "经历",
        takeaway: "闭门做了半年产品，见到客户才发现方向错了",
      },
      {
        slug: "lean-validation-cold-outreach",
        kind: "经历",
        takeaway: "2500 次冷外联、95 条回复之后，为什么选择止损",
      },
      {
        slug: "dissolving-japanese-company",
        kind: "经历",
        takeaway: "一年创业的真实账单，以及离开东京的理由",
      },
      {
        slug: "startup-warmup-three-carrier-pivots",
        kind: "经历",
        takeaway: "同一个后端换三种壳，从没人用到用完免费额度",
      },
    ],
  },
  {
    id: "method",
    name: "创业方法",
    color: "#1a9a85",
    question: "写代码之前，怎么知道一个想法值不值得做？",
    intro:
      "从踩过的坑里总结出来、可以照着做的方法。每个方法都配了我自己的实战记录。",
    stations: [
      {
        slug: "validate-startup-idea-lean-experiments",
        kind: "方法",
        takeaway: "先找核心风险，再用 5 种低成本实验去验证",
      },
      {
        slug: "lean-validation-cold-outreach",
        kind: "经历",
        takeaway: "上一站方法的完整实战，包括什么时候该收手",
      },
      {
        slug: "long-termism-needs-measurable-metrics",
        kind: "方法",
        takeaway: "没有外部反馈的冷启动期，用中间指标撑下去",
      },
    ],
  },
  {
    id: "money",
    name: "财务与杠杆",
    color: "#b5850b",
    question: "怎么让收入不再和时间一一绑定？",
    intro: "被动收入的本质、杠杆思维，以及怎么省下那些不起眼却很贵的费用。",
    stations: [
      {
        slug: "leverage-and-passive-income",
        kind: "方法",
        takeaway: "被动收入的本质是杠杆率，不是什么都不干",
      },
      {
        slug: "dissolving-japanese-company",
        kind: "经历",
        takeaway: "关公司时最大的损失，竟然是换汇",
      },
      {
        slug: "hk-investment-accounts-lower-fees",
        kind: "方法",
        takeaway: "手续费在 30 年复利下能吃掉多少，以及怎么在香港开户",
      },
    ],
  },
];
