import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { v4 as uuidv4 } from 'uuid';

type FileType = UploadFile;

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj as Blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadImage = ({
  upload,
  media,
  limitUpload,
}: {
  upload: (link: UploadFile[]) => void;
  media?: any;
  limitUpload?: number;
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  useEffect(() => {
    upload(fileList);
  }, [fileList]);

  useEffect(() => {
    if (media && media.length > 0)
      setFileList(
        media?.map((item: string) => {
          return {
            uid: item,
            name: item,
            status: "done",
            url: `${process.env.NEXT_PUBLIC_HOST}/uploads/${item}`,
          };
        })
      );
  }, [media]);

  const getExtension = (filename: any) => {
    // Hàm này trích xuất phần mở rộng của file dựa trên MIME type hoặc tên file
    const dotIndex = filename.lastIndexOf(".");
    if (dotIndex === -1) return ""; // Không có phần mở rộng
    return filename.substring(dotIndex);
  };

  const beforeUpload = (file: any) => {
    const isImageOrVideo =
      file.type.startsWith("image/") || file.type.startsWith("video/");
    if (!isImageOrVideo) {
      return Upload.LIST_IGNORE;
    }

    // Tạo tên file mới với chuỗi ngẫu nhiên và giữ nguyên phần mở rộng
    const extension = getExtension(file.name);
    const randomName = `${uuidv4()}${extension}`;
    file = new File([file], randomName, { type: file.type });

    return true;
  };
  return (
    <>
      <Upload
        action={`${process.env.NEXT_PUBLIC_HOST}/api/upload`}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
      >
        {!limitUpload || (limitUpload && fileList.length < limitUpload)
          ? uploadButton
          : ""}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadImage;
