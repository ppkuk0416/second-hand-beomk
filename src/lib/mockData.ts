import { Product } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "스마트폰",
    imageUrl:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
    ],
    releaseDate: "2024-01-17",
    releasePrice: 1899000,
    currentNewPrice: 1590000,
    avgUsedPrice: 980000,
    specs: [
      { name: "디스플레이", value: '6.8" QHD+ Dynamic AMOLED 2X, 120Hz' },
      { name: "프로세서", value: "Snapdragon 8 Gen 3" },
      { name: "RAM", value: "12GB" },
      { name: "저장공간", value: "256GB / 512GB / 1TB" },
      { name: "카메라", value: "200MP + 12MP + 10MP + 50MP" },
      { name: "배터리", value: "5000mAh, 45W 고속충전" },
      { name: "운영체제", value: "Android 14 (One UI 6.1)" },
      { name: "크기/무게", value: "162.3 × 79 × 8.6mm / 232g" },
      { name: "색상", value: "티타늄 블랙, 그레이, 바이올렛, 옐로우" },
    ],
    reviews: [
      {
        author: "tech_lover",
        rating: 5,
        date: "2024-03-15",
        content:
          "S펜 내장에 카메라 퀄리티 최상. 특히 야간 촬영이 놀랍습니다. 배터리도 하루 종일 거뜬히 버팁니다.",
        source: "네이버 쇼핑",
      },
      {
        author: "power_user_kim",
        rating: 4,
        date: "2024-04-02",
        content:
          "업무용으로 쓰기 최고. 무게가 좀 있지만 그만큼 프리미엄 느낌. AI 기능이 생각보다 유용합니다.",
        source: "쿠팡 리뷰",
      },
      {
        author: "photo_master",
        rating: 5,
        date: "2024-05-10",
        content:
          "200만화소 카메라 진짜 대박. 줌 성능도 아이폰 압도. 다만 가격이 부담스럽긴 해요.",
        source: "네이버 쇼핑",
      },
      {
        author: "daily_user99",
        rating: 3,
        date: "2024-06-20",
        content:
          "성능은 최고지만 너무 무겁고 큽니다. 한 손 조작은 포기해야 해요. 갤럭시 AI는 아직 갈 길이 멉니다.",
        source: "다나와",
      },
    ],
    platforms: [
      {
        platform: "당근마켓",
        price: 950000,
        count: 47,
        avgPrice: 950000,
        minPrice: 820000,
        maxPrice: 1100000,
        url: "https://www.daangn.com",
        color: "#FF6F0F",
      },
      {
        platform: "번개장터",
        price: 980000,
        count: 83,
        avgPrice: 980000,
        minPrice: 850000,
        maxPrice: 1150000,
        url: "https://www.bunjang.co.kr",
        color: "#FF3D00",
      },
      {
        platform: "중고나라",
        price: 1010000,
        count: 62,
        avgPrice: 1010000,
        minPrice: 890000,
        maxPrice: 1200000,
        url: "https://cafe.naver.com/joonggonara",
        color: "#2DB400",
      },
      {
        platform: "헬로마켓",
        price: 990000,
        count: 29,
        avgPrice: 990000,
        minPrice: 860000,
        maxPrice: 1130000,
        url: "https://www.hellomarket.com",
        color: "#1A73E8",
      },
    ],
    priceHistory: generatePriceHistory(1500000, 980000, 12),
    dealAnalysis: {
      signal: "good",
      score: 82,
      reason:
        "출시가 대비 48% 저렴하고 현재 신제품가 대비 38% 절약됩니다. 중고 시세도 안정적이며 매물이 풍부합니다.",
      savingsVsNew: 38,
      savingsVsAvg: 2,
    },
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "스마트폰",
    imageUrl:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
    ],
    releaseDate: "2023-09-22",
    releasePrice: 1550000,
    currentNewPrice: 1350000,
    avgUsedPrice: 1050000,
    specs: [
      { name: "디스플레이", value: '6.1" Super Retina XDR, ProMotion 120Hz' },
      { name: "프로세서", value: "Apple A17 Pro" },
      { name: "RAM", value: "8GB" },
      { name: "저장공간", value: "128GB / 256GB / 512GB / 1TB" },
      { name: "카메라", value: "48MP 메인 + 12MP 울트라 + 12MP 3배줌" },
      { name: "배터리", value: "3274mAh, 27W 고속충전" },
      { name: "운영체제", value: "iOS 17" },
      { name: "재질", value: "티타늄 프레임, 텍스처드 매트 유리" },
      { name: "색상", value: "블랙 티타늄, 화이트, 블루, 내추럴" },
    ],
    reviews: [
      {
        author: "apple_fan_lee",
        rating: 5,
        date: "2023-11-01",
        content:
          "티타늄 소재 변경으로 훨씬 가벼워졌어요. A17 Pro 성능은 두말할 필요 없고. USB-C 전환도 만족.",
        source: "네이버 쇼핑",
      },
      {
        author: "video_creator",
        rating: 5,
        date: "2024-01-15",
        content: "4K ProRes 영상 촬영이 놀랍습니다. 유튜브 촬영용으로 최고.",
        source: "다나와",
      },
    ],
    platforms: [
      {
        platform: "당근마켓",
        price: 1020000,
        count: 89,
        avgPrice: 1020000,
        minPrice: 890000,
        maxPrice: 1200000,
        url: "https://www.daangn.com",
        color: "#FF6F0F",
      },
      {
        platform: "번개장터",
        price: 1060000,
        count: 134,
        avgPrice: 1060000,
        minPrice: 920000,
        maxPrice: 1250000,
        url: "https://www.bunjang.co.kr",
        color: "#FF3D00",
      },
      {
        platform: "중고나라",
        price: 1080000,
        count: 97,
        avgPrice: 1080000,
        minPrice: 940000,
        maxPrice: 1280000,
        url: "https://cafe.naver.com/joonggonara",
        color: "#2DB400",
      },
      {
        platform: "헬로마켓",
        price: 1050000,
        count: 45,
        avgPrice: 1050000,
        minPrice: 910000,
        maxPrice: 1230000,
        url: "https://www.hellomarket.com",
        color: "#1A73E8",
      },
    ],
    priceHistory: generatePriceHistory(1450000, 1050000, 12),
    dealAnalysis: {
      signal: "fair",
      score: 63,
      reason:
        "중고가가 신제품가의 78% 수준으로 절감폭이 크지 않습니다. iPhone 16 출시로 가격이 더 떨어질 가능성이 있습니다.",
      savingsVsNew: 22,
      savingsVsAvg: 3,
    },
  },
  {
    id: "macbook-pro-m3",
    name: "MacBook Pro 14 M3",
    brand: "Apple",
    category: "노트북",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    ],
    releaseDate: "2023-11-07",
    releasePrice: 2290000,
    currentNewPrice: 2190000,
    avgUsedPrice: 1850000,
    specs: [
      { name: "디스플레이", value: '14.2" Liquid Retina XDR, 120Hz' },
      { name: "프로세서", value: "Apple M3 (8코어 CPU, 10코어 GPU)" },
      { name: "RAM", value: "8GB / 16GB 통합 메모리" },
      { name: "저장공간", value: "512GB / 1TB SSD" },
      { name: "배터리", value: "최대 22시간" },
      { name: "포트", value: "Thunderbolt 4 × 3, HDMI, SDXC, MagSafe 3" },
      { name: "무게", value: "1.55kg" },
      { name: "색상", value: "스페이스 블랙, 실버" },
    ],
    reviews: [
      {
        author: "dev_park",
        rating: 5,
        date: "2024-02-10",
        content:
          "개발 작업에 완벽합니다. 배터리 하루 종일 거뜬. M3 칩 성능 압도적이에요.",
        source: "쿠팡",
      },
    ],
    platforms: [
      {
        platform: "당근마켓",
        price: 1780000,
        count: 23,
        avgPrice: 1780000,
        minPrice: 1600000,
        maxPrice: 2000000,
        url: "https://www.daangn.com",
        color: "#FF6F0F",
      },
      {
        platform: "번개장터",
        price: 1850000,
        count: 41,
        avgPrice: 1850000,
        minPrice: 1650000,
        maxPrice: 2050000,
        url: "https://www.bunjang.co.kr",
        color: "#FF3D00",
      },
      {
        platform: "중고나라",
        price: 1900000,
        count: 38,
        avgPrice: 1900000,
        minPrice: 1700000,
        maxPrice: 2100000,
        url: "https://cafe.naver.com/joonggonara",
        color: "#2DB400",
      },
      {
        platform: "헬로마켓",
        price: 1870000,
        count: 18,
        avgPrice: 1870000,
        minPrice: 1680000,
        maxPrice: 2020000,
        url: "https://www.hellomarket.com",
        color: "#1A73E8",
      },
    ],
    priceHistory: generatePriceHistory(2200000, 1850000, 12),
    dealAnalysis: {
      signal: "bad",
      score: 31,
      reason:
        "중고가가 신제품가의 85% 수준으로 거의 새제품과 차이가 없습니다. 신제품 구매를 권장합니다.",
      savingsVsNew: 15,
      savingsVsAvg: -3,
    },
  },
  {
    id: "dyson-v15",
    name: "Dyson V15 Detect",
    brand: "Dyson",
    category: "청소기",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    ],
    releaseDate: "2023-03-01",
    releasePrice: 1090000,
    currentNewPrice: 890000,
    avgUsedPrice: 430000,
    specs: [
      { name: "흡입력", value: "230AW" },
      { name: "배터리", value: "최대 60분 (에코 모드)" },
      { name: "필터", value: "5단계 HEPA 필터링" },
      { name: "레이저 기술", value: "레이저 먼지 감지" },
      { name: "LCD 화면", value: "먼지 입자 수 실시간 표시" },
      { name: "무게", value: "3.1kg" },
      { name: "쓰레기통", value: "0.77L" },
    ],
    reviews: [
      {
        author: "clean_freak",
        rating: 5,
        date: "2023-10-05",
        content:
          "레이저로 먼지 보이니까 더 열심히 청소하게 됩니다. 흡입력 최고.",
        source: "네이버 쇼핑",
      },
      {
        author: "housewife_jung",
        rating: 4,
        date: "2024-01-20",
        content: "무겁긴 하지만 성능은 최고. 배터리 지속시간이 좀 아쉬워요.",
        source: "쿠팡",
      },
    ],
    platforms: [
      {
        platform: "당근마켓",
        price: 410000,
        count: 156,
        avgPrice: 410000,
        minPrice: 300000,
        maxPrice: 550000,
        url: "https://www.daangn.com",
        color: "#FF6F0F",
      },
      {
        platform: "번개장터",
        price: 440000,
        count: 203,
        avgPrice: 440000,
        minPrice: 320000,
        maxPrice: 580000,
        url: "https://www.bunjang.co.kr",
        color: "#FF3D00",
      },
      {
        platform: "중고나라",
        price: 450000,
        count: 178,
        avgPrice: 450000,
        minPrice: 330000,
        maxPrice: 600000,
        url: "https://cafe.naver.com/joonggonara",
        color: "#2DB400",
      },
      {
        platform: "헬로마켓",
        price: 420000,
        count: 89,
        avgPrice: 420000,
        minPrice: 310000,
        maxPrice: 560000,
        url: "https://www.hellomarket.com",
        color: "#1A73E8",
      },
    ],
    priceHistory: generatePriceHistory(900000, 430000, 12),
    dealAnalysis: {
      signal: "good",
      score: 91,
      reason:
        "출시가 대비 60% 이상 저렴합니다. 매물도 풍부하고 가격 안정적. 중고 구매 적극 추천합니다.",
      savingsVsNew: 52,
      savingsVsAvg: 5,
    },
  },
];

function generatePriceHistory(
  startPrice: number,
  endPrice: number,
  months: number
): import("./types").PriceHistory[] {
  const history: import("./types").PriceHistory[] = [];
  const now = new Date();

  for (let i = months; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);

    const progress = (months - i) / months;
    const noise = (Math.random() - 0.5) * 50000;
    const price = Math.round(
      startPrice - (startPrice - endPrice) * progress + noise
    );

    history.push({
      date: date.toISOString().split("T")[0],
      avgUsedPrice: price,
      platform: "전체 평균",
    });
  }

  return history;
}

export function searchProducts(query: string): Product[] {
  if (!query.trim()) return MOCK_PRODUCTS;
  const lower = query.toLowerCase();
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.brand.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower)
  );
}

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}
