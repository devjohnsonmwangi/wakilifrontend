// FILE LOCATION: src/pages/api/news.ts

import type { NextApiRequest, NextApiResponse } from 'next';

type Article = {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};

type ApiResponse = {
  status?: 'ok' | 'error';
  totalResults?: number;
  articles?: Article[];
  message?: string;
  error?: string;
};

const NEWS_API_URL = 'https://newsapi.org/v2/everything';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.error("SERVER ERROR: NEWS_API_KEY environment variable is not set!");
    return res.status(500).json({ message: "Server configuration error: API key is missing." });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ message: "Query parameter 'q' is required." });
  }

  try {
    const queryParams = new URLSearchParams({
      q,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: (req.query.pageSize as string) || '20',
      page: (req.query.page as string) || '1',
    });

    const externalUrl = `${NEWS_API_URL}?${queryParams.toString()}`;
    const apiResponse = await fetch(externalUrl, { headers: { 'X-Api-Key': apiKey } });
    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error("NewsAPI Error:", data.message);
      return res.status(apiResponse.status).json({ message: `Upstream API Error: ${data.message}` });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Internal fetch failed:", err);
    return res.status(500).json({ message: 'Failed to fetch news from the external service.' });
  }
}