"use client";

import { PlatformListing } from "@/lib/types";
import { ExternalLink } from "lucide-react";

interface PriceComparisonProps {
  platforms: PlatformListing[];
  avgUsedPrice: number;
  currentNewPrice: number;
}

function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}

export function PriceComparison({
  platforms,
  avgUsedPrice,
  currentNewPrice,
}: PriceComparisonProps) {
  const sorted = [...platforms].sort((a, b) => a.avgPrice - b.avgPrice);
  const cheapest = sorted[0];

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white">플랫폼별 가격 비교</h3>
        <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
          최근 1년 기준
        </span>
      </div>

      {/* Best deal highlight */}
      <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 mb-5">
        <div className="text-green-400 text-xs font-semibold mb-1">
          최저가 플랫폼
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white font-bold text-lg">
              {cheapest.platform}
            </span>
            <span className="text-gray-400 text-sm ml-2">
              평균 {formatPrice(cheapest.avgPrice)}
            </span>
          </div>
          <div className="text-green-400 text-sm font-medium">
            신제품 대비{" "}
            {Math.round((1 - cheapest.avgPrice / currentNewPrice) * 100)}% 저렴
          </div>
        </div>
      </div>

      {/* Platform list */}
      <div className="space-y-3">
        {sorted.map((platform) => {
          const pct = Math.round((platform.avgPrice / avgUsedPrice - 1) * 100);
          const isCheapest = platform.platform === cheapest.platform;

          return (
            <div
              key={platform.platform}
              className={`rounded-xl p-4 border transition-all ${
                isCheapest
                  ? "border-green-700/60 bg-green-900/10"
                  : "border-gray-700 bg-gray-800/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-white font-medium">
                    {platform.platform}
                  </span>
                  {isCheapest && (
                    <span className="text-xs bg-green-800 text-green-300 px-2 py-0.5 rounded-full">
                      최저가
                    </span>
                  )}
                </div>
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className="text-white font-bold text-xl">
                    {formatPrice(platform.avgPrice)}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    {formatPrice(platform.minPrice)} ~{" "}
                    {formatPrice(platform.maxPrice)}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${pct > 0 ? "text-red-400" : pct < 0 ? "text-green-400" : "text-gray-400"}`}
                  >
                    {pct > 0 ? "+" : ""}
                    {pct}% vs 평균
                  </div>
                  <div className="text-gray-500 text-xs">
                    매물 {platform.count}개
                  </div>
                </div>
              </div>

              {/* Price bar */}
              <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: platform.color,
                    width: `${Math.min(100, (platform.avgPrice / currentNewPrice) * 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
