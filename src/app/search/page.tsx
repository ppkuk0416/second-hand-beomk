import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { SignalBadge } from "@/components/SignalBadge";
import { MOCK_PRODUCTS, searchProducts } from "@/lib/mockData";
import { TrendingDown, SearchX, Sparkles, Zap } from "lucide-react";
import { Product } from "@/lib/types";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

async function aiSearch(
  query: string
): Promise<{ products: Product[]; method: string; message: string | null }> {
  // 서버 컴포넌트에서 직접 AI 검색 로직 실행
  const { MOCK_PRODUCTS: products } = await import("@/lib/mockData");

  if (!query.trim()) return { products, method: "all", message: null };

  // 토큰 기반 퍼지 검색
  const tokens = query
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0);

  if (tokens.length === 0)
    return { products, method: "all", message: null };

  const scored = products.map((p) => {
    const haystack = [
      p.name,
      p.brand,
      p.category,
      ...p.specs.map((s) => s.value),
    ]
      .join(" ")
      .toLowerCase();

    let score = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) score += 2;
      else if (token.length >= 2) {
        for (let i = 0; i <= token.length - 2; i++) {
          if (haystack.includes(token.slice(i, i + 2))) {
            score += 0.5;
            break;
          }
        }
      }
    }
    return { product: p, score };
  });

  const fuzzyResults = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.product);

  // Anthropic API를 서버에서 직접 호출
  if (!process.env.ANTHROPIC_API_KEY) {
    return { products: fuzzyResults, method: "fuzzy", message: null };
  }

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic();

    const productList = products
      .map(
        (p) =>
          `- id: "${p.id}", 이름: "${p.name}", 브랜드: "${p.brand}", 카테고리: "${p.category}"`
      )
      .join("\n");

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: `당신은 중고거래 플랫폼의 AI 검색 어시스턴트입니다.
사용자가 중고 제품을 검색할 때 오타, 약어, 불완전한 입력이 있어도 의도를 파악해서 관련 제품을 찾아주세요.
예: "커클랜드 드라이버" → 골프 드라이버 / "아이폰15" → iPhone 15 Pro / "소니 헤드폰" → Sony WH-1000XM5

아래 제품 목록 중에서 검색어와 관련있는 제품의 id를 배열로 반환하세요.
관련도 순서로 정렬하고, 없으면 빈 배열 반환.
반드시 JSON만 반환: {"ids": ["id1", "id2"], "message": "검색 도움말 (불필요하면 null)"}

제품 목록:
${productList}`,
      messages: [{ role: "user", content: `검색어: "${query}"` }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "{}";
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}");

    const ids: string[] = parsed.ids ?? [];
    const aiProducts = ids
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as Product[];

    const results = aiProducts.length > 0 ? aiProducts : fuzzyResults;

    return {
      products: results,
      method: aiProducts.length > 0 ? "ai" : "fuzzy",
      message: parsed.message ?? null,
    };
  } catch {
    return { products: fuzzyResults, method: "fuzzy", message: null };
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { products: results, method, message } = await aiSearch(q);

  return (
    <div className="min-h-screen bg-gray-950">
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
            <SearchBar defaultValue={q} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 검색 결과 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-400 text-sm">
            <span className="text-white font-medium">&ldquo;{q}&rdquo;</span>{" "}
            검색 결과 —{" "}
            <span className="text-white font-medium">{results.length}개</span>{" "}
            제품
          </div>
          {method === "ai" && (
            <div className="flex items-center gap-1.5 text-xs bg-purple-900/40 border border-purple-700/50 text-purple-300 px-3 py-1 rounded-full">
              <Sparkles size={12} />
              AI 검색
            </div>
          )}
          {method === "fuzzy" && results.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs bg-blue-900/40 border border-blue-700/50 text-blue-300 px-3 py-1 rounded-full">
              <Zap size={12} />
              유사 검색
            </div>
          )}
        </div>

        {/* AI 안내 메시지 */}
        {message && (
          <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3 text-sm text-purple-300 mb-5 flex items-start gap-2">
            <Sparkles size={14} className="shrink-0 mt-0.5" />
            {message}
          </div>
        )}

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-gray-500">
            <SearchX size={48} className="mb-4 opacity-40" />
            <p className="text-lg font-medium text-gray-400 mb-1">
              검색 결과가 없습니다
            </p>
            <p className="text-sm mb-6 text-center">
              다른 검색어를 입력해보세요
              <br />
              <span className="text-gray-600">
                예: &quot;커클랜드&quot;, &quot;아이폰&quot;, &quot;노트북&quot;
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "커클랜드 드라이버",
                "갤럭시",
                "아이폰",
                "맥북",
                "다이슨",
                "소니 헤드폰",
              ].map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
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
                        <div className="text-green-400 font-bold">
                          -{savings}%
                        </div>
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
