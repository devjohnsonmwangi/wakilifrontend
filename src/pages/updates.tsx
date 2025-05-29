import { useState, useEffect, useCallback, FC, SyntheticEvent } from 'react'; // Added FC and SyntheticEvent
import { Newspaper, Globe, MapPin, Building, Scale, AlertTriangle, Loader2, ExternalLink, CalendarDays, Building2, LucideProps } from 'lucide-react'; // Import LucideProps

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
  Icon: React.FC<LucideProps>; // Type for Lucide icon components
  query: string;
  country?: string; // Optional country code
}

interface NewsCardProps {
  article: Article;
}

// --- End TypeScript Type Definitions ---


// !!! WARNING: API Key hardcoded. Not recommended for production. !!!
const API_KEY = '0dd6564dccaf43a486afa01c50f9bbe2';
const BASE_URL = 'https://newsapi.org/v2/everything';

const CATEGORIES: Category[] = [ // Typed CATEGORIES array
  { id: 'kenya', name: 'Kenya', Icon: MapPin, query: 'law OR legal OR court OR judiciary', country: 'ke' },
  { id: 'east_africa', name: 'East Africa', Icon: Globe, query: '"East Africa" AND (law OR legal OR court OR judiciary)' },
  { id: 'africa', name: 'Africa', Icon: Globe, query: 'Africa AND (law OR legal OR court OR judiciary)' },
  { id: 'usa', name: 'America (USA)', Icon: Building, query: 'law OR legal OR court OR judiciary', country: 'us' },
  { id: 'china', name: 'China', Icon: Building2, query: 'law OR legal OR court OR judiciary', country: 'cn' },
  { id: 'world', name: 'World', Icon: Scale, query: 'international law OR global legal OR world court' },
];

const NewsCard: FC<NewsCardProps> = ({ article }) => { // Typed props
  if (!article || !article.title) return null;

  const formatDate = (isoDate: string | null | undefined): string => { // Typed parameter and return
    if (!isoDate) return 'Date not available';
    try {
      return new Date(isoDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    // Correctly type the event and target
    (event.target as HTMLImageElement).style.display = 'none';
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md shadow-xl dark:shadow-slate-900/50 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col">
      {article.urlToImage ? (
        <img src={article.urlToImage} alt={article.title || 'News image'} className="w-full h-48 object-cover" onError={handleImageError} />
      ) : (
        <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <Newspaper className="w-16 h-16 text-slate-400 dark:text-slate-500" />
        </div>
      )}
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
          {article.description ? `${article.description.substring(0, 100)}...` : 'No description available.'}
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


const LegalNewsSection: FC = () => { // Typed as a Functional Component
  const [activeTab, setActiveTab] = useState<string>(CATEGORIES[0].id);
  const [news, setNews] = useState<Record<string, Article[]>>({}); // Typed state
  const [loading, setLoading] = useState<Record<string, boolean>>({}); // Typed state
  const [error, setError] = useState<string | null>(null); // Typed state

  const fetchNews = useCallback(async (category: Category) => { // Typed parameter
    if (!API_KEY) {
      setError("News API key is missing. Please configure it."); // This should work with string | null
      setLoading(prev => ({ ...prev, [category.id]: false }));
      return;
    }

    setLoading(prev => ({ ...prev, [category.id]: true }));
    setError(null);

    let url = `${BASE_URL}?q=${encodeURIComponent(category.query)}&language=en&sortBy=publishedAt&pageSize=6&apiKey=${API_KEY}`;
    if (category.country) {
      url += `&country=${category.country}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (errorData && typeof errorData.message === 'string') {
            errorMessage = errorData.message;
        }
         if (errorData.code === 'apiKeyInvalid' || errorData.code === 'apiKeyMissing') {
          throw new Error('Invalid or missing API Key. Please check the key.');
        } else if (errorData.code === 'rateLimited') {
          throw new Error('API rate limit exceeded. Please try again later.');
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      // Assuming data.articles is an array of Article or undefined
      setNews(prev => ({ ...prev, [category.id]: data.articles || [] }));
    } catch (err) { // Type err
      console.error("Failed to fetch news for", category.name, ":", err);
      if (err instanceof Error) {
        setError(`Failed to fetch news for ${category.name}: ${err.message}. Check console for details.`);
      } else {
        setError(`Failed to fetch news for ${category.name}: An unknown error occurred.`);
      }
      setNews(prev => ({ ...prev, [category.id]: [] }));
    } finally {
      setLoading(prev => ({ ...prev, [category.id]: false }));
    }
  }, []);

  useEffect(() => {
    const currentCategory = CATEGORIES.find(cat => cat.id === activeTab);
    if (currentCategory && (!news[activeTab] || news[activeTab].length === 0)) { // Check if news for tab is empty too
      fetchNews(currentCategory);
    }
  }, [activeTab, fetchNews, news]);


  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-sky-500 dark:from-emerald-400 dark:to-sky-400">
              Hot Legal News
            </span>
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
            Stay updated with the latest law-related developments from around the globe.
          </p>
        </div>

        <div className="mb-8 md:mb-10 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex space-x-2 sm:space-x-3 border-b border-slate-300 dark:border-slate-700 w-max sm:w-auto sm:justify-center">
            {CATEGORIES.map((cat) => ( // cat is now typed via CATEGORIES array
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center px-3 py-3 sm:px-5 sm:py-3.5 text-sm sm:text-base font-medium transition-colors duration-200 ease-in-out focus:outline-none
                  ${activeTab === cat.id
                    ? 'border-b-2 border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-b-2 hover:border-emerald-300 dark:hover:border-emerald-600'
                  }`}
              >
                <cat.Icon size={18} className="mr-2 hidden sm:inline-block" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        {error && (
          <div className="flex items-center justify-center p-6 mb-8 bg-red-100 dark:bg-red-800/60 border border-red-300 dark:border-red-700/50 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* News Grid: news[activeTab] and loading[activeTab] are now correctly typed */}
        {loading[activeTab] ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-emerald-500 dark:text-emerald-400 animate-spin" />
            <p className="ml-4 text-slate-600 dark:text-slate-300 text-lg">Loading News...</p>
          </div>
        ) : news[activeTab] && news[activeTab].length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* article and index are now correctly inferred */}
            {news[activeTab].map((article, index) => (
              <NewsCard key={article.url || index.toString()} article={article} />
            ))}
          </div>
        ) : (
          !loading[activeTab] && (
            <div className="text-center py-10">
              <Newspaper className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                No news articles found for this category or an error occurred.
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default LegalNewsSection;