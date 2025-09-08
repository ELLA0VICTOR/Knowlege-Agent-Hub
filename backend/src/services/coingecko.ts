import { ExternalSourceResult, SourceKey } from "../types.js";
import { CONFIG } from "../config.js";

export async function fetchCoinGecko(query: string): Promise<ExternalSourceResult> {
  // Naive: if query mentions a coin, try to fetch price (default bitcoin)
  const coin = (query.match(/(bitcoin|btc|ethereum|eth|solana|sol)/i)?.[1] || "bitcoin")
    .toLowerCase()
    .replace("btc", "bitcoin")
    .replace("eth", "ethereum")
    .replace("sol", "solana");

  // Use API key if available for rate limit bypass
  const apiKeyParam = CONFIG.COINGECKO_API_KEY ? `&x_cg_demo_api_key=${CONFIG.COINGECKO_API_KEY}` : '';
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
    coin
  )}&vs_currencies=usd,eur&include_24hr_change=true${apiKeyParam}`;

  console.log(`🪙 Fetching CoinGecko data for ${coin}`);
  
  const res = await fetch(url, { 
    headers: { 
      accept: "application/json",
      ...(CONFIG.COINGECKO_API_KEY && { 'x-cg-demo-api-key': CONFIG.COINGECKO_API_KEY })
    } 
  });

  if (!res.ok) {
    console.error(`❌ CoinGecko API error: ${res.status} ${res.statusText}`);
    const errorText = await res.text();
    console.error(`Response: ${errorText}`);
    return { key: "coingecko" as SourceKey, title: "CoinGecko", used: false, items: [] };
  }

  const data = (await res.json()) as any;
  console.log(`✅ CoinGecko response received for ${coin}`);

  const price = data?.[coin];
  const items = price
    ? [
        {
          title: `${coin} price`,
          url: `https://www.coingecko.com/en/coins/${coin}`,
          data: price,
          snippet: `USD ${price.usd} (24h ${Number(price.usd_24h_change).toFixed(2)}%)`,
        },
      ]
    : [];

  return { key: "coingecko" as SourceKey, title: "CoinGecko", used: items.length > 0, items };
}