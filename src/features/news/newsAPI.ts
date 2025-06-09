// FILE: src/redux/features/news/newsApiSlice.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; 

// --- Type Definitions for the News API Response ---

// Describes the 'source' object within an article
interface Source {
  id: string | null;
  name: string;
}

// Describes a single news article object
export interface Article {
  source: Source;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string; // ISO string format
  content: string | null;
}

// Describes the entire object returned by your Hono backend
export interface NewsApiResponse {
  status: 'ok' | 'error';
  totalResults: number;
  articles: Article[];
  message?: string; // For error responses
}

// Describes the arguments for our fetchNews query
export interface FetchNewsArgs {
  q: string;       // The search query
  page?: number;   // The page number for pagination
  pageSize?: number;
}


// --- Create the API Slice ---
export const newsApi = createApi({
  // A unique key that will be used for the reducer path
  reducerPath: "newsApi",

  // The base query function that all endpoints will use
  baseQuery: fetchBaseQuery({
    baseUrl: `${APIDomain}/`, // All endpoints will be relative to '/api/'
    // prepareHeaders is where you would add auth tokens if your API needed them
    prepareHeaders: (headers,) => {
      // Example for future use:
      // const token = (getState() as RootState).auth.token;
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
      return headers;
    },
  }),

  // Defines tag types for caching and automatic re-fetching
  tagTypes: ["News"],

  // The actual API endpoints
  endpoints: (builder) => ({
    // Endpoint to fetch a list of news articles
    fetchNews: builder.query<NewsApiResponse, FetchNewsArgs>({
      /**
       * The query function constructs the URL path and parameters.
       * @param {FetchNewsArgs} args - The arguments for the query (q, page, pageSize)
       * @returns {string} The URL segment for the fetch call.
       */
      query: (args) => {
        const params = new URLSearchParams();
        params.append('q', args.q);
        if (args.page) params.append('page', String(args.page));
        if (args.pageSize) params.append('pageSize', String(args.pageSize));
        
        // This will result in a call to: /api/news?q=...&page=...
        return `news?${params.toString()}`;
      },

      /**
       * Merges incoming data with existing data for "Load More" functionality.
       * @param {NewsApiResponse} currentCache - The existing data in the cache.
       * @param {NewsApiResponse} newItems - The new data from the latest fetch.
       * @returns {NewsApiResponse} The merged data.
       */
      merge: (currentCache, newItems) => {
        // This is for infinite scroll / "Load More". It appends new articles.
        currentCache.articles.push(...newItems.articles);
        currentCache.totalResults = newItems.totalResults; // Update total results
      },

      /**
       * Caching strategy: Provides a general list tag.
       * Any mutation that invalidates this tag will cause the list to be re-fetched.
       */
      providesTags: (result) =>
        result ? [{ type: "News", id: 'LIST' }] : [],
    }),

    // You could add other endpoints here if needed, e.g., get a single article by ID
    // getNewsArticleById: builder.query<Article, string>({ ... })
  }),
});

// Export the auto-generated hooks for use in your components
export const {
  useFetchNewsQuery,
} = newsApi;