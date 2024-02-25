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
export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const id = params.id;
  const user = await AccountModel.findOne({ key: id });
  if (user && !user.activated) {
    user.activated = true;
    user.save();
    return NextResponse.redirect(`${process.env.HOST}/admin/login`)

  }
  return NextResponse.json(
    { message: "Tài Khoản đã được kích hoạt" },
    { status: 404 }
  );
}
