import "dotenv/config";
import express from "express";
import { products } from "./products.js";
import { generateListing } from "./ai.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

function profit({ supplierCost, shipping = 0, price, adCost = 0, feePercent = 3 }) {
  const fees = (price * feePercent) / 100;
  const net = price - supplierCost - shipping - adCost - fees;
  return {
    price,
    totalCost: +(supplierCost + shipping + adCost + fees).toFixed(2),
    netProfit: +net.toFixed(2),
    margin: price > 0 ? +((net / price) * 100).toFixed(1) : 0,
  };
}

// Product research: trending products sorted by trend score, with estimated profit.
app.get("/api/products", (req, res) => {
  const { category, competition } = req.query;
  const result = products
    .filter((p) => !category || p.category.toLowerCase() === String(category).toLowerCase())
    .filter((p) => !competition || p.competition === competition)
    .map((p) => ({ ...p, estimate: profit({ ...p, price: p.suggestedPrice }) }))
    .sort((a, b) => b.trendScore - a.trendScore);
  res.json({ success: true, data: result });
});

// AI listing generator.
app.post("/api/listing", async (req, res) => {
  const { name, category, audience, tone } = req.body || {};
  if (!name) return res.status(400).json({ error: "name is required" });
  try {
    res.json({ success: true, data: await generateListing({ name, category, audience, tone }) });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

// Profit calculator.
app.post("/api/profit", (req, res) => {
  const { supplierCost, shipping, price, adCost, feePercent } = req.body || {};
  if (typeof supplierCost !== "number" || typeof price !== "number") {
    return res.status(400).json({ error: "supplierCost and price must be numbers" });
  }
  res.json({ success: true, data: profit({ supplierCost, shipping, price, adCost, feePercent }) });
});

app.listen(PORT, () => console.log(`AI Dropshipping running on http://localhost:${PORT}`));
