export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const { email } = await request.json();

  if (!email || typeof email !== "string") {
    return new Response(JSON.stringify({ error: "请输入邮箱地址" }), {
      status: 400,
    });
  }

  const apiKey = import.meta.env.RESEND_API_KEY;

  try {
    // Get or create audience
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
      return new Response(
        JSON.stringify({ error: errData.message || "订阅失败" }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ message: "订阅成功！" }), {
      status: 200,
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "服务器错误，请稍后再试" }),
      { status: 500 }
    );
  }
};
