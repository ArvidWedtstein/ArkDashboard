const plugin = require("tailwindcss/plugin");
/** @type {require('tailwindcss').Config} */
module.exports = {
  variants: {},
  content: ["src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        boxGradBefore: "linear-gradient(#ffffff, #ffffff, #e3e3e3)",
        boxShadowGrad: "linear-gradient(rgba(0,0,0,0.075), transparent)",
      },
      backgroundImage: (theme) => ({
        "gradient-box": `linear-gradient(169.44deg, rgba(58, 129, 191, 0.08) 1.85%, rgba(65, 48, 90, 0.08) 98.72%)`,
      }),
      animation: {
        "circle-progress": "progress 1s ease-out forwards",
      },
      boxShadow: {
        boxContent:
          "5px 5px 5px rgba(0,0,0,0.1), 15px 15px 15px rgba(0,0,0,0.1), 20px 20px 20px rgba(0,0,0,0.1), 50px 50px 50px rgba(0,0,0,0.1), inset 3px 3px 2px #fff",
      },
      keyframes: {
        progress: {
          "0%": {
            "stroke-dasharray": "0 100",
          },
        },
      },
      //https://uicolors.app/create
      colors: {
        dark: "#000000",
        primary: "#1D2026", //"#14213d",
        secondary: "#EF4135",
        accent: "#fca311", // EF4135
        text: "ffffff",
        pea: {
          50: "#f1fcf5",
          100: "#e0f8e8",
          200: "#c2f0d2",
          300: "#92e3b0",
          400: "#5bcd85",
          500: "#34b364",
          600: "#26934f",
          700: "#1f6d3d",
          800: "#1f5c37",
          900: "#1b4c2f",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("dataready", '&[data-ready="true"]');
    }),
  ],
};
