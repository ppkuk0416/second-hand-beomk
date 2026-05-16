"use client";

import { DealAnalysis } from "@/lib/types";

interface TrafficLightProps {
  analysis: DealAnalysis;
}

export function TrafficLight({ analysis }: TrafficLightProps) {
  const isGood = analysis.signal === "good";
  const isFair = analysis.signal === "fair";
  const isBad = analysis.signal === "bad";

  const label = isGood ? "구매 추천" : isFair ? "보통 거래" : "구매 비추천";
  const labelColor = isGood
    ? "text-green-400"
    : isFair
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">구매 판단 신호</h3>

      {/* Traffic light */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2 bg-gray-800 rounded-xl p-4 border border-gray-600">
          <div
            className={`w-10 h-10 rounded-full transition-all duration-300 ${
              isBad ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]" : "bg-red-900/40"
            }`}
          />
          <div
            className={`w-10 h-10 rounded-full transition-all duration-300 ${
              isFair
                ? "bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)]"
                : "bg-yellow-900/40"
            }`}
          />
          <div
            className={`w-10 h-10 rounded-full transition-all duration-300 ${
              isGood
                ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]"
                : "bg-green-900/40"
            }`}
          />
        </div>

        <div className="flex-1">
          <div className={`text-2xl font-bold mb-1 ${labelColor}`}>{label}</div>
          <div className="text-gray-400 text-sm leading-relaxed">
            {analysis.reason}
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-5">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>구매 점수</span>
          <span className={`font-bold ${labelColor}`}>
            {analysis.score} / 100
          </span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isGood
                ? "bg-gradient-to-r from-green-600 to-green-400"
                : isFair
                  ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
                  : "bg-gradient-to-r from-red-600 to-red-400"
            }`}
            style={{ width: `${analysis.score}%` }}
          />
        </div>
      </div>

      {/* Savings summary */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-gray-800 rounded-xl p-3 border border-gray-600">
          <div className="text-gray-400 text-xs mb-1">신제품 대비 절약</div>
          <div
            className={`text-xl font-bold ${analysis.savingsVsNew > 30 ? "text-green-400" : analysis.savingsVsNew > 15 ? "text-yellow-400" : "text-red-400"}`}
          >
            {analysis.savingsVsNew}%
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 border border-gray-600">
          <div className="text-gray-400 text-xs mb-1">평균 시세 대비</div>
          <div
            className={`text-xl font-bold ${analysis.savingsVsAvg >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {analysis.savingsVsAvg >= 0 ? "-" : "+"}
            {Math.abs(analysis.savingsVsAvg)}%
          </div>
        </div>
      </div>
    </div>
  );
}
