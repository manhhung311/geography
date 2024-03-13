import { NextResponse } from "next/server";
import * as nodemailer from "nodemailer";
import * as bcrypt from "bcrypt";
import mongoose, { ConnectOptions } from "mongoose";
import AccountModel from "@/model/account";
const connectDB = async () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(
        process.env.MONGDB as string
      )
      .then(() => {
        console.log("Connected to the database");
        return resolve(true)
      })
      .catch((err) => {
        console.error(`Database connection failed: ${err}`);
        return reject(false)
      });
  });
};
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json()
  const { name, email, password } = body as any;
  const user = await AccountModel.findOne({email});
  if(user) return NextResponse.json({ message: "Tài Khoản Đã Tồn Tại" }, {status: 406});
  let salt = await bcrypt.genSalt();
  let hash = await bcrypt.hash(password, salt);
  await AccountModel.create({
    email,
    password: hash,
    name,
    key: salt,
  });
  sendMail(email, `${process.env.HOST as string}/api/activated/${encodeURIComponent(salt)}`);
  return NextResponse.json({ message: "OK" });
}

const sendMail = async (email: string, link: string) => {
  const html = `
  <p><strong>Welcome to Geography!</strong></p>

  <p>Cảm ơn bạn đã đăng ký</p>

  <p>&nbsp;</p>

  <p>Vui Lòng mở link sau để tài khoản của bạn được kích hoạt</p>

  <p>${link}</p>

  <p>&nbsp;</p>

  <p>Link kích hoạt chỉ có thời hạn trong 30p vui lòng lưu ý</p>
  `;
  const mailOption = {
    to: email,
    subject: "Register by geography app",
    html,
  };
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
      user: 'tulieusogddpnamdinh@gmail.com',
      pass: 'afsbbsxcezccfdhm',
    },
  });

  transporter.sendMail(mailOption, function (error, info) {
    if (error) {
      console.log(error)
      return true;
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  return mailOption;
};
