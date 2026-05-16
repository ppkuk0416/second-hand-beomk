import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/mockData";
import { TrafficLight } from "@/components/TrafficLight";
import { PriceComparison } from "@/components/PriceComparison";
import { PriceHistoryChart } from "@/components/PriceHistoryChart";
import { SpecsTable } from "@/components/SpecsTable";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SearchBar } from "@/components/SearchBar";
import { SignalBadge } from "@/components/SignalBadge";
import { ImageGallery } from "@/components/ImageGallery";
import { TrendingDown, ArrowLeft, Calendar } from "lucide-react";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) notFound();

  const savings = Math.round(
    (1 - product.avgUsedPrice / product.currentNewPrice) * 100
  );
  const savingsFromRelease = Math.round(
    (1 - product.avgUsedPrice / product.releasePrice) * 100
  );

  const signalColors = {
    good: "bg-green-900/20 border-green-700/50 text-green-300",
    fair: "bg-yellow-900/20 border-yellow-700/50 text-yellow-300",
    bad: "bg-red-900/20 border-red-700/50 text-red-300",
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <TrendingDown size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg hidden sm:block">중고비교</span>
          </Link>
          <div className="flex-1 max-w-xl">
            <SearchBar />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          홈으로
        </Link>

        {/* Product hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Image gallery */}
          <ImageGallery images={product.images} alt={product.name} />

          {/* Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-400 text-sm">
                  {product.brand} · {product.category}
                </span>
                <SignalBadge signal={product.dealAnalysis.signal} />
              </div>
              <h1 className="text-2xl font-bold text-white">{product.name}</h1>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                <Calendar size={13} />
                출시일: {product.releaseDate}
              </div>
            </div>

            {/* Price grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-3">
                <div className="text-gray-400 text-xs mb-1">출시가</div>
                <div className="text-white font-bold text-sm sm:text-base">
                  {formatPrice(product.releasePrice)}
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-3">
                <div className="text-gray-400 text-xs mb-1">현재 신제품가</div>
                <div className="text-blue-400 font-bold text-sm sm:text-base">
                  {formatPrice(product.currentNewPrice)}
                </div>
              </div>
              <div className="bg-gray-900 border border-green-700/50 rounded-xl p-3">
                <div className="text-gray-400 text-xs mb-1">중고 평균가</div>
                <div className="text-green-400 font-bold text-sm sm:text-base">
                  {formatPrice(product.avgUsedPrice)}
                </div>
              </div>
            </div>

            {/* Savings pills */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-900/40 text-green-400 border border-green-700/50 text-sm px-3 py-1 rounded-full font-medium">
                신제품 대비 {savings}% 저렴
              </span>
              <span className="bg-blue-900/40 text-blue-400 border border-blue-700/50 text-sm px-3 py-1 rounded-full font-medium">
                출시가 대비 {savingsFromRelease}% 저렴
              </span>
            </div>

            {/* Deal summary */}
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${signalColors[product.dealAnalysis.signal]}`}
            >
              <p className="text-gray-300 leading-relaxed">
                {product.dealAnalysis.reason}
              </p>
            </div>

            {/* Platform count */}
            <div className="text-gray-500 text-sm">
              총{" "}
              <span className="text-white font-medium">
                {product.platforms.reduce((s, p) => s + p.count, 0)}개
              </span>{" "}
              매물 · 4개 플랫폼 기준
            </div>
          </div>
        </div>

        {/* Traffic light + Platform comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TrafficLight analysis={product.dealAnalysis} />
          <PriceComparison
            platforms={product.platforms}
            avgUsedPrice={product.avgUsedPrice}
            currentNewPrice={product.currentNewPrice}
          />
        </div>

        {/* Price history chart */}
        <div className="mb-6">
          <PriceHistoryChart
            history={product.priceHistory}
            currentNewPrice={product.currentNewPrice}
            releasePrice={product.releasePrice}
          />
        </div>

        {/* Specs + Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpecsTable specs={product.specs} />
          <ReviewsSection reviews={product.reviews} />
        </div>
      </main>
    </div>
  );
}
