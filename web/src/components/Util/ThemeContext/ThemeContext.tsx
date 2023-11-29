// import resolveConfig from "tailwindcss/resolveConfig";
// import tailwindConfig from "./../../../../config/tailwind.config.js";
// const tailwindConfig = require("./../../../../config/tailwind.config.js");
import React, { createContext, useState, useContext } from "react";
import { Color } from "src/lib/formatters";

type TypeBackground = {
  // default: string;
  light: string;
  dark: string;
};
type PaletteColorOptions = {
  // main: Color;
  light?: Color;
  dark?: Color;
  contrastText?: Color;
};
type PaletteOptions = {
  primary?: PaletteColorOptions;
  secondary?: PaletteColorOptions;
  error?: PaletteColorOptions;
  warning?: PaletteColorOptions;
  info?: PaletteColorOptions;
  success?: PaletteColorOptions;
  background?: Partial<TypeBackground>;
  getContrastText?: (background: string) => string;
};
type Theme = {
  palette: PaletteOptions;
  setTheme?: (theme: Partial<Theme>) => void;
};

type ThemeContextProps = Theme & {
  setTheme: (theme: Partial<Theme>) => void;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextProps>({
  palette: {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>({
    palette: {
      primary: {
        light: "blue-400",
      },
      secondary: {
        light: "zinc-400",
      },
      error: {
        light: "red-500",
        dark: "red-500",
        contrastText: "white",
      },
      warning: {
        light: "amber-500",
      },
      info: {
        light: "blue-500",
      },
      success: {
        light: "green-500",
        dark: "green-500",
      },
      background: {
        light: "gray-100",
        dark: "gray-900",
      },
    },
  });

  const updateTheme = (newTheme: Partial<Theme>) => {
    setTheme({ ...theme, ...newTheme });
  };

  return (
    <ThemeContext.Provider value={{ ...theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to easily consume the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
