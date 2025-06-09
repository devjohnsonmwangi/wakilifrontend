import { useState, useEffect, useCallback, FC, SyntheticEvent } from 'react';
import {
  Newspaper, Globe, Scale, AlertTriangle,
  Loader2, ExternalLink, CalendarDays, Building2, LucideProps,
  Users, ChevronUp, ChevronDown, RefreshCw
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
  publishedAt: string;
  content: string | null;
}

interface Category {
  id: string;
  name: string;
  Icon: React.FC<LucideProps>;
  query: string;
  useEverythingAPI?: boolean;
}

interface NewsCardProps {
  article: Article;
}
// --- End TypeScript Type Definitions ---

/**************************************************************************/
/** WARNING: THIS IS THE INSECURE, FRONTEND-ONLY APPROACH                **/
/** Your API Key is exposed here. This will work on localhost but        **/
/** WILL FAIL with a CORS error when deployed to Vercel or any other     **/
/** hosting platform. The serverless proxy is the correct solution.      **/
/**************************************************************************/
const API_KEY = '0dd6564dccaf43a486afa01c50f9bbe2';
const BASE_URL_EVERYTHING = 'https://newsapi.org/v2/everything';
const PAGE_SIZE = 20;

const NEWS_CATEGORIES: Category[] = [
  { id: 'world_legal', name: 'World Law', Icon: Scale, query: '"international law" OR "human rights law" OR "global legal"', useEverythingAPI: true },
  { id: 'world_politics', name: 'World Politics', Icon: Globe, query: '"global politics" OR "international relations" OR diplomacy', useEverythingAPI: true },
  { id: 'east_africa_legal', name: 'EA Law', Icon: Globe, query: '("East African Community" OR Kenya OR Tanzania OR Uganda) AND (law OR legal OR court)', useEverythingAPI: true },
  { id: 'east_africa_politics', name: 'EA Politics', Icon: Users, query: '("East African Community" OR Kenya OR Tanzania OR Uganda) AND (politics OR election OR government)', useEverythingAPI: true },
  { id: 'africa_legal', name: 'Africa Law', Icon: Globe, query: 'Africa AND (law OR legal OR court OR "African Union")', useEverythingAPI: true },
  { id: 'africa_politics', name: 'Africa Politics', Icon: Users, query: 'Africa AND (politics OR election OR government)', useEverythingAPI: true },
];

// --- Reusable Child Components ---

const NewsCard: FC<NewsCardProps> = ({ article }) => {
  if (!article || !article.title) return null;

  const formatDate = (isoDate: string): string => {
    try {
      return new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'Invalid Date';
    }
  };

  const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    const placeholder = event.currentTarget.parentElement?.querySelector('.image-placeholder');
    if (placeholder) placeholder.classList.remove('hidden');
    event.currentTarget.style.display = 'none';
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg dark:shadow-slate-900/50 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col">
      <div className="relative w-full h-48 bg-slate-200 dark:bg-slate-700">
        {article.urlToImage ? (
          <img src={article.urlToImage} alt={article.title} className="w-full h-full object-cover" onError={handleImageError} />
        ) : null}
        <div className={`image-placeholder absolute inset-0 bg-slate-200 dark:bg-slate-700 items-center justify-center ${article.urlToImage ? 'hidden' : 'flex'}`}>
          <Newspaper className="w-16 h-16 text-slate-400 dark:text-slate-500" />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-400 mb-2 leading-tight">{article.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center"><Building2 size={14} className="mr-1.5" /> {article.source?.name || 'Unknown Source'}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center"><CalendarDays size={14} className="mr-1.5" /> {formatDate(article.publishedAt)}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed flex-grow">
          {article.description ? `${article.description.substring(0, 120)}...` : 'No description available.'}
        </p>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="mt-auto self-start inline-flex items-center text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-bold group">
          Read More
          <ExternalLink size={16} className="ml-1.5 transform transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

const ScrollControls: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const handleScroll = () => { if (window.pageYOffset > 300) setIsVisible(true); else setIsVisible(false); };
  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const scrollToBottom = () => { window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }); };
  useEffect(() => { window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  return (
    <div className={`fixed bottom-20 right-4 z-50 flex-col space-y-2 transition-opacity duration-300 lg:hidden ${isVisible ? 'opacity-100 flex' : 'opacity-0 hidden'}`}>
      <button onClick={scrollToTop} aria-label="Scroll to top" className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800/70 text-white backdrop-blur-sm border border-slate-500/50 shadow-lg hover:bg-slate-700 transition-colors"><ChevronUp className="w-6 h-6" /></button>
      <button onClick={scrollToBottom} aria-label="Scroll to bottom" className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800/70 text-white backdrop-blur-sm border border-slate-500/50 shadow-lg hover:bg-slate-700 transition-colors"><ChevronDown className="w-6 h-6" /></button>
    </div>
  );
};

// --- Main Page Component ---

const LegalNewsSection: FC = () => {
  const [activeTab, setActiveTab] = useState<string>(NEWS_CATEGORIES[0].id);
  const [news, setNews] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const [totalResults, setTotalResults] = useState<Record<string, number>>({});
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<Record<string, boolean>>({});

  const fetchNews = useCallback(async (category: Category, page: number) => {
    if (!API_KEY) {
      setError(prev => ({ ...prev, [category.id]: "Configuration Error: API key is missing." }));
      return;
    }

    if (page === 1) setLoading(prev => ({ ...prev, [category.id]: true }));
    else setIsLoadMoreLoading(prev => ({ ...prev, [category.id]: true }));
    setError(prev => ({ ...prev, [category.id]: null }));

    const queryParams = new URLSearchParams({
      q: category.query,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: PAGE_SIZE.toString(),
      page: page.toString(),
    });

    const fullUrl = `${BASE_URL_EVERYTHING}?${queryParams.toString()}`;

    try {
      // THIS IS THE DIRECT, INSECURE CALL THAT WILL CAUSE CORS ERRORS IN PRODUCTION
      const response = await fetch(fullUrl, { headers: { 'X-Api-Key': API_KEY } });
      
      if (!response.ok) {
        // This is where the CORS error will be caught in production.
        // It will throw a generic network error, not a helpful JSON message.
        const errorData = await response.json();
        throw new Error(`API Error (Status ${response.status}): ${errorData.message || 'An unknown API error.'}`);
      }

      const data = await response.json();
      if (data.status === "error") {
        throw new Error(`API Error: ${data.message || 'An error occurred.'}`);
      }
      
      setNews(prev => ({ ...prev, [category.id]: page === 1 ? data.articles || [] : [...(prev[category.id] || []), ...(data.articles || [])] }));
      setTotalResults(prev => ({ ...prev, [category.id]: data.totalResults || 0 }));
      setCurrentPage(prev => ({ ...prev, [category.id]: page }));
    } catch (err) {
      // The error message in production will likely be "Failed to fetch" due to the CORS policy.
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(prev => ({ ...prev, [category.id]: `Could not load news. Check browser console for CORS errors. ${errorMessage}` }));
    } finally {
      if (page === 1) setLoading(prev => ({ ...prev, [category.id]: false }));
      else setIsLoadMoreLoading(prev => ({ ...prev, [category.id]: false }));
    }
  }, []);

  useEffect(() => {
    const currentCategory = NEWS_CATEGORIES.find(cat => cat.id === activeTab);
    if (currentCategory && !news[activeTab]) {
      fetchNews(currentCategory, 1);
    }
  }, [activeTab, fetchNews, news]);

  const handleLoadMore = () => {
    const currentCategory = NEWS_CATEGORIES.find(cat => cat.id === activeTab);
    const nextPage = (currentPage[activeTab] || 1) + 1;
    if (currentCategory) {
      fetchNews(currentCategory, nextPage);
    }
  };

  const currentNews = news[activeTab] || [];
  const isLoading = loading[activeTab] ?? true;
  const currentError = error[activeTab];
  const hasMore = currentNews.length < (totalResults[activeTab] || 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 pt-16 pb-16 lg:pb-0">
        <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center mb-16 p-8 md:p-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-sky-500 dark:from-emerald-400 dark:to-sky-400">
                Global News Updates
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Stay informed with the latest legal and political developments from key regions.
            </p>
          </div>

          <div className="mb-12 flex justify-center">
            <div className="p-1.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-full overflow-x-auto">
              <div className="flex space-x-1 w-max">
                {NEWS_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex items-center px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-200 dark:focus:ring-offset-slate-800 ${activeTab === cat.id ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60'}`}
                  >
                    <cat.Icon size={16} className="mr-2" />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="min-h-[400px]">
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 text-emerald-500 dark:text-emerald-400 animate-spin" />
              </div>
            )}

            {!isLoading && currentError && (
              <div className="flex items-center justify-center p-6 bg-red-100 dark:bg-red-800/60 border border-red-300 dark:border-red-700/50 rounded-lg shadow-md">
                <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300 text-sm font-medium">{currentError}</p>
              </div>
            )}

            {!isLoading && !currentError && currentNews.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {currentNews.map((article, index) => (
                  <NewsCard key={article.url ? `${article.url}-${index}` : `${article.title}-${index}`} article={article} />
                ))}
              </div>
            )}
            
            {!isLoading && !currentError && currentNews.length === 0 && (
              <div className="text-center py-16">
                <Newspaper className="h-20 w-20 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <h4 className="text-slate-600 dark:text-slate-300 text-xl font-semibold">No Articles Found</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                  There are currently no news articles for this category.
                  <br />
                  Please try another category or check back later.
                </p>
              </div>
            )}

            {!isLoading && !currentError && hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadMoreLoading[activeTab]}
                  className="inline-flex items-center justify-center px-8 py-3 bg-emerald-600 text-white font-semibold rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isLoadMoreLoading[activeTab] ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <RefreshCw className="w-5 h-5 ml-3" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <ScrollControls />
    </>
  );
};

export default LegalNewsSection;