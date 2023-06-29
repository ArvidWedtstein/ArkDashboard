const plugin = require("tailwindcss/plugin");
/** @type {require('tailwindcss').Config} */
module.exports = {
  variants: {},
  content: ["src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "2xl": "1536px",
        "3xl": "1600px",
      },
      backgroundColor: {
        boxGradBefore: "linear-gradient(#ffffff, #ffffff, #e3e3e3)",
        boxShadowGrad: "linear-gradient(rgba(0,0,0,0.075), transparent)",
      },

      animation: {
        "circle-progress": "progress 1s ease-out forwards",
        "fade-in": "fade 0.5s ease-in forwards",
        "fly-in": "flyIn 0.3s ease-out",
        "fly-out": "flyOut 0.3s ease-out",
        "pop-up":
          "popUp 0.5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards",
        "fill-up":
          "fillProgess 2s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards",
        fill: "fill 2s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards",
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
        fade: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        countup: {
          from: {
            opacity: "0",
            transform: "translateY(50px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      //https://uicolors.app/create
      colors: {
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
        montserrat: ["Montserrat"],
        // poppins2: ["Unifraktur Cook", "Poppins", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("dataready", '&[data-ready="true"]');
      addVariant("not-last", "&:not(:last-child)");
      addVariant("not-only", "&:not(:only-child)");
      addVariant("not-firstlast", "&:not(:first-child):not(:last-child)");
    }),
  ],
};
