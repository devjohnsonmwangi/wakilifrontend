import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../features/users/userSlice'; 


const SunIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

// A  SVG spinner component
const SpinnerIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// Logout Icon
const LogoutIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);


const Logout: React.FC = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') { 
      const savedTheme = localStorage.getItem('theme');
      
      // Default to 'dark' if no preference or if system preference cannot be determined.
      if (savedTheme) return savedTheme;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'dark'; // Default to dark if all else fails or SSR
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    dispatch(logOut());
    localStorage.removeItem('authToken'); 
    sessionStorage.removeItem('authToken');
    document.cookie = 'authToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen 
                   bg-gradient-to-br from-slate-100 via-sky-100 to-slate-100
                   dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 
                   p-4 sm:p-6 relative overflow-hidden transition-colors duration-500"
    >
      {/* Optional: Subtle animated background elements for dark mode */}
      {theme === 'dark' && (
        <>
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-30 animate-blob animation-delay-4000"></div>
        </>
      )}

      {/* Main Card with Glassmorphism Effect */}
      <div
        className="
          bg-white bg-opacity-70 backdrop-blur-lg border border-slate-300 text-slate-800
          dark:bg-slate-800 dark:bg-opacity-50 dark:border-slate-700 dark:text-slate-100
          p-6 sm:p-10 rounded-xl shadow-xl dark:shadow-2xl dark:shadow-purple-500/30
          w-full max-w-lg 
          relative transition-all duration-500
        "
      >
        {/* Theme Toggle Button */}
        <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-200
                       text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700
                       focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-purple-500 focus:ring-opacity-75"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
                <MoonIcon className="w-5 h-5 text-slate-700" />
            )}
        </button>

        {/* Fancy corner accent - themed */}
        <div className="absolute -top-2 -left-2 w-12 h-12 border-t-2 border-l-2 rounded-tl-xl 
                       border-sky-500 dark:border-purple-500 
                       animate-pulse transition-colors duration-500"></div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 rounded-br-xl 
                       border-pink-400 dark:border-pink-500 
                       animate-pulse animation-delay-1000 transition-colors duration-500"></div>


        <div className="text-center">
          <div className="flex justify-center mb-6">
            <LogoutIcon className="w-16 h-16 text-sky-600 dark:text-purple-400 transition-colors duration-500" />
          </div>

          <h2 
            className="
              text-3xl sm:text-4xl font-bold mb-4
              text-transparent bg-clip-text 
              bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600
              dark:from-purple-400 dark:via-pink-500 dark:to-orange-400
            "
          >
            Leaving So Soon?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 transition-colors duration-500">
            Are you sure you want to log out? We'll miss you! <span role="img" aria-label="sad emoji">😢</span>
            <br />
            Hope to see you back again soon.
          </p>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`
              w-full sm:w-auto flex items-center justify-center
              px-8 py-3 mb-4
              bg-gradient-to-r from-red-500 via-red-600 to-red-700
              text-white text-lg font-semibold 
              rounded-lg shadow-md hover:shadow-lg hover:shadow-red-500/50
              transform hover:scale-105 transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75
              ${isLoggingOut ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          >
            {isLoggingOut ? (
              <>
                <SpinnerIcon className="w-5 h-5 mr-3 text-white" /> {/* Spinner color */}
                Logging out...
              </>
            ) : (
              'Yes, Log Me Out'
            )}
          </button>

          {/* Option to Stay */}
          {!isLoggingOut && (
            <div className="mt-6">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 transition-colors duration-500">
                Changed your mind? <span role="img" aria-label="thinking emoji">🤔</span>
              </p>
              <button
                onClick={() => navigate(-1)}
                className="
                  text-sky-600 hover:text-sky-700 
                  dark:text-purple-400 dark:hover:text-purple-300 
                  font-medium transition-colors duration-200
                  hover:underline
                "
              >
                No, take me back!
              </button>
            </div>
          )}
        </div>

        {/* Inspirational Quote or Footer Text */}
        <div className="mt-10 pt-6 border-t border-slate-300 dark:border-slate-700 transition-colors duration-500">
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-500">
            "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle." – Steve Jobs
          </p>
        </div>
        
        {/* Animated Progress Bar during logout */}
        {isLoggingOut && (
          <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-1.5 mt-8 overflow-hidden transition-colors duration-500">
            <div 
              className="bg-gradient-to-r 
                         from-sky-500 to-blue-600
                         dark:from-purple-500 dark:to-pink-500 
                         h-1.5 rounded-full animate-logout-progress"
              style={{ width: '100%' }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logout;