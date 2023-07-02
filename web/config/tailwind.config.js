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
        "fade-out": "fadeout 0.5s linear forwards",
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
        fadeout: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
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
      // https://uicolors.app/create
      // https://realtimecolors.com/?colors=0a070e-f4f1f8-14eba3-25211e-12d393
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
          950: "#0a2917",
        },
        text: {
          50: "hsl(65, 52%, 96%)",
          100: "hsl(62, 53%, 90%)",
          200: "hsl(67, 50%, 80%)",
          300: "hsl(71, 47%, 67%)",
          400: "hsl(73, 43%, 52%)",
          500: "hsl(74, 55%, 39%)",
          600: "hsl(76, 61%, 30%)",
          700: "hsl(77, 61%, 24%)",
          800: "hsl(77, 58%, 20%)",
          900: "hsl(78, 57%, 16%)",
          950: "hsl(80, 60%, 1%)",
        },
        background: {
          DEFAULT: "#fffafb",
          50: "#fffafb",
          100: "#ffe0e6",
          200: "#ffc6d1",
          300: "#ff9eb1",
          400: "#ff6685",
          500: "#fd365e",
          600: "#eb1741",
          700: "#c60f34",
          800: "#a3112e",
          900: "#87152c",
          950: "#4a0513",
        },
        primary: {
          DEFAULT: "#14eba3",
          50: "#e9fff6",
          100: "#cbffe7",
          200: "#9bffd4",
          300: "#5bfac0",
          400: "#14eba3",
          500: "#00d390",
          600: "#00ac77",
          700: "#008a63",
          800: "#006d4f",
          900: "#005943",
          950: "#003327",
        },
        secondary: {
          DEFAULT: "#25211e",
          50: "#f7f6f6",
          100: "#e6e2e1",
          200: "#cdc5c2",
          300: "#ada09b",
          400: "#8b7c76",
          500: "#70635c",
          600: "#594e48",
          700: "#49413c",
          800: "#3c3733",
          900: "#34302d",
          950: "#25211e",
        },
        accent: {
          DEFAULT: "#12d393",
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#12d393",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
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
    require("@tailwindcss/typography"),
    plugin(({ addVariant }) => {
      addVariant("dataready", '&[data-ready="true"]');
      addVariant("not-last", "&:not(:last-child)");
      addVariant("not-only", "&:not(:only-child)");
      addVariant("not-firstlast", "&:not(:first-child):not(:last-child)");
    }),
  ],
};
