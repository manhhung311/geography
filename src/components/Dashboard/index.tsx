"use client";
import { Post } from "@/app/post/[id]/page";
import {
  CheckSquareTwoTone,
  DeleteTwoTone,
  EditTwoTone,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import { Button, Modal, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import Category from "../../category.json";
import PostForm from "../PostFrom";
import { getCookie } from "cookies-next";
import ExerciseForm from "../ExerciseFrom";
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  activated: boolean;
  _id: string;
  url: string;
}
export default function DataBoard({ menu }: { menu: number }) {
  const [columns, setColumns] = useState<TableProps<DataType>["columns"]>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [post, setPost] = useState<Post>();
  const [exercise, setExercise] = useState<any>();
  const [listPost, setListPost] = useState<Array<DataType>>([]);
  const [listUser, setListUser] = useState<Array<DataType>>([]);
  const [listExercise, setListExercise] = useState<Array<DataType>>([]);
  const [role, setRole] = useState<string>("");
  const getPost = async () => {
    const api = await fetch("/api/post", {
      method: "GET",
      credentials: "include",
    });
    const res = await api.json();
    setListPost(res);
  };

  const getUser = async () => {
    const api = await fetch("/api/user", {
      method: "GET",
      credentials: "include",
    });
    const res = await api.json();
    setListUser(res);
  };

  const getExercises = async () => {
    const api = await fetch("/api/exercises", {
      method: "GET",
      credentials: "include",
    });
    const res = await api.json();
    setListExercise(res);
  };

  const activatePost = async (id: string) => {
    const response = await fetch(`/api/post/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...post,
        activated: true,
      }),
    });
    const res = await response.json();
    if (res.message === "OK") {
      setListPost(
        listPost.map((item) => {
          if (item._id === id) {
            return {
              ...item,
              activated: true,
            };
          }
          return item;
        })
      );
    }
  };

  const activateExercise = async (id: string) => {
    const response = await fetch(`/api/exercises/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...exercise,
        activated: true,
      }),
    });
    const res = await response.json();
    if (res.message === "OK") {
      setListExercise(
        listExercise.map((item) => {
          if (item._id === id) {
            return {
              ...item,
              activated: true,
            };
          }
          return item;
        })
      );
    }
  };

  const handelEditPost = async (data: any) => {
    setPost(data);
    setOpenModal(true);
  };

  const handelEditExercise = async (data: any) => {
    setExercise(data);
    setOpenModal(true);
  };

  const handelDelete = async (id: string) => {
    const response = await fetch(`/api/post/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const res = await response.json();
    if (res.message == "OK") {
      setListPost(listPost.filter((item) => item._id !== id));
    }
  };

  const deleteUser = async (id: string) => {
    const response = await fetch(`/api/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const res = await response.json();
    if (res.message == "OK") {
      setListUser(listUser.filter((item) => item._id !== id));
    }
  };

  const deleteExercise = async (id: string) => {
    const response = await fetch(`/api/exercises/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const res = await response.json();
    if (res.message == "OK") {
      setListExercise(listExercise?.filter((item) => item._id !== id));
    }
  };

  useEffect(() => {
    setRole(getCookie("role") || "");
    if (menu === 0) {
      setColumns([
        {
          title: "Tiêu Đề",
          dataIndex: "title",
          key: "title",
          render: (text, record) => (
            <a href={`${process.env.NEXT_PUBLIC_HOST}/post/${record._id}`}>
              {text}
            </a>
          ),
        },
        {
          title: "Danh Mục",
          dataIndex: "category",
          key: "category",
          render: (text) => (
            <span>{Category.data.find((item) => item.id === text)?.name}</span>
          ),
        },
        {
          title: "Nội Dung",
          dataIndex: "content",
          key: "content",
          render: (text) => (
            <div className=" h-32 overflow-auto flex justify-center items-center">
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: text }}
              ></div>
            </div>
          ),
        },
        {
          title: "Trạng Thái",
          key: "activated",
          dataIndex: "activated",
          render: (_, { activated }) => (
            <>
              {
                <Tag color={activated ? "geekblue" : "red"}>
                  {activated ? "Kích Hoạt" : "Chờ Duyệt"}
                </Tag>
              }
            </>
          ),
        },
        {
          title: "Action",
          key: "action",
          render: (_, record) => (
            <Space size="middle">
              <EditTwoTone onClick={() => handelEditPost(record)} />
              {role === "admin" && (
                <DeleteTwoTone onClick={() => handelDelete(record._id)} />
              )}
              {!record.activated && role === "admin" && (
                <CheckSquareTwoTone
                  onClick={() => {
                    activatePost(record._id);
                  }}
                />
              )}
            </Space>
          ),
        },
      ]);
      if (!listPost || listPost.length === 0) getPost();
    }
    if (menu === 1) {
      setColumns([
        {
          title: "Tên",
          dataIndex: "name",
          key: "name",
          render: (text) => <a>{text}</a>,
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "Trạng Thái",
          key: "activated",
          dataIndex: "activated",
          render: (_, { activated }) => (
            <>
              {
                <Tag color={activated ? "geekblue" : "red"}>
                  {activated ? "Kích Hoạt" : "Chưa Kích Hoạt"}
                </Tag>
              }
            </>
          ),
        },
        {
          title: "Action",
          key: "action",
          render: (_, record) => (
            <Space size="middle">
              {role === "admin" && (
                <DeleteTwoTone onClick={() => deleteUser(record._id)} />
              )}
            </Space>
          ),
        },
      ]);
      if (!listUser || listUser.length === 0) getUser();
    }
    if (menu === 2) {
      setColumns([
        {
          title: "tiêu đề",
          dataIndex: "title",
          key: "title",
          render: (text, { url }) => (
            <a href={url} target={"_blank"}>
              {text}
            </a>
          ),
        },
        {
          title: "url",
          dataIndex: "url",
          key: "url",
          render: (_, { url }) => (
            <div className=" w-56">
              <a href={url} target={"_blank"}>
                {url}
              </a>
            </div>
          ),
        },
        {
          title: "Trạng Thái",
          key: "activated",
          dataIndex: "activated",
          render: (_, { activated }) => (
            <>
              {
                <Tag color={activated ? "geekblue" : "red"}>
                  {activated ? "Kích Hoạt" : "Chưa Kích Hoạt"}
                </Tag>
              }
            </>
          ),
        },
        {
          title: "Action",
          key: "action",
          render: (_, record) => (
            <Space size="middle">
              <EditTwoTone onClick={() => handelEditExercise(record)} />
              {role === "admin" && (
                <DeleteTwoTone onClick={() => deleteExercise(record._id)} />
              )}
              {!record.activated && role === "admin" && (
                <CheckSquareTwoTone
                  onClick={() => {
                    activateExercise(record._id);
                  }}
                />
              )}
            </Space>
          ),
        },
      ]);
      if (!listExercise || listExercise.length === 0) getExercises();
    }
    console.log(listPost.length)
  }, [menu, role, listPost, listUser, listExercise]);

  return (
    <div>
      <Button
        onClick={() => {
          setPost(undefined)
          setExercise(undefined)
          setOpenModal(true);
        }}
        className=" bg-white border-2 border-blue-200"
      >
        Thêm
      </Button>
      <Table
        columns={columns}
        pagination={{ pageSize: 10 }}
        dataSource={
          menu === 0 ? listPost : menu === 1 ? listUser : listExercise
        }
        className=" mb-8"
      />
      <Modal
        title={
          <div className=" flex justify-center items-center">
            <span>{menu === 0 ? "POST" : menu === 2 ? "exercise" : ""}</span>
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
        width={menu === 0 ? 900 : menu === 2 ? 300 : 200}
        zIndex={10}
        bodyStyle={{
          position: "relative",
          paddingInline: "8px",
          overflowY: "auto",
          borderTop: "1px solid #E8E8E8",
          height: `${menu === 0 ? "90vh" : menu === 2 ? "40vh" : ""}`,
          // overflow: "hidden",
        }}
      >
        <div className=" w-full flex justify-center items-center overflow-auto">
          {menu === 0 && (
            <PostForm
              post={post}
              close={() => {
                setOpenModal(false);
                getPost();
                setPost(undefined)
              }}
              updatePost={(p) => setPost(p)}
            />
          )}
          {menu == 2 && (
            <ExerciseForm
              exercise={exercise}
              close={() => {
                setOpenModal(false);
                getExercises();
                setExercise(undefined)
              }}
              updateExercise={(p) => setExercise(p)}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
