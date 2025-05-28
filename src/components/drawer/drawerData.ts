import React from 'react';

// Updated imports with more modern/specific icons
import {
    LayoutDashboard, // For Dashboard Overview
    BookOpenText,    // For My_Diary (more distinct than just Calendar)
    Briefcase,       // My Cases (Good as is)
    CalendarCheck,   // Appointments (more specific for scheduled items)
    FileText,        // Documents (Good as is)
    Users,           // Manage users (plural)
    FolderKanban,    // Manage Cases (or BriefcaseBusiness, Settings2 depending on nuance)
    Ticket,          // Support Tickets & My Tickets (Good as is)
    CreditCard,      // Payments (general)
    Receipt,         // Individual Payments (specific transaction)
    History,         // Payments Records (historical data)
    BarChart3,       // Reports (visual data)
    CircleUserRound, // Profile (modern user icon)
    Settings as SettingsIcon, // Settings (aliased to avoid conflict if 'Settings' is a component)
    CalendarDays,    // Events (general calendar icon)
    MapPin,          // Location (Good as is)
    MessageSquareText, // Feedbacks (more like text feedback)
    FileClock,       // Logs_History (file with a time aspect)
    LogOut,          // Logout (Good as is)
    // User, // Kept for reference, but replaced in usage
    // BookmarkPlus, // Replaced
    // ClipboardList, // Replaced
    // Folder, // Replaced by more specific icons
    // FileCheck, // Replaced by SettingsIcon
    // DollarSign, // Replaced by CreditCard, Receipt
    // Calendar, // Replaced by BookOpenText, CalendarCheck, CalendarDays for specificity
    // MessageCircle, // Replaced
    // File // Replaced
} from 'lucide-react';

// Type definition for drawer data
export type DrawerData = {
    id: number;
    name: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Specify type for icon
    link: string;
    adminOnly: boolean;
}

// Drawer data with roles and permissions
export const drawerData: DrawerData[] = [
    //navigating to dashboard
    { id: 17, name: 'Dashboard Overview', icon: LayoutDashboard, link: 'dashboard', adminOnly: false },
    //diary
    { id: 20, name: 'My_Diary', icon: BookOpenText, link: 'mydiary', adminOnly: false },
    { id: 0, name: 'My Cases', icon: Briefcase, link: 'mycases', adminOnly: false },
    { id: 1, name: 'Appointments', icon: CalendarCheck, link: 'appoint', adminOnly: false },
    { id: 2, name: 'Documents', icon: FileText, link: 'listdoc', adminOnly: false },
    { id: 3, name: 'Manage users', icon: Users, link: 'account', adminOnly: true },
    { id: 4, name: 'Manage Cases', icon: FolderKanban, link: 'cases', adminOnly: true }, // Or BriefcaseBusiness
    { id: 5, name: 'Support Tickets', icon: Ticket, link: 'supporttickets', adminOnly: true },

    { id: 6, name: 'Payments', icon: CreditCard, link: 'payments', adminOnly: true },
    //single user payment portal
    { id: 18, name: 'Individual Payments', icon: Receipt, link: 'payment-portal', adminOnly: true }, // Corrected name slightly for consistency

    //user payment records
    { id: 19, name: 'Payments Records', icon: History, link: 'user-payments', adminOnly: false }, // Corrected name slightly

    { id: 7, name: 'Reports', icon: BarChart3, link: 'reports', adminOnly: true },
    { id: 8, name: 'Profile', icon: CircleUserRound, link: 'profile', adminOnly: false },
    { id: 9, name: 'Settings', icon: SettingsIcon, link: 'settings', adminOnly: true },
    { id: 10, name: 'Events', icon: CalendarDays, link: 'events', adminOnly: false },
    //{ id: 11, name: 'Event Reminders', icon: Calendar, link: 'event-reminders', adminOnly: false }, // Consider BellRing for reminders
    { id: 12, name: 'Location', icon: MapPin, link: 'branch', adminOnly: false },
    { id: 13, name: 'Feedbacks', icon: MessageSquareText, link: 'feedbacks', adminOnly: false },
    { id: 14, name: 'Logs_History', icon: FileClock, link: 'activity-log', adminOnly: true },

    { id: 16, name: 'My Tickets', icon: Ticket, link: 'mytickets', adminOnly: false },
    { id: 15, name: 'Logout', icon: LogOut, link: 'logout', adminOnly: false },
];

// Role-based access control (RBAC) function
export const filterDrawerByRole = (role: string): DrawerData[] => {
    const adminRoles = ['admin', 'support', 'manager', 'lawyer'];
    const lawyerRoles = ['lawyer'];
    const userRoles = ['user', 'client'];

    return drawerData.filter(item => {
        if (item.link === 'logout') return true; // Logout is accessible to all roles
        if (adminRoles.includes(role)) return true; // Admin, support, and manager have full access
        if (lawyerRoles.includes(role)) return !item.adminOnly; // Lawyers have access to non-admin only items
        // Corrected the condition for userRoles and "Individual Payments" based on its adminOnly flag
        if (userRoles.includes(role)) {
            return !item.adminOnly &&
                   item.name !== 'Manage Cases' &&
                   item.name !== 'Manage Clients' // 'Manage Clients' is not in the list, but good to keep if it might be added
                   // 'Individual Payments' is adminOnly: true, so it will be filtered out by !item.adminOnly for userRoles
                   // item.name !== 'Individual Payments' was potentially redundant given adminOnly flag
                   ;
        }
        return false; // Default to no access if role does not match any categories
    });
};