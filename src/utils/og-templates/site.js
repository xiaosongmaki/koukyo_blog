import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

export default async () => {
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
          // 中间：站点标题与简介
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
                      fontSize: 96,
                      fontWeight: 700,
                      letterSpacing: "-2px",
                      lineHeight: 1.1,
                      color: "#1a1a1a",
                    },
                    children: SITE.title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 30,
                      lineHeight: 1.5,
                      color: "#5a5a5a",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    },
                    children: SITE.desc,
                  },
                },
              ],
            },
          },
          // 底部域名
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "flex-end",
                fontSize: 26,
                fontWeight: 700,
                color: "#006cac",
                letterSpacing: "0.5px",
                paddingTop: 24,
                borderTop: "1px solid #e6e6e6",
              },
              children: hostname,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadGoogleFonts(SITE.title + SITE.desc + hostname),
    }
  );
};
