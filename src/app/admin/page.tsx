"use client";
import DataBoard from "@/components/Dashboard";
import {
  DownOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Tooltip, Select } from "antd";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HiUsers } from "react-icons/hi2";

import { useRouter } from "next/navigation";
import { FaBook } from "react-icons/fa";
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

  const [show, setShow] = useState<boolean>(false);

  const [menu, setMenu] = useState<number>(0);
  return (
    <>
      {login ? (
        <div className=" w-screen h-screen overflow-hidden bg-white text-black">
          <div className="w-full flex justify-between h-">
            <div className=" w-2/12 flex justify-center items-center">
              <Tooltip placement="top" title={"Về Trang Chủ"}>
                <Image
                  src={"/logo.webp"}
                  width={500}
                  height={500}
                  className=" h-16 object-cover cursor-pointer"
                  alt="logo"
                  onClick={() => router.push("/")}
                />
              </Tooltip>
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
            <div className=" sm:w-2/12 w-36 flex  flex-col border-l-2 border-gray-50 gap-5 p-8">
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
              <div
                className={`${
                  menu === 2 ? " bg-zinc-400" : ""
                } flex gap-2 p-4 justify-start cursor-pointer`}
                onClick={() => setMenu(2)}
              >
                <FaBook />
                <span>Bài Tập</span>
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
              {!show && (
                <button
                  onClick={() => setShow(true)}
                  className=" origin-center shadow-2xl bg-blue-700 p-5 rounded"
                >
                  TRUY CẬP TRANG
                </button>
              )}
              {show && (
                <Select
                  size="large"
                  style={{ width: "300px" }}
                  defaultValue={"Vui Lòng Lựa Chọn"}
                  options={[
                    {
                      value: "1",
                      label: (
                        <div
                          className="flex w-96 items-center justify-start gap-1"
                          onClick={() => {
                            router.push("/admin/login");
                          }}
                        >
                          <div className="col-span-2 text-ellipsis overflow-hidden">
                            Truy cập tư cách là giáo viên
                          </div>
                        </div>
                      ),
                    },
                    {
                      value: "2",
                      label: (
                        <div
                          className="flex w-96 items-center justify-start gap-1"
                          onClick={() => {
                            router.push("/home");
                          }}
                        >
                          <div className="col-span-2 text-ellipsis overflow-hidden">
                            Truy cập tư cách là khách
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
