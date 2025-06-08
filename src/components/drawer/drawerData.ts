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
    link: string; // This is the route/path
    adminOnly: boolean;
    category?: 'Admin' | 'Management' | 'User' | 'Legal Tools' | 'Support' | 'General';
    iconBgColor :string
    
};

// Drawer data array 
export const drawerData: DrawerData[] = [
    // --- Admin & Management Specific ---
    { id: 17, name: 'Dashboard Overview', icon: LayoutDashboard, link: '/dashboard', adminOnly: false, category: 'User',iconBgColor:'' },
    // Original ID 3, link 'account'
    { id: 3, name: 'Manage Users', icon: Users, link: 'account', adminOnly: true, category: 'Admin',iconBgColor :'' },
    // Original ID 4, link 'cases'
    { id: 4, name: 'Manage Cases', icon: FolderKanban, link: 'cases', adminOnly: true, category: 'Admin' ,iconBgColor:'' },
    // Original ID 1, link 'appoint'
    { id: 1, name: 'Manage Appointments', icon: CalendarCheck, link: 'appoint', adminOnly: true, category: 'Admin' ,iconBgColor :''},
    // Original ID 22, link 'branchappointments'
    { id: 22, name: 'Branch Appointments', icon: CalendarCheck, link: 'branchappointments', adminOnly: true, category: 'Admin',iconBgColor :'' },
    // Original ID 2, link 'listdoc'
    { id: 2, name: 'Manage Documents', icon: FileText, link: 'listdoc', adminOnly: true, category: 'Admin',iconBgColor :'' },
    // Original ID 6, link 'payments'
    { id: 6, name: 'Manage Payments', icon: CreditCard, link: 'payments', adminOnly: true, category: 'Admin',iconBgColor :'' },
    // Original ID 18, link 'payment-portal'
    { id: 18, name: 'Process Payments', icon: Receipt, link: 'payment-portal', adminOnly: true, category: 'Admin',iconBgColor :'' },
    // Original ID 7, link 'reports'
    { id: 7, name: 'View Reports', icon: BarChart3, link: 'reports', adminOnly: true, category: 'Admin',iconBgColor :'' },
    // Original ID 14, link 'activity-log'
    { id: 14, name: 'System Logs', icon: FileClock, link: 'activity-log', adminOnly: true, category: 'Admin' ,iconBgColor :''},
    // Original ID 9, link 'settings'
    
    // Original ID 5, link 'supporttickets'
    { id: 5, name: 'View Support Tickets', icon: Ticket, link: 'supporttickets', adminOnly: true, category: 'Admin',iconBgColor :'' },

    // --- Legal Tools & Resources (Accessible to Lawyers and Users/Clients) ---
    // Original ID 23, link 'ourservices'
    { id: 23, name: 'Our Services', icon: BookOpenText, link: 'ourservices', adminOnly: false, category: 'Legal Tools' ,iconBgColor :''}, // Kept original name & icon
    // Original ID 24, link 'library'
    { id: 24, name: 'Document Library', icon: FileText, link: 'library', adminOnly: false, category: 'Legal Tools',iconBgColor :'' },

    // --- User / Client Specific ---
    // Original ID 17, link '/dashboard' (Note: leading slash implies absolute path)
   
    // Original ID 20, link 'mydiary'
    { id: 20, name: 'My Diary', icon: BookOpenText, link: 'mydiary', adminOnly: false, category: 'User',iconBgColor :' '}, // Renamed "My_Diary" to "My Diary"
    // Original ID 0, link 'mycases'
    { id: 0, name: 'My Cases', icon: Briefcase, link: 'mycases', adminOnly: false, category: 'User',iconBgColor :' '},
    // Original ID 21, link 'myappointments'
    { id: 21, name: 'Clients Appointments', icon: CalendarCheck, link: 'myclientsappointments', adminOnly: true, category: 'Admin',iconBgColor :'' },
    //my appointments
    { id: 21, name: 'My Appointments', icon: CalendarCheck, link: 'myappointments', adminOnly: false, category: 'User' ,iconBgColor :''}, // Renamed "My_Appointments" to "My Appointments"
    // Original ID 19, link 'user-payments'
    { id: 19, name: 'Payments Records', icon: History, link: 'user-payments', adminOnly: false, category: 'User',iconBgColor :'' },
    // Original ID 16, link 'mytickets'
    { id: 16, name: 'My Tickets', icon: Ticket, link: 'mytickets', adminOnly: false, category: 'User',iconBgColor :'' },
    // Original ID 25, link 'appoints' 
    { id: 25, name: 'Book Appointment', icon: CalendarDays, link: 'appoints', adminOnly: false, category: 'User',iconBgColor :' '}, // Standardized link for clarity

    // --- General / Common ---
    //chats
    { id: 26, name: 'Chats', icon: MessageSquareText, link: 'chats', adminOnly: false, category: 'General' ,iconBgColor :''}, // Assuming this is a chat page
    // Original ID 12, link 'branch'
    { id: 12, name: 'Branch Location', icon: MapPin, link: 'branch', adminOnly: false, category: 'General',iconBgColor :'' },
    // Original ID 13, link 'feedbacks'
    //{ id: 13, name: 'Feedbacks', icon: MessageSquareText, link: 'feedbacks', adminOnly: false, category: 'General',iconBgColor :'' },
    // Original ID 10, link 'events' 
    { id: 10, name: 'Events', icon: CalendarDays, link: 'events', adminOnly: true, category: 'General' ,iconBgColor :''},
    // Original ID 8, link 'profile'
    { id: 8, name: 'Profile', icon: CircleUserRound, link: 'profile', adminOnly: false, category: 'General' ,iconBgColor :''},
    // Original ID 15, link 'logout'
    { id: 15, name: 'Logout', icon: LogOut, link: 'logout', adminOnly: false, category: 'General',iconBgColor :'' },
    { id: 9, name: 'System Settings', icon: SettingsIcon, link: 'settings', adminOnly: false, category: 'General' ,iconBgColor :''},
];

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