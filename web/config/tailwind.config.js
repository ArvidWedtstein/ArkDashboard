/** @type {require('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  variants: {},
  content: ["src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        boxGradBefore: "linear-gradient(#ffffff, #ffffff, #e3e3e3)",
        boxShadowGrad: "linear-gradient(rgba(0,0,0,0.075), transparent)",
      },
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
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("dataready", '&[data-ready="true"]');
    }),
  ],
};
