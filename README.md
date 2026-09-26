# 🛒 AI Dropshipping

AI-powered dropshipping assistant: find trending products, generate store listings with AI, and calculate profit margins.

## Features

- 🔥 **Product research** – trending products ranked by trend score, with estimated profit and competition level
- ✍️ **AI listing generator** – title, description, bullet points and tags (uses Claude when `ANTHROPIC_API_KEY` is set, template fallback otherwise)
- 💰 **Profit calculator** – supplier cost, shipping, ad spend and payment fees → net profit and margin

## Tech Stack

- Node.js + Express
- Anthropic Claude API (optional)

## Usage

```bash
npm install
cp .env.example .env   # optionally add ANTHROPIC_API_KEY
npm start
```

Open http://localhost:3000

## API

| Method | Endpoint | Body / Query |
| --- | --- | --- |
| GET | `/api/products` | `?category=Pets&competition=low` |
| POST | `/api/listing` | `{ "name": "Neck Fan", "category": "Summer", "audience": "...", "tone": "..." }` |
| POST | `/api/profit` | `{ "supplierCost": 6.5, "shipping": 2.5, "adCost": 8, "price": 24.99, "feePercent": 3 }` |

---

Author: OnchEins
License: MIT
