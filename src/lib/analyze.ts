import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export interface PlatformData {
  platform: "당근마켓" | "번개장터" | "중고나라" | "헬로마켓";
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  count: number;
  url: string;
  color: string;
}

export interface AnalysisResult {
  found: boolean;
  name: string;
  brand: string;
  category: string;
  imageSearchQuery: string;
  releaseDate: string;
  releasePrice: number;
  currentNewPrice: number;
  avgUsedPrice: number;
  specs: { name: string; value: string }[];
  platforms: PlatformData[];
  priceHistory: { date: string; avgUsedPrice: number; platform: string }[];
  reviews: { author: string; rating: number; date: string; content: string; source: string }[];
  dealAnalysis: {
    signal: "good" | "fair" | "bad";
    score: number;
    reason: string;
    savingsVsNew: number;
    savingsVsAvg: number;
  };
  dataSource: "real" | "ai-knowledge";
  disclaimer: string;
}

// 번개장터 실시간 검색 시도
async function tryBunjang(query: string) {
  try {
    const res = await fetch(
      `https://api.bunjang.co.kr/api/1/find_v2.json?q=${encodeURIComponent(query)}&n=30&stat_device=w`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(4000),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.list ?? null;
  } catch {
    return null;
  }
}

// 중고나라 실시간 검색 시도
async function tryJoonggonara(query: string) {
  try {
    const res = await fetch(
      `https://api.joongna.com/v1/articles/search?keyword=${encodeURIComponent(query)}&size=30`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(4000),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.content ?? null;
  } catch {
    return null;
  }
}

function generatePriceHistory(
  startPrice: number,
  endPrice: number
): { date: string; avgUsedPrice: number; platform: string }[] {
  const history = [];
  const now = new Date();
  for (let i = 12; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const progress = (12 - i) / 12;
    const noise = (Math.random() - 0.5) * startPrice * 0.05;
    const price = Math.round(
      startPrice - (startPrice - endPrice) * progress + noise
    );
    history.push({ date: date.toISOString().split("T")[0], avgUsedPrice: price, platform: "전체 평균" });
  }
  return history;
}

const PLATFORM_META: Omit<PlatformData, "avgPrice" | "minPrice" | "maxPrice" | "count">[] = [
  { platform: "당근마켓", url: "https://www.daangn.com", color: "#FF6F0F" },
  { platform: "번개장터", url: "https://www.bunjang.co.kr", color: "#FF3D00" },
  { platform: "중고나라", url: "https://cafe.naver.com/joonggonara", color: "#2DB400" },
  { platform: "헬로마켓", url: "https://www.hellomarket.com", color: "#1A73E8" },
];

export async function analyzeProduct(query: string): Promise<AnalysisResult> {
  if (!query.trim()) {
    return {
      found: false,
      name: "",
      brand: "",
      category: "",
      imageSearchQuery: "",
      releaseDate: "",
      releasePrice: 0,
      currentNewPrice: 0,
      avgUsedPrice: 0,
      specs: [],
      platforms: [],
      priceHistory: [],
      reviews: [],
      dealAnalysis: { signal: "fair", score: 50, reason: "", savingsVsNew: 0, savingsVsAvg: 0 },
      dataSource: "ai-knowledge",
      disclaimer: "",
    };
  }

  // 실시간 플랫폼 데이터 수집 시도 (병렬)
  const [bunjangRaw, joonggnaRaw] = await Promise.all([
    tryBunjang(query),
    tryJoonggonara(query),
  ]);

  const hasRealData = !!(
    (bunjangRaw && bunjangRaw.length > 0) ||
    (joonggnaRaw && joonggnaRaw.length > 0)
  );

  // 실시간 데이터 요약
  let realDataContext = "";
  if (bunjangRaw && bunjangRaw.length > 0) {
    const prices = bunjangRaw
      .map((item: { price?: number; name?: string }) => item.price)
      .filter((p: number) => p > 0)
      .slice(0, 20);
    const names = bunjangRaw
      .slice(0, 5)
      .map((item: { name?: string }) => item.name)
      .join(", ");
    if (prices.length > 0) {
      const avg = Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      realDataContext += `\n번개장터 실시간 데이터 (${prices.length}개 매물):
- 평균가: ${avg.toLocaleString()}원
- 최저가: ${min.toLocaleString()}원
- 최고가: ${max.toLocaleString()}원
- 매물 예시: ${names}`;
    }
  }
  if (joonggnaRaw && joonggnaRaw.length > 0) {
    const prices = joonggnaRaw
      .map((item: { price?: number }) => item.price)
      .filter((p: number) => p > 0)
      .slice(0, 20);
    if (prices.length > 0) {
      const avg = Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length);
      realDataContext += `\n중고나라 실시간 데이터 (${prices.length}개 매물):
- 평균가: ${avg.toLocaleString()}원`;
    }
  }

  // Claude가 제품 파악 + 전체 분석
  const systemPrompt = `당신은 한국 중고 시장 전문 분석가입니다.
사용자가 어떤 제품명을 입력하든 (오타, 약어, 부분 입력 포함) 정확한 제품을 파악하고 분석합니다.

실시간 플랫폼 데이터가 있으면 그것을 우선 사용하고, 없으면 최신 시장 지식으로 추정합니다.
모든 가격은 원화(KRW), 한국 시장 기준입니다.

반드시 아래 JSON만 반환하세요 (마크다운 코드블록 없이):
{
  "found": true,
  "name": "정확한 제품 전체명",
  "brand": "브랜드명",
  "category": "카테고리 (예: 스마트폰, 노트북, 골프 드라이버, 청소기 등)",
  "imageSearchQuery": "영어로 구글 이미지 검색에 쓸 쿼리",
  "releaseDate": "YYYY-MM",
  "releasePrice": 출시가격(숫자),
  "currentNewPrice": 현재신제품가격(숫자),
  "avgUsedPrice": 중고평균가격(숫자),
  "specs": [{"name": "스펙항목", "value": "값"}],
  "platforms": [
    {"platform": "당근마켓", "avgPrice": 숫자, "minPrice": 숫자, "maxPrice": 숫자, "count": 숫자},
    {"platform": "번개장터", "avgPrice": 숫자, "minPrice": 숫자, "maxPrice": 숫자, "count": 숫자},
    {"platform": "중고나라", "avgPrice": 숫자, "minPrice": 숫자, "maxPrice": 숫자, "count": 숫자},
    {"platform": "헬로마켓", "avgPrice": 숫자, "minPrice": 숫자, "maxPrice": 숫자, "count": 숫자}
  ],
  "reviews": [
    {"author": "닉네임", "rating": 1-5점, "date": "YYYY-MM-DD", "content": "후기내용", "source": "출처"}
  ],
  "dealAnalysis": {
    "signal": "good 또는 fair 또는 bad",
    "score": 0-100,
    "reason": "구매 판단 이유 (2-3문장)",
    "savingsVsNew": 신제품대비절약퍼센트(숫자),
    "savingsVsAvg": 플랫폼평균대비차이퍼센트(숫자)
  },
  "dataSource": "${hasRealData ? "real" : "ai-knowledge"}",
  "disclaimer": "${hasRealData ? "실시간 플랫폼 데이터 기반 분석입니다." : "AI 지식 기반 추정 데이터입니다. 실제 거래가와 차이가 있을 수 있습니다."}"
}

검색어가 너무 모호해서 제품을 특정할 수 없을 때만 "found": false로 반환.`;

  const userMessage = `검색어: "${query}"
${realDataContext || "\n실시간 데이터 없음 - AI 지식으로 분석해주세요."}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text.trim() : "{}";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const parsed: Partial<AnalysisResult> = jsonMatch
    ? JSON.parse(jsonMatch[0])
    : {};

  // platforms에 메타 정보 합치기
  const platforms: PlatformData[] = (parsed.platforms ?? []).map(
    (p: Partial<PlatformData>) => {
      const meta = PLATFORM_META.find((m) => m.platform === p.platform);
      return { ...meta, ...p } as PlatformData;
    }
  );

  const avgUsedPrice = parsed.avgUsedPrice ?? 0;
  const releasePrice = parsed.releasePrice ?? 0;

  return {
    found: parsed.found ?? true,
    name: parsed.name ?? query,
    brand: parsed.brand ?? "",
    category: parsed.category ?? "",
    imageSearchQuery: parsed.imageSearchQuery ?? query,
    releaseDate: parsed.releaseDate ?? "",
    releasePrice,
    currentNewPrice: parsed.currentNewPrice ?? 0,
    avgUsedPrice,
    specs: parsed.specs ?? [],
    platforms,
    priceHistory: generatePriceHistory(releasePrice || avgUsedPrice * 1.5, avgUsedPrice),
    reviews: parsed.reviews ?? [],
    dealAnalysis: parsed.dealAnalysis ?? {
      signal: "fair",
      score: 50,
      reason: "",
      savingsVsNew: 0,
      savingsVsAvg: 0,
    },
    dataSource: parsed.dataSource ?? "ai-knowledge",
    disclaimer: parsed.disclaimer ?? "AI 분석 데이터입니다.",
  };
}
