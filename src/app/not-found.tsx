import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <SearchX size={52} className="text-gray-600 mx-auto mb-4" />
        <h2 className="text-white text-2xl font-bold mb-2">제품을 찾을 수 없습니다</h2>
        <p className="text-gray-400 mb-6">
          요청하신 제품 정보가 존재하지 않습니다.
        </p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-block"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
