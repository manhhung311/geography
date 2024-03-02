import { NextResponse } from "next/server";
import OpenAI from "openai";
export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.GPT,
      dangerouslyAllowBrowser: true,
    });
    const body = await req.json();
    const { input, field } = body as any;
    const question = `${input} ${
      field && field.trim() !== ""
        ? `. Hãy giới hạn trong lĩnh vực ${field}`
        : ""
    }`;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    });
    return NextResponse.json({
      content: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    return NextResponse.json({ content: "Đã xảy ra lỗi" });
  }
}
