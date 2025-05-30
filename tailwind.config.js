// tailwind.config.js (or .ts)
import daisyui from "daisyui";
import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Crucial for the manual dark mode toggling in React
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
    'node_modules/flowbite/**/*.js' // Recommended by Flowbite docs
  ],
  theme: {
    extend: {
      colors: {
        'soft-yellow': '#FFD700',
        'dark-green': '#6dc26d',
        'button-gradient-start': '#FFA500',
        'button-gradient-end': '#FF4500',
      },
      keyframes: {
        // --- Your existing keyframes ---
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        twinkle: {
          '0%, 100%': { color: '#FFF', transform: 'translateY(0)' },
          '50%': { color: '#FFF5E1', transform: 'translateY(-0.25rem)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        spinFast: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        fadeInOut: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 1 },
        },
        bounce: { // Standard bounce
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25%)' }, // Adjusted for more noticeable bounce
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        modalShow: { // You already have this, very similar to what's needed
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        // --- ADDED/MODIFIED FOR `animate-modalEnter` class ---
        modalEnter: { // This is for the `animate-modalEnter` class used in Profile.tsx
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' }, // Starts slightly down
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        // --- New keyframes for logout component ---
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        logoutProgress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        // --- Keyframes for Hero component animations ---
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        // --- Your existing animations ---
        marquee: 'marquee 10s linear infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'spin-slow': 'spinSlow 3s linear infinite',
        'spin-fast': 'spinFast 0.7s linear infinite',
        'fade-in-out': 'fadeInOut 2s ease-in-out infinite',
        'bounce': 'bounce 1s infinite', // Using standard bounce keyframe
        float: 'float 3s ease-in-out infinite',
        modalShow: 'modalShow 0.3s ease-out forwards', // Connects to modalShow keyframes
        // --- ADDED/MODIFIED FOR `animate-modalEnter` class ---
        modalEnter: 'modalEnter 0.3s ease-in-out forwards', // Connects to modalEnter keyframes. 'forwards' is key.
        // --- New animations for logout component ---
        blob: "blob 7s infinite",
        'logout-progress': 'logoutProgress 2s ease-out forwards',
        // --- Animations for Hero component ---
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards', // Added 'forwards' to keep final state
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',   // Added 'forwards' to keep final state
      },
      animationDelay: { // This is for the custom plugin generating .animation-delay-xxxx
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      screens: {
        'xs': '250px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '2000px',
      },
    },
  },
  plugins: [
    daisyui,
    flowbitePlugin,
    function ({ addUtilities, theme, e }) {
      const delays = theme('animationDelay');
      if (delays) {
        const utilities = Object.entries(delays).map(([key, value]) => ({
          [`.${e(`animation-delay-${key}`)}`]: { 'animation-delay': value },
        }));
        addUtilities(utilities, ['responsive', 'hover']);
      }
    }
  ],
  daisyui: {
    themes: [
      "light", "dark", "cupcake", "retro", "forest", "aqua", "lofi",
      "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
      "cmyk", "autumn", "business", "acid", "lemonade", "night",
      "coffee", "winter", "dim", "nord", "sunset",
    ],
  },
};