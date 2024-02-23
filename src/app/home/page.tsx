"use client";
import SideBar from "@/components/SideBar";
import ChatBox from "@/components/chatBox";
import CustomMapND from "@/components/mapND";
import { useState } from "react";
import { Post } from "../post/[id]/page";

export default function Home() {
  const [post, setPost] = useState<Post[]>([]);
  const handelChange = async (select: string, field: string)=> {
    const api = await fetch(`/api/post?select=${select}&field=${field}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });
    const res = await api.json();
    setPost(res);
    console.log(res)
  }
  return (
    <div className=" flex w-screen h-screen">
      <SideBar onChange={handelChange}/>
      <div className=" w-full h-full">
        <CustomMapND post={post} />
      </div>
      <ChatBox />
    </div>
  );
}
