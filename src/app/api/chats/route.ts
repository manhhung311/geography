import mongoose from "mongoose";
import { NextResponse } from "next/server";
import OpenAI from "openai";
export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.GPT,
      dangerouslyAllowBrowser: true,
    });
    const body = await req.json();
    const { input } = body as any;
    const question = `${input}. Hãy giới hạn trong các lĩnh vực lịch sử, Giáo dục, Lễ Hội, Làng nghề, Văn học, Âm nhạc, Mĩ thuật, Du lịch, Kinh tế, Chính trị`;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    });
    return NextResponse.json({content: completion.choices[0].message.content})
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    return NextResponse.json({content: "Đã xảy ra lỗi"})
  }
}
