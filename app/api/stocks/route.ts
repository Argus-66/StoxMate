import { NextRequest, NextResponse } from "next/server";
import https from "https";

// Helper to fetch NSE data with cookie handling
async function fetchNSEQuote(symbol: string) {
  const baseHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    Accept: "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    Referer: "https://www.nseindia.com/",
    Connection: "keep-alive",
    Host: "www.nseindia.com",
  };

  // Step 1: Get cookie
  const cookie = await new Promise<string>((resolve, reject) => {
    https.get("https://www.nseindia.com", { headers: baseHeaders }, (res) => {
      const setCookie = res.headers["set-cookie"];
      if (setCookie) {
        const cookieString = setCookie.map((c) => c.split(";")[0]).join("; ");
        resolve(cookieString);
      } else {
        reject("Failed to get NSE cookies");
      }
    }).on("error", reject);
  });

  // Step 2: Small delay helps with some blocking issues
  await new Promise((r) => setTimeout(r, 500));

  // Step 3: Call the actual quote API
  const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol.toUpperCase()}`;
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          ...baseHeaders,
          Cookie: cookie,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (data.startsWith("<")) {
            console.error("❌ Received HTML instead of JSON.");
            return reject("Blocked by NSE (HTML response)");
          }

          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (err) {
            console.error("❌ Failed to parse JSON:", data.slice(0, 300));
            reject(err);
          }
        });
      }
    ).on("error", reject);
  });
}


// API handler
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const exchange = searchParams.get("exchange") || "NSE";

  if (!symbol || exchange !== "NSE") {
    return NextResponse.json(
      { error: "Missing or invalid symbol/exchange" },
      { status: 400 }
    );
  }

  try {
    const data: any = await fetchNSEQuote(symbol);

    return NextResponse.json({
      symbol,
      exchange,
      price: data?.priceInfo?.lastPrice ?? null,
      data, // full raw data if needed
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Error in /api/stocks route:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data", details: message },
      { status: 500 }
    );
  }
}
