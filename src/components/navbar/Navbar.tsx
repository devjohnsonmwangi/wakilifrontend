import React, { useState, useEffect, useRef, FC } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../app/store";
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from "../../features/users/userSlice";
import { usersAPI } from "../../features/users/usersAPI";
import {
    User, LogOut as LogOutIcon, Home, Info, Mail, UserPlus, LogIn, LayoutDashboard,
    X, ChevronDown, Settings, HelpCircle, Briefcase, BookOpen, DownloadCloud, MoreHorizontal,
    Menu,
    Newspaper
} from 'lucide-react';

import AppDrawer from "../../pages/dashboard/aside/Drawer";

// Use Vite's import.meta.env for development checks
const ALWAYS_SHOW_PWA_BUTTON_FOR_DEV = import.meta.env.DEV;

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

// Define UserData type
interface UserData {
    profile_picture?: string;
    email?: string;
    full_name?: string;
}

const Navbar: FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const user = useSelector((state: RootState) => state.user);
    const username = user.user?.full_name;
    const user_id = user.user?.user_id ? Number(user.user.user_id) : undefined;
    const userRole = user.user?.role;

    const { data: userData } = usersAPI.useGetUserByIdQuery(user_id!, { skip: !user_id });
    const profile_picture = (userData as UserData | undefined)?.profile_picture;

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileMoreSheetOpen, setIsMobileMoreSheetOpen] = useState(false);
    const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isRunningAsPWA, setIsRunningAsPWA] = useState(false);

    const desktopProfileMenuRef = useRef<HTMLDivElement>(null);
    const mobileProfileMenuRef = useRef<HTMLDivElement>(null);
    const mobileSheetRef = useRef<HTMLDivElement>(null);

    // Effect for PWA installation logic
    useEffect(() => {
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        const handleMediaQueryChange = (e: MediaQueryListEvent) => setIsRunningAsPWA(e.matches);
        setIsRunningAsPWA(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleMediaQueryChange);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        const handleAppInstalled = () => {
            setDeferredPrompt(null);
        };
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    // Effect for handling clicks outside of the profile dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isProfileDropdownOpen) return;
            const targetNode = event.target as Node;
            const isOutsideDesktop = desktopProfileMenuRef.current && !desktopProfileMenuRef.current.contains(targetNode);
            const isOutsideMobile = mobileProfileMenuRef.current && !mobileProfileMenuRef.current.contains(targetNode);

            if (isOutsideDesktop || isOutsideMobile) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileDropdownOpen]);

    // Effect to close all modals/drawers when the route changes
    useEffect(() => {
        setIsProfileDropdownOpen(false);
        setIsMobileMoreSheetOpen(false);
        setIsAppDrawerOpen(false);
    }, [location.pathname]);

    // --- Core Functions ---

    const handlePWAInstall = async () => {
        // ... (Your PWA install logic is good, no changes needed here)
    };

    const toggleProfileDropdown = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsProfileDropdownOpen(prev => !prev);
        setIsMobileMoreSheetOpen(false);
        setIsAppDrawerOpen(false);
    };

    const toggleMobileMoreSheet = (event?: React.MouseEvent) => {
        if (event) event.stopPropagation();
        setIsMobileMoreSheetOpen(prev => !prev);
        setIsProfileDropdownOpen(false);
        setIsAppDrawerOpen(false);
    };

    const toggleAppDrawer = (event?: React.MouseEvent) => {
        if (event) event.stopPropagation();
        setIsAppDrawerOpen(prev => !prev);
        setIsProfileDropdownOpen(false);
        setIsMobileMoreSheetOpen(false);
    };

    /**************************************************/
    /**        UPDATED AND ROBUST LOGOUT LOGIC       **/
    /**************************************************/
    const handleLogout = () => {
        console.log("Attempting logout...");
        try {
            // Step 1: Dispatch the Redux action to clear user state.
            dispatch(logOut());
            console.log("Redux logOut action dispatched.");

            // Step 2: Navigate the user to the login page immediately.
            // This is the critical action that must happen before UI cleanup.
            navigate('/login');
            console.log("Navigated to /login");

            // Step 3: Clean up the UI by closing all modals/drawers.
            // This happens *after* the critical actions are done to avoid race conditions.
            setIsProfileDropdownOpen(false);
            setIsMobileMoreSheetOpen(false);
            setIsAppDrawerOpen(false);
            
        } catch (error) {
            console.error("Error during logout process:", error);
            // Even if an error occurs, still try to clean up the UI.
            setIsProfileDropdownOpen(false);
            setIsMobileMoreSheetOpen(false);
            setIsAppDrawerOpen(false);
        }
    };

    // --- Reusable Data & Classes ---

    const desktopNavLinksList = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/howitworks", icon: BookOpen, label: "How It Works" },
        { to: "/updates", icon: Newspaper, label: "News" },
        { to: "/about", icon: Info, label: "About Us" },
        { to: "/services", icon: Briefcase, label: "Services" },
        ...(userRole !== 'disabled' && username ? [{ to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }] : []),
        { to: "/contactus", icon: Mail, label: "Contact Us" },
    ];

    const desktopLinkClasses = (isActive = false) => `flex items-center text-sm font-bold px-2.5 py-2 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 whitespace-nowrap ${isActive ? 'bg-green-100 text-green-700' : 'text-green-500 hover:text-green-800 hover:bg-green-50'}`;
    const mobileSheetLinkClasses = (isActive = false) => `flex items-center w-full text-base px-4 py-3 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${isActive ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`;
    const mobileSheetNavItemClick = (path: string) => { navigate(path); setIsMobileMoreSheetOpen(false); };
    const bottomNavLinkClasses = (isActive: boolean) => `flex flex-col items-center justify-center flex-1 px-1 py-2 text-xs transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 rounded-sm ${isActive ? 'text-green-600 font-medium' : 'text-gray-500 hover:text-green-600'}`;
    const PWA_BUTTON_SHARED_CLASSES = "flex items-center justify-center font-semibold rounded-md shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 whitespace-nowrap px-2.5 py-1.5 text-sm";
    const desktopAuthButtonBaseClasses = "flex items-center text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-150 whitespace-nowrap";

    const shouldShowPWAButton = !isRunningAsPWA && (!!deferredPrompt || ALWAYS_SHOW_PWA_BUTTON_FOR_DEV);

    // --- Reusable Components ---

    const ProfileDropdownPanel = ({ triggerButtonId }: { triggerButtonId: string }) => (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-70" role="menu" aria-orientation="vertical" aria-labelledby={triggerButtonId}>
            <div className="px-4 py-3"><p className="text-sm font-semibold text-gray-900 truncate" title={username || ""}>{username}</p>{(userData as UserData)?.email && <p className="text-xs text-gray-500 truncate" title={(userData as UserData).email}>{(userData as UserData).email}</p>}</div>
            <div className="border-t border-gray-100"></div>
            <Link to="/dashboard/profile" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"><User className="w-4 h-4 mr-2.5 text-gray-500 shrink-0" /> Profile</Link>
            <Link to="/dashboard/settings" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"><Settings className="w-4 h-4 mr-2.5 text-gray-500 shrink-0" /> Settings</Link>
            <Link to="/dashboard/help" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"><HelpCircle className="w-4 h-4 mr-2.5 text-gray-500 shrink-0" /> Help</Link>
            <div className="border-t border-gray-100"></div>
            <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700" role="menuitem">
                <LogOutIcon className="w-4 h-4 mr-2.5 shrink-0" /> Logout
            </button>
        </div>
    );

    return (
        <>
            {/* Top Navbar: z-50 */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-800 shadow-md h-16">
                <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center"> {/* Left side: Hamburger and Brand */}
                        <button
                            onClick={username ? toggleAppDrawer : toggleMobileMoreSheet}
                            className="lg:hidden flex flex-col items-center justify-center p-2 -ml-2 mr-2 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            aria-label={username ? "Open main menu" : "Open menu"}
                        >
                            <Menu className="h-6 w-6 shrink-0" />
                            {username && (<span className="text-[10px] leading-none font-medium mt-0.5">Menu</span>)}
                        </button>
                        <Link to="/" className="flex items-center flex-shrink-0" aria-label="Go to Homepage">
                            <img src="/wakililogo.png" alt="WakiliApp Logo" className="h-8 w-8 rounded-full mr-2" />
                            <span className="text-2xl font-bold text-green-700 dark:text-green-500">WakiliApp</span>
                        </Link>
                    </div>

                    {/* Right side of Navbar */}
                    <div className="flex items-center">
                        <div className="hidden lg:flex items-center space-x-3">
                            <nav className="flex items-center space-x-1" aria-label="Main navigation">
                                {desktopNavLinksList.map(link => (
                                    <Link key={link.to} to={link.to} className={desktopLinkClasses(location.pathname === link.to || (link.to !== "/" && location.pathname.startsWith(link.to) && link.to.length > 1) )}>
                                        <link.icon className="w-4 h-4 mr-1.5 shrink-0" /> {link.label}
                                    </Link>
                                ))}
                            </nav>
                            {(desktopNavLinksList.length > 0 && (shouldShowPWAButton || username)) && (<div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>)}
                            <div className="flex items-center space-x-2">
                                {shouldShowPWAButton && (<button onClick={handlePWAInstall} className={`${PWA_BUTTON_SHARED_CLASSES} bg-green-600 hover:bg-green-700 text-white`} title="Install WakiliApp"><DownloadCloud className="w-4 h-4 mr-1.5 shrink-0" /> Install App</button>)}
                                {!username ? (
                                    <>
                                        <Link to="/register" className={`${desktopAuthButtonBaseClasses} text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 bg-green-50 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-gray-600`}><UserPlus className="w-4 h-4 mr-1.5 shrink-0" /> Register</Link>
                                        <Link to="/login" className={`${desktopAuthButtonBaseClasses} text-white bg-green-600 hover:bg-green-700`}><LogIn className="w-4 h-4 mr-1.5 shrink-0" /> Login</Link>
                                    </>
                                ) : (
                                    <div className="relative" ref={desktopProfileMenuRef}>
                                        <button id="user-menu-button-desktop" onClick={toggleProfileDropdown} aria-expanded={isProfileDropdownOpen} className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-white dark:focus:ring-offset-gray-800">
                                            <img src={profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(username || "User")}&background=059669&color=fff&rounded=true&size=36&font-size=0.45&length=2&bold=true`} alt={`${username || "User"}'s Avatar`} className="w-9 h-9 rounded-full border-2 border-green-200 hover:border-green-500 transition-colors"/>
                                            <ChevronDown className="w-4 h-4 ml-1 text-gray-500 dark:text-gray-400 shrink-0" />
                                        </button>
                                        {isProfileDropdownOpen && <ProfileDropdownPanel triggerButtonId="user-menu-button-desktop" />}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="lg:hidden flex items-center space-x-1">
                            {shouldShowPWAButton && (<button onClick={handlePWAInstall} className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1" title="Install WakiliApp"><DownloadCloud className="h-5 w-5 shrink-0" /></button>)}
                            {!username ? (
                                <Link to="/login" className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1" title="Login"><LogIn className="w-5 h-5 shrink-0" /></Link>
                            ) : (
                                <div className="relative" ref={mobileProfileMenuRef}>
                                    <button id="user-menu-button-mobile" onClick={toggleProfileDropdown} aria-expanded={isProfileDropdownOpen} className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-white dark:focus:ring-offset-gray-800">
                                        <img src={profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(username || "User")}&background=059669&color=fff&rounded=true&size=36&font-size=0.45&length=2&bold=true`} alt={`${username || "User"}'s Avatar`} className="w-9 h-9 rounded-full border-2 border-green-200 hover:border-green-500 transition-colors"/>
                                    </button>
                                    {isProfileDropdownOpen && <ProfileDropdownPanel triggerButtonId="user-menu-button-mobile" />}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Bottom Mobile Navbar */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 w-full h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-top z-50 flex items-stretch" aria-label="Mobile bottom navigation">
                <Link to="/" className={bottomNavLinkClasses(location.pathname === "/")}> <Home className="w-5 h-5 mb-0.5 shrink-0" /> Home </Link>
                {username && userRole !== 'disabled' ? (
                    <Link to="/dashboard" className={bottomNavLinkClasses(location.pathname.startsWith("/dashboard"))}> <LayoutDashboard className="w-5 h-5 mb-0.5 shrink-0" /> Dashboard </Link>
                ) : (
                     <Link to="/updates" className={bottomNavLinkClasses(location.pathname.startsWith("/updates"))}> <Newspaper className="w-5 h-5 mb-0.5 shrink-0" /> News </Link>
                )}
                <Link to="/howitworks" className={bottomNavLinkClasses(location.pathname.startsWith("/howitworks"))}> <BookOpen className="w-5 h-5 mb-0.5 shrink-0" /> How It Works </Link>
                <button onClick={toggleMobileMoreSheet} className={bottomNavLinkClasses(isMobileMoreSheetOpen)} aria-label="More options">
                    <MoreHorizontal className="w-5 h-5 mb-0.5 shrink-0" /> More
                </button>
            </nav>

            {/* Mobile "More" Sheet */}
            {isMobileMoreSheetOpen && (
                 <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsMobileMoreSheetOpen(false)} aria-hidden="true"></div>
                    <div
                        ref={mobileSheetRef}
                        className="fixed bottom-16 left-0 right-0 w-full bg-white dark:bg-gray-800 rounded-t-2xl shadow-top-xl z-40 p-4 pt-3 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto"
                        style={{ transform: isMobileMoreSheetOpen ? 'translateY(0)' : 'translateY(100%)', maxHeight: 'calc(100vh - 8rem)' }}
                        role="dialog"
                    >
                        <div className="flex justify-between items-center mb-3"><h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">More Options</h3><button onClick={() => setIsMobileMoreSheetOpen(false)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Close more options"><X className="w-5 h-5 shrink-0" /></button></div>
                        <nav className="space-y-1">
                            {shouldShowPWAButton && (<button onClick={handlePWAInstall} className={`${PWA_BUTTON_SHARED_CLASSES} ${mobileSheetLinkClasses(false)} w-full bg-green-100 text-green-700 hover:bg-green-200 text-base px-4 py-3`}><DownloadCloud className="w-5 h-5 mr-3 shrink-0" /> Install WakiliApp</button>)}
                            {!(username && userRole !== 'disabled') && (
                                <Link to="/updates" onClick={() => mobileSheetNavItemClick("/updates")} className={mobileSheetLinkClasses(location.pathname.startsWith("/updates"))}><Newspaper className="w-5 h-5 mr-3 text-gray-500 shrink-0" /> News</Link>
                            )}
                            <Link to="/services" onClick={() => mobileSheetNavItemClick("/services")} className={mobileSheetLinkClasses(location.pathname === "/services")}><Briefcase className="w-5 h-5 mr-3 text-gray-500 shrink-0" /> Services</Link>
                            <Link to="/about" onClick={() => mobileSheetNavItemClick("/about")} className={mobileSheetLinkClasses(location.pathname === "/about")}><Info className="w-5 h-5 mr-3 text-gray-500 shrink-0" /> About Us</Link>
                            <Link to="/contactus" onClick={() => mobileSheetNavItemClick("/contactus")} className={mobileSheetLinkClasses(location.pathname === "/contactus")}><Mail className="w-5 h-5 mr-3 text-gray-500 shrink-0" /> Contact Us</Link>
                            {username ? (
                                <><div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700"></div>
                                <Link to="/dashboard/profile" onClick={() => mobileSheetNavItemClick("/dashboard/profile")} className={mobileSheetLinkClasses(location.pathname === "/dashboard/profile")}><User className="w-5 h-5 mr-3 text-gray-500 shrink-0" /> My Profile</Link>
                                <Link to="/dashboard/settings" onClick={() => mobileSheetNavItemClick("/dashboard/settings")} className={mobileSheetLinkClasses(location.pathname === "/dashboard/settings")}><Settings className="w-5 h-5 mr-3 text-gray-500 shrink-0" /> App Settings</Link>
                                <button onClick={handleLogout} className={`${mobileSheetLinkClasses(false)} w-full text-red-600 hover:bg-red-50`}><LogOutIcon className="w-5 h-5 mr-3 shrink-0" /> Logout</button></>
                            ) : (
                                <><div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700"></div>
                                <Link to="/register" onClick={() => mobileSheetNavItemClick("/register")} className={mobileSheetLinkClasses(location.pathname === "/register")}><UserPlus className="w-5 h-5 mr-3 text-gray-500 shrink-0" /> Register</Link>
                                <Link to="/login" onClick={() => mobileSheetNavItemClick("/login")} className={`${mobileSheetLinkClasses(false)} font-semibold bg-green-600 text-white hover:bg-green-700 justify-center`}><LogIn className="w-5 h-5 mr-3 shrink-0" /> Login</Link></>
                            )}
                        </nav>
                    </div>
                </>
            )}

            {/* Main App Drawer (for logged-in users) */}
            {username && (
                 <AppDrawer
                    isMobileMode={true}
                    mobileIsOpen={isAppDrawerOpen}
                    onMobileClose={() => setIsAppDrawerOpen(false)}
                />
            )}
        </>
    );
};

export default Navbar;