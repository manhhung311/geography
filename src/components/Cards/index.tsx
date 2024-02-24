"use client";
import { Post } from "@/app/post/[id]/page";
import Image from "next/image";

const Cards = ({ post, select }: { post?: Post; select: (id: number) => void }) => {
  const scrollLeft = () => {
    document.getElementById("list")?.scrollBy(-100, 0);
  };
  const scrollRight = () => {
    document.getElementById("list")?.scrollBy(100, 0);
  };
  return (
    <div className=" flex justify-center items-center relative w-full h-full">
      <div
        id="list"
        className="w-full p-1 px-2 gap-2 h-full flex items-center bg-neutrals-10 rounded-lg overflow-scroll custom-scroll"
      >
        {post &&
          post.files.map((item, index) => {
            if (item.endsWith("mp4") || item.endsWith("avi")) {
              return (
                <video
                  key={index}
                  autoPlay={true}
                  className=" w-1/3 h-full object-cover"
                  src={`/files/${item}`}
                  onClick={()=>{select(index)}}
                />
              );
            }
            if (
              item.endsWith("jpg") ||
              item.endsWith("jpeg") ||
              item.endsWith("png")
            ) {
              return (
                <img
                  key={index}
                  className=" w-1/3 h-full object-cover"
                  src={`/files/${item}`}
                  onClick={()=>{select(index)}}
                />
              );
            }
            return <></>;
          })}
      </div>
      <Image
        alt="arrow"
        src={"/double_arrow_left.png"}
        width={100}
        height={100}
        onClick={scrollLeft}
        className=" w-5 h-10 absolute left-0 bg-slate-400"
      />
      <Image
        alt="arrow"
        src={"/double_arrow_right.png"}
        width={100}
        height={100}
        onClick={scrollRight}
        className=" absolute right-0 w-5 h-10 bg-slate-400"
      />
    </div>
  );
};

export default Cards;
