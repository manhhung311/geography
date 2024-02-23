"use client";
import { CustomMap } from "@/components/map";
import Image from "next/image";
import { useState } from "react";

export default function Lesson() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="flex w-full h-full bg-[#FF8A00]">
      {!open ? (
        <div className="flex justify-center items-center bg-orange-500 w-7 h-3/6">
          <Image
            alt="arrow"
            src={"/double_arrow_right.png"}
            width={100}
            height={100}
            onClick={() => setOpen(true)}
          />
        </div>
      ) : (
        <div className=" relative flex w-1/3 h-3/6">
          <div className="h-full w-full">
            <div>Hinh Anh</div>
            <div>icon</div>
          </div>
          <div className=" absolute right-0 flex justify-center items-center bg-orange-500 w-4 h-full">
            <Image
              alt="arrow"
              src={"/double_arrow_left.png"}
              width={100}
              height={100}
              onClick={() => setOpen(false)}
            />
          </div>
        </div>
      )}
      <div className={open?`ml-5 right-0 w-2/3 whitespace-pre-wrap mr-5`:' w-full ml-5'}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla, ex asperiores ea eum maxime ipsam quae atque perferendis eius non, animi at, repellendus nesciunt ad adipisci id impedit error veritatis.
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Praesentium, numquam eos reiciendis repudiandae commodi eveniet dolorum, vel voluptates obcaecati saepe unde labore nostrum fugiat ratione accusamus qui doloribus. Rem, molestiae.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam maxime laudantium aperiam modi dignissimos aliquam obcaecati quas corrupti vitae quo explicabo et necessitatibus, perspiciatis tenetur voluptatibus quaerat atque id sed.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum deleniti maiores saepe nostrum quam quia eos ad non natus, architecto eaque, nulla, eligendi molestias! Quas in laboriosam reiciendis recusandae accusamus?
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia quod, aperiam totam ratione dolorem amet unde ullam dolores a expedita corrupti, minima vitae, molestias consequatur minus sed sunt voluptates corporis.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, fugit ab exercitationem blanditiis modi officiis iure ipsum quae neque repellendus hic nam aspernatur, repellat debitis quis ullam maxime assumenda ipsa?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos ea in qui voluptatibus nostrum harum consequuntur perferendis, ut consectetur sunt. Saepe minima, nulla esse laborum officia quaerat aperiam non hic?
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe optio, quas accusantium nam pariatur alias maiores corporis rerum possimus? Assumenda veritatis molestias beatae nulla dolorum ut expedita quam repudiandae voluptatum!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit in quam, et animi voluptas sapiente beatae repudiandae facere. Suscipit ratione molestiae impedit sed reiciendis harum eum delectus, atque eaque magnam.
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab cupiditate aperiam nostrum provident, minus sunt dolores quam eligendi modi deleniti, at tempora quaerat similique consequuntur, molestias corrupti! Consectetur, ullam voluptatem?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam rerum blanditiis accusamus officia quam, fugiat, maxime natus alias dolor doloribus maiores doloremque enim dolorum dolores molestiae, eos nostrum saepe necessitatibus.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti atque a aliquam quaerat voluptates explicabo neque excepturi odit rerum eos, molestiae veniam praesentium. Laudantium commodi molestiae nostrum nihil saepe facilis.
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque repellendus perferendis sunt rerum eos vero excepturi pariatur totam repudiandae ullam dicta, amet commodi beatae eligendi quasi quas maiores, atque consequuntur?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis pariatur doloremque aliquid accusamus fugit voluptate fuga velit ipsum enim dicta ullam animi ea expedita voluptatem rerum cum, laudantium debitis officia.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab rem obcaecati aut quae laboriosam. Ab culpa a, sequi fugit, quisquam perspiciatis animi cupiditate eum doloremque veniam ipsa debitis magnam sunt?
      </div>
    </div>
  );
}
