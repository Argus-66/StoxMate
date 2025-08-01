import mongoose, { Schema, models, model } from "mongoose";

const TransactionSchema = new Schema({
  type: { type: String, enum: ["buy", "sell"], required: true },
  timestamp: { type: Date, required: true },
});

const StockSchema = new Schema({
  symbol: { type: String, required: true },
  exchange: { type: String, required: true },
  transactions: [TransactionSchema],
});

const PortfolioSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  stocks: [StockSchema],
});

export const Portfolio =
  models.Portfolio || model("Portfolio", PortfolioSchema);
