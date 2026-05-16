"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { PriceHistory } from "@/lib/types";

interface PriceHistoryChartProps {
  history: PriceHistory[];
  currentNewPrice: number;
  releasePrice: number;
}

function formatPrice(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 10000) return `${Math.round(value / 10000)}만`;
  return value.toLocaleString();
}

interface TooltipPayload {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm">
        <p className="text-gray-400">{label}</p>
        <p className="text-blue-400 font-bold">
          {payload[0].value.toLocaleString("ko-KR")}원
        </p>
      </div>
    );
  }
  return null;
}

export function PriceHistoryChart({
  history,
  currentNewPrice,
  releasePrice,
}: PriceHistoryChartProps) {
  const data = history.map((h) => ({
    date: h.date.slice(5),
    price: h.avgUsedPrice,
  }));

  const minVal = Math.min(...history.map((h) => h.avgUsedPrice)) * 0.9;
  const maxVal = Math.max(releasePrice, currentNewPrice) * 1.05;

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white">
          중고 시세 1년 트렌드
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-blue-400" />
            <span className="text-gray-400">중고 시세</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-gray-500 border-dashed border-t" />
            <span className="text-gray-400">신제품가</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            axisLine={{ stroke: "#374151" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatPrice}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[minVal, maxVal]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={currentNewPrice}
            stroke="#6B7280"
            strokeDasharray="4 4"
            label={{
              value: "신제품",
              fill: "#6B7280",
              fontSize: 11,
              position: "right",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#60A5FA"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "#60A5FA" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
