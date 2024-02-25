"use client";
import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";

import SideBar from "@/components/SideBar";
import TopMenu from "@/components/TopMenu";
import { useRouter, useSearchParams } from "next/navigation";
import { Post } from "../post/[id]/page";

import ChatBox from "@/components/chatBox";
import NamDinh from "../../ND.json";
import { SiGoogleclassroom } from "react-icons/si";
export default function Exercises() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [posts, setPosts] = useState<Post[]>([]);
  const [rooms, setRooms] = useState<Array<number>>([]);
  const router = useRouter();

  useEffect(() => {
    getRooms();
  }, []);

  const [post, setPost] = useState<Post[]>([]);
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [openChatGpt, setOpenChatGpt] = useState<boolean>();
  const getRooms = async () => {
    const api = await fetch(`/api/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const res: any[] = await api.json();
    setRooms(res.sort((a: number, b: number) => a - b));
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
            {rooms?.map((item, index) => (
              <Col
                key={index}
                span={5}
                onClick={() => {
                   router.push(`/exercises/${item}`);
                }}
              >
                <Card
                  title={
                    <div className=" w-full h-max-[400px] flex justify-center items-center">
                      <SiGoogleclassroom className=" w-full h-full" />
                    </div>
                  }
                  bordered={false}
                  className=" rounded-lg bg-slate-500"
                >
                  <div className=" w-full h-full flex justify-center items-center">
                    <span className=" font-bold">Lớp {item}</span>
                  </div>
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
