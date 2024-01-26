const plugin = require("tailwindcss/plugin");
/** @type {require('tailwindcss').Config} */
module.exports = {
  variants: {},
  content: ["src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    {
      pattern: /grid-cols-./,
    },
  ],
  theme: {
    extend: {
      screens: {
        "2xl": "1536px",
        "3xl": "1600px",
      },
      borderWidth: {
        skew: "55px 0 0 320px",
      },
      animation: {
        "circle-progress": "progress 1s ease-out forwards",
        "fade-in": "fadein 0.3s ease-in forwards",
        "fade-out": "fadeout 0.3s linear forwards",
        "fly-in": "flyIn 0.3s ease-out",
        "fly-out": "flyOut 0.3s ease-out",
        "fly-in-top": "flyInTop 0.1s ease-out",
        "pop-up":
          "popUp 0.5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards",
        "fill-up":
          "fillProgess 2s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards",
        fill: "fill 2s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards",
        "auto-fill-cancel": "auto-fill-cancel 10ms",
        "ripple-enter": "ripple-enter 550ms cubic-bezier(0.4, 0, 0.2, 1)",
        "ripple-exit": "ripple-exit 550ms cubic-bezier(0.4, 0, 0.2, 1)",
        wave: "wave 2s linear 0.5s infinite",
      },
      keyframes: {
        progress: {
          "0%": {
            "stroke-dasharray": "0 100",
          },
        },
        fadein: {
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
        flyIn: {
          from: {
            transform: "translateX(calc(100% + 1.5em))",
          },
          to: {
            transform: "translateX(0)",
          },
        },
        flyOut: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(calc(100% + 1.5em))",
            display: "none",
          },
        },
        popUp: {
          from: {
            transform: "scale(0)",
          },
          to: {
            transform: "scale(1)",
          },
        },
        fill: {
          from: {
            transform: "scaleX(0)",
          },
          to: {
            transform: "scaleX(1)",
          },
        },
        "auto-fill-cancel": {
          from: {
            display: "block",
          },
        },
        flyInTop: {
          from: {
            transform: "translateY(calc(-100% + 1.5em))",
          },
          to: {
            transform: "translateY(0)",
          },
        },
        wave: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "50%": {
            transform: "translateX(100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "ripple-enter": {
          "0%": {
            transform: "scale(0)",
            opacity: "0.1",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "0.12",
          },
        },
        "ripple-exit": {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
      // https://uicolors.app/create
      // https://realtimecolors.com/?colors=0a070e-f4f1f8-14eba3-25211e-12d393
      colors: {
        primary: {
          // default blue colors
          50: "#eff6ff",
          100: "#ebf8ff",
          200: "#bee3f8",
          300: "#90cdf4",
          400: "#63b3ed",
          500: "#4299e1",
          600: "#3182ce",
          700: "#2b6cb0",
          800: "#2c5282",
          900: "#2a4365",
        },
        secondary: {
          // Default Zinc Colors
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
        success: {
          // Default Green Colors
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        warning: {
          // default amber colors
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        error: {
          // default red colors
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        // warning: { // default orange colors
        //   50: "#fff7ed",
        //   100: "#ffedd5",
        //   200: "#fed7aa",
        //   300: "#fdba74",
        //   400: "#fb923c",
        //   500: "#f97316",
        //   600: "#ea580c",
        //   700: "#c2410c",
        //   800: "#9a3412",
        //   900: "#7c2d12",
        //   950: "#431407",
        // },
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
    require("autoprefixer"),
    plugin(({ addVariant, addComponents, theme }) => {
      addVariant("not-last", "&:not(:last-child)");
      addVariant("not-only", "&:not(:only-child)");
      addVariant("between", "&:not(:first-child):not(:last-child)");
      addComponents({
        ".rw-segment": {
          width: "100%",
          overflow: "hidden",
          scrollBehavior: "smooth",
          scrollbarColor: `${theme("colors.zinc.400")} transparent`,
        },
        ".rw-segment-main": {
          padding: `${theme("spacing.4")}`,
        },
      });
    }),
  ],
};
