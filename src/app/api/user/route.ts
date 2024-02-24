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

export async function GET(request: Request) {
  await connectDB();
  const user = await AccountModel.find({});
  return NextResponse.json(user);
}
