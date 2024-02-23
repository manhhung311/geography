"use client";
import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button, Modal } from "antd";
import type { TableProps } from "antd";
import {
  EditTwoTone,
  DeleteTwoTone,
  CheckSquareTwoTone,
} from "@ant-design/icons";
import PostForm from "../PostFrom";
import { Post } from "@/app/post/[id]/page";
import Category from "../../category.json";
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
  const getPost = async () => {
    const api = await fetch("/api/post", {
      method: "GET",
      credentials: "include",
    });
    const res = await api.json();
    setListPost(res);
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
    console.log(res);
  };

  const handelEditPost = async (data: any) => {
    setPost(data);
    setOpenModal(true);
  };

  const handelDelete = async (id: string)=> {
    const response = await fetch(`/api/post/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const res = await response.json();
    console.log(res);
  }

  useEffect(() => {
    if (menu === 0) {
      setColumns([
        {
          title: "Tiêu Đề",
          dataIndex: "title",
          key: "title",
          render: (text) => <a>{text}</a>,
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
              <DeleteTwoTone onClick={()=> handelDelete(record._id)}/>
              {!record.activated && (
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
      getPost();
    }
    if (menu === 1)
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
          key: "age",
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
              <DeleteTwoTone />
            </Space>
          ),
        },
      ]);
  }, [menu]);

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
            <PostForm post={post} close={() => setOpenModal(false)} />
          )}
        </div>
      </Modal>
    </div>
  );
}
