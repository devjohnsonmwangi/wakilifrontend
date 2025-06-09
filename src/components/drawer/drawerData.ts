import React from 'react';
import {
    LayoutDashboard, BookOpenText, Briefcase, CalendarCheck, FileText, Users,
    FolderKanban, Ticket, CreditCard, Receipt, History, BarChart3, CircleUserRound,
    Settings as SettingsIcon, CalendarDays, MapPin, MessageSquareText, FileClock, LogOut,
} from 'lucide-react';

// Type definition for drawer data
export type DrawerData = {
    id: number;
    name: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    link: string;
    adminOnly: boolean;
    category?: 'Admin' | 'Management' | 'User' | 'Legal Tools' | 'Support' | 'General';
    iconBgColor: string; // This will hold the hex color code
};

// Drawer data array with unique background colors for each icon
export const drawerData: DrawerData[] = [
    // --- User & Client Specific ---
    { id: 17, name: 'Dashboard Overview', icon: LayoutDashboard, link: '/dashboard', adminOnly: false, category: 'User', iconBgColor: '#E0F2FE' }, // Light Blue
    { id: 20, name: 'My Diary', icon: BookOpenText, link: '/dashboard/mydiary', adminOnly: false, category: 'User', iconBgColor: '#D1FAE5' }, // Light Green
    { id: 0, name: 'My Cases', icon: Briefcase, link: '/dashboard/mycases', adminOnly: false, category: 'User', iconBgColor: '#FEF3C7' }, // Light Yellow
    { id: 27, name: 'My Appointments', icon: CalendarCheck, link: '/dashboard/myappointments', adminOnly: false, category: 'User', iconBgColor: '#E5E7EB' }, // Light Gray
    { id: 19, name: 'Payments Records', icon: History, link: '/dashboard/user-payments', adminOnly: false, category: 'User', iconBgColor: '#FFE4E6' }, // Light Pink
    { id: 16, name: 'My Tickets', icon: Ticket, link: '/dashboard/mytickets', adminOnly: false, category: 'User', iconBgColor: '#E0E7FF' }, // Light Indigo
    { id: 25, name: 'Book Appointment', icon: CalendarDays, link: '/dashboard/appoints', adminOnly: false, category: 'User', iconBgColor: '#F3E8FF' }, // Light Purple

    // --- Legal Tools & Resources ---
    { id: 23, name: 'Our Services', icon: BookOpenText, link: '/dashboard/ourservices', adminOnly: false, category: 'Legal Tools', iconBgColor: '#D1FAE5' }, // Light Green
    { id: 24, name: 'Document Library', icon: FileText, link: '/dashboard/library', adminOnly: false, category: 'Legal Tools', iconBgColor: '#E0F2FE' }, // Light Blue

    // --- Admin & Management Specific ---
    { id: 3, name: 'Manage Users', icon: Users, link: '/dashboard/account', adminOnly: true, category: 'Admin', iconBgColor: '#FEE2E2' }, // Light Red
    { id: 4, name: 'Manage Cases', icon: FolderKanban, link: '/dashboard/cases', adminOnly: true, category: 'Admin', iconBgColor: '#FFEDD5' }, // Light Orange
    { id: 1, name: 'Manage Appointments', icon: CalendarCheck, link: '/dashboard/appoint', adminOnly: true, category: 'Admin', iconBgColor: '#E0E7FF' }, // Light Indigo
    { id: 22, name: 'Branch Appointments', icon: CalendarCheck, link: '/dashboard/branchappointments', adminOnly: true, category: 'Admin', iconBgColor: '#E5E7EB' }, // Light Gray
    { id: 2, name: 'Manage Documents', icon: FileText, link: '/dashboard/listdoc', adminOnly: true, category: 'Admin', iconBgColor: '#D1FAE5' }, // Light Green
    { id: 6, name: 'Manage Payments', icon: CreditCard, link: '/dashboard/payments', adminOnly: true, category: 'Admin', iconBgColor: '#FEF3C7' }, // Light Yellow
    { id: 18, name: 'Process Payments', icon: Receipt, link: '/dashboard/payment-portal', adminOnly: true, category: 'Admin', iconBgColor: '#F3E8FF' }, // Light Purple
    { id: 7, name: 'View Reports', icon: BarChart3, link: '/dashboard/reports', adminOnly: true, category: 'Admin', iconBgColor: '#E0F2FE' }, // Light Blue
    { id: 14, name: 'System Logs', icon: FileClock, link: '/dashboard/activity-log', adminOnly: true, category: 'Admin', iconBgColor: '#FCE7F3' }, // Light Pink
    { id: 5, name: 'View Support Tickets', icon: Ticket, link: '/dashboard/supporttickets', adminOnly: true, category: 'Admin', iconBgColor: '#FFEDD5' }, // Light Orange
    { id: 21, name: 'Clients Appointments', icon: CalendarCheck, link: '/dashboard/myclientsappointments', adminOnly: true, category: 'Admin', iconBgColor: '#FEE2E2' }, // Light Red

    // --- General / Common ---
    { id: 10, name: 'Events', icon: CalendarDays, link: '/dashboard/events', adminOnly: true, category: 'General', iconBgColor: '#FEF3C7' }, // Light Yellow
    { id: 26, name: 'Chats', icon: MessageSquareText, link: '/dashboard/chats', adminOnly: false, category: 'General', iconBgColor: '#CCFBF1' }, // Light Teal
    { id: 12, name: 'Branch Location', icon: MapPin, link: '/dashboard/branch', adminOnly: false, category: 'General', iconBgColor: '#D1FAE5' }, // Light Green
    { id: 8, name: 'Profile', icon: CircleUserRound, link: '/dashboard/profile', adminOnly: false, category: 'General', iconBgColor: '#E0E7FF' }, // Light Indigo
    { id: 9, name: 'System Settings', icon: SettingsIcon, link: '/dashboard/settings', adminOnly: false, category: 'General', iconBgColor: '#E5E7EB' }, // Light Gray
    { id: 15, name: 'Logout', icon: LogOut, link: '/dashboard/logout', adminOnly: false, category: 'General', iconBgColor: '#FEE2E2' }, // Light Red
];

// ... (The rest of your file: filterDrawerByRole, groupDrawerItems, etc. remains the same)

// Role-based access control (RBAC) function
export const filterDrawerByRole = (role: string): DrawerData[] => {
    const normalizedRole = role.toLowerCase();

    // These links are based on the 'link' property in the drawerData above
    const lawyerAccessibleAdminLinks: string[] = [
        'cases',            // Manage Cases
        'appoint',          // Manage Appointments
        'branchappointments',// Branch Appointments
        'listdoc',          // Manage Documents
        'payments',         // Manage Payments
        'payment-portal',   // Process Payments
        'supporttickets',   // View Support Tickets
    ];

    if (normalizedRole === 'admin' || normalizedRole === 'support' || normalizedRole === 'manager') {
        return drawerData;
    }

    if (normalizedRole === 'lawyer') {
        return drawerData.filter((item: DrawerData) => {
            if (!item.adminOnly) { // Accessible to all non-admin roles
                return true;
            }
            // If it's adminOnly, check if it's in the lawyer's specific access list
            if (item.adminOnly && lawyerAccessibleAdminLinks.includes(item.link)) {
                return true;
            }
            return false;
        });
    }

    // Handles both 'user' and 'client' roles
    if (normalizedRole === 'user' || normalizedRole === 'client') {
        return drawerData.filter((item: DrawerData) => !item.adminOnly);
    }

    // Fallback for unrecognized roles: only show Logout
    return drawerData.filter((item: DrawerData) => item.link === 'logout');
};

// --- Optional: Function to group drawer items by category for rendering ---
export type GroupedDrawerData = {
    category: string;
    items: DrawerData[];
};

export const groupDrawerItems = (items: DrawerData[]): GroupedDrawerData[] => {
    const groups: Record<string, DrawerData[]> = {};
    items.forEach((item: DrawerData) => {
        const category = item.category || 'General';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
    });

    const categoryOrder: Array<DrawerData['category']> = [
        'User',
        'Legal Tools',
        'Admin',
        'Management', 
        'Support',    
        'General'
    ];

    return categoryOrder
        .filter(cat => cat && groups[cat])
        .map(cat => ({
            category: cat as string,
            items: groups[cat as string],
        }));
};