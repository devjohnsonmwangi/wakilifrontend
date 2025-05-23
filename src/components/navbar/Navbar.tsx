import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../app/store"; // Adjust path
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from "../../features/users/userSlice"; // Adjust path
import { usersAPI } from "../../features/users/usersAPI"; // Adjust path
import {
    User, LogOut as LogOutIcon, Home, Info, Mail, UserPlus, LogIn, LayoutDashboard,
    X, ChevronDown, Settings, HelpCircle, Briefcase, BookOpen, DownloadCloud, MoreHorizontal,
    Menu
} from 'lucide-react';

import AppDrawer from "../../pages/dashboard/aside/Drawer"; // Adjust path

// Define this interface at the top of the file or in a global types.d.ts
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

// SET THIS TO FALSE FOR PRODUCTION or if you want to test the "hide when installed" logic
const ALWAYS_SHOW_PWA_BUTTON_FOR_DEV = false;

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const user = useSelector((state: RootState) => state.user);
    const username = user.user?.full_name;
    const user_id = Number(user.user?.user_id);
    const userRole = user.user?.role;

    const { data: userData } = usersAPI.useGetUserByIdQuery(user_id, { skip: !user_id });
    const profile_picture = userData?.profile_picture;

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileMoreSheetOpen, setIsMobileMoreSheetOpen] = useState(false);
    const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null); // Correctly typed
    const [isStandalone, setIsStandalone] = useState(false); // State for PWA standalone mode

    // Separate refs for desktop and mobile profile dropdown containers
    const desktopProfileMenuRef = useRef<HTMLDivElement>(null);
    const mobileProfileMenuRef = useRef<HTMLDivElement>(null); // For the top-right mobile avatar dropdown
    const mobileSheetRef = useRef<HTMLDivElement>(null);

    // Effect to check PWA display mode
    useEffect(() => {
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        const handler = () => setIsStandalone(mediaQuery.matches);

        handler(); // Check initial state
        mediaQuery.addEventListener('change', handler); // Listen for changes

        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Effect for beforeinstallprompt
    useEffect(() => {
        const handler = (e: Event) => { // Standard Event type for the listener
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent); // Cast when setting state
            console.log("'beforeinstallprompt' event fired and deferred.");
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handlePWAInstall = async () => {
        const canPrompt = !isStandalone && (deferredPrompt || (ALWAYS_SHOW_PWA_BUTTON_FOR_DEV && !deferredPrompt));

        if (canPrompt && deferredPrompt) {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            if (!ALWAYS_SHOW_PWA_BUTTON_FOR_DEV) { // Only clear if not in dev "always show" mode
                setDeferredPrompt(null);
            }
            setIsMobileMoreSheetOpen(false);
            setIsAppDrawerOpen(false);
            setIsProfileDropdownOpen(false);
        } else if (canPrompt && ALWAYS_SHOW_PWA_BUTTON_FOR_DEV && !deferredPrompt) {
            console.log("DEV MODE: Mock PWA prompt() called because ALWAYS_SHOW_PWA_BUTTON_FOR_DEV is true and no real prompt available.");
            setIsMobileMoreSheetOpen(false);
            setIsAppDrawerOpen(false);
            setIsProfileDropdownOpen(false);
        } else if (isStandalone) {
            alert('App is already installed and running in standalone mode.');
        } else {
            alert('App installation is not available at this moment.');
        }
    };

    const toggleProfileDropdown = (event: React.MouseEvent) => {
        event.stopPropagation(); // Important to prevent immediate closure by handleClickOutside
        setIsProfileDropdownOpen(prev => !prev);
        setIsMobileMoreSheetOpen(false); setIsAppDrawerOpen(false);
    };

    const toggleMobileMoreSheet = (event?: React.MouseEvent) => {
        if (event) event.stopPropagation();
        setIsMobileMoreSheetOpen(prev => !prev);
        setIsProfileDropdownOpen(false); setIsAppDrawerOpen(false);
    };

    const toggleAppDrawer = (event?: React.MouseEvent) => {
        if (event) event.stopPropagation();
        setIsAppDrawerOpen(prev => !prev);
        setIsProfileDropdownOpen(false); setIsMobileMoreSheetOpen(false);
    };

    // Effect to handle clicks outside the profile dropdowns
    useEffect(() => {
        if (!isProfileDropdownOpen) return; // Only add listener if dropdown is open

        const handleClickOutside = (event: MouseEvent) => {
            const targetNode = event.target as Node;
            // Check if the click is outside the desktop dropdown
            const isOutsideDesktop = desktopProfileMenuRef.current && !desktopProfileMenuRef.current.contains(targetNode);
            // Check if the click is outside the mobile (top-right avatar) dropdown
            const isOutsideMobile = mobileProfileMenuRef.current && !mobileProfileMenuRef.current.contains(targetNode);

            // If it's open and click is outside both potential dropdown containers, close it
            if (isProfileDropdownOpen && isOutsideDesktop && isOutsideMobile) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileDropdownOpen]); // Re-run when isProfileDropdownOpen changes

    // Effect to close all modals/drawers on route change
    useEffect(() => {
        setIsProfileDropdownOpen(false);
        setIsMobileMoreSheetOpen(false);
        setIsAppDrawerOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        console.log("Attempting logout...");
        try {
            dispatch(logOut());
            console.log("Redux logOut action dispatched.");
        } catch (error) {
            console.error("Error dispatching logOut action:", error);
        }
        setIsProfileDropdownOpen(false);
        setIsMobileMoreSheetOpen(false);
        setIsAppDrawerOpen(false);
        console.log("Navigating to /login");
        navigate('/login');
    };

    const desktopNavLinksList = [
        { to: "/", icon: Home, label: "Home" },
        { to: "/howitworks", icon: BookOpen, label: "How It Works" },
        { to: "/about", icon: Info, label: "About Us" },
        { to: "/services", icon: Briefcase, label: "Services" },
        ...(userRole !== 'disabled' && username ? [{ to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }] : []),
        { to: "/contactus", icon: Mail, label: "Contact Us" },
    ];

    const desktopLinkClasses = (isActive = false) => `flex items-center text-sm font-semibold px-2.5 py-2 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 whitespace-nowrap ${isActive ? 'bg-green-100 text-green-700' : 'text-green-700 hover:text-green-800 hover:bg-green-50'}`;
    const mobileSheetLinkClasses = (isActive = false) => `flex items-center w-full text-base px-4 py-3 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${isActive ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`;
    const mobileSheetNavItemClick = (path?: string) => { if (path) navigate(path); setIsMobileMoreSheetOpen(false); };
    const bottomNavLinkClasses = (isActive: boolean) => `flex flex-col items-center justify-center flex-1 px-1 py-2 text-xs transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 rounded-sm ${isActive ? 'text-green-600 font-medium' : 'text-gray-500 hover:text-green-600'}`;
    const PWA_BUTTON_SHARED_CLASSES = "flex items-center justify-center font-semibold rounded-md shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 whitespace-nowrap px-2.5 py-1.5 text-sm";
    const desktopAuthButtonBaseClasses = "flex items-center text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-150 whitespace-nowrap";
    
    // Logic for showing the PWA button: Only if NOT standalone AND (deferredPrompt exists OR dev flag is true)
    const shouldShowPWAButton = !isStandalone && (!!deferredPrompt || ALWAYS_SHOW_PWA_BUTTON_FOR_DEV);

    const ProfileDropdownPanel = ({ triggerButtonId }: { triggerButtonId: string }) => (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-70" role="menu" aria-orientation="vertical" aria-labelledby={triggerButtonId}>
            <div className="px-4 py-3"><p className="text-sm font-semibold text-gray-900 truncate" title={username || ""}>{username}</p>{userData?.email && <p className="text-xs text-gray-500 truncate" title={userData.email}>{userData.email}</p>}</div>
            <div className="border-t border-gray-100"></div>
            <Link to="/dashboard/profile" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"><User className="w-4 h-4 mr-2.5 text-gray-500 shrink-0" /> Profile</Link>
            <Link to="/dashboard/settings" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"><Settings className="w-4 h-4 mr-2.5 text-gray-500 shrink-0" /> Settings</Link>
            <Link to="/dashboard/help" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"><HelpCircle className="w-4 h-4 mr-2.5 text-gray-500 shrink-0" /> Help</Link>
            <div className="border-t border-gray-100"></div>
            <button
                onClick={handleLogout}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                role="menuitem"
            >
                <LogOutIcon className="w-4 h-4 mr-2.5 shrink-0" />
                Logout
            </button>
        </div>
    );

    return (
        <>
            {/* Top Navbar: z-50 */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-800 shadow-md h-16">
                <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <button
                            onClick={username ? toggleAppDrawer : toggleMobileMoreSheet}
                            className="lg:hidden flex flex-col items-center justify-center p-2 -ml-2 mr-2 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            aria-label={username ? "Open main menu" : "Open menu"}
                            aria-expanded={username ? isAppDrawerOpen : isMobileMoreSheetOpen}
                            aria-controls={username ? "app-drawer" : "mobile-more-sheet"}
                        >
                            <Menu className="h-6 w-6 shrink-0" />
                            {username && (<span className="text-[10px] leading-none font-medium mt-0.5">Menu</span>)}
                        </button>
                        <Link to="/" className="flex-shrink-0" aria-label="Go to Homepage">
                            <span className="text-2xl font-bold text-green-700 dark:text-green-500">WakiliApp</span>
                        </Link>
                    </div>

                    <div className="flex items-center">
                        <div className="hidden lg:flex items-center space-x-3"> {/* Desktop Nav */}
                            <nav className="flex items-center space-x-1" aria-label="Main navigation">
                                {desktopNavLinksList.map(link => (
                                    <Link key={link.to} to={link.to} className={desktopLinkClasses(location.pathname === link.to || (link.to !== "/" && location.pathname.startsWith(link.to) && link.to.length > 1) )} aria-current={location.pathname === link.to ? "page" : undefined}>
                                        <link.icon className="w-4 h-4 mr-1.5 shrink-0" /> {link.label}
                                    </Link>
                                ))}
                            </nav>
                            {/* Show separator if PWA button is shown, OR if user is logged in (and PWA button might not be shown) */}
                            {(desktopNavLinksList.length > 0 && (shouldShowPWAButton || (username && !shouldShowPWAButton))) && (<div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>)}
                            <div className="flex items-center space-x-2">
                                {shouldShowPWAButton && (<button onClick={handlePWAInstall} className={`${PWA_BUTTON_SHARED_CLASSES} bg-green-600 hover:bg-green-700 text-white`} title="Install WakiliApp"><DownloadCloud className="w-4 h-4 mr-1.5 shrink-0" /> Install App</button>)}
                                {!username ? (
                                    <>
                                        <Link to="/register" className={`${desktopAuthButtonBaseClasses} text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 bg-green-50 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-gray-600`}><UserPlus className="w-4 h-4 mr-1.5 shrink-0" /> Register</Link>
                                        <Link to="/login" className={`${desktopAuthButtonBaseClasses} text-white bg-green-600 hover:bg-green-700`}><LogIn className="w-4 h-4 mr-1.5 shrink-0" /> Login</Link>
                                    </>
                                ) : (
                                    // Desktop Profile Menu Container
                                    <div className="relative" ref={desktopProfileMenuRef}>
                                        <button id="user-menu-button-desktop" onClick={toggleProfileDropdown} aria-label="User menu" aria-expanded={isProfileDropdownOpen} aria-haspopup="true" className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-white dark:focus:ring-offset-gray-800">
                                            <img src={profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=059669&color=fff&rounded=true&size=36&font-size=0.45&length=2&bold=true`} alt={`${username}'s Avatar`} className="w-9 h-9 rounded-full border-2 border-green-200 hover:border-green-500 transition-colors"/>
                                            <ChevronDown className="w-4 h-4 ml-1 text-gray-500 dark:text-gray-400 shrink-0" />
                                        </button>
                                        {isProfileDropdownOpen && <ProfileDropdownPanel triggerButtonId="user-menu-button-desktop" />}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="lg:hidden flex items-center space-x-1"> {/* Mobile Right Icons */}
                            {shouldShowPWAButton && (<button onClick={handlePWAInstall} className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1" title="Install WakiliApp" aria-label="Install WakiliApp"><DownloadCloud className="h-5 w-5 shrink-0" /></button>)}
                            {!username ? (
                                <Link to="/login" className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1" aria-label="Login" title="Login"><LogIn className="w-5 h-5 shrink-0" /></Link>
                            ) : (
                                // Mobile (top-right avatar) Profile Menu Container
                                <div className="relative" ref={mobileProfileMenuRef}>
                                    <button id="user-menu-button-mobile" onClick={toggleProfileDropdown} aria-label="User menu" aria-expanded={isProfileDropdownOpen} aria-haspopup="true" className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-white dark:focus:ring-offset-gray-800">
                                        <img src={profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=059669&color=fff&rounded=true&size=36&font-size=0.45&length=2&bold=true`} alt={`${username}'s Avatar`} className="w-9 h-9 rounded-full border-2 border-green-200 hover:border-green-500 transition-colors"/>
                                    </button>
                                    {isProfileDropdownOpen && <ProfileDropdownPanel triggerButtonId="user-menu-button-mobile" />}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Bottom Mobile Navbar: z-50 */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 w-full h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-top z-50 flex items-stretch" aria-label="Mobile bottom navigation">
                <Link to="/" className={bottomNavLinkClasses(location.pathname === "/")}> <Home className="w-5 h-5 mb-0.5 shrink-0" /> Home </Link>
                {username && userRole !== 'disabled' ? (
                    <Link to="/dashboard" className={bottomNavLinkClasses(location.pathname.startsWith("/dashboard"))}> <LayoutDashboard className="w-5 h-5 mb-0.5 shrink-0" /> Dashboard </Link>
                ) : (
                    <Link to="/services" className={bottomNavLinkClasses(location.pathname === "/services")}> <Briefcase className="w-5 h-5 mb-0.5 shrink-0" /> Services </Link>
                )}
                <Link to="/howitworks" className={bottomNavLinkClasses(location.pathname.startsWith("/howitworks"))}> <BookOpen className="w-5 h-5 mb-0.5 shrink-0" /> How It Works </Link>
                <button onClick={toggleMobileMoreSheet} className={bottomNavLinkClasses(isMobileMoreSheetOpen)} aria-label="More options" aria-expanded={isMobileMoreSheetOpen} aria-haspopup="true" id="mobile-more-button-bottomnav">
                    <MoreHorizontal className="w-5 h-5 mb-0.5 shrink-0" /> More
                </button>
            </nav>

            {/* Mobile More Sheet: Panel z-60, Overlay z-55 */}
            {isMobileMoreSheetOpen && (
                 <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-55 lg:hidden" onClick={() => setIsMobileMoreSheetOpen(false)} aria-hidden="true"></div>
                    <div id="mobile-more-sheet" ref={mobileSheetRef} className="fixed bottom-16 left-0 right-0 w-full bg-white dark:bg-gray-800 rounded-t-2xl shadow-top-xl z-60 p-4 pt-3 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto" style={{ transform: isMobileMoreSheetOpen ? 'translateY(0)' : 'translateY(100%)', maxHeight: 'calc(100vh - 8rem)' }} role="dialog" aria-modal="true" aria-labelledby="more-options-title">
                        <div className="flex justify-between items-center mb-3"><h3 id="more-options-title" className="text-lg font-semibold text-gray-800 dark:text-gray-100">More Options</h3><button onClick={() => setIsMobileMoreSheetOpen(false)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Close more options"><X className="w-5 h-5 shrink-0" /></button></div>
                        <nav className="space-y-1" aria-label="Additional mobile navigation">
                            {shouldShowPWAButton && (<button onClick={handlePWAInstall} className={`${PWA_BUTTON_SHARED_CLASSES} ${mobileSheetLinkClasses(false)} w-full bg-green-100 text-green-700 hover:bg-green-200 text-base px-4 py-3`}><DownloadCloud className="w-5 h-5 mr-3 shrink-0" /> Install WakiliApp</button>)}
                            <Link to="/about" onClick={() => mobileSheetNavItemClick("/about")} className={mobileSheetLinkClasses(location.pathname === "/about")}><Info className="w-5 h-5 mr-3 text-gray-500 shrink-0" /> About Us</Link>
                            <Link to="/contactus" onClick={() => mobileSheetNavItemClick("/contactus")} className={mobileSheetLinkClasses(location.pathname === "/contactus")}><Mail className="w-5 h-5 mr-3 text-gray-500 shrink-0" /> Contact Us</Link>
                            {username ? (
                                <><div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700"></div>
                                <Link to="/dashboard/profile" onClick={() => mobileSheetNavItemClick("/dashboard/profile")} className={mobileSheetLinkClasses(location.pathname === "/dashboard/profile")}><User className="w-5 h-5 mr-3 text-gray-500 shrink-0" /> My Profile</Link>
                                <Link to="/dashboard/settings" onClick={() => mobileSheetNavItemClick("/dashboard/settings")} className={mobileSheetLinkClasses(location.pathname === "/dashboard/settings")}><Settings className="w-5 h-5 mr-3 text-gray-500 shrink-0" /> App Settings</Link>
                                <button onClick={() => { handleLogout(); mobileSheetNavItemClick(); /* mobileSheetNavItemClick with no arg just closes sheet */ }} className={`${mobileSheetLinkClasses(false)} w-full text-red-600 hover:bg-red-50`}><LogOutIcon className="w-5 h-5 mr-3 shrink-0" /> Logout</button></>
                            ) : (
                                <><div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700"></div>
                                <Link to="/register" onClick={() => mobileSheetNavItemClick("/register")} className={mobileSheetLinkClasses(location.pathname === "/register")}><UserPlus className="w-5 h-5 mr-3 text-gray-500 shrink-0" /> Register</Link>
                                <Link to="/login" onClick={() => mobileSheetNavItemClick("/login")} className={`${mobileSheetLinkClasses(false)} font-semibold bg-green-600 text-white hover:bg-green-700 justify-center`}><LogIn className="w-5 h-5 mr-3 shrink-0" /> Login</Link></>
                            )}
                        </nav>
                    </div>
                </>
            )}

            {/* AppDrawer (mobile main menu): Panel z-30, Overlay z-20 */}
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