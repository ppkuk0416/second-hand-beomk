"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { AnalysisResultView } from "@/components/AnalysisResult";
import { AnalysisResult } from "@/lib/analyze";
import { TrendingDown, Loader2, AlertCircle } from "lucide-react";
import { Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState("");

  const analyze = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    // 단계별 메시지
    setStep("번개장터 실시간 매물 수집 중...");
    await new Promise((r) => setTimeout(r, 800));
    setStep("중고나라 가격 데이터 수집 중...");
    await new Promise((r) => setTimeout(r, 600));
    setStep("AI가 제품을 파악하고 분석 중...");

    try {
      const res = await fetch(`/api/analyze?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("분석 실패");
      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch {
      setError("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
      setStep("");
    }
  }, []);

  useEffect(() => {
    if (query) analyze(query);
  }, [query, analyze]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <TrendingDown size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg hidden sm:block">
              중고비교
            </span>
          </Link>
          <div className="flex-1 max-w-xl">
            <SearchBar defaultValue={query} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 로딩 */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            {/* 애니메이션 신호등 */}
            <div className="flex flex-col items-center gap-2 bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <div
                className={`w-10 h-10 rounded-full transition-all duration-500 ${
                  step.includes("AI")
                    ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                    : "bg-red-900/30"
                }`}
              />
              <div
                className={`w-10 h-10 rounded-full transition-all duration-500 ${
                  step.includes("중고나라")
                    ? "bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]"
                    : "bg-yellow-900/30"
                }`}
              />
              <div
                className={`w-10 h-10 rounded-full transition-all duration-500 ${
                  step.includes("번개장터")
                    ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                    : "bg-green-900/30"
                }`}
              />
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 text-white font-medium mb-1">
                <Loader2 size={16} className="animate-spin text-blue-400" />
                {step}
              </div>
              <div className="text-gray-500 text-sm">
                &ldquo;{query}&rdquo; 분석 중
              </div>
            </div>
          </div>
        )}

        {/* 에러 */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertCircle size={40} className="text-red-400 opacity-60" />
            <p className="text-gray-400">{error}</p>
            <button
              onClick={() => analyze(query)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 결과 */}
        {result && !loading && (
          <>
            <div className="text-gray-400 text-sm mb-6">
              <span className="text-white font-medium">&ldquo;{query}&rdquo;</span> 분석 결과
            </div>
            <AnalysisResultView result={result} query={query} />
          </>
        )}

        {/* 초기 상태 */}
        {!query && !loading && !result && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <p>검색어를 입력하면 AI가 실시간으로 분석합니다</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
