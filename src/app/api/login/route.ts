import AccountModel from "@/model/account";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
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
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const { email, password } = body as any;
  const user = await AccountModel.findOne({ email: email });
  if (user && user.activated) {
    const comparePassword = await bcrypt.compare(password, user.password);
    if (comparePassword) {
      const token = await jwt.sign(
        { email: user.email, role: user.role },
        process.env.PRIVATE_KEY as string,
        {
          algorithm: "RS256",
        }
      );
      return NextResponse.json({ token: token, statusCode: 200 }, { status: 200 });
    }
  }
  return NextResponse.json(
    { message: "Tài Khoản Hoặc Mật Khẩu Không Đúng", statusCode: 404 },
    { status: 404 }
  );
}
