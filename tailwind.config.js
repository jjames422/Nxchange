const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF00FF', // 80s pink
        secondary: '#800080', // 80s purple
        background: '#000000',
        foreground: '#FFFFFF',
        success: '#45D483',
        warning: '#F5A524',
        danger: '#F31260',
        info: '#06B7DB',
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        "pink-dark": {
          extend: "dark",
          colors: {
            "primary-50": "#FFCCED",
            "primary-100": "#FF99E4",
            "primary-200": "#FF66E4",
            "primary-300": "#FF3FEE",
            "primary-400": "#FF00FF",
            "primary-500": "#C800DB",
            "primary-600": "#9700B7",
            "primary-700": "#6D0093",
            "primary-800": "#4F007A",
            "success-100": "#DAFCDB",
            "success-200": "#B7FAC0",
            "success-300": "#90F2A7",
            "success-400": "#71E597",
            "success-500": "#45D483",
            "info-100": "#D0F0FF",
            "info-200": "#A1DEFF",
            "info-300": "#73C6FF",
            "info-400": "#50AFFF",
            "info-500": "#168AFF",
            "warning-100": "#FEFDD0",
            "warning-200": "#FDFCA1",
            "warning-300": "#F9F772",
            "warning-400": "#F4F14E",
            "warning-500": "#EDE917",
            "danger-100": "#FED1CF",
            "danger-200": "#FD9FA4",
            "danger-300": "#FB6F84",
            "danger-400": "#F74B76",
            "danger-500": "#F31260",
          },
        },
      },
    }),
  ],
};
