"use client";
import DataBoard from "@/components/Dashboard";
import {
  DownOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HiUsers } from "react-icons/hi2";

import { useRouter } from "next/navigation";
export default function Home() {
  const [login, setLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    const cookie = getCookie("token");
    if (cookie && cookie.toString() !== "") {
      setLogin(true);
      setEmail(getCookie("email") || "");
    } else setLogin(false);
  }, []);
  const userMenu = (
    <Menu>
      {/* <Menu.Item key="0">
        <UserOutlined />
        <span>Thông tin cá nhân</span>
      </Menu.Item> */}
      <Menu.Divider />
      <Menu.Item
        key="1"
        onClick={() => {
          setCookie("token", "");
          setCookie("role", "");
          setCookie("email", "");
          router.push("/admin/login");
        }}
      >
        <LogoutOutlined />
        <span>Đăng xuất</span>
      </Menu.Item>
    </Menu>
  );

  const [menu, setMenu] = useState<number>(0);
  return (
    <>
      {login ? (
        <div className=" w-screen h-screen overflow-hidden bg-white text-black">
          <div className="w-full flex justify-between h-">
            <div className=" w-2/12 flex justify-center items-center">
              <Image
                src={"/logo.webp"}
                width={500}
                height={500}
                className=" h-16 object-cover"
                alt="logo"
              />
            </div>
            <div className=" h-full p-5">
              <Dropdown overlay={userMenu} trigger={["click"]}>
                <div className=" border-0 border-none">
                  <Avatar
                    // style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                  />
                  <span> {email} </span> <DownOutlined />
                </div>
              </Dropdown>
            </div>
          </div>
          <div className=" flex w-full h-full">
            <div className=" w-2/12 flex  flex-col border-l-2 border-gray-50 gap-5 p-8">
              <div
                className={`${
                  menu === 0 ? " bg-zinc-400" : ""
                } flex gap-2 p-4 justify-start cursor-pointer`}
                onClick={() => setMenu(0)}
              >
                <UnorderedListOutlined />
                <span>Bài Viết</span>
              </div>
              <div
                className={`${
                  menu === 1 ? " bg-zinc-400" : ""
                } flex gap-2 p-4 justify-start cursor-pointer`}
                onClick={() => setMenu(1)}
              >
                <HiUsers />
                <span>Tài Khoản</span>
              </div>
            </div>
            <div className=" w-10/12 p-8 bg-slate-300 h-full overflow-auto">
              <DataBoard menu={menu} />
            </div>
          </div>
        </div>
      ) : (
        <div className=" w-screen h-screen bg-[url('/backgroud-login.jpg')] bg-cover bg-no-repeat bg-center">
          <div className="w-full h-full flex justify-center items-center">
            <div className=" flex">
              <button
                onClick={() => router.push("/admin/login")}
                className=" origin-center shadow-2xl bg-blue-700 p-5 rounded"
              >
                ĐĂNG NHẬP
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
