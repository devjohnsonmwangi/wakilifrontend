// src/components/dashboard/DashboardOverview.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Users,
  Settings2,
  Info,
  ArrowRight,
  Bell,
  CircleUserRound,
  History,
  LoaderCircle,
  CalendarDays,
  Search,
  FilePlus2,
  BellRing,
  ShieldCheck,
  BarChart3,
  MessageSquareWarning,
  Sun,
  Moon,
} from 'lucide-react';
import { getStoredRecentPages, StoredVisitedPage } from '../../pages/dashboard/activity';
import { filterDrawerByRole } from '../../components/drawer/drawerData';

// --- Integrated timeAgo Function ---
const timeAgo = (date: Date | string | number): string => {
  const now = new Date();
  const seconds = Math.round((now.getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds} seconds ago`;
  const intervals: { [key: string]: number } = { year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60 };
  for (const i in intervals) {
    if (Object.prototype.hasOwnProperty.call(intervals, i)) {
      const counter = Math.floor(seconds / intervals[i]);
      if (counter > 0) return `${counter} ${i}${counter === 1 ? '' : 's'} ago`;
    }
  }
  return "a moment ago";
};

const iconMap: { [key: string]: React.ElementType } = {
  Briefcase,
  FileText,
  Users,
  Settings2,
  History,
  CalendarDays,
  LayoutDashboard: Info,
  Search,
  FilePlus2,
  BellRing,
  ShieldCheck,
  BarChart3,
  MessageSquareWarning,
  Ticket: MessageSquareWarning,
};

interface DashboardOverviewProps {
  userName: string;
  userEmail: string;
  userAvatarUrl?: string;
  notificationCount?: number;
  userRole: string;
}

interface ServiceCardItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  iconBgColor: string; // For light mode
  iconTextColor: string; // For light mode
  borderColor?: string; // For light mode
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  userName,
  userEmail,
  userAvatarUrl,
  notificationCount = 3,
  userRole,
}) => {
  const [recentPages, setRecentPages] = useState<StoredVisitedPage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
      return 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const fetchRecentPages = () => {
    setIsLoadingHistory(true);
    setRecentPages(getStoredRecentPages());
    setIsLoadingHistory(false);
  };

  useEffect(() => {
    fetchRecentPages();
    const handleStorageUpdate = () => fetchRecentPages();
    window.addEventListener('wakiliStorageUpdated', handleStorageUpdate);
    return () => {
      window.removeEventListener('wakiliStorageUpdated', handleStorageUpdate);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      fetchRecentPages();
    }
  }, [location.pathname]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const serviceCards: ServiceCardItem[] = filterDrawerByRole(userRole).map(item => ({
    id: item.id.toString(),
    title: item.name,
    description: `Access your ${item.name.toLowerCase()}.`,
    icon: item.icon || Info,
    link: item.link,
    iconBgColor: item.iconBgColor || 'bg-sky-100',
    iconTextColor: 'text-sky-600',
    borderColor: 'border-sky-500',
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 dark:from-slate-900 dark:via-gray-800 dark:to-slate-950 min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Header Section */}
      <header className="mb-8 md:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-sky-600 dark:from-green-500 dark:to-sky-500">{userName}</span>!
            </h1>
            <p className="text-md text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Welcome to your Wakili App Personal Dashboard command center. Email: {userEmail}
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-300/70 dark:hover:bg-slate-700/70 transition-colors"
              aria-label={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === 'light' ? (
                <Moon size={22} className="text-slate-600 dark:text-slate-300" />
              ) : (
                <Sun size={24} className="text-yellow-400" />
              )}
            </button>
            <Link to="/dashboard/notifications" className="relative p-2 rounded-full hover:bg-slate-300/70 dark:hover:bg-slate-700/70 transition-colors" aria-label="Notifications">
              <Bell size={24} className="text-slate-600 dark:text-slate-300" />
              {notificationCount > 0 && (
                <span className="absolute top-0.5 right-0.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-100 dark:ring-slate-800" />
              )}
            </Link>
            {userAvatarUrl ? (
              <img src={userAvatarUrl} alt={userName} className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-green-500 dark:border-green-400 p-0.5" />
            ) : (
              <CircleUserRound size={48} className="text-slate-400 dark:text-slate-500" />
            )}
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Quick Access / Services Section */}
        <section className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Your Toolkit</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Jump right into key actions and information.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-slate-900/50 max-h-[calc(60vh-2rem)] lg:max-h-[calc(80vh-10rem-env(safe-area-inset-bottom))] overflow-y-auto fancy-scrollbar">
            {serviceCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Link
                  key={card.id}
                  to={card.link}
                  className={`
                    group bg-white dark:bg-slate-800 p-5 rounded-xl shadow-lg 
                    flex flex-col relative overflow-hidden 
                    border-l-4 ${card.borderColor} dark:border-sky-700
                    
                    transition-all duration-300 ease-in-out
                    
                    hover:-translate-y-2 hover:scale-[1.03]
                    
                    /* === MORE INTENSE HOVER EFFECTS === */
                    hover:bg-gradient-to-br hover:from-green-50 hover:to-sky-50
                    dark:hover:bg-gradient-to-br dark:hover:from-green-950/60 dark:hover:to-slate-800
                    hover:border-green-500 dark:hover:border-green-400
                    hover:shadow-2xl dark:hover:shadow-green-400/30
                  `}
                >
                  <div className="flex items-start mb-3">
                    <div
                      className={`
                        p-3 rounded-lg ${card.iconBgColor} dark:bg-sky-900/50 mr-4 shadow-sm
                        
                        /* === ANIMATE ICON WRAPPER & CHANGE BG COLOR === */
                        transition-all duration-300 ease-in-out
                        group-hover:scale-110 group-hover:-rotate-6
                        group-hover:bg-green-500 dark:group-hover:bg-green-500
                      `}
                    >
                      <IconComponent
                        size={28}
                        className={`
                          ${card.iconTextColor} dark:text-sky-400
                          
                          /* === CHANGE ICON COLOR FOR CONTRAST === */
                          transition-colors duration-300
                          group-hover:text-white dark:group-hover:text-white
                        `}
                        strokeWidth={1.75}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors mt-1">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 flex-grow px-1">{card.description}</p>
                  <div className="mt-auto flex justify-end">
                    <span className="text-green-600 dark:text-green-400 font-medium text-sm group-hover:underline flex items-center">
                      Explore
                      <ArrowRight size={16} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2" strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent/Frequent Pages Section */}
        <section className="lg:col-span-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">Recently Visited</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Quickly jump back to pages you've recently accessed.</p>
          <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-slate-900/50 max-h-[calc(60vh-2rem)] lg:max-h-[calc(80vh-10rem-env(safe-area-inset-bottom))] overflow-y-auto fancy-scrollbar">
            {isLoadingHistory ? (
              <div className="text-center py-10">
                <LoaderCircle size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-3 animate-spin" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Loading history...</p>
              </div>
            ) : recentPages.length > 0 ? (
              <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {recentPages.map((page) => {
                  const PageIcon = (page.iconName && iconMap[page.iconName]) || History;
                  return (
                    <li key={page.id + page.lastVisited} className="py-3.5 px-2 hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition-colors duration-150 rounded-lg">
                      <Link to={page.link} className="flex items-center space-x-3 group cursor-pointer">
                        <div className={`flex-shrink-0 p-2 rounded-full bg-slate-100 dark:bg-slate-700`}>
                          <PageIcon size={20} className="text-slate-500 dark:text-slate-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate group-hover:text-green-600 dark:group-hover:text-green-400">
                            {page.title}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            Last visited: {timeAgo(page.lastVisited)}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-slate-400 dark:text-slate-500 self-center opacity-0 group-hover:opacity-100 group-hover:text-green-500 dark:group-hover:text-green-400 transition-all transform group-hover:translate-x-0.5" strokeWidth={2} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-10">
                <History size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">No recent activity yet.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Pages you visit will appear here.</p>
              </div>
            )}
            {recentPages.length > 0 && (
              <div className="pt-4 pb-1 text-center border-t border-slate-200 dark:border-slate-700 mt-2">
                <Link to="/dashboard/activity-log" className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:underline">
                  View Full History
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Navigation & Help Section - EXPANDED */}
      <section className="mt-10 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-slate-900/50 border-t-4 border-green-500 dark:border-green-600">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-shrink-0 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg shadow">
            <Info size={40} className="text-green-600 dark:text-green-400" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-1">Wakili Dashboard Guide</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-5 text-sm">
              Welcome to your command center! Here’s how to make the most of the Wakili platform:
            </p>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-md text-slate-700 dark:text-slate-200 mb-1.5 flex items-center">
                  <ArrowRight size={18} className="text-green-500 dark:text-green-400 mr-2 flex-shrink-0"/> Navigating with Ease
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm ml-7">
                  The **sidebar menu** on your left is your primary navigation tool. It provides quick access to all major sections like 'Manage Cases', 'Appointments Hub', 'Document Center', and your 'Account Settings'. Click on any item to jump directly to that module.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-md text-slate-700 dark:text-slate-200 mb-1.5 flex items-center">
                  <Search size={18} className="text-green-500 dark:text-green-400 mr-2 flex-shrink-0"/> Utilizing Search
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm ml-7">
                  Look for the **search bar** (usually at the top or within the sidebar). It's a powerful tool to quickly find specific cases, documents, clients, or appointments without browsing through lists. Try typing keywords, case numbers, or names.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-md text-slate-700 dark:text-slate-200 mb-1.5 flex items-center">
                  <FilePlus2 size={18} className="text-green-500 dark:text-green-400 mr-2 flex-shrink-0"/> Adding New Information
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm ml-7">
                  Most sections will have clear buttons like "Add New Case," "Schedule Appointment," or "Upload Document." These are typically found at the top right of the respective section's list view or via prominent action buttons.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-md text-slate-700 dark:text-slate-200 mb-1.5 flex items-center">
                  <BellRing size={18} className="text-green-500 dark:text-green-400 mr-2 flex-shrink-0"/> Staying Updated with Notifications
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm ml-7">
                  The **bell icon** in the header keeps you informed of important updates, new messages, upcoming deadlines, or system alerts. A red dot indicates unread notifications. Click it to view details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-md text-slate-700 dark:text-slate-200 mb-1.5 flex items-center">
                  <Settings2 size={18} className="text-green-500 dark:text-green-400 mr-2 flex-shrink-0"/> Customizing Your Experience
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm ml-7">
                  Visit your **Profile & Account Settings** (often accessible from the top-right user menu or sidebar) to update your personal details, change your password, manage notification preferences, and view your subscription or billing information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-md text-slate-700 dark:text-slate-200 mb-1.5 flex items-center">
                  <ShieldCheck size={18} className="text-green-500 dark:text-green-400 mr-2 flex-shrink-0"/> Security Best Practices
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm ml-7">
                  Always use a strong, unique password. Be mindful of where you access your account and ensure you log out when using shared computers. We employ robust security measures, but your diligence is also key.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Need more help? Visit our comprehensive <Link to="/dashboard/help" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium hover:underline">Help Center</Link> or <Link to="/dashboard/mytickets" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium hover:underline">contact our support team</Link>. We're here to assist you!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardOverview;