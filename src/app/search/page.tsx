import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { searchProducts } from "@/lib/mockData";
import { TrendingDown } from "lucide-react";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

function SignalLight({ signal }: { signal: "good" | "fair" | "bad" }) {
  const config = {
    good: { color: "bg-green-500", text: "구매 추천", textColor: "text-green-400" },
    fair: { color: "bg-yellow-400", text: "보통 거래", textColor: "text-yellow-400" },
    bad: { color: "bg-red-500", text: "비추천", textColor: "text-red-400" },
  }[signal];

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
      <span className={`text-xs font-medium ${config.textColor}`}>{config.text}</span>
    </div>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <SearchPageContent searchParams={searchParams} />
  );
}

async function SearchPageContent({
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
          &quot;{q}&quot; 검색 결과 —{" "}
          <span className="text-white font-medium">{results.length}개</span> 제품
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            검색 결과가 없습니다. 다른 검색어를 입력해보세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((product) => {
              const savings = Math.round(
                (1 - product.avgUsedPrice / product.currentNewPrice) * 100
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
                    <SignalLight signal={product.dealAnalysis.signal} />
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
                      매물 {product.platforms.reduce((s, p) => s + p.count, 0)}개 · 4개 플랫폼
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
