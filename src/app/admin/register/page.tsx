"use client";
import Image from "next/image";
import { useState } from "react";
import  { notification } from 'antd';
import { useRouter } from "next/navigation";
export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const handelRegister = async () => {
    if (name.trim() !== "" && email.trim() !== "" && password.trim() !== "") {
      const resRegister = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });
      const res = await resRegister.json();
      if(res.message === "OK") {
        api.error({
          message: `Đăng Ký Thành Công`,
          description: "vui lòng vào mail đã đăng ký để xác thực tài khoản",
          placement: 'top',
        });
        router.push("/admin");
      }
      else {
        api.error({
          message: `Đã Xảy ra lỗi`,
          description: res.message,
          placement: 'top',
        });
      }
    }
  };
  return (
    <div className=" w-screen h-screen bg-[#F3E8DC] flex justify-center items-center">
      {contextHolder}
      <div className=" bg-white sm:h-3/4 sm:w-1/4 w-full h-full rounded-xl shadow-2xl flex flex-col  items-center gap-4">
        <div className="h-1/2 flex items-center justify-center">
          <Image
            src={"/logo.webp"}
            width={500}
            height={500}
            className=" w-32 h-32 object-cover rounded-full"
            alt="logo"
          />
        </div>
        <div className=" w-4/5 flex flex-col">
          <label htmlFor="name" className=" text-black font-semibold">
            Tên Của Bạn
          </label>
          <input
            name="name"
            className=" w-full border rounded-lg outline-blue-200 p-2 text-black"
            placeholder="Họ Và Tên"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className=" w-4/5 flex flex-col">
          <label htmlFor="username" className=" text-black font-semibold">
            Tài Khoản
          </label>
          <input
            type={"email"}
            name="username"
            className=" w-full border rounded-lg outline-blue-200 p-2 text-black"
            placeholder="your_email@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className=" w-4/5 flex flex-col">
          <label htmlFor="password" className=" text-black font-semibold">
            Mật Khẩu
          </label>
          <input
            name="password"
            type="password"
            className="border rounded-lg w-full outline-blue-200 p-2 text-black"
            placeholder="*******"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            className=" bg-blue-700 p-2 rounded-lg"
            onClick={handelRegister}
          >
            ĐĂNG KÝ
          </button>
        </div>
      </div>
    </div>
  );
}
