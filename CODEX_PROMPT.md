# 중고비교 (Second-Hand Market Comparison Tool) — Codex 작업 프롬프트

## 프로젝트 개요

한국 중고 거래 플랫폼(번개장터·중고나라·당근마켓·헬로마켓)의 실시간 매물을 수집하고,
AI(Claude)가 제품을 파악해 **구매 적합도 신호등(빨강·주황·초록)**으로 판단해주는 Next.js 웹 앱.

사용자가 어떤 제품명을 입력하든(오타·약어 포함) AI가 파악해서 분석한다.
제품을 사전 등록하는 방식이 아닌, 검색할 때마다 실시간으로 크롤링 + AI 분석.

---

## 레포지토리

```
github: ppkuk0416/second-hand-beomk
branch: claude/used-product-comparison-r2LsH
```

---

## 기술 스택

```
Framework:   Next.js 16.2.6 (App Router, TypeScript)
Styling:     Tailwind CSS v4
AI:          @anthropic-ai/sdk (Claude Sonnet / Haiku)
Charts:      Recharts
Icons:       lucide-react
Node:        18+
```

---

## 현재 파일 구조

```
src/
├── app/
│   ├── page.tsx                    # 홈 (검색바 + 예시 검색어)
│   ├── search/page.tsx             # 검색 결과 (client component, AI 분석 호출)
│   ├── product/[id]/page.tsx       # 예시 제품 상세 (mock data 기반, 참고용)
│   ├── api/
│   │   ├── analyze/route.ts        # GET /api/analyze?q= → analyzeProduct() 호출
│   │   └── search/route.ts         # (구버전, 미사용)
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── AnalysisResult.tsx          # AI 분석 결과 전체 렌더링
│   ├── TrafficLight.tsx            # 신호등 + 점수 + 이유
│   ├── PriceComparison.tsx         # 플랫폼별 가격 비교 카드
│   ├── PriceHistoryChart.tsx       # 1년 시세 꺾은선 차트 (Recharts)
│   ├── SpecsTable.tsx              # 제품 스펙 테이블
│   ├── ReviewsSection.tsx          # 후기 목록
│   ├── ImageGallery.tsx            # 이미지 슬라이더
│   ├── SearchBar.tsx               # 검색 입력창
│   └── SignalBadge.tsx             # good/fair/bad 인라인 배지
└── lib/
    ├── analyze.ts                  # 핵심 분석 엔진 (크롤링 + Claude 합성)
    ├── types.ts                    # Product, PriceHistory 등 타입
    └── mockData.ts                 # 예시 제품 데이터 (홈 화면용)
```

---

## 핵심 파일 상세

### `src/lib/analyze.ts` — 분석 엔진

```typescript
export interface AnalysisResult {
  found: boolean;
  name: string;
  brand: string;
  category: string;
  imageSearchQuery: string;    // Unsplash 이미지 검색용 영어 쿼리
  releaseDate: string;         // "YYYY-MM"
  releasePrice: number;
  currentNewPrice: number;
  avgUsedPrice: number;
  specs: { name: string; value: string }[];
  platforms: PlatformData[];
  priceHistory: { date: string; avgUsedPrice: number; platform: string }[];
  reviews: { author: string; rating: number; date: string; content: string; source: string }[];
  dealAnalysis: {
    signal: "good" | "fair" | "bad";
    score: number;           // 0-100
    reason: string;
    savingsVsNew: number;    // 신제품가 대비 절약 %
    savingsVsAvg: number;    // 플랫폼 평균 대비 차이 %
  };
  dataSource: "real" | "ai-knowledge";
  disclaimer: string;
}
```

**analyzeProduct(query) 흐름:**
1. 번개장터 공개 API 호출 (실패해도 계속):
   `GET https://api.bunjang.co.kr/api/1/find_v2.json?q={query}&n=30&stat_device=w`
2. 중고나라 API 호출 (실패해도 계속):
   `GET https://api.joongna.com/v1/articles/search?keyword={query}&size=30`
3. 수집된 실제 데이터를 컨텍스트로 Claude에게 전달
4. Claude(claude-sonnet-4-6)가 제품 파악 + 전체 분석 JSON 반환
5. 실데이터 없으면 Claude의 지식으로 추정

### 번개장터 API 응답 형식 (참고용)
```json
{
  "list": [
    {
      "pid": "12345678",
      "name": "커클랜드 시그니쳐 드라이버",
      "price": 95000,
      "location": "서울 마포구",
      "image": "https://media.bunjang.co.kr/...",
      "update_time": 1700000000
    }
  ]
}
```

### 번개장터 상품 상세 API
```
GET https://api.bunjang.co.kr/api/1/product/{pid}/detail_info.json?version=4
```

---

## 현재 작동 방식

```
사용자 검색
    ↓
/search?q=커클랜드드라이버
    ↓ (client component)
fetch("/api/analyze?q=...")
    ↓
analyzeProduct(query)
    ├── 번개장터 API 실시간 호출
    ├── 중고나라 API 실시간 호출
    └── Claude에 합성 요청
         ↓
AnalysisResult JSON
    ↓
<AnalysisResultView /> 렌더링
    ├── 이미지 (Unsplash 키워드 검색)
    ├── 가격 3단 비교 (출시가/현재신제품가/중고평균)
    ├── <TrafficLight /> 신호등
    ├── <PriceComparison /> 플랫폼별 비교
    ├── <PriceHistoryChart /> 1년 트렌드
    ├── <SpecsTable /> 스펙
    └── <ReviewsSection /> 후기
```

---

## 환경 변수

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...       # 필수: Claude API
KAKAO_REST_API_KEY=...             # 선택: 지도 기능 구현 시
```

---

## 미구현 기능 (우선순위 순)

아래 기능들이 부족하다. 우선순위 순으로 구현해야 한다.

---

### [P1] 당근마켓 실시간 크롤링

**배경:** 번개장터는 공개 REST API가 있어서 fetch()로 바로 됨.
당근마켓은 공개 API가 없어서 HTML 파싱이 필요함.

**구현 목표:**
- `src/lib/crawlers/daangn.ts` 파일 생성
- 당근마켓 검색 페이지 HTML에서 가격 목록 추출
- 실패 시 null 반환 (graceful degradation)

**참고 URL:**
```
https://www.daangn.com/search/{query}
https://www.daangn.com/search/{query}?in=전국
```

**추출 대상:** 제목, 가격, 지역, 올린 시간, 링크

---

### [P1] 번개장터 상세 정보 수집 강화

**현재:** 검색 목록(pid, name, price, location)만 수집
**개선:** 각 pid의 상세 API도 호출해서 설명·이미지·조회수까지 수집

```typescript
// 상세 정보 API
GET https://api.bunjang.co.kr/api/1/product/{pid}/detail_info.json?version=4

// 응답에서 추출:
item_info.description_for_detail  // 상품 설명
item_info.product_image           // 이미지 URL
item_info.num_item_view           // 조회수
item_info.status                  // 거래 상태
```

---

### [P2] 가격 이력 실제 데이터 수집 및 저장

**현재 문제:** `priceHistory`가 generatePriceHistory()로 수학적으로 생성된 가짜 곡선임.
실제 데이터가 없어서 "1년 트렌드"가 의미 없음.

**구현 목표:**
- SQLite 또는 JSON 파일 기반 로컬 가격 이력 저장소
- 동일 제품을 재검색할 때 이전 가격 데이터와 비교
- `src/lib/priceStore.ts` 생성

```typescript
// 저장 구조
interface PriceRecord {
  queryHash: string;      // 검색어 해시 (정규화)
  productName: string;
  timestamp: number;
  bunjangAvg: number;
  bunjangCount: number;
  joonggnaAvg: number;
  daanggnAvg: number;
  overallAvg: number;
}

// API
savePriceRecord(record: PriceRecord): void
getPriceHistory(queryHash: string, days: number): PriceRecord[]
```

**저장 방식:** `data/price-history.json` (프로덕션에서는 DB로 교체)

---

### [P2] 가격 알림 등록 기능

**현재:** 없음
**목표:** "이 제품 X만원 이하로 올라오면 알려줘" 기능

**구현 목표:**
- `/api/alerts` POST 엔드포인트
- 알림 목록 저장 (`data/alerts.json`)
- 주기적 체크 (Next.js Route Handler + cron 또는 수동 폴링)
- 이메일 발송 (nodemailer 또는 Resend API)

**UI 위치:** 검색 결과 하단에 "가격 알림 설정" 버튼 추가

```typescript
interface PriceAlert {
  id: string;
  query: string;
  productName: string;
  targetPrice: number;
  email: string;
  createdAt: number;
  triggered: boolean;
}
```

---

### [P3] 지역별 매물 지도 시각화

**배경:** 참고 레포(FleaFully)가 카카오맵으로 지역별 매물 수를 시각화함.
당근마켓은 location 필드에 지역명이 있고, 번개장터도 location 필드 존재.

**구현 목표:**
- 검색 결과 하단에 카카오맵 지도 컴포넌트 추가
- 매물이 있는 지역을 마커로 표시
- 마커 클릭 시 해당 매물 목록 표시

**카카오맵 SDK:**
```html
<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey={KAKAO_REST_API_KEY}"></script>
```

**파일:** `src/components/ListingMap.tsx`

---

### [P3] 판매자 모드

**현재:** 구매자 관점만 (얼마에 사야 해?)
**추가:** 판매자 관점 (얼마에 팔아야 해?)

**구현:**
- 검색 결과에 "판매 시 추천가" 섹션 추가
- "지금 이 가격에 팔면 빠름 / 적정 / 늦게 팔림" 판단
- 경쟁 매물 수 기준으로 "매물 포화도" 표시

---

### [P4] 검색 기록 및 즐겨찾기

**구현:**
- localStorage에 최근 검색어 5개 저장
- 홈 화면에 "최근 검색" 표시
- 특정 제품 즐겨찾기 (localStorage)

---

## 구현 시 주의사항

### 크롤링 관련
- 모든 외부 fetch는 `AbortSignal.timeout(5000)` 사용 (타임아웃 필수)
- 실패해도 앱이 죽으면 안 됨 — try/catch로 null 반환
- User-Agent 헤더 필수: `"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"`
- 번개장터 API는 인증 불필요, 바로 호출 가능

### Claude API 사용
- 모델: `claude-sonnet-4-6` (분석), `claude-haiku-4-5-20251001` (빠른 분류)
- 프롬프트 캐싱 활용 권장 (system prompt에 `cache_control` 추가)
- JSON만 반환하도록 system prompt에 명시
- JSON 파싱 실패 대비 regex fallback: `text.match(/\{[\s\S]*\}/)`

### Next.js App Router
- 크롤링/AI 호출은 Server Component 또는 Route Handler에서만
- 로딩 UI가 필요한 페이지는 `"use client"` + `useEffect`
- `next.config.ts`에 외부 이미지 도메인 등록 필요

### 타입 안전성
- `analyzeProduct()`의 반환값은 항상 `AnalysisResult` 완전한 객체
- 플랫폼 데이터 없으면 빈 배열 `[]`, 숫자 없으면 `0` (null/undefined 없게)
- Claude 응답 파싱 후 반드시 타입 검증

---

## 당장 시작하기 좋은 작업 순서

1. **당근마켓 크롤러** (`src/lib/crawlers/daangn.ts`)
   - URL fetch → cheerio로 HTML 파싱 → 가격 목록 반환
   - `analyzeProduct()`의 tryBunjang/tryJoonggonara 옆에 tryDaangn() 추가

2. **번개장터 상세 API 연동** (`analyze.ts` 수정)
   - 검색 결과 상위 5개 pid에 대해 detail API 호출
   - 이미지 URL, 상품 설명을 Claude 컨텍스트에 추가

3. **가격 이력 저장** (`src/lib/priceStore.ts` + `data/` 디렉토리)
   - 검색할 때마다 현재 가격 스냅샷 저장
   - PriceHistoryChart에 실제 데이터 연결

4. **가격 알림** (`/api/alerts` + `src/components/AlertForm.tsx`)
   - 이메일 입력 + 목표가 입력 폼
   - `/api/alerts/check` 엔드포인트로 수동 체크

5. **카카오맵 지도** (`src/components/ListingMap.tsx`)
   - 번개장터 location 필드 파싱
   - 카카오맵 마커 표시

---

## 실행 방법

```bash
git clone https://github.com/ppkuk0416/second-hand-beomk
cd second-hand-beomk
git checkout claude/used-product-comparison-r2LsH

npm install

# .env.local 생성
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

npm run dev
# → http://localhost:3000
```

검색창에 아무 제품명이나 입력하면 AI가 실시간 분석.
예: "커클랜드 드라이버", "갤럭시 S24", "다이슨 청소기", "에어팟 프로"
