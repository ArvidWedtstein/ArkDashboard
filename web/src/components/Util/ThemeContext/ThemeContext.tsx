import React, { createContext, useState, useContext } from 'react';

interface Theme {
  primaryColor: string;
  secondaryColor: string;
}

interface ThemeContextProps {
  primaryColor: string;
  secondaryColor: string;
  setTheme: (newTheme: Partial<Theme>) => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextProps>({
  primaryColor: 'blue',
  secondaryColor: 'green',
  setTheme: () => { },
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>({
    primaryColor: 'blue',
    secondaryColor: 'green',
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
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};