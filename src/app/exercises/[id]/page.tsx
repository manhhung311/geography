"use client";
import { Card, Col, Row, Modal } from "antd";
import { useEffect, useState } from "react";

import SideBar from "@/components/SideBar";
import TopMenu from "@/components/TopMenu";
import { useRouter, useSearchParams } from "next/navigation";
import ChatBox from "@/components/chatBox";
import { SiGoogleclassroom } from "react-icons/si";
export default function Exercises({ params }: { params: { id: string } }) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    getRooms();
  }, []);

  const [openChatGpt, setOpenChatGpt] = useState<boolean>();
  const [exercise, setExercise] = useState<any>();
  const [title, setTitle] = useState<string>("");
  const getRooms = async () => {
    const api = await fetch(`/api/rooms/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const res = await api.json();
    setRooms(res);
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
                  setOpenModal(true);
                  setTitle(item.title);
                  setExercise(item.url);
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
                    <span className=" font-bold"> {item.title}</span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <ChatBox openClick={openChatGpt} />
      </div>
      <Modal
        title={
          <div className=" flex justify-center items-center">
            <span>{title}</span>
          </div>
        }
        footer={null}
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
        }}
        destroyOnClose={true}
        closable={false}
        centered={true}
        width={1000}
        zIndex={10}
        bodyStyle={{
          position: "relative",
          paddingInline: "8px",
          overflowY: "auto",
          borderTop: "1px solid #E8E8E8",
          height: `80vh`,
          // overflow: "hidden",
        }}
      >
        <div className=" w-full h-full flex justify-center items-center overflow-auto">
          <iframe className=" w-full h-full overflow-scroll" src={exercise}>
            Đang tải…
          </iframe>
        </div>
      </Modal>
    </div>
  );
}
