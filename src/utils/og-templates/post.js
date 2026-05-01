import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

// 模板里出现的固定文案，需要全部传给 loadGoogleFonts 以便字体子集包含这些字。
const STATIC_TEXT = "by ";

export default async post => {
  const title = post.data.title ?? "";
  const description = post.data.description ?? "";
  const author = post.data.author ?? SITE.author;
  const hostname = new URL(SITE.website).hostname;

  return satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          background: "#fdfdfd",
          backgroundImage:
            "radial-gradient(circle at 100% 0%, rgba(0,108,172,0.08) 0%, rgba(0,108,172,0) 55%), radial-gradient(circle at 0% 100%, rgba(255,107,1,0.06) 0%, rgba(255,107,1,0) 55%)",
          color: "#282728",
          fontFamily: "Noto Sans SC",
        },
        children: [
          // 中间主体：标题 + 描述
          {
            type: "div",
            props: {
              style: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: 28,
                borderLeft: "6px solid #006cac",
                marginTop: 40,
                marginBottom: 40,
                gap: 24,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: title.length > 22 ? 64 : 80,
                      fontWeight: 700,
                      lineHeight: 1.18,
                      letterSpacing: "-1px",
                      color: "#1a1a1a",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    },
                    children: title,
                  },
                },
                description && {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 28,
                      lineHeight: 1.5,
                      color: "#5a5a5a",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    },
                    children: description,
                  },
                },
              ].filter(Boolean),
            },
          },
          // 底部：作者 + 域名
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 26,
                color: "#4a4a4a",
                paddingTop: 24,
                borderTop: "1px solid #e6e6e6",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", alignItems: "baseline", gap: 8 },
                    children: [
                      { type: "span", props: { children: "by " } },
                      {
                        type: "span",
                        props: {
                          style: { fontWeight: 700, color: "#282728" },
                          children: author,
                        },
                      },
                    ],
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontWeight: 700,
                      color: "#006cac",
                      letterSpacing: "0.5px",
                    },
                    children: hostname,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadGoogleFonts(
        title + description + author + hostname + STATIC_TEXT
      ),
    }
  );
};
