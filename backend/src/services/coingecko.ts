import { ExternalSourceResult, SourceKey } from "@shared/types";

export async function fetchCoinGecko(query: string): Promise<ExternalSourceResult> {
  // Naive: if query mentions a coin, try to fetch price (default bitcoin)
  const coin = (query.match(/(bitcoin|btc|ethereum|eth|solana|sol)/i)?.[1] || "bitcoin")
    .toLowerCase()
    .replace("btc", "bitcoin")
    .replace("eth", "ethereum")
    .replace("sol", "solana");

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
    coin
  )}&vs_currencies=usd,eur&include_24hr_change=true`;

  const res = await fetch(url, { headers: { accept: "application/json" } });
  const data = (await res.json()) as any;

  const price = data?.[coin];
  const items = price
    ? [
        {
          title: `${coin} price`,
          url: `https://www.coingecko.com/en/coins/${coin}`,
          data: price,
          snippet: `USD $${price.usd} (24h ${Number(price.usd_24h_change).toFixed(2)}%)`,
        },
      ]
    : [];

  return { key: "coingecko" as SourceKey, title: "CoinGecko", used: items.length > 0, items };
}