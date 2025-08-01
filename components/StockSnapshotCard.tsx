'use client';

import React from 'react';

type PriceInfo = {
  lastPrice: number;
  change: number;
  pChange: number;
  open: number;
  close: number;
  previousClose: number;
  vwap: number;
  intraDayHighLow: { min: number; max: number };
  weekHighLow: { min: number; max: number };
};

type Props = {
  symbol: string;
  companyName: string;
  priceInfo: PriceInfo;
};

export default function StockSnapshotCard({ symbol, companyName, priceInfo }: Props) {
  const isUp = priceInfo.change >= 0;

  return (
    <div className="p-4 rounded-2xl shadow bg-white dark:bg-zinc-900 w-full max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{symbol}</h2>
        <div className={`text-lg font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          ₹{priceInfo.lastPrice.toFixed(2)}
        </div>
      </div>

      <div className={`mb-2 text-sm ${isUp ? 'text-green-400' : 'text-red-400'}`}>
        {isUp ? '▲' : '▼'} {priceInfo.change.toFixed(2)} ({priceInfo.pChange.toFixed(2)}%)
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <div>Open: ₹{priceInfo.open}</div>
        <div>VWAP: ₹{priceInfo.vwap}</div>
        <div>High: ₹{priceInfo.intraDayHighLow.max}</div>
        <div>Low: ₹{priceInfo.intraDayHighLow.min}</div>
        <div>Prev Close: ₹{priceInfo.previousClose}</div>
        <div>Week High: ₹{priceInfo.weekHighLow.max}</div>
        <div>Week Low: ₹{priceInfo.weekHighLow.min}</div>
      </div>

      <div className="text-xs mt-3 text-zinc-500 dark:text-zinc-400">
        {companyName}
      </div>
    </div>
  );
}
