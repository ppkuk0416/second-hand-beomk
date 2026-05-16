"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  defaultValue?: string;
  large?: boolean;
}

export function SearchBar({ defaultValue = "", large = false }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`relative flex items-center ${
          large ? "text-lg" : "text-sm"
        }`}
      >
        <Search
          className="absolute left-4 text-gray-400"
          size={large ? 22 : 18}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제품명, 브랜드, 카테고리 검색..."
          className={`w-full bg-gray-800 border border-gray-600 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors ${
            large ? "pl-12 pr-36 py-4" : "pl-10 pr-28 py-3"
          }`}
        />
        <button
          type="submit"
          className={`absolute right-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors ${
            large ? "px-5 py-2.5 text-base" : "px-4 py-1.5 text-sm"
          }`}
        >
          검색
        </button>
      </div>
    </form>
  );
}
