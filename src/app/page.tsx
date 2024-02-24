"use client";
import SideBar from "@/components/SideBar";
import ChatBox from "@/components/chatBox";
import CustomMapND from "@/components/mapND";
import { useState } from "react";
import { Post } from "./post/[id]/page";
import NamDinh from "../ND.json";

export default function Home() {
  const [post, setPost] = useState<Post[]>([]);
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const handelChange = async (select: string, field: string) => {
    console.log(select, field);
    const api = await fetch(`/api/post?select=${select}&field=${field}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const res: any[] = await api.json();
    console.log(res.filter(item => item.activated === true))
    setPost(res);
    const location = NamDinh.Nam_Dinh.districts.find(
      (item) => item.id === select
    );
    if (location) {
      setLatitude(
       location.latitude
      );
      setLongitude(
        location.longitude
      );
    }
  };
  return (
    <div className=" flex w-screen h-screen">
      <SideBar onChange={handelChange} />
      <div className=" w-full h-full">
        <CustomMapND post={post} longitude={longitude} latitude={latitude} />
      </div>
      <ChatBox />
    </div>
  );
}
