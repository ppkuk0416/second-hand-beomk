"use client";

import { AnalysisResult } from "@/lib/analyze";
import { TrafficLight } from "./TrafficLight";
import { PriceComparison } from "./PriceComparison";
import { PriceHistoryChart } from "./PriceHistoryChart";
import { SpecsTable } from "./SpecsTable";
import { ReviewsSection } from "./ReviewsSection";
import { SignalBadge } from "./SignalBadge";
import { Calendar, Sparkles, Wifi, AlertCircle } from "lucide-react";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

interface Props {
  result: AnalysisResult;
  query: string;
}

export function AnalysisResultView({ result, query }: Props) {
  if (!result.found) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <AlertCircle size={48} className="mb-4 opacity-40" />
        <p className="text-lg font-medium text-gray-400 mb-1">
          제품을 특정할 수 없습니다
        </p>
        <p className="text-sm text-center">
          더 구체적인 검색어를 입력해보세요
          <br />
          <span className="text-gray-600">
            예: &quot;갤럭시 S24 울트라&quot;, &quot;커클랜드 드라이버 10.5도&quot;
          </span>
        </p>
      </div>
    );
  }

  const savings = result.currentNewPrice
    ? Math.round((1 - result.avgUsedPrice / result.currentNewPrice) * 100)
    : 0;
  const savingsFromRelease = result.releasePrice
    ? Math.round((1 - result.avgUsedPrice / result.releasePrice) * 100)
    : 0;

  const signalColors = {
    good: "bg-green-900/20 border-green-700/50 text-green-300",
    fair: "bg-yellow-900/20 border-yellow-700/50 text-yellow-300",
    bad: "bg-red-900/20 border-red-700/50 text-red-300",
  };

  // 플랫폼 데이터를 PriceComparison 컴포넌트 형식으로 변환
  const platforms = result.platforms.map((p) => ({
    ...p,
    price: p.avgPrice,
  }));

  return (
    <div className="space-y-6">
      {/* 데이터 출처 표시 */}
      <div
        className={`flex items-center gap-2 text-xs px-4 py-2 rounded-xl border w-fit ${
          result.dataSource === "real"
            ? "bg-green-900/30 border-green-700/50 text-green-400"
            : "bg-purple-900/30 border-purple-700/50 text-purple-300"
        }`}
      >
        {result.dataSource === "real" ? (
          <>
            <Wifi size={12} />
            실시간 플랫폼 데이터 기반
          </>
        ) : (
          <>
            <Sparkles size={12} />
            AI 분석 데이터 · {result.disclaimer}
          </>
        )}
      </div>

      {/* 제품 헤더 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 이미지 */}
        <div className="rounded-2xl overflow-hidden bg-gray-900 border border-gray-700">
          <img
            src={`https://source.unsplash.com/600x400/?${encodeURIComponent(result.imageSearchQuery)}`}
            alt={result.name}
            className="w-full h-56 sm:h-72 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80";
            }}
          />
        </div>

        {/* 기본 정보 */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400 text-sm">
                {result.brand} · {result.category}
              </span>
              <SignalBadge signal={result.dealAnalysis.signal} />
            </div>
            <h2 className="text-2xl font-bold text-white">{result.name}</h2>
            {result.releaseDate && (
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                <Calendar size={13} />
                출시: {result.releaseDate}
              </div>
            )}
          </div>

          {/* 가격 3단 비교 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-3">
              <div className="text-gray-400 text-xs mb-1">출시가</div>
              <div className="text-white font-bold text-sm">
                {result.releasePrice ? formatPrice(result.releasePrice) : "미상"}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-3">
              <div className="text-gray-400 text-xs mb-1">현재 신제품가</div>
              <div className="text-blue-400 font-bold text-sm">
                {result.currentNewPrice
                  ? formatPrice(result.currentNewPrice)
                  : "미상"}
              </div>
            </div>
            <div className="bg-gray-900 border border-green-700/50 rounded-xl p-3">
              <div className="text-gray-400 text-xs mb-1">중고 평균가</div>
              <div className="text-green-400 font-bold text-sm">
                {formatPrice(result.avgUsedPrice)}
              </div>
            </div>
          </div>

          {/* 절약 뱃지 */}
          {(savings > 0 || savingsFromRelease > 0) && (
            <div className="flex flex-wrap gap-2">
              {savings > 0 && (
                <span className="bg-green-900/40 text-green-400 border border-green-700/50 text-sm px-3 py-1 rounded-full font-medium">
                  신제품 대비 {savings}% 저렴
                </span>
              )}
              {savingsFromRelease > 0 && savingsFromRelease !== savings && (
                <span className="bg-blue-900/40 text-blue-400 border border-blue-700/50 text-sm px-3 py-1 rounded-full font-medium">
                  출시가 대비 {savingsFromRelease}% 저렴
                </span>
              )}
            </div>
          )}

          {/* 딜 요약 */}
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${signalColors[result.dealAnalysis.signal]}`}
          >
            <p className="text-gray-300 leading-relaxed">
              {result.dealAnalysis.reason}
            </p>
          </div>

          {/* 총 매물 수 */}
          {platforms.length > 0 && (
            <div className="text-gray-500 text-sm">
              총{" "}
              <span className="text-white font-medium">
                {platforms.reduce((s, p) => s + p.count, 0).toLocaleString()}개
              </span>{" "}
              매물 · {platforms.length}개 플랫폼 기준
            </div>
          )}
        </div>
      </div>

      {/* 신호등 + 플랫폼 비교 */}
      {platforms.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrafficLight analysis={result.dealAnalysis} />
          <PriceComparison
            platforms={platforms}
            avgUsedPrice={result.avgUsedPrice}
            currentNewPrice={result.currentNewPrice || result.avgUsedPrice * 1.5}
          />
        </div>
      )}

      {/* 가격 트렌드 */}
      {result.priceHistory.length > 0 && (
        <PriceHistoryChart
          history={result.priceHistory}
          currentNewPrice={result.currentNewPrice || result.avgUsedPrice * 1.5}
          releasePrice={result.releasePrice || result.avgUsedPrice * 2}
        />
      )}

      {/* 스펙 + 후기 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {result.specs.length > 0 && <SpecsTable specs={result.specs} />}
        <ReviewsSection reviews={result.reviews} />
      </div>
    </div>
  );
}
