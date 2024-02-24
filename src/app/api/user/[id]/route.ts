import AccountModel from "@/model/account";
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
  if (user && user.role === "admin"){
    await AccountModel.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "OK", statusCode: 200 });
  }
  else 
  return NextResponse.json({ message: "Bạn Không đủ thẩm quyền" }, {status: 500});
}
