"use client";
import SideBar from "@/components/SideBar";
import ChatBox from "@/components/chatBox";
import CustomMapND from "@/components/mapND";
import { useState } from "react";
import { Post } from "../../post/[id]/page";
import NamDinh from "../../../ND.json";
import TopMenu from "@/components/TopMenu";
import JSCategory from "../../../category.json";

export default function Category({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post[]>([]);
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [openChatGpt, setOpenChatGpt] = useState<boolean>();
  const handelChange = async (select: string) => {
    console.log("selec", select)
    const api = await fetch(`/api/post?select=${select}&field=${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const res: any[] = await api.json();
    setPost(res);
    const location = NamDinh.Nam_Dinh.districts.find(
      (item) => item.id === select
    );
    if (location) {
      setLatitude(location.latitude);
      setLongitude(location.longitude);
    }
  };
  return (
    <div className="w-screen h-screen bg-white">
      <div className=" h-1/3 w-full bg-white overflow-hidden">
        <TopMenu
          openChatGpt={() => {
            setOpenChatGpt(!openChatGpt);
          }}
        />
      </div>
      <div className=" h-2/3 flex w-full bg-white">
        <div className="flex flex-col gap-3 w-2/12 h-full">
          <div className=" justify-center items-center flex text-black font-extrabold text-2xl">
            <span>{JSCategory.data.find(item=> item.id === params.id)?.name || "Đường dẫn không hợp lệ"}</span>
          </div>
          <SideBar
            onChangeND={(i) => handelChange(i)}
            category={`${params.id}`}
          />
        </div>
        <div className=" h-full w-10/12">
          <CustomMapND post={post} longitude={longitude} latitude={latitude} />
        </div>
        <ChatBox openClick={openChatGpt} field={params.id||""} />
      </div>
    </div>
  );
}
