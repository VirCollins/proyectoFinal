// ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const ThemeContext = createContext();

// Proveedor del contexto
export const ThemeProvider = ({ children }) => {
  const [isNightMode, setIsNightMode] = useState(false);

  const toggleNightMode = () => {
    setIsNightMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isNightMode, toggleNightMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar el contexto
export const useTheme = () => {
  return useContext(ThemeContext);
};