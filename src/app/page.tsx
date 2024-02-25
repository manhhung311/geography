"use client";
import { useState } from "react";
import { Select } from "antd";
import { useRouter } from "next/navigation";

export default function Home() {
  const [show, setShow] = useState<boolean>(false);
  const router = useRouter();
  return (
    <div className=" w-screen h-screen bg-[url('/backgroud-login.jpg')] bg-cover bg-no-repeat bg-center">
      <div className="w-full h-full flex justify-center items-center">
        <div className=" flex">
          {!show && (
            <button
              onClick={() => setShow(true)}
              className=" origin-center shadow-2xl bg-blue-700 p-5 rounded"
            >
              TRUY CẬP TRANG
            </button>
          )}
          {show && (
            <Select
              size="large"
              style={{ width: "300px" }}
              defaultValue={"Vui Lòng Lựa Chọn"}
              options={[
                {
                  value: "1",
                  label: (
                    <div
                      className="flex w-96 items-center justify-start gap-1"
                      onClick={() => {
                        router.push("/admin/login")
                      }}
                    >
                      <div className="col-span-2 text-ellipsis overflow-hidden">
                        Truy cập tư cách là giáo viên
                      </div>
                    </div>
                  ),
                },
                {
                  value: "2",
                  label: (
                    <div
                      className="flex w-96 items-center justify-start gap-1"
                      onClick={() => {
                        router.push("/home")
                      }}
                    >
                      <div className="col-span-2 text-ellipsis overflow-hidden">
                        Truy cập tư cách là khách
                      </div>
                    </div>
                  ),
                }
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
