// src/utils/activityStorage.ts

export interface StoredVisitedPage {
    id: string;
    title: string;
    link: string;
    lastVisited: number; // Store timestamp as number for easier JSON serialization
    visitCount: number;
    iconName?: keyof typeof import('lucide-react'); // Store icon name as string
  }
  
  const MAX_RECENT_PAGES = 7; // Max number of recent pages to store
  const STORAGE_KEY = 'wakiliAppRecentPages';
  
  // Helper to get Lucide icon component by name (if needed outside DashboardOverview)
  // For now, DashboardOverview will handle mapping iconName back to component
  // import * as LucideIcons from 'lucide-react';
  // export const getIconComponent = (iconName?: keyof typeof LucideIcons): React.ElementType | undefined => {
  //   if (!iconName || !LucideIcons[iconName]) return undefined;
  //   return LucideIcons[iconName] as React.ElementType;
  // };
  
  
  export const getStoredRecentPages = (): StoredVisitedPage[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const pages: StoredVisitedPage[] = JSON.parse(stored);
        
        return pages.sort((a, b) => b.lastVisited - a.lastVisited); // Ensures sorted by most recent
      }
    } catch (error) {
      console.error("Error reading recent pages from localStorage:", error);
    }
    return [];
  };
  
  export const logPageVisitToStorage = (page: {
    id: string;
    title: string;
    link: string;
    iconName?: keyof typeof import('lucide-react'); // Pass the string name of the Lucide icon
  }): void => {
    try {
      const currentPages = getStoredRecentPages();
      const now = Date.now();
  
      const existingPageIndex = currentPages.findIndex(p => p.id === page.id);
  
      if (existingPageIndex > -1) {
        // Page already in list, update its timestamp and visit count, move to top
        const updatedPage = {
          ...currentPages[existingPageIndex],
          lastVisited: now,
          visitCount: (currentPages[existingPageIndex].visitCount || 0) + 1,
        };
        currentPages.splice(existingPageIndex, 1); // Remove old entry
        currentPages.unshift(updatedPage); // Add updated entry to the beginning
      } else {
        // New page visit, add to top
        const newEntry: StoredVisitedPage = {
          ...page,
          lastVisited: now,
          visitCount: 1,
        };
        currentPages.unshift(newEntry);
      }
  
      // Keep list to a certain size
      const pagesToStore = currentPages.slice(0, MAX_RECENT_PAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pagesToStore));
  
    } catch (error) {
      console.error("Error logging page visit to localStorage:", error);
    }
  };
  
  //Function to clear history
  export const clearRecentPagesHistory = (): void => {
      try {
          localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
          console.error("Error clearing recent pages history from localStorage:", error);
      }
  }