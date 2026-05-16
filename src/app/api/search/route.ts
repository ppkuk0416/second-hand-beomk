import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { MOCK_PRODUCTS } from "@/lib/mockData";

const client = new Anthropic();

// 토큰 기반 퍼지 검색 (AI 실패 시 fallback)
function fuzzySearch(query: string) {
  const tokens = query
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0);

  if (tokens.length === 0) return MOCK_PRODUCTS;

  const scored = MOCK_PRODUCTS.map((p) => {
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
      // 부분 매칭 (2자 이상 겹치면 점수)
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

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.product);
}

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query?.trim()) {
    return NextResponse.json({ products: MOCK_PRODUCTS, method: "all" });
  }

  // ANTHROPIC_API_KEY가 없으면 퍼지 검색으로만 운영
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      products: fuzzySearch(query),
      method: "fuzzy",
      message: null,
    });
  }

  try {
    const productList = MOCK_PRODUCTS.map(
      (p) => `- id: "${p.id}", 이름: "${p.name}", 브랜드: "${p.brand}", 카테고리: "${p.category}"`
    ).join("\n");

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: `당신은 중고거래 플랫폼의 AI 검색 어시스턴트입니다.
사용자가 중고 제품을 검색할 때 오타, 약어, 불완전한 입력이 있어도 의도를 파악해서 관련 제품을 찾아주세요.

아래 제품 목록 중에서 검색어와 관련있는 제품의 id를 배열로 반환하세요.
관련도 순서로 정렬하고, 없으면 빈 배열 반환.
반드시 JSON 형식으로만 답하세요: {"ids": ["id1", "id2"], "message": "검색 결과 안내 (없으면 null)"}

제품 목록:
${productList}`,
      messages: [{ role: "user", content: `검색어: "${query}"` }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "{}";
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}");

    const ids: string[] = parsed.ids ?? [];
    const aiProducts = ids
      .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
      .filter(Boolean) as typeof MOCK_PRODUCTS;

    // AI 결과가 없으면 퍼지 검색으로 보완
    const results =
      aiProducts.length > 0 ? aiProducts : fuzzySearch(query);

    return NextResponse.json({
      products: results,
      method: aiProducts.length > 0 ? "ai" : "fuzzy",
      message: parsed.message ?? null,
    });
  } catch {
    // API 오류 시 퍼지 검색 fallback
    return NextResponse.json({
      products: fuzzySearch(query),
      method: "fuzzy",
      message: null,
    });
  }
}
