import { useState, useEffect, useCallback, FC, SyntheticEvent } from 'react';
import {
  Newspaper, Globe, MapPin, Building, Scale, AlertTriangle,
  Loader2, ExternalLink, CalendarDays, Building2, LucideProps,
  Landmark, Users 
} from 'lucide-react';


import Navbar from '../components/navbar/Navbar';

// --- TypeScript Type Definitions ---
interface ArticleSource {
  id: string | null;
  name: string;
}

interface Article {
  source: ArticleSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string; // ISO date string
  content: string | null;
}

interface Category {
  id: string;
  name: string;
  Icon: React.FC<LucideProps>;
  query: string;
  country?: string; // For /top-headlines
  useEverythingAPI?: boolean; // To explicitly use /everything even with country-specific keywords
}

interface NewsCardProps {
  article: Article;
}
// --- End TypeScript Type Definitions ---


const API_KEY = '0dd6564dccaf43a486afa01c50f9bbe2';
const BASE_URL_EVERYTHING = 'https://newsapi.org/v2/everything';
const BASE_URL_TOPHEADLINES = 'https://newsapi.org/v2/top-headlines';
const PAGE_SIZE = 20; 

const CATEGORIES: Category[] = [
  // Kenya
  { id: 'kenya_legal', name: 'Kenya Law', Icon: MapPin, query: '(law OR legal OR court OR judiciary)', country: 'ke' },
  { id: 'kenya_politics', name: 'Kenya Politics', Icon: Landmark, query: '(politics OR election OR government OR parliament)', country: 'ke' },
  // East Africa (using /everything for broader regional search)
  { id: 'east_africa_legal', name: 'EA Law', Icon: Globe, query: '"East Africa" AND (law OR legal OR court OR judiciary)', useEverythingAPI: true },
  { id: 'east_africa_politics', name: 'EA Politics', Icon: Users, query: '"East Africa" AND (politics OR election OR government)', useEverythingAPI: true },
  // Africa (using /everything)
  { id: 'africa_legal', name: 'Africa Law', Icon: Globe, query: 'Africa AND (law OR legal OR court OR judiciary)', useEverythingAPI: true },
  { id: 'africa_politics', name: 'Africa Politics', Icon: Users, query: 'Africa AND (politics OR election OR government)', useEverythingAPI: true },
  // USA
  { id: 'usa_legal', name: 'USA Law', Icon: Building, query: '(law OR legal OR court OR judiciary)', country: 'us' },
  { id: 'usa_politics', name: 'USA Politics', Icon: Landmark, query: '(politics OR election OR government OR congress OR "white house")', country: 'us' },
  // China
  { id: 'china_legal', name: 'China Law', Icon: Building2, query: '(law OR legal OR court OR judiciary)', country: 'cn' },
  { id: 'china_politics', name: 'China Politics', Icon: Landmark, query: '(politics OR CCP OR government OR "Xi Jinping")', country: 'cn' },
  // World (using /everything)
  { id: 'world_legal', name: 'World Law', Icon: Scale, query: '"international law" OR "global legal" OR "world court"', useEverythingAPI: true },
  { id: 'world_politics', name: 'World Politics', Icon: Globe, query: '"global politics" OR "international relations" OR diplomacy OR geopolitics', useEverythingAPI: true },
];


const NewsCard: FC<NewsCardProps> = ({ article }) => {
  if (!article || !article.title) return null;

  const formatDate = (isoDate: string | null | undefined): string => {
    if (!isoDate) return 'Date not available';
    try {
      return new Date(isoDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.warn("Invalid date format for article:", article.title, isoDate);
      return 'Invalid Date';
    }
  };

  const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none'; // Hide the broken image

    const placeholder = imgElement.parentElement?.querySelector('.image-placeholder');
    if (placeholder && placeholder instanceof HTMLElement) {
      placeholder.classList.remove('hidden');
      placeholder.classList.add('flex'); // Ensure it's displayed as flex
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md shadow-xl dark:shadow-slate-900/50 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col">
      {/* Image container with a background color for better placeholder visibility */}
      <div className="relative w-full h-48 bg-slate-200 dark:bg-slate-700">
        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt={article.title || 'News image'}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}
        {/* Placeholder: Always present, visibility controlled by CSS and JS */}
        <div
          className={`image-placeholder absolute inset-0 w-full h-full bg-slate-200 dark:bg-slate-700 items-center justify-center ${article.urlToImage ? 'hidden' : 'flex'}`}
        >
          <Newspaper className="w-16 h-16 text-slate-400 dark:text-slate-500" />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 mb-2 leading-tight">
          {article.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center">
          <Building2 size={14} className="mr-1.5" /> {article.source?.name || 'Unknown Source'}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center">
          <CalendarDays size={14} className="mr-1.5" /> {formatDate(article.publishedAt)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed flex-grow">
          {article.description ? `${article.description.substring(0, 120)}...` : 'No description available.'}
        </p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto self-start inline-flex items-center text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium group"
        >
          Read More
          <ExternalLink size={16} className="ml-1.5 transform transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};


const LegalNewsSection: FC = () => {
  const [activeTab, setActiveTab] = useState<string>(CATEGORIES[0].id);
  const [news, setNews] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (category: Category) => {
    if (!API_KEY) {
      setError("Configuration Error: News API key is missing.");
      setLoading(prev => ({ ...prev, [category.id]: false }));
      return;
    }

    setLoading(prev => ({ ...prev, [category.id]: true }));
    setError(null);

    // For client-side (browser) requests, X-Api-Key is the primary authentication.
    // The browser will send its own User-Agent. Explicitly setting it can sometimes cause issues.
    const requestHeaders: HeadersInit = {
        'X-Api-Key': API_KEY
    };

    let baseUrlToUse: string;
    const queryParams = new URLSearchParams({
        q: encodeURIComponent(category.query), 
        language: 'en',
        sortBy: 'publishedAt', 
        pageSize: PAGE_SIZE.toString()
    });

    if (category.country && !category.useEverythingAPI) {
      baseUrlToUse = BASE_URL_TOPHEADLINES;
      queryParams.set('country', category.country); 
    } else {
      baseUrlToUse = BASE_URL_EVERYTHING;
      // For /everything, country is not a direct param, but can be part of 'q'
      // If category.country exists and useEverythingAPI is true, it should be in the query string.
      if (category.country && category.useEverythingAPI && !category.query.toLowerCase().includes(category.name.toLowerCase().split(' ')[0].toLowerCase())) {
        // Example: if query is just "politics" but country is "Kenya", ensure "Kenya" is in query.
        // This is a heuristic, might need refinement based on specific category names & queries.
        // For now, relying on explicit query construction in CATEGORIES.
      }
    }

    const fullUrl = `${baseUrlToUse}?${queryParams.toString()}`;

    try {
      console.log(`Fetching from: ${fullUrl}`); // Log the URL for debugging
      const response = await fetch(fullUrl, { headers: requestHeaders });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          throw new Error(`API request failed with status ${response.status}: ${response.statusText || 'Could not parse error response.'}`);
        }

        const apiMessage = errorData?.message || 'No specific message from API.';
        const errorCode = errorData?.code;

        console.error("NewsAPI Error Response:", errorData); // Log the full error data

        if (errorCode === 'apiKeyInvalid' || errorCode === 'apiKeyMissing' || response.status === 401) {
          throw new Error('API Key Error: Invalid or missing API Key, or unauthorized. Please check your configuration.');
        } else if (errorCode === 'rateLimited' || response.status === 429) {
          throw new Error('API Limit Error: Rate limit exceeded. Please try again later.');
        } else if (errorCode === 'corsNotAllowed') {
             throw new Error('CORS Error: This API key cannot be used from the browser. This typically means it is restricted to server-side use only.');
        }
        // More generic error based on API message or status
        throw new Error(`API Error (Status ${response.status}, Code: ${errorCode || 'N/A'}): ${apiMessage}`);
      }

      const data = await response.json();
      if (data.status === "error") {
        console.error("NewsAPI Error in 200 OK response:", data);
        throw new Error(`API Error: ${data.message || 'An error occurred while fetching news.'} (Code: ${data.code})`);
      }

      setNews(prev => ({ ...prev, [category.id]: data.articles || [] }));

    } catch (err) {
      console.error(`Failed to fetch news for '${category.name}':`, err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Could not load news for ${category.name}: ${errorMessage}`);
      setNews(prev => ({ ...prev, [category.id]: [] }));
    } finally {
      setLoading(prev => ({ ...prev, [category.id]: false }));
    }
  }, []);

  useEffect(() => {
    const currentCategory = CATEGORIES.find(cat => cat.id === activeTab);
    if (currentCategory) {
      const categoryNews = news[activeTab];
      const categoryIsLoading = loading[activeTab];
      if (!categoryIsLoading && (!categoryNews || categoryNews.length === 0)) {
        fetchNews(currentCategory);
      }
    }
  }, [activeTab, fetchNews, news, loading]);


  return (
    <>
      <Navbar />
      <section className="py-12 md:py-20 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-sky-500 dark:from-emerald-400 dark:to-sky-400">
                Global News Updates
              </span>
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
              Stay informed with the latest legal and political developments from around the globe.
            </p>
          </div>

          <div className="mb-8 md:mb-10 overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex space-x-1 sm:space-x-2 border-b border-slate-300 dark:border-slate-700 w-max sm:w-auto sm:justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center px-2.5 py-3 sm:px-4 sm:py-3.5 text-xs sm:text-sm font-medium whitespace-nowrap
                    transition-colors duration-200 ease-in-out focus:outline-none
                  ${activeTab === cat.id
                    ? 'border-b-2 border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-b-2 hover:border-emerald-300 dark:hover:border-emerald-600'
                  }`}
                >
                  <cat.Icon size={16} className="mr-1.5 hidden sm:inline-block" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center justify-center p-6 mb-8 bg-red-100 dark:bg-red-800/60 border border-red-300 dark:border-red-700/50 rounded-lg shadow-md">
              <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          {loading[activeTab] && !error && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 text-emerald-500 dark:text-emerald-400 animate-spin" />
              <p className="ml-4 text-slate-600 dark:text-slate-300 text-lg">Loading News...</p>
            </div>
          )}

          {!loading[activeTab] && !error && news[activeTab] && news[activeTab].length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"> 
              {news[activeTab].map((article, index) => (
                <NewsCard key={article.url || `${article.title}-${index}`} article={article} />
              ))}
            </div>
          )}

          {!loading[activeTab] && !error && (!news[activeTab] || news[activeTab].length === 0) && (
            <div className="text-center py-10">
              <Newspaper className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                No news articles found for this category.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Try selecting a different category or check back later. It's also possible the API returned no results for the current query.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default LegalNewsSection;