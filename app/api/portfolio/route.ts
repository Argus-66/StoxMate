import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";

// Initialize Firebase Admin only once
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { db } = await connectToDatabase();
    const portfolio = await db.collection("portfolios").findOne({ userId });

    return NextResponse.json(portfolio?.stocks || []);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { symbol, exchange, type, timestamp } = await req.json();

    if (!symbol || !exchange || !type || !timestamp) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const existing = await db.collection("portfolios").findOne({ userId });

    if (!existing) {
      // Create new portfolio
      await db.collection("portfolios").insertOne({
        userId,
        stocks: [
          {
            symbol,
            exchange,
            transactions: [{ type, timestamp }],
          },
        ],
      });
    } else {
      const stockExists = existing.stocks.some(
        (s: any) => s.symbol === symbol && s.exchange === exchange
      );

      if (!stockExists) {
        // Add new stock to portfolio
        await db.collection("portfolios").updateOne(
          { userId },
          {
            $push: {
              stocks: {
                symbol,
                exchange,
                transactions: [{ type, timestamp }],
              },
            },
          }
        );
      } else {
        // Add transaction to existing stock using positional $
        await db.collection("portfolios").updateOne(
          {
            userId,
            "stocks.symbol": symbol,
            "stocks.exchange": exchange,
          },
          {
            $push: {
              "stocks.$.transactions": { type, timestamp },
            },
          }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
