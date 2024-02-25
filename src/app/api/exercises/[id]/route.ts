import mongoose from "mongoose";
import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import AccountModel from "@/model/account";
import ExerciseModel from "@/model/exercise";
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
  await connectDB();
  const exercise = params.id
    ? await ExerciseModel.findById(params.id)
    : await ExerciseModel.find({});
  return NextResponse.json({ exercise });
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
  let exercise = await ExerciseModel.findById(params.id);
  const { title, url, classNumber, activated } = body as any;
  if (exercise && user) {
    exercise.title = title || exercise.title;
    exercise.url = url || exercise.url;
    exercise.classNumber = classNumber || exercise.classNumber;
    if(user.role === "admin")exercise.activated = activated || exercise.activated;
    exercise.save();
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
    await ExerciseModel.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "OK" });
  } else return NextResponse.json({ message: "" }, { status: 500 });
}
