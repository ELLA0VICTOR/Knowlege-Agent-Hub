import { ExternalSourceResult, SourceKey } from "@shared/types";

export async function fetchArxiv(query: string): Promise<ExternalSourceResult> {
  const q = encodeURIComponent(query.replace(/\s+/g, "+"));
  const url = `https://export.arxiv.org/api/query?search_query=all:${q}&start=0&max_results=3&sortBy=submittedDate&sortOrder=descending`;
  const res = await fetch(url);
  const text = await res.text();

  // Very light parse: extract <entry><title> and <id>
  const items = Array.from(
    text.matchAll(
      /<entry>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<id>([\s\S]*?)<\/id>/g
    )
  )
    .slice(0, 3)
    .map((m) => ({
      title: m[1].replace(/\s+/g, " ").trim(),
      url: m[2].trim(),
      snippet: "arXiv result",
    }));

  return { key: "arxiv" as SourceKey, title: "arXiv", used: items.length > 0, items };
}
