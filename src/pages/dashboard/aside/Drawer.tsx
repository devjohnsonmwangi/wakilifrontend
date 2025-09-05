import { useState, useEffect, useMemo } from 'react';
import { ChevronsLeft, Search as SearchIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { filterDrawerByRole } from '../../../components/drawer/drawerData';

interface DrawerProps {
  isMobileMode?: boolean;
  mobileIsOpen?: boolean;
  onMobileClose?: () => void;
}

interface DrawerItem {
  id: string;
  name: string;
  link: string;
  icon: React.ElementType;
}

// Array of encouraging quotes
const quotes = [
  "Great choice! ⭐",
  "You're on the right track! 🌟",
  "Fantastic selection! 🎉",
  "Keep up the great work! 💪",
  "You're doing amazing! 🌈",
  "Believe in yourself! You can do it! 🌻",
  "Every step counts, keep moving forward! 🚀",
  "You're stronger than you think! 💖",
  "Don't forget to take a break and breathe! 🌬️",
  "Your effort today is your success tomorrow! 🌅",
  "Stay positive, work hard, make it happen! 🌟",
  "You are capable of achieving great things! 🏆",
  "Mistakes are proof that you are trying! ✨",
  "Your only limit is your mind! 🧠",
  "Keep pushing, you're almost there! ⏳",
  "Success is the sum of small efforts! 🌱",
  "Every day is a new beginning! 🌄",
  "You are doing better than you think! 👍",
  "Believe you can, and you're halfway there! 🌈",
  "Take it one day at a time! ☀️",
  "Your hard work will pay off! 💪",
];

const Drawer = ({
  isMobileMode = false,
  mobileIsOpen = false,
  onMobileClose,
}: DrawerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<DrawerItem | null>(null);
  const [quote, setQuote] = useState<string>('');
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();

  const actualIsOpen = isMobileMode ? mobileIsOpen : true;

  const handleLinkClick = (item: DrawerItem) => {
    setSelectedItem(item);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]); // Select a random quote
    if (isMobileMode && onMobileClose) {
      onMobileClose();
    }
  };

  const displayedItems: DrawerItem[] = useMemo(() => {
    const userRole = user.user?.role || 'guest';
    let items = filterDrawerByRole(userRole).map((item) => ({
      ...item,
      id: String(item.id),
    })) as DrawerItem[];

    if (searchTerm.trim() !== '') {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return items;
  }, [user.user?.role, searchTerm]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMode && mobileIsOpen && onMobileClose) {
        onMobileClose();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMode, mobileIsOpen, onMobileClose]);

  if (isMobileMode && !actualIsOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay for Mobile Mode */}
      {isMobileMode && actualIsOpen && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/70 z-20 lg:hidden backdrop-blur-sm"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer content panel */}
      <div
        id={isMobileMode ? "app-drawer" : "desktop-sidebar"}
        className={`
          overflow-y-hidden
          transition-transform duration-300 ease-in-out
          bg-gradient-to-b from-green-400 to-green-600 shadow-2xl rounded-l-lg
          flex flex-col
          ${isMobileMode
            ? `fixed left-0 top-16 w-72 sm:w-80 h-[calc(100vh-8rem)] z-30 transform ${actualIsOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden border-r`
            : `relative h-full w-64 flex-shrink-0 hidden lg:flex border-r`
          }
        `}
        tabIndex={-1}
        aria-labelledby="drawer-title"
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h5
            id="drawer-title"
            className="text-lg font-bold text-white uppercase tracking-wider underline"
          >
            Navigation
          </h5>
          {isMobileMode && (
            <button
              title="Close menu"
              className="text-white hover:bg-slate-700 p-1.5 rounded-full -mr-1"
              type="button"
              onClick={onMobileClose}
              aria-label="Close menu"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Input Area */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              name="search-drawer"
              id="search-drawer"
              className="block w-full pl-9 pr-3 py-2 text-sm rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 dark:focus:ring-green-400 dark:focus:border-green-400"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search menu items"
            />
          </div>
        </div>

        {/* Drawer Items List */}
        <div className="flex-grow p-3 overflow-y-auto">
          {displayedItems.length > 0 ? (
            <ul className="space-y-1.5 font-medium">
              {displayedItems.map((item: DrawerItem) => {
                const isActive = location.pathname === item.link ||
                                 (item.link !== "/" && location.pathname.startsWith(item.link) && item.link.length > 1);
                return (
                  <li key={item.id}>
                    <Link
                      to={item.link}
                      onClick={() => handleLinkClick(item)}
                      className={`flex items-center p-2 rounded-lg transition-all duration-200 ease-in-out group
                        ${isActive
                          ? 'bg-green-700 text-white shadow-md font-semibold'
                          : 'text-white hover:bg-green-500 hover:bg-opacity-50'
                        }
                      `}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.icon && (
                        <div
                          className={`
                            w-8 h-8 mr-3 rounded-lg flex items-center justify-center shrink-0
                            transition-all duration-200
                          `}
                          style={{ backgroundColor: isActive ? 'transparent' : 'rgba(255, 255, 255, 0.1)' }} // Light background for icons
                        >
                          <item.icon
                            className={`
                              w-5 h-5 transition-colors duration-200
                              ${isActive
                                ? 'text-white' 
                                : 'text-slate-200' 
                              }
                            `}
                          />
                        </div>
                      )}
                      <span className="flex-1 whitespace-nowrap text-sm">{item.name}</span>
                    </Link>
                    {/* Display encouraging quotes when an item is selected */}
                    {selectedItem && selectedItem.id === item.id && (
                      <div className="mt-2 text-center text-white transition-opacity duration-300 animate-fade-in">
                        <p className="text-sm">{quote}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="p-4 text-sm text-center text-slate-200 dark:text-slate-400">
              No items match your search.
            </p>
          )}
        </div>
      </div>

      {/* CSS for fancy pop-up animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out forwards;
        }
      `}</style>
    </>
  );
};

export default Drawer;
