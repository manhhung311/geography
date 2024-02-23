"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as jwt from "jsonwebtoken";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Button } from "antd";
export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const handelLogin = async () => {
    setLoading(true);
    const api = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const res = await api.json();
    const decode = (await jwt.decode(res.token)) as any;
    setCookie("token", res.token);
    setCookie("role", decode?.role);
    setCookie("email", decode.email);
    setLoading(false);
    router.push("/admin");
  };
  useEffect(() => {
    const token = getCookie("token");
    if (token && token !== "") {
      router.push("/admin");
    }
  });
  return (
    <div className=" w-screen h-screen bg-[#F3E8DC] flex justify-center items-center">
      <div className=" bg-white h-2/3 w-1/4 rounded-xl shadow-2xl flex flex-col  items-center gap-5">
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
          <label htmlFor="username" className=" text-black font-semibold">
            Tài Khoản
          </label>
          <input
            name="username"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className=" w-full border rounded-lg outline-blue-200 p-2 text-black"
            placeholder=" Tên Đăng Nhập"
          />
        </div>
        <div className=" w-4/5 flex flex-col">
          <label htmlFor="password" className=" text-black font-semibold">
            Mật Khẩu
          </label>
          <input
            name="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            className="border rounded-lg w-full outline-blue-200 p-2 text-black"
            placeholder="*******"
          />
        </div>
        <div>
          <Button
            type={"primary"}
            loading={loading}
            className=" bg-blue-700 text-white rounded-lg"
            onClick={handelLogin}
          >
            ĐĂNG NHẬP
          </Button>
        </div>
      </div>
    </div>
  );
}
