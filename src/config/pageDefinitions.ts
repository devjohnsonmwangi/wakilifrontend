// src/config/pageDefinitions.ts
import * as LucideIcons from 'lucide-react'; // Import all for mapping

export interface PageDefinition {
  path: string; // The exact path or a base path for regex matching
  id: string; // Unique ID for this page definition
  title: string; // User-friendly title
  iconName?: keyof typeof LucideIcons; // Optional Lucide icon name
  isDashboardPage?: boolean; // Flag if it's part of the main dashboard layout
  // Add any other metadata you might need
}

// This list needs to be comprehensive and match your router paths
export const APP_PAGE_DEFINITIONS: PageDefinition[] = [
  // Non-Dashboard Pages
  { path: '/', id: 'home', title: 'Homepage', iconName: 'Home' },
  { path: '/register', id: 'register', title: 'Create Account', iconName: 'UserPlus' },
  { path: '/login', id: 'login', title: 'Login', iconName: 'LogIn' },
  { path: '/howitworks', id: 'howitworks', title: 'How It Works', iconName: 'HelpCircle' },
  { path: '/contactus', id: 'contactus', title: 'Contact Us', iconName: 'Mail' },
  { path: '/services', id: 'services', title: 'Our Services', iconName: 'Briefcase' }, // Assuming Briefcase for general services
  { path: '/about', id: 'about', title: 'About Us', iconName: 'Info' },
  { path: '/forgot-password', id: 'forgot-password', title: 'Forgot Password', iconName: 'KeyRound' },
  { path: '/reset-password', id: 'reset-password', title: 'Reset Password', iconName: 'KeyRound' }, // Path might include token

  // Standalone Dashboard-like pages (if any outside the /dashboard/* structure)
  // For example, if /profile was outside /dashboard/profile
  // { path: '/profile', id: 'standalone-profile', title: 'My Profile', iconName: 'UserCog', isDashboardPage: false },


  // Dashboard Pages (these will be prefixed with /dashboard)
  // The `path` here is relative to the '/dashboard' parent route in your router config
  { path: 'overview', id: 'dashboard-overview', title: 'Dashboard Overview', iconName: 'LayoutDashboard', isDashboardPage: true },
  { path: 'supporttickets', id: 'dashboard-supporttickets', title: 'Support Tickets (All)', iconName: 'MessageSquareWarning', isDashboardPage: true },
  { path: 'account', id: 'dashboard-account', title: 'Account Management', iconName: 'UserCog', isDashboardPage: true },
  { path: 'appoint', id: 'dashboard-appointments', title: 'Appointments', iconName: 'CalendarDays', isDashboardPage: true },
  { path: 'events', id: 'dashboard-events', title: 'Events', iconName: 'CalendarClock', isDashboardPage: true },
  { path: 'payments', id: 'dashboard-payments', title: 'Payment History', iconName: 'CreditCard', isDashboardPage: true },
  { path: 'profile', id: 'dashboard-profile', title: 'My Profile', iconName: 'UserCircle2', isDashboardPage: true },
  { path: 'listdoc', id: 'dashboard-documents', title: 'Documents', iconName: 'FileText', isDashboardPage: true },
  { path: 'mytickets', id: 'dashboard-mytickets', title: 'My Support Tickets', iconName: 'Ticket', isDashboardPage: true },
  { path: 'logout', id: 'dashboard-logout', title: 'Logout', iconName: 'LogOut', isDashboardPage: true }, // Logout is an action, but if it's a route
  { path: 'mycases', id: 'dashboard-mycases', title: 'My Cases', iconName: 'FolderKanban', isDashboardPage: true },
  { path: 'cases', id: 'dashboard-cases', title: 'Manage Cases (All)', iconName: 'Briefcase', isDashboardPage: true },
  { path: 'reports', id: 'dashboard-reports', title: 'Reports', iconName: 'BarChart3', isDashboardPage: true },
  { path: 'branch', id: 'dashboard-branches', title: 'Branch Locations', iconName: 'Building2', isDashboardPage: true },

  // You might need more specific entries for dynamic routes or use regex later
  // e.g., for a case detail page like /dashboard/cases/:caseId
  // This approach might require more sophisticated matching if IDs are part of the URL
  // For now, this definition assumes distinct paths as defined in your router.
];