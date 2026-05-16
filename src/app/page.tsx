import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { TrendingDown, ShieldCheck, BarChart2 } from "lucide-react";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

function SignalBadge({ signal }: { signal: "good" | "fair" | "bad" }) {
  if (signal === "good")
    return (
      <span className="flex items-center gap-1 text-xs bg-green-900/60 text-green-400 px-2 py-0.5 rounded-full font-medium border border-green-700/50">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
        구매 추천
      </span>
    );
  if (signal === "fair")
    return (
      <span className="flex items-center gap-1 text-xs bg-yellow-900/60 text-yellow-400 px-2 py-0.5 rounded-full font-medium border border-yellow-700/50">
        <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
        보통
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs bg-red-900/60 text-red-400 px-2 py-0.5 rounded-full font-medium border border-red-700/50">
      <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
      비추천
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <TrendingDown size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">중고비교</span>
          </Link>
          <span className="text-gray-500 text-sm hidden sm:block">
            당근 · 번개장터 · 중고나라 · 헬로마켓 통합 비교
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/40 rounded-full px-4 py-1.5 text-blue-400 text-sm mb-6">
          <ShieldCheck size={14} />
          4대 중고 플랫폼 실시간 비교
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
          중고 구매, 지금 사도 될까요?
          <br />
          <span className="text-blue-400">신호등</span>이 알려드립니다
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          당근마켓, 번개장터, 중고나라, 헬로마켓 1년치 데이터를 분석해
          <br />
          지금 구매가 좋은 딜인지 빨간불·주황불·초록불로 판단해드려요
        </p>

        <div className="max-w-xl mx-auto">
          <SearchBar large />
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            "신제품가 비교",
            "중고 시세 트렌드",
            "플랫폼별 최저가",
            "구매 점수",
            "실사용 후기",
          ].map((f) => (
            <span
              key={f}
              className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full border border-gray-700"
            >
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* Popular products */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 size={18} className="text-blue-400" />
          <h2 className="text-white font-semibold text-lg">인기 제품 시세</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_PRODUCTS.map((product) => {
            const savings = Math.round(
              (1 - product.avgUsedPrice / product.currentNewPrice) * 100
            );
            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-gray-900 border border-gray-700 rounded-2xl p-5 hover:border-blue-600 transition-all hover:shadow-lg hover:shadow-blue-900/20"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl bg-gray-800"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-gray-400 text-xs mb-0.5">
                          {product.brand} · {product.category}
                        </div>
                        <div className="text-white font-semibold text-base leading-tight group-hover:text-blue-400 transition-colors">
                          {product.name}
                        </div>
                      </div>
                      <SignalBadge signal={product.dealAnalysis.signal} />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-gray-500 text-xs">평균 중고가</div>
                        <div className="text-white font-bold text-lg">
                          {formatPrice(product.avgUsedPrice)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">신제품가 대비</div>
                        <div className="text-green-400 font-bold text-lg">
                          -{savings}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
