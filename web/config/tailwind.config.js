/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "circle-progress": "progress 1s ease-out forwards",
      },
      keyframes: {
        progress: {
          "0%": {
            "stroke-dasharray": "0 100",
          },
        },
      },
    },
  },
  plugins: [],
};
