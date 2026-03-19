import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "请输入邮箱地址" });
  }

  const apiKey = process.env.RESEND_API_KEY;

  try {
    const audiencesRes = await fetch("https://api.resend.com/audiences", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const audiencesData = await audiencesRes.json();
    let audienceId = audiencesData.data?.[0]?.id;

    if (!audienceId) {
      const createRes = await fetch("https://api.resend.com/audiences", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Newsletter" }),
      });
      const createData = await createRes.json();
      audienceId = createData.id;
    }

    const addRes = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!addRes.ok) {
      const errData = await addRes.json();
      return res.status(400).json({ error: errData.message || "订阅失败" });
    }

    return res.status(200).json({ message: "订阅成功！" });
  } catch {
    return res.status(500).json({ error: "服务器错误，请稍后再试" });
  }
}
