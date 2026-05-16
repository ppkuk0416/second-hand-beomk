"use client";

import { ProductSpec } from "@/lib/types";

interface SpecsTableProps {
  specs: ProductSpec[];
}

export function SpecsTable({ specs }: SpecsTableProps) {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">제품 스펙</h3>
      <div className="divide-y divide-gray-800">
        {specs.map((spec) => (
          <div
            key={spec.name}
            className="flex items-start gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div className="text-gray-400 text-sm w-32 shrink-0">{spec.name}</div>
            <div className="text-white text-sm flex-1">{spec.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
