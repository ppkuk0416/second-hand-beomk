"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <AlertTriangle size={48} className="text-yellow-400 mx-auto mb-4" />
        <h2 className="text-white text-2xl font-bold mb-2">문제가 발생했습니다</h2>
        <p className="text-gray-400 mb-6">페이지를 불러오는 중 오류가 발생했습니다.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
