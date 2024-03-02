"use client";
import { useState } from "react";

enum TypeMessage {
  user,
  system,
}
type Message = {
  content: string;
  type: TypeMessage;
};

export default function ChatPost({field}: {field: string}) {
  const [input, setInput] = useState<string>("");
  const [listMessage, setListMessage] = useState<Array<Message>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const callAPI = async () => {
    const inputQuestion = input;
    const question = `${input}`;
    setLoading(true);
    try {
      const api = await fetch(`/api/chats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: question, field }),
        credentials: "include",
      });
      const res = await api.json();
      setListMessage([
        ...listMessage,
        { type: TypeMessage.user, content: inputQuestion },
        {
          type: TypeMessage.system,
          content: res.content || "Đã xảy ra lỗi vui lòng thử lại",
        },
      ]);
      setInput("");
      setLoading(false);
    } catch (error) {
      console.error("Error calling ChatGPT API:", error);
      setLoading(false);
      throw error;
    }
  };

  return (
    <div className="mr-4 p-4 mb-4 w-full bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden text-xl">
      <div className="p-3 sm:h-[700px]  overflow-y-auto">
        {listMessage.length > 0 ? (
          listMessage.map((item, index) => {
            if (item.type === TypeMessage.user) {
              return (
                <div key={index} className="flex items-end justify-end mt-2">
                  <div className="bg-blue-500 text-white text-sm rounded-lg p-2 max-w-xs lg:max-w-md">
                    {item.content}
                  </div>
                </div>
              );
            }
            return (
              <div key={index} className="flex items-start justify-start mt-2">
                <div className="bg-gray-300 text-sm rounded-lg p-2 max-w-xs lg:max-w-md text-black">
                  {item.content}
                </div>
              </div>
            );
          })
        ) : (
          <div className=" text-black">Tôi có thể giúp gì cho bạn</div>
        )}
        {loading && (
          <div className="flex items-end justify-end mt-2">
            <div className="bg-blue-500 text-white text-sm rounded-lg p-2 max-w-xs lg:max-w-md">
              {input}
            </div>
          </div>
        )}
        {loading && (
          <div className="flex items-start justify-start mt-2">
            <div className="bg-gray-300 text-sm rounded-lg p-2 max-w-xs lg:max-w-md text-black">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full">
                .
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center p-3">
        <input
          type="text"
          value={input}
          className="form-input w-full rounded-md p-2 border-gray-300 text-black outline-blue-300"
          placeholder="Nhập Câu Hỏi..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (
              (e.ctrlKey && e.key === "Enter") ||
              (e.shiftKey && e.key === "Enter")
            ) {
              const newLetter = `${input}\n`;
              setInput(newLetter);
              return;
            }
            if (e.key === "Enter") {
              callAPI();
              e.preventDefault();
            }
          }}
        />
        <button className="ml-2 text-blue-500" onClick={callAPI}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
