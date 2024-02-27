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
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookiesHeader = request.headers.get("cookie");
  const cookies: { [key: string]: string } = {};
  if (cookiesHeader) {
    cookiesHeader.split(";").forEach((cookie) => {
      const [key, value] = cookie.split("=").map((c) => c.trim());
      cookies[key] = decodeURIComponent(value);
    });
  }

  const post = await PostModel.findById(params.id);
  if (post?.activated) {
    return NextResponse.json({ post });
  } else {
    const token = cookies["token"];
    const payload: any = await jwt.verify(
      token,
      process.env.PRIVATE_KEY as string
    );
    const user = await AccountModel.findOne({ email: payload.email });
    if(user?.role === "admin") return NextResponse.json({post});
  }
  return NextResponse.json({ });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
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
  const body = await request.json();
  let post = await PostModel.findById(params.id);
  const {
    title,
    content,
    category,
    activated,
    files,
    location,
    district,
    exercise,
  } = body as any;
  if (post && user) {
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    if (user.role === "admin") post.activated = activated;
    post.files = files || post.files;
    post.location = location || post.location;
    post.district = district || post.district;
    post.exercise = exercise;
    post.save();
    return NextResponse.json({ message: "OK" });
  }

  return NextResponse.json({ message: "" }, { status: 500 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
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
  if (user && user.role === "admin") {
    await PostModel.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "OK" });
  } else return NextResponse.json({ message: "" }, { status: 500 });
}
