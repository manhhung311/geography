"use client";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";

export default function ExerciseForm({
  exercise,
  close,
  updateExercise,
}: {
  exercise?: any;
  close: () => void;
  updateExercise: (p: any) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackForm] = Form.useForm();
  const title = Form.useWatch("title", feedbackForm);
  const url = Form.useWatch("url", feedbackForm);
  const classNumber = Form.useWatch("classNumber", feedbackForm);
  
  const handleSubmitForm = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${!exercise ? "/api/exercises" : `/api/exercises/${exercise._id}`}`,
        {
          method: !exercise ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title,
            classNumber,
            url,
          }),
        }
      );
      if (!response.ok) {
        console.error("Upload failed");
      } else {
        const result = await response.json();
        updateExercise({
          title,
          classNumber,
          url,
        });
        close();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (exercise) {
      feedbackForm.setFieldsValue({
        title: exercise.title,
        classNumber: exercise.classNumber,
        url: exercise.url,
      });
    }
  }, [exercise]);

  return (
    <Form className="p-4" form={feedbackForm} onFinish={handleSubmitForm}>
      <div className="grid gap-2">
        <Subtitle title={"Tiêu Đề Bài Tập"} required />
        <Form.Item name={"title"} rules={[{ required: true }]}>
          <Input value={title} disabled={loading} maxLength={500} required />
        </Form.Item>
      </div>
      <div className="grid gap-2">
        <Subtitle title={"Link bài tập google doc"} required={true} />
        <Form.Item name={"url"}>
          <Input
            type="url"
            value={url}
            disabled={loading}
            maxLength={500}
            required
          />
        </Form.Item>
      </div>
      <div className="grid gap-2">
        <Subtitle title={"Lớp"} required={true} />
        <Form.Item name={"classNumber"}>
          <Input
            type={"number"}
            value={classNumber}
            disabled={loading}
            required
          />
        </Form.Item>
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
