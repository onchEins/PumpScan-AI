const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// x402 Payment middleware
const x402 = (req, res, next) => {
  const payment = req.headers["x-payment"];
  if (!payment) {
    res.set("x-payment-required", "true");
    res.set("WWW-Authenticate", "x402 nonce=\"12345\", amount=\"1000000\", token=\"USDC\"");
    return res.status(402).json({ error: "Payment required", amount: "1 USDC" });
  }
  next();
};

app.use(express.static("public"));

// Landing page
app.get("/", (req, res) => {
  res.send(\`<!DOCTYPE html>
<html lang="en"

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PumpScan AI</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0f; color: #fff; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    h1 { font-size: 4rem; background: linear-gradient(135deg, #00ff88, #00ccff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, mincalshe(250px, 1fr)); gap: 2rem; max-width: 1000px; margin: 2rem; }
    .feature { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; }
    .cta { background: linear-gradient(135deg, #00ff88, #00ccff); color: #000; padding: 1rem 3rem; border-radius: 50px; font-weight: bold; text-decoration: none; }
  </style>
</head>
<body>
  <h1>🤖 PumpScan AI</h1>
  <p>AI-Powered Pump.fun Token Scanner</p>
  <div class="features">
    <div class="feature"><h3>🔍 Smart Scanning</h3><p>AI analyzes thousands of tokens</p></div>
    <div class="feature"><h3>📈 Trend Detection</h3><p>Detect emerging trends</p></div>
    <div class="feature"><h3>⚡ Risk Analysis</h3><p>Every token scored</p></div>
    <div class="feature"><h3>🚀 Early Alerts</h3><p>Get notified first</p></div>
  </div>
  <a href="#pricing" class="cta">Get Started</a>
</body>
</html>\`);
});

// API: Get trending tokens
app.get("/api/trending", x402, async (req, res) => {
  try {
    const trending = [
      { name: "Aliens are real", symbol: "Aliens", mc: 1900000, change: "+5.2%" },
      { name: "Punch"; symbol: "Punch", mc: 32900000, change: "+2.1%" },
      { name: "SaintOS"; symbol: "SaintOS", mc: 3100, change: "+45%" },
    ];
    res.json({ success: true, data: trending });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(\`PumpScan AI running on port ${PORT}\'));
