import { createHmac, timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OPTIN_TTL_MS = 60 * 60 * 1000;
const RADAR_SUBSCRIBE_URL =
  "https://wind.peguni.com/api/w/peguni/jobs/run_wait_result/p/f/passive_income/reddit_radar/reddit_radar_subscribe";

type OptinResult = { status: number; body: Record<string, unknown> };

// The thanks page subscribes the same email to other newsletters without a captcha,
// so it must prove the email was just submitted here. The HMAC key reuses
// RESEND_API_KEY so the feature needs no extra secret.
function sign(email: string, expires: number): string {
  return createHmac("sha256", `kyo-optin:${process.env.RESEND_API_KEY}`)
    .update(`${email}|${expires}`)
    .digest("hex");
}

function issueToken(email: string): string {
  const expires = Date.now() + OPTIN_TTL_MS;
  return `${expires}.${sign(email, expires)}`;
}

function verifyToken(email: string, token: unknown): boolean {
  if (typeof token !== "string") return false;
  const [rawExpires, signature = ""] = token.split(".");
  const expires = Number(rawExpires);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = new TextEncoder().encode(sign(email, expires));
  const actual = new TextEncoder().encode(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

async function subscribeRedditRadar(email: string): Promise<OptinResult> {
  const token = process.env.WINDMILL_RADAR_SUBSCRIBE_TOKEN;
  if (!token) {
    return { status: 503, body: { error: "暂时没法一键订阅，可以点上面的链接去订阅" } };
  }
  const res = await fetch(RADAR_SUBSCRIBE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, ref: "blog_thanks" }),
    signal: AbortSignal.timeout(20_000),
  });
  const result = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  if (!res.ok || result?.ok !== true) {
    return { status: 502, body: { error: "订阅失败，请稍后再试" } };
  }
  return { status: 200, body: { message: "订阅成功！" } };
}

// Keys match `id` in src/data/newsletters.ts.
const OPTIN_TARGETS: Record<string, (email: string) => Promise<OptinResult>> = {
  reddit_radar: subscribeRedditRadar,
};

async function addToBlogAudience(apiKey: string | undefined, email: string) {
  const AUDIENCE_NAME = "General";
  const audiencesRes = await fetch("https://api.resend.com/audiences", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const audiencesData = await audiencesRes.json();
  let audienceId = audiencesData.data?.find(
    (a: { id: string; name: string }) => a.name === AUDIENCE_NAME
  )?.id;

  if (!audienceId) {
    const createRes = await fetch("https://api.resend.com/audiences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: AUDIENCE_NAME }),
    });
    const createData = await createRes.json();
    audienceId = createData.id;
  }

  return fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email: rawEmail, also, token, website } = req.body ?? {};

  if (!rawEmail || typeof rawEmail !== "string") {
    return res.status(400).json({ error: "请输入邮箱地址" });
  }
  const email = rawEmail.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return res.status(400).json({ error: "邮箱格式不对，检查一下" });
  }

  if (also !== undefined) {
    const target = typeof also === "string" ? OPTIN_TARGETS[also] : undefined;
    if (!target) return res.status(400).json({ error: "没有这个订阅" });
    if (!verifyToken(email, token)) {
      return res.status(400).json({ error: "订阅已过期，可以点上面的链接去订阅" });
    }
    try {
      const result = await target(email);
      return res.status(result.status).json(result.body);
    } catch {
      return res.status(502).json({ error: "订阅失败，请稍后再试" });
    }
  }

  if (typeof website === "string" && website.trim()) {
    return res.status(200).json({ message: "订阅成功！" });
  }
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret && process.env.VERCEL_ENV === "production") {
    return res.status(503).json({ error: "暂时无法订阅，请稍后再试" });
  }
  if (secret) {
    if (typeof token !== "string" || !token || token.length > 2048) {
      return res.status(400).json({ error: "请完成人机验证后重试" });
    }
    try {
      const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({ secret, response: token }),
        signal: AbortSignal.timeout(10_000),
      });
      const result = await verification.json();
      if (!verification.ok || result.success !== true) {
        return res.status(400).json({ error: "人机验证失败，请重试" });
      }
    } catch {
      return res.status(502).json({ error: "验证服务暂时不可用，请稍后再试" });
    }
  }

  try {
    const addRes = await addToBlogAudience(process.env.RESEND_API_KEY, email);
    if (!addRes.ok) {
      const errData = await addRes.json();
      return res.status(400).json({ error: errData.message || "订阅失败" });
    }
    return res.status(200).json({ message: "订阅成功！", token: issueToken(email) });
  } catch {
    return res.status(500).json({ error: "服务器错误，请稍后再试" });
  }
}
