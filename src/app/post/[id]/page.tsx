"use client";
import Cards from "@/components/Cards";
export type Post = {
  _id: string;
  title: string;
  content: string;
  files: Array<string>;
  activated: boolean;
  location: {
    name: string;
    latitude: number;
    longitude: number;
    image: string;
  };
  exercise?: string;
};
import CustomCarousel from "@/components/CustomCarousel";
import Image from "next/image";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import CustomMapND from "@/components/mapND";
import ChatBox from "@/components/chatBox";
import { useRouter } from "next/navigation";
import TopMenu from "@/components/TopMenu";
import ChatPost from "@/components/chatPost";
export default function Post({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post>();
  const [item, setItem] = useState<any>();
  const router = useRouter();
  const getPost = async () => {
    const api = await fetch(`/api/post/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const res = await api.json();
    setPost(res.post);
  };
  useEffect(() => {
    if (params.id) {
      getPost();
    }
  }, [params]);
  useEffect(() => {
    if (post) {
      setItem([
        {
          label: (
            <button className=" bg-[#23d3f1b0] p-2 w-full text-white">
              Giới thiệu
            </button>
          ),
          key: "1",
          children: (
            <div className=" p-4 h-[800px] flex flex-col gap-2 overflow-auto custom-scroll">
              <div className=" text-3xl flex justify-center items-center font-bold">
                <span>{post.title}</span>
              </div>
              <div
                className="article-content p-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>
            </div>
          ),
        },
        {
          label: (
            <button className=" bg-[#23d3f1b0] p-2 w-full text-white">
              Vị Trí
            </button>
          ),
          key: "2",
          children: (
            <div className=" flex justify-center items-center">
              <div className=" p-4 w-[800px] h-[800px]">
                <CustomMapND
                  latitude={post?.location?.latitude}
                  longitude={post?.location?.longitude}
                  post={post ? [post] : []}
                />
              </div>
            </div>
          ),
        },
        {
          label: (
            <button className=" bg-[#23d3f1b0] p-2 w-full text-white">
              Bài Tập
            </button>
          ),
          key: "3",
          children: (
            <div className=" w-full h-screen">
              <iframe
                className=" w-full h-full overflow-scroll"
                src={post.exercise}
              >
                Đang tải…
              </iframe>
            </div>
          ),
        },
        {
          label: (
            <button className=" bg-[#23d3f1b0] p-2 w-full text-white">
              Tìm Hiểu Thêm
            </button>
          ),
          key: "4",
          children: (
            <div className=" w-full h-screen">
              <ChatPost />
            </div>
          ),
        },
      ]);
    }
  }, [post]);
  const [select, setSelect] = useState<number>();
  const [openChatGpt, setOpenChatGpt] = useState<boolean>();
  return (
    <div className=" w-screen h-screen">
      <div className=" h-72 bg-white">
        <TopMenu
          openChatGpt={() => {
            setOpenChatGpt(!openChatGpt);
          }}
        />
      </div>

      <div className=" flex w-full h-full">
        <div className=" flex flex-col gap-2 items-center w-2/5 bg-gray-300 h-full p-2">
          {post && (
            <CustomCarousel navigation={true} className=" w-full" page={select}>
              {post?.files.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="relative w-full rounded-lg h-[400px] h-max-[400px] flex justify-center items-center bg-neutral-100 cursor-pointer"
                  >
                    <div className="h-[400px]">
                      {(item.toLowerCase().endsWith("jpg") ||
                        item.toLowerCase().endsWith("png") ||
                        item.toLowerCase().endsWith("jpeg")) && (
                        <Image
                          width={1000}
                          height={1000}
                          alt={""}
                          src={`/files/${item}`}
                          className="h-full object-contain object-center mx-auto"
                        />
                      )}
                      {(item.toLowerCase().endsWith("mp4") ||
                        item.toLowerCase().endsWith("avi") ||
                        item.toLowerCase().endsWith("mpeg")) && (
                        <div className=" flex w-full h-full justify-center items-center">
                          <video
                            autoPlay={false}
                            className="h-full object-cover"
                            controls
                            preload="metadata"
                          >
                            <source
                              src={`/files/${item}`}
                              type={`video/${item.split(".").pop()}`}
                            />
                          </video>
                        </div>
                      )}
                    </div>

                    {post && post?.files.length > 1 && (
                      <div className="absolute top-4 right-4 text-base px-3 py-1 rounded-full text-white bg-[#0005]">{`${
                        index + 1
                      }/${post.files.length}`}</div>
                    )}
                  </div>
                );
              })}
            </CustomCarousel>
          )}
          <div className=" w-full h-36 bg-slate-500">
            <Cards
              post={post}
              select={(index) => {
                setSelect(index);
              }}
            />
          </div>
        </div>
        <div className=" w-3/5 px-2 bg-gray-500 h-full overflow-hidden">
          <Tabs
            defaultActiveKey="1"
            size={"large"}
            style={{ marginBottom: 32 }}
            items={item}
          />
        </div>
        <ChatBox openClick={openChatGpt} />
      </div>
    </div>
  );
}
