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
} from 'lucide-react';
import { getStoredRecentPages, StoredVisitedPage } from '../../pages/dashboard/activity'; 
import {  filterDrawerByRole } from '../../components/drawer/drawerData'; // Adjust the import path

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

// Map string icon names from storage back to Lucide components
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
  // Add any other icons as needed
};

interface DashboardOverviewProps {
  userName: string;
  userEmail: string;
  userAvatarUrl?: string;
  notificationCount?: number;
  userRole: string; // Add userRole prop
}

interface ServiceCardItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  iconBgColor: string;
  iconTextColor: string;
  borderColor?: string;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  userName,
  userEmail,
  userAvatarUrl,
  notificationCount = 3,
  userRole, // Receive userRole as a prop
}) => {
  const [recentPages, setRecentPages] = useState<StoredVisitedPage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const location = useLocation();

  const fetchRecentPages = () => {
    setIsLoadingHistory(true);
    setRecentPages(getStoredRecentPages());
    setIsLoadingHistory(false);
  };

  useEffect(() => {
    fetchRecentPages();
    const handleStorageUpdate = () => {
      fetchRecentPages();
    };
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

  // Filter service cards based on user role
  const serviceCards: ServiceCardItem[] = filterDrawerByRole(userRole).map(item => ({
    id: item.id.toString(),
    title: item.name,
    description: `Access your ${item.name.toLowerCase()}.`,
    icon: item.icon || Info, // Default icon if none is provided
    link: `/dashboard/${item.link}`, // Adjust link to match your routing
    iconBgColor: 'bg-sky-100', // You can customize this based on item
    iconTextColor: 'text-sky-600', // You can customize this based on item
    borderColor: 'border-sky-500', // You can customize this based on item
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 min-h-screen text-slate-800">
      {/* Header Section */}
      <header className="mb-8 md:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-sky-600">{userName}</span>!
            </h1>
            <p className="text-md text-slate-600 mt-1">
              Welcome to your Wakili command center. Email: {userEmail}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard/notifications" className="relative p-2 rounded-full hover:bg-slate-300/70 transition-colors" aria-label="Notifications">
              <Bell size={24} className="text-slate-600" />
              {notificationCount > 0 && (
                <span className="absolute top-0.5 right-0.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-100" />
              )}
            </Link>
            {userAvatarUrl ? (
              <img src={userAvatarUrl} alt={userName} className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-green-500 p-0.5" />
            ) : (
              <CircleUserRound size={48} className="text-slate-400" />
            )}
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Quick Access / Services Section */}
        <section className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">Your Toolkit</h2>
          <p className="text-slate-500 mb-6">Jump right into key actions and information.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl shadow-lg max-h-[calc(60vh-2rem)] lg:max-h-[calc(80vh-10rem-env(safe-area-inset-bottom))] overflow-y-auto fancy-scrollbar">
            {serviceCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Link
                  key={card.id}
                  to={card.link}
                  className={`group bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col relative overflow-hidden border-l-4 ${card.borderColor || 'border-transparent'}`}
                >
                  <div className="flex items-start mb-3">
                    <div className={`p-3 rounded-lg ${card.iconBgColor} mr-4 shadow-sm`}>
                      <IconComponent size={28} className={card.iconTextColor} strokeWidth={1.75} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-green-600 transition-colors mt-1">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 flex-grow px-1">{card.description}</p>
                  <div className="mt-auto flex justify-end">
                    <span className="text-green-600 font-medium text-sm group-hover:underline flex items-center">
                      Explore
                      <ArrowRight size={16} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1" strokeWidth={2} />
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
            <h2 className="text-2xl font-semibold text-slate-700">Recently Visited</h2>
          </div>
          <p className="text-slate-500 mb-6">Quickly jump back to pages you've recently accessed.</p>
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg max-h-[calc(60vh-2rem)] lg:max-h-[calc(80vh-10rem-env(safe-area-inset-bottom))] overflow-y-auto fancy-scrollbar">
            {isLoadingHistory ? (
              <div className="text-center py-10">
                <LoaderCircle size={48} className="text-slate-300 mx-auto mb-3 animate-spin" />
                <p className="text-slate-500 font-medium">Loading history...</p>
              </div>
            ) : recentPages.length > 0 ? (
              <ul className="divide-y divide-slate-200">
                {recentPages.map((page) => {
                  const PageIcon = (page.iconName && iconMap[page.iconName]) || History;
                  return (
                    <li key={page.id + page.lastVisited} className="py-3.5 px-2 hover:bg-slate-50/70 transition-colors duration-150">
                      <Link to={page.link} className="flex items-center space-x-3 group cursor-pointer">
                        <div className={`flex-shrink-0 p-2 rounded-full bg-slate-100`}>
                          <PageIcon size={20} className="text-slate-500 group-hover:text-green-600" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate group-hover:text-green-600">
                            {page.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Last visited: {timeAgo(page.lastVisited)}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-slate-400 self-center opacity-0 group-hover:opacity-100 group-hover:text-green-500 transition-all transform group-hover:translate-x-0.5" strokeWidth={2} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-10">
                <History size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No recent activity yet.</p>
                <p className="text-xs text-slate-400">Pages you visit will appear here.</p>
              </div>
            )}
            {recentPages.length > 0 && (
              <div className="pt-4 pb-1 text-center border-t border-slate-200 mt-2">
                <Link to="/dashboard/activity-log" className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline">
                  View Full History
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Navigation & Help Section - EXPANDED */}
      <section className="mt-10 bg-white p-6 sm:p-8 rounded-xl shadow-lg border-t-4 border-green-500">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-shrink-0 p-4 bg-green-100 rounded-lg shadow">
            <Info size={40} className="text-green-600" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-700 mb-1">Wakili Dashboard Guide</h2>
            <p className="text-slate-600 mb-5 text-sm">
              Welcome to your command center! Here’s how to make the most of the Wakili platform:
            </p>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-md text-slate-700 mb-1.5 flex items-center">
                  <ArrowRight size={18} className="text-green-500 mr-2 flex-shrink-0"/> Navigating with Ease
                </h3>
                <p className="text-slate-500 text-sm ml-7">
                  The **sidebar menu** on your left is your primary navigation tool. It provides quick access to all major sections like 'Manage Cases', 'Appointments Hub', 'Document Center', and your 'Account Settings'. Click on any item to jump directly to that module.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-md text-slate-700 mb-1.5 flex items-center">
                  <Search size={18} className="text-green-500 mr-2 flex-shrink-0"/> Utilizing Search
                </h3>
                <p className="text-slate-500 text-sm ml-7">
                  Look for the **search bar** (usually at the top or within the sidebar). It's a powerful tool to quickly find specific cases, documents, clients, or appointments without browsing through lists. Try typing keywords, case numbers, or names.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-md text-slate-700 mb-1.5 flex items-center">
                  <FilePlus2 size={18} className="text-green-500 mr-2 flex-shrink-0"/> Adding New Information
                </h3>
                <p className="text-slate-500 text-sm ml-7">
                  Most sections will have clear buttons like "Add New Case," "Schedule Appointment," or "Upload Document." These are typically found at the top right of the respective section's list view or via prominent action buttons.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-md text-slate-700 mb-1.5 flex items-center">
                  <BellRing size={18} className="text-green-500 mr-2 flex-shrink-0"/> Staying Updated with Notifications
                </h3>
                <p className="text-slate-500 text-sm ml-7">
                  The **bell icon** in the header keeps you informed of important updates, new messages, upcoming deadlines, or system alerts. A red dot indicates unread notifications. Click it to view details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-md text-slate-700 mb-1.5 flex items-center">
                  <Settings2 size={18} className="text-green-500 mr-2 flex-shrink-0"/> Customizing Your Experience
                </h3>
                <p className="text-slate-500 text-sm ml-7">
                  Visit your **Profile & Account Settings** (often accessible from the top-right user menu or sidebar) to update your personal details, change your password, manage notification preferences, and view your subscription or billing information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-md text-slate-700 mb-1.5 flex items-center">
                  <ShieldCheck size={18} className="text-green-500 mr-2 flex-shrink-0"/> Security Best Practices
                </h3>
                <p className="text-slate-500 text-sm ml-7">
                  Always use a strong, unique password. Be mindful of where you access your account and ensure you log out when using shared computers. We employ robust security measures, but your diligence is also key.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Need more help? Visit our comprehensive <Link to="/dashboard/help" className="text-green-600 hover:text-green-700 font-medium hover:underline">Help Center</Link> or <Link to="/dashboard/mytickets" className="text-green-600 hover:text-green-700 font-medium hover:underline">contact our support team</Link>. We're here to assist you!
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
