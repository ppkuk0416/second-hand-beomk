import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { TrendingDown, ShieldCheck, Zap, Brain, BarChart2 } from "lucide-react";

const EXAMPLE_SEARCHES = [
  "커클랜드 드라이버 10.5도",
  "갤럭시 S24 울트라",
  "아이폰 15 프로",
  "맥북 프로 M3",
  "다이슨 V15",
  "소니 WH-1000XM5",
  "에어팟 프로 2세대",
  "닌텐도 스위치 OLED",
  "LG 그램 16",
  "발뮤다 토스터",
];

const HOW_IT_WORKS = [
  {
    icon: <Zap size={20} className="text-orange-400" />,
    title: "실시간 수집",
    desc: "번개장터·중고나라 API를 통해 지금 올라온 매물을 즉시 수집합니다",
  },
  {
    icon: <Brain size={20} className="text-purple-400" />,
    title: "AI 분석",
    desc: "Claude가 오타·약어도 파악해 정확한 제품을 찾고 시세를 분석합니다",
  },
  {
    icon: <BarChart2 size={20} className="text-blue-400" />,
    title: "구매 판단",
    desc: "신호등(빨강·주황·초록)으로 지금 사는 게 맞는지 알려드립니다",
  },
];

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
            당근 · 번개장터 · 중고나라 통합 비교
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/40 rounded-full px-4 py-1.5 text-blue-400 text-sm mb-6">
          <ShieldCheck size={14} />
          어떤 제품이든 — 실시간 AI 분석
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
          중고 구매, 지금 사도 될까요?
          <br />
          <span className="text-blue-400">신호등</span>이 알려드립니다
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          제품명을 입력하면 AI가 실시간으로 중고 플랫폼을 분석해
          <br />
          지금 구매가 좋은 딜인지 바로 판단해드립니다
        </p>

        <div className="max-w-xl mx-auto mb-8">
          <SearchBar large />
        </div>

        {/* 예시 검색어 */}
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_SEARCHES.map((s) => (
            <Link
              key={s}
              href={`/search?q=${encodeURIComponent(s)}`}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-3 py-1.5 rounded-full border border-gray-700 hover:border-gray-500 transition-all"
            >
              {s}
            </Link>
          ))}
        </div>
      </section>

      {/* 작동 방식 */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.title}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <div className="text-white font-semibold mb-1">{item.title}</div>
              <div className="text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* 플랫폼 표시 */}
        <div className="mt-6 bg-gray-900 border border-gray-700 rounded-2xl p-5">
          <div className="text-gray-400 text-xs mb-3 text-center">
            실시간 수집 플랫폼
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { name: "번개장터", color: "#FF3D00", note: "API 직접 연동" },
              { name: "중고나라", color: "#2DB400", note: "API 직접 연동" },
              { name: "당근마켓", color: "#FF6F0F", note: "AI 추정" },
              { name: "헬로마켓", color: "#1A73E8", note: "AI 추정" },
            ].map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="text-white text-sm font-medium">
                    {p.name}
                  </span>
                </div>
                <span className="text-gray-600 text-xs">{p.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
