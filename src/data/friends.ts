export type Friend = {
  name: string;
  href: string;
  avatar: string;
  desc: string;
};

// 按交换时间先后排列，新朋友加在末尾。头像用对方站点上的图片地址，打不开时显示名字首字。
export const FRIENDS: Friend[] = [];

export const MY_CARD = {
  name: "koukyo.",
  href: "https://koukyo.site/",
  avatar: "https://koukyo.site/avatar.png",
  desc: "毕业即创业，探索财务自由与人生自主权的个人博客。",
} as const satisfies Friend;
