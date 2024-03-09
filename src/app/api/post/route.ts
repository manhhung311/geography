import PostModel from "@/model/post";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import AccountModel from "@/model/account";
const connectDB = async () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGDB as string)
      .then(() => {
        console.log("Connected to the database");
        return resolve(true);
      })
      .catch((err) => {
        console.error(`Database connection failed: ${err}`);
        return reject(false);
      });
  });
};
export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const cookiesHeader = request.headers.get("cookie");
  const cookies: { [key: string]: string } = {};
  if (cookiesHeader) {
    cookiesHeader.split(";").forEach((cookie) => {
      const [key, value] = cookie.split("=").map((c) => c.trim());
      cookies[key] = decodeURIComponent(value);
    });
  }

  const token = cookies["token"];
  if (!token) {
    return NextResponse.json({}, { status: 405 });
  }
  const payload: any = await jwt.verify(
    token,
    process.env.PRIVATE_KEY as string
  );
  const user = await AccountModel.findOne({ email: payload.email });
  if (!user) NextResponse.json({ message: "no user" }, { status: 403 });
  await PostModel.create({
    ...body,
  });
  return NextResponse.json({ message: "OK" });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const select = url.searchParams.get("select");
  const field = url.searchParams.get("field");
  await connectDB();
  const post =
    select && field
      ? await PostModel.find({
          district: {$all: [select.trim()]},
          category: { $all: [field.trim()] },
          activated: true
        })
      : field
      ? await PostModel.find({
          category: { $all: [field.trim()] },
          activated: true
        })
      : await PostModel.find({});
  return NextResponse.json(post);
}
