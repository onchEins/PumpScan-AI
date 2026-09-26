// Generates a product listing with Claude when ANTHROPIC_API_KEY is set, otherwise uses a template.
export async function generateListing({ name, category, audience = "online shoppers", tone = "friendly" }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return templateListing({ name, category, audience });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
      max_tokens: 800,
      messages: [{
        role: "user",
        content:
          `Write a dropshipping product listing for "${name}" (category: ${category || "general"}), ` +
          `targeting ${audience}, in a ${tone} tone. Respond with JSON only, shaped as ` +
          `{"title": string, "description": string, "bullets": string[5], "tags": string[]}.`,
      }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return { source: "ai", ...JSON.parse(json) };
}

function templateListing({ name, category, audience }) {
  return {
    source: "template",
    title: `${name} – Premium Quality, Fast Shipping`,
    description: `Discover the ${name}, a must-have ${category || "product"} for ${audience}. Built to last, easy to use and loved by customers.`,
    bullets: [
      "High-quality, durable materials",
      "Easy to use right out of the box",
      "Perfect gift for friends and family",
      "Tracked shipping on every order",
      "30-day satisfaction guarantee",
    ],
    tags: [name.toLowerCase(), (category || "trending").toLowerCase(), "gift", "bestseller"],
  };
}
