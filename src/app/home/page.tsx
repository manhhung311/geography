"use client";
import SideBar from "@/components/SideBar";
import ChatBox from "@/components/chatBox";
import CustomMapND from "@/components/mapND";
import { useState } from "react";
import { Post } from "./../post/[id]/page";
import NamDinh from "../../ND.json";
import TopMenu from "@/components/TopMenu";
import Image from "next/image";

export default function Home() {
  const [post, setPost] = useState<Post[]>([]);
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [openChatGpt, setOpenChatGpt] = useState<boolean>();
  const handelChange = async (select: string, field: string) => {
    const api = await fetch(`/api/post?select=${select}&field=${field}`, {
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
      <div className=" h-72 w-full bg-white overflow-hidden">
        <TopMenu
          openChatGpt={() => {
            setOpenChatGpt(!openChatGpt);
          }}
        />
      </div>
      <div className=" flex w-full h-screen bg-white">
        <div className=" w-2/12 h-full">
          <SideBar />
        </div>
        <div className=" h-full w-10/12">
          <Image
            width={1000}
            height={1000}
            alt={""}
            src={`/dentran.jpg`}
            className="h-full w-full object-cover mx-auto"
          />
        </div>
        <ChatBox openClick={openChatGpt} />
      </div>
    </div>
  );
}
