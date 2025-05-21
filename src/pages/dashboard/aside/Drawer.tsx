import { useState, useEffect } from 'react';
import { ChevronsLeft } from 'lucide-react'; // ChevronsRight might not be needed if mobile is only close
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store'; // Adjust path
import { DrawerData, drawerData } from '../../../components/drawer/drawerData'; // Adjust path

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
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();

  // In mobile mode, 'mobileIsOpen' prop controls visibility.
  // For desktop, it's always "open" as part of the layout.
  const actualIsOpen = isMobileMode ? mobileIsOpen : true;

  const handleLinkClick = () => {
    if (isMobileMode && onMobileClose) {
      onMobileClose();
    }
  };

  // Effect to close mobile drawer if window resizes to desktop width
  // (Navbar's conditional rendering of the mobile Drawer instance usually handles this too)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMode && mobileIsOpen && onMobileClose) {
        // onMobileClose(); // This can cause abrupt closing; often better handled by Navbar
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMode, mobileIsOpen, onMobileClose]);

  useEffect(() => {
    setIsAdmin(user.user?.role === 'admin');
  }, [user]);

  const filterDrawerItems = (item: DrawerData): boolean => {
    if (isAdmin) return true;
    return !item.adminOnly;
  };

  if (isMobileMode && !actualIsOpen) {
    return null; // Don't render if mobile and closed
  }

  return (
    <>
      {/* Overlay for Mobile Mode */}
      {isMobileMode && actualIsOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" // Overlay z-index
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer content panel */}
      <div
        id={isMobileMode ? "app-drawer" : "desktop-sidebar"} // For aria-controls
        className={`
          overflow-y-auto transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
          ${isMobileMode
            ? `fixed left-0 top-16 w-64 sm:w-72 h-[calc(100vh-8rem)] z-30 transform ${actualIsOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden border-r` // Mobile: fixed, below top-nav, above bottom-nav
            : `relative h-full w-64 flex-shrink-0 hidden lg:flex lg:flex-col border-r` // Desktop: part of layout
          }
        `}
        tabIndex={-1}
        aria-labelledby="drawer-title"
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h5
            id="drawer-title"
            className="text-base font-semibold text-gray-600 dark:text-gray-300 uppercase"
          >
            Menu
          </h5>
          {/* Close button for mobile drawer */}
          {isMobileMode && (
            <button
              title="Close menu"
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full -mr-2"
              type="button"
              onClick={onMobileClose}
              aria-label="Close menu"
            >
              <ChevronsLeft className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Drawer Items List */}
        <div className="flex-grow p-4 overflow-y-auto"> {/* Inner scroll for items */}
          <ul className="space-y-1 font-medium">
            {drawerData
              .filter(filterDrawerItems)
              .map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.link}
                    onClick={handleLinkClick}
                    className={`flex items-center p-2.5 rounded-lg text-gray-700 dark:text-white hover:bg-green-50 dark:hover:bg-gray-700 group
                      ${location.pathname === item.link || (item.link !== "/" && location.pathname.startsWith(item.link) && item.link.length > 1)
                        ? 'bg-green-100 dark:bg-gray-600 text-green-700 dark:text-green-300 font-semibold'
                        : ''
                      }
                    `}
                    aria-current={location.pathname === item.link ? "page" : undefined}
                  >
                    {item.icon && <item.icon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 shrink-0" />}
                    <span className="flex-1 whitespace-nowrap">{item.name}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Drawer;