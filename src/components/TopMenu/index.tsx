"use client";
import Link from "next/link";
import Category from "../../category.json";
import Image from "next/image";
import { Input } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TopMenu({ openChatGpt }: { openChatGpt: () => void }) {
  const { Search } = Input;
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchValue.trim() !== "") router.push(`/search?q=${searchValue}`);
  };
  return (
    <div className=" w-full bg-yellow-50">
      <div className=" flex justify-between w-full bg-[#007bff] p-2">
        <div className=" w-16 h-16">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={500}
            height={500}
            className=" w-16 h-16 bg-[#007bff]"
          />
        </div>
        <nav className={"topMenu"}>
          <ul className={"menuList"}>
            <li className={"menuItem  p-2"}>
            <Link href={`/home`}>{"Trang Chủ"}</Link>
            </li>
            {Category.data.map((item, index) => {
              return (
                <li key={index} className={"menuItem p-2"}>
                  <Link href={`/category/${item.id}`}>{item.name}</Link>
                </li>
              );
            })}
            <li
              className={
                "menuItem  border-2 border-yellow-200 rounded-lg p-2 cursor-pointer"
              }
              onClick={() => {
                openChatGpt();
              }}
            >
              <span>chat gpt</span>
            </li>
            <li
              className={"menuItem border-2 border-yellow-200 rounded-lg p-2"}
            >
              <Link href="/exercises">Bài tập</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="w-full relative flex justify-center items-center">
        <Image
          src={"/hvx.jpg"}
          alt="logo"
          width={500}
          height={500}
          className=" w-full h-40"
        />
        <div className=" w-1/3 absolute -bottom-4 flex">
          <Search
            placeholder="Tìm kiếm"
            size="large"
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            onSearch={handleSearch}
            enterButton
          />
        </div>
      </div>
    </div>
  );
}
