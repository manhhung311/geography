import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tư liệu số gddp Nam Định",
  description: "Công cụ hỗ trợ giảng dạy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <AntdRegistry>{children}</AntdRegistry>
        </Suspense>
      </body>
    </html>
  );
}
