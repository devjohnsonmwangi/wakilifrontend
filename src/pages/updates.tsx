import { useState, useEffect, useCallback, FC, SyntheticEvent } from 'react';
import {
  Newspaper, Globe, MapPin, Building, Scale, AlertTriangle,
  Loader2, ExternalLink, CalendarDays, Building2, LucideProps,
  Landmark, Users, Briefcase, Smartphone, Flame, HeartPulse, Atom, Clapperboard, Trophy
} from 'lucide-react';

// --- Navbar Stub ---
const Navbar: FC = () => {
  return (
    <nav className="bg-slate-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">News Portal</h1>
      </div>
    </nav>
  );
};
// --- End Navbar Stub ---

interface ArticleSource { id: string | null; name: string; }
interface Article {
  source: ArticleSource; author: string | null; title: string; description: string | null;
  url: string; urlToImage: string | null; publishedAt: string; content: string | null;
}
interface Category {
  id: string; name: string; Icon: React.FC<LucideProps>; rssFeedUrlTemplate?: string;
  directRssFeedUrl?: string; query?: string; lang?: string; countryCode?: string;
}
interface NewsCardProps { article: Article; }

const PAGE_SIZE_RSS = 20;
// Reverting to allorigins as an example, but acknowledging its potential failure.
// You can cycle through public proxies here if you find others.
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';


const CATEGORIES: Category[] = [
  { id: 'kenya_law_rss', name: 'Kenya Law', Icon: MapPin, rssFeedUrlTemplate: 'https://news.google.com/rss/search?q={QUERY}&hl=en-KE&gl=KE&ceid=KE:en', query: 'Kenya law OR legal OR judiciary' },
  { id: 'usa_politics_rss', name: 'USA Politics', Icon: Landmark, rssFeedUrlTemplate: 'https://news.google.com/rss/search?q={QUERY}&hl=en-US&gl=US&ceid=US:en', query: 'USA politics OR election OR government' },
  { id: 'tech_rss', name: 'Technology', Icon: Smartphone, rssFeedUrlTemplate: 'https://news.google.com/rss/search?q={QUERY}&hl=en-US&gl=US&ceid=US:en', query: 'technology OR AI OR startups' },
  { id: 'business_rss', name: 'Business', Icon: Briefcase, rssFeedUrlTemplate: 'https://news.google.com/rss/search?q={QUERY}&hl=en-US&gl=US&ceid=US:en', query: 'business OR economy OR finance' },
  { id: 'health_rss', name: 'Health', Icon: HeartPulse, rssFeedUrlTemplate: 'https://news.google.com/rss/search?q={QUERY}&hl=en-US&gl=US&ceid=US:en', query: 'health OR medicine OR wellness' },
  { id: 'science_rss', name: 'Science', Icon: Atom, rssFeedUrlTemplate: 'https://news.google.com/rss/search?q={QUERY}&hl=en-US&gl=US&ceid=US:en', query: 'science OR research OR discovery' }, // Used Atom
  { id: 'entertainment_rss', name: 'Entertainment', Icon: Clapperboard, rssFeedUrlTemplate: 'https://news.google.com/rss/search?q={QUERY}&hl=en-US&gl=US&ceid=US:en', query: 'entertainment OR movies OR music' }, // Used Clapperboard
  { id: 'sports_rss', name: 'Sports', Icon: Trophy, rssFeedUrlTemplate: 'https://news.google.com/rss/search?q={QUERY}&hl=en-US&gl=US&ceid=US:en', query: 'sports OR football OR basketball' }, // Used Trophy
  { id: 'china_news_rss', name: 'China News', Icon: Building2, rssFeedUrlTemplate: 'https://news.google.com/rss/search?q={QUERY}&hl=en-CN&gl=CN&ceid=CN:en', query: 'China' },
  { id: 'africa_news_rss', name: 'Africa News', Icon: Users, rssFeedUrlTemplate: 'https://news.google.com/rss/search?q={QUERY}&hl=en-ZA&gl=ZA&ceid=ZA:en', query: 'Africa' }, // Used Users
  { id: 'world_law_rss', name: 'World Law', Icon: Scale, rssFeedUrlTemplate: 'https://news.google.com/rss/search?q={QUERY}&hl=en-US&gl=US&ceid=US:en', query: '"international law" OR "global justice"' }, // Used Scale
  { id: 'world_news_rss', name: 'World News', Icon: Globe, rssFeedUrlTemplate: 'https://news.google.com/rss/search?q={QUERY}&hl=en-US&gl=US&ceid=US:en', query: 'world news' },
  { id: 'example_direct_rss', name: 'Example Direct', Icon: Building, directRssFeedUrl: 'https://www.example.com/nonexistent-feed.xml' },
  { id: 'trending_rss', name: 'Trending World', Icon: Flame, rssFeedUrlTemplate: 'https://news.google.com/rss/search?q={QUERY}&hl=en-US&gl=US&ceid=US:en', query: 'world news headlines' },
];

const NewsCard: FC<NewsCardProps> = ({ article }) => {
  if (!article || !article.title) return null;
  const formatDate = (isoDate: string | null | undefined): string => {
    if (!isoDate) return 'Date not available';
    try { return new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch (error) { return 'Invalid Date'; }
  };
  const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
    const placeholder = imgElement.parentElement?.querySelector('.image-placeholder');
    if (placeholder && placeholder instanceof HTMLElement) {
      placeholder.classList.remove('hidden');
      placeholder.classList.add('flex');
    }
  };
  return (
    <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md shadow-xl dark:shadow-slate-900/50 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col">
      <div className="relative w-full h-48 bg-slate-200 dark:bg-slate-700">
        {article.urlToImage && (<img src={article.urlToImage} alt={article.title || 'News image'} className="w-full h-full object-cover" onError={handleImageError}/>)}
        <div className={`image-placeholder absolute inset-0 w-full h-full bg-slate-200 dark:bg-slate-700 items-center justify-center ${article.urlToImage ? 'hidden' : 'flex'}`}>
          <Newspaper className="w-16 h-16 text-slate-400 dark:text-slate-500" />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 mb-2 leading-tight">{article.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center"><Building2 size={14} className="mr-1.5" /> {article.source?.name || 'Unknown Source'}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center"><CalendarDays size={14} className="mr-1.5" /> {formatDate(article.publishedAt)}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed flex-grow">{article.description ? `${article.description.substring(0, 150)}...` : 'No description available.'}</p>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="mt-auto self-start inline-flex items-center text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium group">
          Read More <ExternalLink size={16} className="ml-1.5 transform transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

const getText = (element: Element | null | undefined, query?: string): string | null => {
  if (!element) return null;
  const node = query ? element.querySelector(query) : element;
  return node?.textContent?.trim() || null;
};

const LegalNewsSection: FC = () => {
  const [activeTab, setActiveTab] = useState<string>(CATEGORIES[0].id);
  const [news, setNews] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (category: Category) => {
    setLoading(prev => ({ ...prev, [category.id]: true }));
    setError(null);
    let feedUrl: string | undefined;
    if (category.directRssFeedUrl) feedUrl = category.directRssFeedUrl;
    else if (category.rssFeedUrlTemplate && category.query) {
        feedUrl = category.rssFeedUrlTemplate
            .replace('{QUERY}', encodeURIComponent(category.query))
            .replace('{LANG}', category.lang || 'en-US')
            .replace('{COUNTRY_CODE}', category.countryCode || 'US');
    }
    if (!feedUrl) {
      setError(`Config Error: No RSS URL for ${category.name}.`);
      setLoading(prev => ({ ...prev, [category.id]: false }));
      return;
    }

    const urlToFetchViaProxy = `${CORS_PROXY_URL}${encodeURIComponent(feedUrl)}`;
    console.log(`Fetching RSS from: ${feedUrl} via proxy: ${urlToFetchViaProxy}`);

    try {
      const response = await fetch(urlToFetchViaProxy);
      console.log(`Proxy response status for ${category.name} (${feedUrl}): ${response.status}`);

      if (!response.ok) {
        let errorDetail = `HTTP status ${response.status} (${response.statusText})`;
        try {
          const bodyText = await response.text();
          console.error(`Proxy error body for ${category.name} from ${urlToFetchViaProxy}:`, bodyText.substring(0, 500));
          if (bodyText && !bodyText.trim().toLowerCase().startsWith("<!doctype html") && !bodyText.trim().toLowerCase().startsWith("<html")) {
            errorDetail += ` - Server message: ${bodyText.substring(0, 200)}`;
          } else if (bodyText) {
            errorDetail += ` - The proxy or target server returned an HTML error page (often a 403 Forbidden or CAPTCHA page from the target like Google).`;
          }
        } catch (e) {
          console.warn("Could not read error body from proxy response", e);
        }
        throw new Error(`Proxy/Feed fetch failed. ${errorDetail}. This often means the public proxy is blocked or the target server (e.g., Google News) denied the proxy's request.`);
      }

      const xmlString = await response.text();
      if (!xmlString || xmlString.trim() === "") {
          throw new Error("Proxy returned empty content. The feed might be empty or the proxy failed silently.");
      }

      const domParser = new DOMParser();
      const doc = domParser.parseFromString(xmlString, "application/xml");
      const parserError = doc.querySelector("parsererror");
      if (parserError) {
        console.error("XML Parsing Error:", parserError.textContent);
        throw new Error(`Failed to parse XML. Error: ${parserError.textContent?.substring(0,100) || "Unknown parsing error"}. This can happen if the proxy returned non-XML content (like an HTML error page).`);
      }

      const feedTitleElementRss = doc.querySelector("channel > title");
      const feedTitleElementAtom = doc.querySelector("feed > title");
      const feedTitle = getText(feedTitleElementRss) || getText(feedTitleElementAtom) || 'Unknown Feed';

      const items = Array.from(doc.querySelectorAll("item, entry"));
      if (items.length === 0 && xmlString.length > 0) {
        console.warn(`No <item> or <entry> tags found in the XML for ${category.name}. Feed might be empty or structured differently. XML received (first 1000 chars):`, xmlString.substring(0, 1000));
      }

      const articles: Article[] = items.slice(0, PAGE_SIZE_RSS).map((item): Article => {
        const title = getText(item, "title") || 'No Title';
        const linkElement = item.querySelector("link");
        const link = linkElement?.getAttribute('href') || getText(linkElement) || '#';
        
        // Fixed: use const for descriptionHtml as it's not reassigned
        const descriptionHtml = getText(item, "description") || getText(item, "summary") || getText(item, "content");
        let plainDescription = null;
        if (descriptionHtml) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = descriptionHtml;
            plainDescription = (tempDiv.textContent || tempDiv.innerText || "").trim().substring(0, 250);
        }

        const pubDateStr = getText(item, "pubDate") || getText(item, "published") || getText(item, "updated");
        const publishedAt = pubDateStr ? new Date(pubDateStr).toISOString() : new Date().toISOString();
        const author = getText(item, "author > name") || getText(item, "dc\\:creator") || getText(item, "creator");
        let urlToImage: string | null = null;
        const enclosure = item.querySelector("enclosure[type^='image']");
        if (enclosure) urlToImage = enclosure.getAttribute('url');
        if (!urlToImage) {
            const mediaContent = item.querySelector("media\\:content[medium='image'], content[medium='image']");
            if (mediaContent) urlToImage = mediaContent.getAttribute('url');
        }
        if (!urlToImage) {
            const mediaThumbnail = item.querySelector("media\\:thumbnail, thumbnail");
            if (mediaThumbnail) urlToImage = mediaThumbnail.getAttribute('url');
        }
        if (!urlToImage && descriptionHtml) {
            const imgMatch = descriptionHtml.match(/<img [^>]*src="([^"]+)"/);
            if (imgMatch && imgMatch[1]) urlToImage = imgMatch[1];
        }
        return {
          title, url: link, description: plainDescription, publishedAt, author,
          source: { id: feedUrl!, name: feedTitle }, urlToImage,
          content: plainDescription,
        };
      });
      setNews(prev => ({ ...prev, [category.id]: articles }));
    } catch (err) {
      console.error(`Error processing feed for '${category.name}':`, err);
      let errorMessage = 'Unknown error processing feed.';
      if (err instanceof Error) {
        errorMessage = err.message; // Display the more detailed error message we constructed
      }
      setError(`Error for ${category.name}: ${errorMessage}`);
      setNews(prev => ({ ...prev, [category.id]: [] }));
    } finally { setLoading(prev => ({ ...prev, [category.id]: false })); }
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
                News Feed Updates
              </span>
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
              Latest updates from various RSS feeds.
              <strong className="block mt-2 text-sm text-red-600 dark:text-red-400">
                WARNING: Uses public CORS proxies which are UNRELIABLE. 403 Forbidden errors from the proxy mean the target (e.g., Google News) is blocking the proxy. A backend proxy you control is the only stable solution.
              </strong>
            </p>
          </div>
          <div className="mb-8 md:mb-10 overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex space-x-1 sm:space-x-2 border-b border-slate-300 dark:border-slate-700 w-max sm:w-auto sm:justify-center">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center px-2.5 py-3 sm:px-4 sm:py-3.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-in-out focus:outline-none ${activeTab === cat.id ? 'border-b-2 border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-b-2 hover:border-emerald-300 dark:hover:border-emerald-600'}`}>
                  <cat.Icon size={16} className="mr-1.5 hidden sm:inline-block" /> {cat.name}
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
              <p className="ml-4 text-slate-600 dark:text-slate-300 text-lg">Loading News Feed...</p>
            </div>
          )}
          {!loading[activeTab] && !error && news[activeTab] && news[activeTab].length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {news[activeTab].map((article, index) => (<NewsCard key={article.url || `${article.title}-${index}`} article={article} />))}
            </div>
          )}
          {!loading[activeTab] && !error && (!news[activeTab] || news[activeTab].length === 0) && (
            <div className="text-center py-10">
              <Newspaper className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-lg">No articles found or feed could not be loaded.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">This might be due to public proxy issues or an empty feed. Try again later or select a different category.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default LegalNewsSection;