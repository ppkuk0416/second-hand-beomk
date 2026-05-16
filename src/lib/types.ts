export interface ProductSpec {
  name: string;
  value: string;
}

export interface PlatformListing {
  platform: "당근마켓" | "번개장터" | "중고나라" | "헬로마켓";
  price: number;
  count: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  url: string;
  color: string;
}

export interface PriceHistory {
  date: string;
  avgUsedPrice: number;
  platform: string;
}

export interface Review {
  author: string;
  rating: number;
  date: string;
  content: string;
  source: string;
}

export type DealSignal = "good" | "fair" | "bad";

export interface DealAnalysis {
  signal: DealSignal;
  score: number;
  reason: string;
  savingsVsNew: number;
  savingsVsAvg: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  images: string[];
  releaseDate: string;
  releasePrice: number;
  currentNewPrice: number;
  avgUsedPrice: number;
  specs: ProductSpec[];
  reviews: Review[];
  platforms: PlatformListing[];
  priceHistory: PriceHistory[];
  dealAnalysis: DealAnalysis;
}
