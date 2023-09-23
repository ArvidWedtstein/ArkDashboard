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
        "fade-in": "fadein 0.5s ease-in forwards",
        "fade-out": "fadeout 0.5s linear forwards",
        "fly-in": "flyIn 0.3s ease-out",
        "fly-out": "flyOut 0.3s ease-out",
        "fly-in-top": "flyInTop 0.1s ease-out",
        "pop-up":
          "popUp 0.5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards",
        "fill-up":
          "fillProgess 2s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards",
        fill: "fill 2s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards",
        ripple: "ripple 0.6s linear infinite",
        "ripple-hover": "ripple 0.6s linear forwards",
      },
      keyframes: {
        ripple: {
          "0%": {
            "box-shadow":
              "0 0 0 0 rgba(255,255,255, 0.1), 0 0 0 20px rgba(255,255,255, 0.1), 0 0 0 40px rgba(255,255,255, 0.1), 0 0 0 60px rgba(255,255,255, 0.1)",
          },
          "100%": {
            "box-shadow":
              "0 0 0 20px rgba(255,255,255, 0.1), 0 0 0 40px rgba(255,255,255, 0.1), 0 0 0 60px rgba(255,255,255, 0.1), 0 0 0 80px rgba(255,255,255, 0)",
          },
        },
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
        flyInTop: {
          from: {
            transform: "translateY(calc(-100% + 1.5em))",
          },
          to: {
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
        grey: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
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
    require("autoprefixer"),
    plugin(({ addVariant, addComponents, theme }) => {
      addVariant("dataready", '&[data-ready="true"]');
      addVariant("not-last", "&:not(:last-child)");
      addVariant("not-only", "&:not(:only-child)");
      addVariant("not-firstlast", "&:not(:first-child):not(:last-child)");
      addComponents({
        ".rw-badge": {
          display: "inline-flex",
          alignItems: "center",
          borderRadius: theme("borderRadius.DEFAULT"),
          padding: `${theme("spacing.1")} ${theme("spacing[2.5]")}`,
          fontSize: theme("fontSize.xs"),
          lineHeight: theme("lineHeight.4"),
          fontWeight: theme("fontWeight.medium"),
        },
        ".rw-badge-small": {
          padding: "2px 6px",
        },
        ".rw-segment": {
          width: "100%",
          overflow: "hidden",
          scrollBehavior: "smooth",
          scrollbarColor: `${theme("colors.zinc.400")} transparent`,
        },
      });
    }),
  ],
};
