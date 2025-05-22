// src/pages/dashboard/main/ActivityLog/FullActivityHistory.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  Trash2,
  XCircle,
  CalendarDays,
  FileText,
  Briefcase,
  Users,
  Settings2,
  Info,
  PanelRight,
  // Add other icons that might be stored via iconName
  LayoutDashboard,
  MessageSquareWarning,
  Ticket,
  UserCog,
  CalendarClock,
  CreditCard,
  UserCircle2,
  LogOut,
  FolderKanban,
  BarChart3,
  Building2,
  FilePlus2,
  BellRing,
  ShieldCheck,
  Home as HomeIcon, // Renamed to avoid conflict if Home component is imported
  HelpCircle,
  LoaderCircle
} from 'lucide-react';
import {
  getStoredRecentPages,
  clearRecentPagesHistory,
  StoredVisitedPage,
} from './activity'; // Adjust path as needed

// --- Integrated timeAgo Function ---
const timeAgo = (date: Date | string | number): string => {
  const now = new Date();
  const seconds = Math.round((now.getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds} s ago`; // Shorter format
  const intervals: { [key: string]: { singular: string; plural: string; seconds: number } } = {
    yr: { singular: 'yr', plural: 'yrs', seconds: 31536000 },
    mo: { singular: 'mo', plural: 'mos', seconds: 2592000 },
    wk: { singular: 'wk', plural: 'wks', seconds: 604800 },
    day: { singular: 'day', plural: 'days', seconds: 86400 },
    hr: { singular: 'hr', plural: 'hrs', seconds: 3600 },
    min: { singular: 'min', plural: 'mins', seconds: 60 },
  };
  for (const i in intervals) {
    if (Object.prototype.hasOwnProperty.call(intervals, i)) {
      const interval = intervals[i];
      const counter = Math.floor(seconds / interval.seconds);
      if (counter > 0) return `${counter} ${counter === 1 ? interval.singular : interval.plural} ago`;
    }
  }
  return "a moment ago";
};

// Comprehensive iconMap - ensure this matches all possible iconNames stored
const iconMap: { [key: string]: React.ElementType } = {
  History, Search, Trash2, XCircle, CalendarDays, FileText, Briefcase, Users, Settings2, Info, PanelRight,
  LayoutDashboard, MessageSquareWarning, Ticket, UserCog, CalendarClock, CreditCard, UserCircle2, LogOut, FolderKanban,
  BarChart3, Building2, FilePlus2, BellRing, ShieldCheck, Home: HomeIcon, HelpCircle,
  // Add any other icon names used in your pageDefinitions.ts
  // Example: if you store 'MyCustomIcon', add: MyCustomIcon: YourLucideIconComponent
};

const FullActivityHistory: React.FC = () => {
  const [allPages, setAllPages] = useState<StoredVisitedPage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const fetchHistory = () => {
    setIsLoading(true);
    const pages = getStoredRecentPages(); // Already sorted by most recent in utility
    setAllPages(pages);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistory();

    // Listen for storage updates from other tabs/components
    const handleStorageUpdate = () => fetchHistory();
    window.addEventListener('wakiliStorageUpdated', handleStorageUpdate);
    // Also listen to the standard 'storage' event for cross-tab updates
    window.addEventListener('storage', (event) => {
        if (event.key === 'wakiliAppRecentPages') { // Check your storage key
            fetchHistory();
        }
    });

    return () => {
      window.removeEventListener('wakiliStorageUpdated', handleStorageUpdate);
      window.removeEventListener('storage', (event) => {
        if (event.key === 'wakiliAppRecentPages') fetchHistory();
      });
    };
  }, []);

  const filteredPages = useMemo(() => {
    if (!searchTerm.trim()) {
      return allPages;
    }
    return allPages.filter(page =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.link.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPages, searchTerm]);

  const handleClearHistory = () => {
    clearRecentPagesHistory();
    setAllPages([]); // Immediately update UI
    setShowClearConfirm(false);
    // Optionally dispatch event if other components need to know history was cleared
    window.dispatchEvent(new CustomEvent('wakiliStorageUpdated'));
  };

  const groupPagesByDate = (pages: StoredVisitedPage[]) => {
    const groups: { [key: string]: StoredVisitedPage[] } = {};
    pages.forEach(page => {
      const date = new Date(page.lastVisited).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(page);
    });
    return groups;
  };

  const groupedFilteredPages = useMemo(() => groupPagesByDate(filteredPages), [filteredPages]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <History size={32} className="mr-3 text-green-600" />
            Full Activity History
          </h1>
          {allPages.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center text-sm text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Trash2 size={16} className="mr-2" />
              Clear History
            </button>
          )}
        </div>
        <p className="text-slate-600 mt-1">
          Review all pages you've recently accessed on the Wakili platform.
        </p>
      </header>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search history by title or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
        />
        {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <XCircle className="h-5 w-5 text-slate-400 hover:text-slate-600"/>
            </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <LoaderCircle size={56} className="text-green-500 mx-auto animate-spin" />
          <p className="mt-4 text-slate-600">Loading your history...</p>
        </div>
      ) : Object.keys(groupedFilteredPages).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedFilteredPages)
            .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime()) // Sort date groups, newest first
            .map(([date, pagesInGroup]) => (
            <section key={date}>
              <h2 className="text-xl font-semibold text-slate-700 mb-3 sticky top-0 bg-slate-50 py-2 z-10">
                {date}
              </h2>
              <ul className="divide-y divide-slate-200 bg-white shadow-md rounded-lg overflow-hidden">
                {pagesInGroup
                  .sort((a,b) => b.lastVisited - a.lastVisited) // Sort items within group by time
                  .map((page) => {
                  const PageIcon = (page.iconName && iconMap[page.iconName]) || PanelRight; // Default Icon
                  return (
                    <li
                      key={page.id + page.lastVisited}
                      className="hover:bg-green-50/50 transition-colors duration-150"
                    >
                      <Link
                        to={page.link}
                        className="flex items-center space-x-4 p-4 group"
                      >
                        <div className={`flex-shrink-0 p-2.5 rounded-lg bg-slate-100 group-hover:bg-green-100 transition-colors`}>
                          <PageIcon size={22} className="text-slate-500 group-hover:text-green-600 transition-colors" strokeWidth={1.75}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-md font-medium text-slate-800 truncate group-hover:text-green-700 transition-colors">
                            {page.title}
                          </p>
                          <p className="text-sm text-slate-500 truncate">
                            {page.link}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-xs text-slate-500 group-hover:text-slate-700">
                                {new Date(page.lastVisited).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-xs text-slate-400 group-hover:text-slate-600">
                                {timeAgo(page.lastVisited)}
                            </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-md p-10">
          <History size={64} className="text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            {searchTerm ? 'No Matching History Found' : 'Your Activity History is Empty'}
          </h2>
          <p className="text-slate-500">
            {searchTerm
              ? 'Try a different search term or clear your search.'
              : "Pages you visit within the dashboard will appear here. Start navigating to build your history!"}
          </p>
        </div>
      )}

      {/* Confirmation Modal for Clearing History */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-start">
                <div className="p-2 bg-red-100 rounded-full mr-4">
                    <Trash2 size={24} className="text-red-500" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Clear Activity History?</h2>
                    <p className="text-slate-600 text-sm mb-6">
                    Are you sure you want to permanently delete all your visited page history? This action cannot be undone.
                    </p>
                </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
              >
                Yes, Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullActivityHistory;