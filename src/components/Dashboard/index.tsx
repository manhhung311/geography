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
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  activated: boolean;
  _id: string;
}
export default function DataBoard({ menu }: { menu: number }) {
  const [columns, setColumns] = useState<TableProps<DataType>["columns"]>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [post, setPost] = useState<Post>();
  const [listPost, setListPost] = useState<Array<DataType>>([]);
  const [listUser, setListUser] = useState<Array<DataType>>([]);
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

  const handelEditPost = async (data: any) => {
    setPost(data);
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
      if(!listPost|| listPost.length === 0)getPost();
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
      if(!listUser || listUser.length === 0)getUser();
    }
  }, [menu, role, listPost, listUser]);

  return (
    <div>
      <Button
        onClick={() => {
          setOpenModal(true);
        }}
        className=" bg-white border-2 border-blue-200"
      >
        Thêm
      </Button>
      <Table
        columns={columns}
        pagination={{ pageSize: 10 }}
        dataSource={menu === 0 ? listPost : listUser}
      />
      <Modal
        title={
          <div className=" flex justify-center items-center">
            <span>POST</span>
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
        width={900}
        zIndex={10}
        bodyStyle={{
          position: "relative",
          paddingInline: "8px",
          overflowY: "auto",
          borderTop: "1px solid #E8E8E8",
          height: "80vh",
          // overflow: "hidden",
        }}
      >
        <div className=" flex justify-center items-center overflow-auto">
          {menu === 0 && (
            <PostForm
              post={post}
              close={() => {
                setOpenModal(false);
                getPost();
              }}
              updatePost={(p) => setPost(p)}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
