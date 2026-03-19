import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "高校公众号运营平台",
  description: "对标、选题、生成一站式工作流",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: 'var(--background)' }}
      >
        {/* 顶部导航栏 - 全屏宽度 */}
        <TopNav />

        <div className="flex min-h-screen pt-14">
          {/* 侧边栏 - 在顶部导航下方 */}
          <Sidebar />

          {/* 主内容区域 */}
          <main className="flex-1 ml-60" style={{ background: 'var(--background-secondary)' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

