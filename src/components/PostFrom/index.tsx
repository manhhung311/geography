"use client";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
import type { UploadFile } from "antd";
import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import ND from "../../ND.json";
import Category from "../../category.json";
import LocationPicker, { Location } from "../LocationPicker";
import UploadImage from "../uploadImage";
// import dynamic from "next/dynamic";
// type FileType = UploadFile;
// const CKEditor = dynamic(
//   () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
//   { ssr: false } // This line is important. It disables server-side rendering for CKEditor.
// );
export default function PostForm({
  post,
  close,
}: {
  post?: any;
  close: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [locationGeo, setLocationGeo] = useState<Location>();
  const [feedbackForm] = Form.useForm();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [representativeImage, setRepresentativeImage] = useState<UploadFile[]>(
    []
  );

  const editorRef: any = useRef(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
  }, []);

  const [selectCategory, setSelectCategory] = useState<String>();
  const [selectField, setSelectField] = useState<String>("");
  const title = Form.useWatch("title", feedbackForm);
  const exercise = Form.useWatch("exercise", feedbackForm);
  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setContent(data as string);
  };
  const handleSubmitForm = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${!post ? "/api/post" : `/api/post/${post._id}`}`,
        {
          method: !post ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            content,
            category: selectCategory,
            location: {
              name: location,
              latitude: locationGeo?.lat,
              longitude: locationGeo?.lon,
              image: representativeImage[0].name,
            },
            district: selectField,
            files: files.map((item) => item.name),
            exercise: exercise,
          }),
        }
      );

      if (!response.ok) {
        console.error("Upload failed");
      } else {
        const result = await response.json();
        close();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (post) {
      feedbackForm.setFieldsValue({
        title: post.title,
        link: post.link,
        field: post.district,
        category: post.category,
        exercise: post.exercise,
      });
      setLocationGeo({
        lat: post.location.latitude,
        lon: post.location.longitude,
      });
      setLocation(post.location.name);
      setSelectCategory(post.catogory);
      setSelectField(post.district);
    }
  }, [post]);
  const options = ND.Nam_Dinh.districts.map((item) => {
    return {
      value: item.id,
      label: (
        <div
          className="flex items-center justify-start gap-1"
          onClick={() => {
            setSelectField(item.id);
          }}
        >
          <div className="col-span-2">{item.name}</div>
        </div>
      ),
    };
  });
  const optionsCategory = Category.data.map((item) => {
    return {
      value: item.id,
      label: (
        <div
          className="flex items-center justify-start gap-1"
          onClick={() => {
            setSelectCategory(item.id);
          }}
        >
          <div className="col-span-2">{item.name}</div>
        </div>
      ),
    };
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);
  return (
    <Form className="p-4" form={feedbackForm} onFinish={handleSubmitForm}>
      <div className="grid gap-2">
        <Subtitle title={"Tiêu Đề Bài Viết"} required />
        <Form.Item name={"title"} rules={[{ required: true }]}>
          <Input value={title} disabled={loading} maxLength={500} />
        </Form.Item>
      </div>
      <div className="grid gap-2">
        <Subtitle title={"Hình Ảnh Trên Bản Đồ"} required />
        <div className=" flex justify-center items-center w-full">
          <UploadImage
            upload={(file) => {
              setRepresentativeImage(file);
            }}
            media={post ? [post?.location?.image] : []}
            limitUpload={1}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Subtitle title={"Video Hình Ảnh"} required />
        <UploadImage
          upload={(file) => {
            setFiles(file);
          }}
          media={post ? post?.files : []}
        />
      </div>
      <div className="grid gap-2">
        <Subtitle title={"Link bài tập google doc"} required={false} />
        <Form.Item name={"exercise"}>
          <Input
            type="url"
            value={exercise}
            disabled={loading}
            maxLength={500}
          />
        </Form.Item>
      </div>
      <div className="grid gap-2">
        <Subtitle title={"Danh Mục"} required={true} />
        <Form.Item name={"category"}>
          <Select
            size="large"
            style={{ width: "100%" }}
            options={optionsCategory}
          />
        </Form.Item>
      </div>
      <div className="grid gap-2">
        <Subtitle title={"Huyện"} required={true} />
        <Form.Item name={"field"}>
          <Select size="large" style={{ width: "100%" }} options={options} />
        </Form.Item>
      </div>
      <div className="grid gap-2">
        <Subtitle title={"Location"} required={false} />
        <Form.Item name={"Location"}>
          <Input
            value={location}
            onClick={() => {
              setOpenModal(true);
            }}
          />
        </Form.Item>
      </div>
      <div className="grid gap-2">
        <Subtitle title={"Nội Dung"} required />
        {isClient && (
          <CKEditor
            data={post?.content || ""}
            editor={ClassicEditor}
            onChange={handleEditorChange}
          />
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Button disabled={loading} onClick={close}>
          Đóng
        </Button>
        <Button
          loading={loading}
          htmlType="submit"
          type="primary"
          className=" bg-blue-500 text-white"
        >
          Lưu
        </Button>
      </div>
      <Modal
        title={
          <div className=" flex justify-center items-center">
            <span>Location</span>
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
        width={700}
        zIndex={10}
        bodyStyle={{
          position: "relative",
          paddingInline: "8px",
          overflowY: "auto",
          borderTop: "1px solid #E8E8E8",
          height: "80vh",
          overflow: "hidden",
        }}
      >
        <div className=" flex justify-center items-center p-8">
          <LocationPicker
            onEndSelect={() => {
              setOpenModal(false);
            }}
            onSelectLocation={(locationString, location) => {
              setLocation(locationString || "");
              setLocationGeo(location);
              setOpenModal(false);
              feedbackForm.setFieldsValue({
                Location: locationString,
              });
            }}
          />
        </div>
      </Modal>
    </Form>
  );
}

const Subtitle = ({
  title,
  required,
}: {
  title: string;
  required: boolean;
}) => (
  <p className="text-sm md:text-base">
    <span className="capitalize font-medium">{title}</span>
    {required && <span className="ml-1 text-negative">{"*"}</span>}
  </p>
);
