"use client";
import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";

import SideBar from "@/components/SideBar";
import TopMenu from "@/components/TopMenu";
import { useRouter, useSearchParams } from "next/navigation";
import { Post } from "../post/[id]/page";

import ChatBox from "@/components/chatBox";
import NamDinh from "../../ND.json";
export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [posts, setPosts] = useState<Post[]>([]);
  const getQuery = async () => {
    const api = await fetch(`/api/search/${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const res = await api.json();
    setPosts(res);
  };

  const router = useRouter();

  useEffect(() => {
    getQuery();
  }, [query]);

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
    <div className=" w-screen h-screen bg-white">
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
        <div className=" h-full w-10/12 p-4 bg-slate-600">
          <Row gutter={16} className=" gap-2">
            {posts?.map((item, index) => (
              <Col key={index} span={5}
                onClick={()=> {
                    router.push(`/post/${item._id}`)
                }}
              >
                <Card
                  title={
                    <div className=" w-full h-max-[400px] flex justify-center items-center">
                      <img
                        src={`${process.env.NEXT_PUBLIC_HOST}/files/${item.location.image}`}
                        className=" w-full h-full object-scale-down"
                      />
                    </div>
                  }
                  bordered={false}
                  className=" rounded-lg bg-slate-500"
                >
                  <span className=" font-bold">{item.title}</span>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <ChatBox openClick={openChatGpt} />
      </div>
    </div>
  );
}
