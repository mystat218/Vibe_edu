import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "부산축제허브 (Busan Festival Hub)",
  description: "부산광역시에서 열리는 오색찬란한 대표 축제 정보를 구군별, 일정별, 요금별로 손쉽게 확인하세요. 실시간 위치 지도와 나만의 관심 축제 기능을 제공합니다.",
  keywords: ["부산 축제", "부산 여행", "부산 가볼만한곳", "부산불꽃축제", "부산바다축제", "부산 여행코스"],
  openGraph: {
    title: "부산축제허브 (Busan Festival Hub)",
    description: "부산광역시 대표 축제 정보와 상세 일정, 대중교통 및 지도 정보를 확인하세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

