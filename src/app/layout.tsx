import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "중고비교 - 스마트한 중고 구매 판단",
  description:
    "중고 플랫폼 가격 비교, 시세 분석, 구매 적합도 신호등으로 스마트한 중고 구매를 도와드립니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${geist.className} bg-gray-950 text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
