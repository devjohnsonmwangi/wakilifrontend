import { useState, useEffect, useMemo } from 'react';
import { ChevronsLeft, Search as SearchIcon } from 'lucide-react'; // Added SearchIcon
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store'; // Adjust path
import {  filterDrawerByRole } from '../../../components/drawer/drawerData'; // Adjust path, ensure filterDrawerByRole is exported

interface DrawerProps {
  isMobileMode?: boolean;
  mobileIsOpen?: boolean;
  onMobileClose?: () => void;
}

const Drawer = ({
  isMobileMode = false,
  mobileIsOpen = false,
  onMobileClose,
}: DrawerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();

  const actualIsOpen = isMobileMode ? mobileIsOpen : true;

  const handleLinkClick = () => {
    if (isMobileMode && onMobileClose) {
      onMobileClose();
    }
    // Optionally clear search term on navigation
    // setSearchTerm('');
  };

  // Memoize filtered items for performance
  const displayedItems = useMemo(() => {
    const userRole = user.user?.role || 'guest'; // Default to a non-privileged role if undefined
    let items = filterDrawerByRole(userRole); // Use the robust filter function

    if (searchTerm.trim() !== '') {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return items;
  }, [user.user?.role, searchTerm]);

  useEffect(() => {
    // Effect to close mobile drawer if window resizes to desktop width
    // This is a fallback; usually, the parent component's conditional rendering handles this.
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMode && mobileIsOpen && onMobileClose) {
        // Consider if this is truly needed or if it causes issues with parent state.
        // onMobileClose();
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
          className="fixed inset-0 bg-black/60 dark:bg-black/70 z-20 lg:hidden backdrop-blur-sm" // Enhanced overlay
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer content panel */}
      <div
        id={isMobileMode ? "app-drawer" : "desktop-sidebar"}
        className={`
          overflow-y-hidden /* Prevent double scrollbars, inner div will scroll */
          transition-transform duration-300 ease-in-out
          bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700
          flex flex-col /* Ensure it's a flex column */
          ${isMobileMode
            ? `fixed left-0 top-16 w-72 sm:w-80 h-[calc(100vh-8rem)] z-30 transform ${actualIsOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden border-r shadow-xl` // Mobile: fixed, below top-nav, above bottom-nav, added shadow
            : `relative h-full w-64 flex-shrink-0 hidden lg:flex border-r` // Desktop: part of layout
          }
        `}
        tabIndex={-1}
        aria-labelledby="drawer-title"
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h5
            id="drawer-title"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            Navigation
          </h5>
          {isMobileMode && (
            <button
              title="Close menu"
              className="text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 p-1.5 rounded-full -mr-1"
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
              className="block w-full pl-9 pr-3 py-2 text-sm rounded-md
                         bg-white dark:bg-slate-700
                         border border-slate-300 dark:border-slate-600
                         text-slate-900 dark:text-slate-100
                         placeholder-slate-400 dark:placeholder-slate-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search menu items"
            />
          </div>
        </div>

        {/* Drawer Items List */}
        <div className="flex-grow p-3 overflow-y-auto"> {/* Inner scroll for items */}
          {displayedItems.length > 0 ? (
            <ul className="space-y-1.5 font-medium">
              {displayedItems.map((item) => {
                const isActive = location.pathname === item.link ||
                                 (item.link !== "/" && location.pathname.startsWith(item.link) && item.link.length > 1);
                return (
                  <li key={item.id}>
                    <Link
                      to={item.link}
                      onClick={handleLinkClick}
                      className={`flex items-center p-2.5 rounded-lg transition-all duration-200 ease-in-out group
                        ${isActive
                          ? 'bg-blue-500 text-white dark:bg-blue-600 dark:text-white shadow-sm font-semibold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-slate-50'
                        }
                      `}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.icon && (
                        <item.icon
                          className={`w-5 h-5 mr-3 shrink-0 transition-colors duration-200
                            ${isActive
                              ? 'text-white dark:text-blue-100'
                              : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                            }
                          `}
                        />
                      )}
                      <span className="flex-1 whitespace-nowrap text-sm">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="p-4 text-sm text-center text-slate-500 dark:text-slate-400">
              No items match your search.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Drawer;