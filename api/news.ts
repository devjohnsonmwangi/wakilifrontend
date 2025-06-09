import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = process.env.VITE_NEWS_API_KEY; 
const BASE_URL_EVERYTHING = 'https://newsapi.org/v2/everything';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (!API_KEY) {
    return response.status(500).json({ error: 'Server configuration error: API key is missing.' });
  }
  const { q, language, sortBy, pageSize, page } = request.query;
  if (!q) {
    return response.status(400).json({ error: 'Query parameter "q" is required.' });
  }
  try {
    const queryParams = new URLSearchParams({
      q: q as string,
      language: (language as string) || 'en',
      sortBy: (sortBy as string) || 'publishedAt',
      pageSize: (pageSize as string) || '20',
      page: (page as string) || '1',
    });
    const newsApiUrl = `${BASE_URL_EVERYTHING}?${queryParams.toString()}`;
    const apiResponse = await fetch(newsApiUrl, { headers: { 'X-Api-Key': API_KEY } });
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return response.status(apiResponse.status).json({ error: `Failed to fetch from NewsAPI: ${errorData.message || 'Unknown API error'}` });
    }
    const newsData = await apiResponse.json();
    response.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return response.status(200).json(newsData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal error occurred.';
    return response.status(500).json({ error: errorMessage });
  }
}