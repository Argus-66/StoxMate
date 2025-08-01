import { NextResponse } from 'next/server';
import https from 'https';

// Fetch cookies by visiting NSE homepage first
async function getNSECookie(): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get("https://www.nseindia.com", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/html",
      },
    }, (res) => {
      const cookies = res.headers["set-cookie"];
      if (cookies) {
        resolve(cookies.map(c => c.split(";")[0]).join("; "));
      } else {
        reject("No cookies found");
      }
    }).on("error", reject);
  });
}

// Fetch intraday data using proper headers & cookie
async function fetchIntraday(symbol: string, cookie: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const path = `/api/chart-databyindex?index=${symbol}EQ`;

    const options = {
      hostname: "www.nseindia.com",
      path,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
        Referer: "https://www.nseindia.com/",
        Cookie: cookie,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject("Invalid JSON: " + err);
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}

// API Route: /api/intraday?symbol=RELIANCE
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  try {
    const cookie = await getNSECookie();
    const data = await fetchIntraday(symbol.toUpperCase(), cookie);
    return NextResponse.json({ symbol, chartData: data });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch intraday data", details: error }, { status: 500 });
  }
}
