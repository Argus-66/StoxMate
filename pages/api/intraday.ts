// File: /pages/api/intraday.ts

import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { symbol } = req.query;

  if (!symbol || typeof symbol !== "string") {
    return res.status(400).json({ error: "Symbol is required" });
  }

  try {
    const url = `https://www.nseindia.com/api/chart-databyindex?index=${symbol}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://www.nseindia.com/",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch intraday data" });
    }

    const raw = await response.json();

    const candles = raw.grapthData?.map((item: number[]) => ({
      time: item[0], // timestamp in ms
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
    }));

    return res.status(200).json({ symbol, candles });
  } catch (err: any) {
    console.error("Intraday fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch intraday data" });
  }
}
