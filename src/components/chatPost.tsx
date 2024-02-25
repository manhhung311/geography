"use client";
import OpenAI from "openai";
import { useState } from "react";

enum TypeMessage {
  user,
  system,
}
type Message = {
  content: string;
  type: TypeMessage;
};

export default function ChatPost() {
  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });
  const [input, setInput] = useState<string>("");
  const [listMessage, setListMessage] = useState<Array<Message>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const callAPI = async () => {
    const inputQuestion = input;
    const question = `${input}. Hãy giới hạn trong các lĩnh vực lịch sử, Giáo dục, Lễ Hội, Làng nghề, Văn học, Âm nhạc, Mĩ thuật, Du lịch, Kinh tế, Chính trị`;
    setLoading(true);
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      });
      setListMessage([
        ...listMessage,
        { type: TypeMessage.user, content: inputQuestion },
        {
          type: TypeMessage.system,
          content:
            completion.choices[0].message.content ||
            "Đã xảy ra lỗi vui lòng thử lại",
        },
      ]);
      setInput("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error calling ChatGPT API:", error);
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
