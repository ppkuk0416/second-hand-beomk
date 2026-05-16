import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { SignalBadge } from "@/components/SignalBadge";
import { searchProducts } from "@/lib/mockData";
import { TrendingDown, SearchX } from "lucide-react";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = searchProducts(q);

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <TrendingDown size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg hidden sm:block">중고비교</span>
          </Link>
          <div className="flex-1 max-w-xl">
            <SearchBar defaultValue={q} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-gray-400 text-sm mb-6">
          <span className="text-white font-medium">&ldquo;{q}&rdquo;</span> 검색 결과 —{" "}
          <span className="text-white font-medium">{results.length}개</span> 제품
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-gray-500">
            <SearchX size={48} className="mb-4 opacity-40" />
            <p className="text-lg font-medium text-gray-400 mb-1">
              검색 결과가 없습니다
            </p>
            <p className="text-sm mb-6">
              다른 검색어를 입력하거나 카테고리로 찾아보세요
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Galaxy", "iPhone", "MacBook", "Dyson"].map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${s}`}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm border border-gray-700 transition-colors"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((product) => {
              const savings = Math.round(
                (1 - product.avgUsedPrice / product.currentNewPrice) * 100
              );
              const totalListings = product.platforms.reduce(
                (s, p) => s + p.count,
                0
              );
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden hover:border-blue-600 transition-all hover:shadow-lg hover:shadow-blue-900/20"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-44 object-cover bg-gray-800"
                  />
                  <div className="p-4">
                    <div className="text-gray-400 text-xs mb-1">
                      {product.brand} · {product.category}
                    </div>
                    <div className="text-white font-semibold text-base leading-snug group-hover:text-blue-400 transition-colors mb-3">
                      {product.name}
                    </div>
                    <SignalBadge signal={product.dealAnalysis.signal} />
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <div className="text-gray-500 text-xs">평균 중고가</div>
                        <div className="text-white font-bold">
                          {formatPrice(product.avgUsedPrice)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500 text-xs">절약</div>
                        <div className="text-green-400 font-bold">-{savings}%</div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      매물 {totalListings}개 · 4개 플랫폼
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
