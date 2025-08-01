"use client";

import { useState } from "react";

export default function StockList() {
  const [stockInput, setStockInput] = useState("");
  const [stocks, setStocks] = useState<string[]>([]);

  const handleAddStock = () => {
    if (!stockInput.trim()) return;
    setStocks((prev) => [...prev, stockInput.trim().toUpperCase()]);
    setStockInput("");
  };

  const handleRemoveStock = (symbol: string) => {
    setStocks((prev) => prev.filter((s) => s !== symbol));
  };

  return (
    <div className="max-w-xl bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Your Stocks</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter stock symbol"
          value={stockInput}
          onChange={(e) => setStockInput(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleAddStock}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {stocks.length === 0 ? (
        <p className="text-gray-500">No stocks added yet.</p>
      ) : (
        <ul className="space-y-2">
          {stocks.map((symbol) => (
            <li
              key={symbol}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
            >
              <span className="font-medium">{symbol}</span>
              <button
                onClick={() => handleRemoveStock(symbol)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
