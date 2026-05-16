"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  defaultValue?: string;
  large?: boolean;
}

export function SearchBar({ defaultValue = "", large = false }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    // 페이지 전환 후 로딩 상태 자동 해제
    setTimeout(() => setLoading(false), 1000);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative flex items-center ${large ? "text-lg" : "text-sm"}`}>
        {loading ? (
          <Loader2
            className="absolute left-4 text-blue-400 animate-spin"
            size={large ? 22 : 18}
          />
        ) : (
          <Search
            className="absolute left-4 text-gray-400"
            size={large ? 22 : 18}
          />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예: 커클랜드 드라이버, 아이폰 15, 다이슨..."
          className={`w-full bg-gray-800 border border-gray-600 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors ${
            large ? "pl-12 pr-36 py-4" : "pl-10 pr-28 py-3"
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className={`absolute right-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors ${
            large ? "px-5 py-2.5 text-base" : "px-4 py-1.5 text-sm"
          }`}
        >
          {loading ? "검색 중..." : "검색"}
        </button>
      </div>
    </form>
  );
}
