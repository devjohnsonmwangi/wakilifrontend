// FILE: src/pages/updates.tsx

import { useState, FC, SyntheticEvent } from 'react';
import { useFetchNewsQuery } from '../features/news/newsAPI'; 
import {
  Newspaper, Globe, Scale, AlertTriangle,
  Loader2, ExternalLink, CalendarDays, Building2, LucideProps,
  Users, ChevronUp, ChevronDown, RefreshCw
} from 'lucide-react';
import Navbar from '../components/navbar/Navbar';

// --- Type Definitions (These should match your newsApiSlice.ts) ---
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
}
interface Category {
  id: string;
  name: string;
  Icon: React.FC<LucideProps>;
  query: string;
}
interface NewsCardProps {
  article: Article;
}
// --- End Type Definitions ---

// --- Constants ---
const NEWS_CATEGORIES: Category[] = [
  { id: 'world_legal', name: 'World Law', Icon: Scale, query: '"international law" OR "human rights law"' },
  { id: 'world_politics', name: 'World Politics', Icon: Globe, query: '"global politics" OR "international relations"' },
  { id: 'east_africa_legal', name: 'EA Law', Icon: Globe, query: '("East African Community" OR Kenya OR Tanzania OR Uganda) AND (law OR legal)' },
  { id: 'east_africa_politics', name: 'EA Politics', Icon: Users, query: '("East African Community" OR Kenya OR Tanzania OR Uganda) AND politics' },
  { id: 'africa_legal', name: 'Africa Law', Icon: Globe, query: 'Africa AND (law OR legal OR "African Union")' },
  { id: 'africa_politics', name: 'Africa Politics', Icon: Users, query: 'Africa AND (politics OR government)' },
];

// --- Reusable Child Components ---

const NewsCard: FC<NewsCardProps> = ({ article }) => {
  if (!article || !article.title) return null;
  const formatDate = (isoDate: string): string => {
    try {
      return new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return 'Invalid Date'; }
  };
  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
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

// --- CORRECTED: Implemented ScrollControls to use the icons ---
const ScrollControls: FC = () => {
    // This state is local to the component, so we use useState, not Redux
    const [isVisible, setIsVisible] = useState(false);
    
    const handleScroll = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    };
    
    // We need useEffect here to add and remove the scroll event listener
    useState(() => {
        window.addEventListener('scroll', handleScroll);
        // Cleanup function to remove the listener when the component unmounts
        return () => window.removeEventListener('scroll', handleScroll);
    }); // Empty dependency array means this effect runs once on mount
    
    if (!isVisible) {
        return null; // Return null when not visible to avoid rendering anything
    }
  
    // Now it returns a React node (JSX), satisfying the FC type
    return (
      <div className={`fixed bottom-20 right-4 z-50 flex flex-col space-y-2`}>
        <button onClick={scrollToTop} aria-label="Scroll to top" className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800/70 text-white backdrop-blur-sm border border-slate-500/50 shadow-lg hover:bg-slate-700 transition-colors">
          <ChevronUp className="w-6 h-6" />
        </button>
        <button onClick={scrollToBottom} aria-label="Scroll to bottom" className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800/70 text-white backdrop-blur-sm border border-slate-500/50 shadow-lg hover:bg-slate-700 transition-colors">
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    );
};

// --- Main Page Component ---
const LegalNewsSection: FC = () => {
  const [activeTab, setActiveTab] = useState<Category>(NEWS_CATEGORIES[0]);
  const [page, setPage] = useState<number>(1);

  const {
    data,
    error,
    isLoading,
    isFetching,
  } = useFetchNewsQuery(
    { q: activeTab.query, page },
    { skip: !activeTab.query }
  );
  
  const handleTabChange = (category: Category) => {
    setActiveTab(category);
    setPage(1);
  };
  
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const articles = data?.articles || [];
  const totalResults = data?.totalResults || 0;
  const hasMore = articles.length < totalResults;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 pt-16 pb-16">
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
                    onClick={() => handleTabChange(cat)}
                    className={`flex items-center px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-200 dark:focus:ring-offset-slate-800 ${activeTab.id === cat.id ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60'}`}
                  >
                    <cat.Icon size={16} className="mr-2" />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="min-h-[400px]">
            {isLoading && page === 1 && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 text-emerald-500 dark:text-emerald-400 animate-spin" />
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center p-6 bg-red-100 dark:bg-red-800/60 border border-red-300 dark:border-red-700/50 rounded-lg shadow-md">
                <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Error Fetching News</h3>
                <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                  {'data' in error && typeof error.data === 'object' && error.data && 'message' in error.data
                    ? (error.data as { message?: string }).message
                    : 'An unexpected error occurred.'}
                </p>
              </div>
            )}

            {articles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {/* --- CORRECTED: Added types to map parameters --- */}
                {articles.map((article: Article, index: number) => (
                  <NewsCard key={`${article.url}-${index}`} article={article} />
                ))}
              </div>
            )}
            
            {!isLoading && !error && articles.length === 0 && (
              <div className="text-center py-16">
                <Newspaper className="h-20 w-20 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <h4 className="text-slate-600 dark:text-slate-300 text-xl font-semibold">No Articles Found</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">There are currently no news articles for this category.</p>
              </div>
            )}

            <div className="mt-12 text-center">
              {hasMore && !isFetching && (
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center justify-center px-8 py-3 bg-emerald-600 text-white font-semibold rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105"
                >
                  Load More
                  <RefreshCw className="w-5 h-5 ml-3" />
                </button>
              )}
              {isFetching && page > 1 && (
                <div className="flex items-center justify-center text-slate-500 dark:text-slate-400 font-semibold">
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Loading more articles...
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <ScrollControls />
    </>
  );
};

export default LegalNewsSection;