// src/components/RouteChangeTracker.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageVisitToStorage } from '../pages/dashboard/activity'; // Adjust path
import { APP_PAGE_DEFINITIONS, PageDefinition } from '../config/pageDefinitions'; // Adjust path

// This RouteChangeTracker will be used *inside* your RouterProvider context

interface RouteChangeTrackerProps {
  // You can pass the router's route configuration if needed for more complex matching,
  // but for simple path matching, APP_PAGE_DEFINITIONS might suffice.
  // routesConfig: ReturnType<typeof createBrowserRouter>['routes']; // If using matchRoutes with full config
}

const RouteChangeTracker: React.FC<RouteChangeTrackerProps> = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    let matchedPage: PageDefinition | undefined = undefined;

    // Attempt to find a matching page definition
    // This matching logic might need to be more sophisticated for complex apps
    // (e.g., handling dynamic segments like /cases/:id)

    // 1. Try exact match first for non-dashboard pages
    matchedPage = APP_PAGE_DEFINITIONS.find(
      p => !p.isDashboardPage && p.path === currentPath
    );

    // 2. Try matching dashboard pages (prefix with /dashboard)
    if (!matchedPage && currentPath.startsWith('/dashboard')) {
      const dashboardRelativePath = currentPath.substring('/dashboard'.length).replace(/^\//, ''); // Get path relative to /dashboard
      matchedPage = APP_PAGE_DEFINITIONS.find(
        p => p.isDashboardPage && p.path === (dashboardRelativePath || 'overview') // 'overview' is often the index
      );
    }

    // Fallback or more generic title if no specific match (optional)
    if (!matchedPage && currentPath.startsWith('/dashboard') && currentPath !== '/dashboard' && currentPath !== '/dashboard/') {
        // Generic dashboard page if not specifically defined but under /dashboard
        const parts = currentPath.split('/');
        const lastPart = parts[parts.length -1] || parts[parts.length -2]; // get last segment
         if (lastPart && lastPart !== 'dashboard') {
             matchedPage = {
                 id: `generic-dashboard-${lastPart}`,
                 title: `Dashboard: ${lastPart.charAt(0).toUpperCase() + lastPart.slice(1)}`,
                 path: currentPath, // Use full path for link
                 iconName: 'PanelRight', // Generic icon
                 isDashboardPage: true,
             }
         }
    } else if (!matchedPage && !currentPath.startsWith('/dashboard') && currentPath !== '/') {
         // Generic non-dashboard page
         const parts = currentPath.split('/');
         const lastPart = parts[parts.length -1] || parts[parts.length -2];
         if (lastPart) {
              matchedPage = {
                 id: `generic-${lastPart}`,
                 title: `${lastPart.charAt(0).toUpperCase() + lastPart.slice(1)} Page`,
                 path: currentPath,
                 iconName: 'Link',
             }
         }
    }


    if (matchedPage) {
      logPageVisitToStorage({
        id: matchedPage.id, // Ensure ID is unique
        title: matchedPage.title,
        link: currentPath, // Log the actual full path visited
        iconName: matchedPage.iconName,
      });
    } else {
      // Optionally log unmatched routes or handle them differently
      console.warn(`No page definition found for path: ${currentPath}`);
    }

  }, [location.pathname]); // Re-run when the path changes

  return null; // This component doesn't render anything itself
};

export default RouteChangeTracker;