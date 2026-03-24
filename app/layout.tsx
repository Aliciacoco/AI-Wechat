import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import { SceneProvider } from "@/components/SceneProvider";
import SceneContent from "@/components/SceneContent";

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
        style={{ background: '#F2F4F7' }}
      >
        <SceneProvider>
          <TopNav />
          <div className="pt-[68px] min-h-screen">
            <SceneContent />
          </div>
        </SceneProvider>
      </body>
    </html>
  );
}
