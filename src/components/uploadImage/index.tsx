import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { v4 as uuidv4 } from "uuid";
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

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

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
    if (media && media.length > 0 && Array.isArray(media))
      setFileList(
        media?.map((item: string) => {
          return {
            uid: item,
            name: item,
            status: "done",
            url: `${process.env.NEXT_PUBLIC_HOST}/files/${item}`,
          };
        })
      );
    if (media && !Array.isArray(media)) {
      setFileList([
        {
          uid: media,
          name: media,
          status: "done",
          url: `${process.env.NEXT_PUBLIC_HOST}/files/${media}`,
        },
      ]);
    }
  }, [media]);

  const CustomUpload = async (options: any) => {
    const { file } = options;
    const formData = new FormData();
    const fileNameWithUUID = uuidv4(); // Sinh ra UUID

    // Tạo tên file mới kết hợp UUID và phần mở rộng file gốc
    const newFileName = `${fileNameWithUUID}.${file.name.split(".").pop()}`;

    // Thêm file vào FormData với tên file mới
    formData.append("file", new File([file], newFileName, { type: file.type }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        console.log("Upload success");
        setFileList(
          fileList.map((item) => {
            if (item.name === file.name) {
              return {
                ...item,
                status: "done",
                uid: newFileName,
                name: newFileName,
                url: `${process.env.NEXT_PUBLIC_HOST}/files/${newFileName}`,
              };
            }
            return item;
          })
        );

        //   ...fileList,
        //   {
        //     uid: newFileName,
        //     name: newFileName,
        //     status: "done",
        //     url: `${process.env.NEXT_PUBLIC_HOST}/files/${newFileName}`,
        //   },
        // ]);
        // Xử lý thêm sau khi upload thành công nếu cần
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Upload
        action={`${process.env.NEXT_PUBLIC_HOST}/api/upload`}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        customRequest={CustomUpload}
        onChange={handleChange}
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
