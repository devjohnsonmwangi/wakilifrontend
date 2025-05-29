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
    'node_modules/flowbite/**/*.js' // Recommended by Flowbite docs to ensure all JS-triggered classes are picked up
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
        bounce: { // Note: Tailwind has a built-in 'bounce' animation, this will override it if you use `animate-bounce`
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-5px)'
          },
          '100%': {
            transform: 'translateY(0px)'
          }
        },
        // Updated/Added for the modern modal
        modalShow: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(20px)' }, // Added translateY
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 10s linear infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'spin-slow': 'spin 3s linear infinite', // Note: Tailwind has 'animate-spin', this allows for 'animate-spin-slow'
        'spin-fast': 'spinFast 0.7s linear infinite',
        'fade-in-out': 'fadeInOut 2s ease-in-out infinite',
        'bounce': 'bounce 0.5s infinite', // This will be used by `animate-bounce`
        float: 'float 3s ease-in-out infinite',
        // Updated/Added for the modern modal
        modalShow: 'modalShow 0.3s ease-out forwards', // Changed from ease-in-out to ease-out for a snappier feel
      },
      screens: {
        'xs': '250px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '2000px', // Keep your custom screen size
      },
    },
  },
  plugins: [
    daisyui, 
    flowbitePlugin
  ],
  daisyui: {
    themes: [ // Your existing themes are good
      "light",
      "dark",
      "cupcake",
      "retro",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
    // You can also specify if DaisyUI should automatically add the 'dark' class
    // based on prefers-color-scheme, but since you're handling it manually,
    // this might not be strictly necessary.
    // darkTheme: "dark", // (Optional) Explicitly set the dark theme DaisyUI uses
  },
};