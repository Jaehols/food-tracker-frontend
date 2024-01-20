import { createContext } from 'react'

interface ThemeContextType {
    theme: string;
    setTheme: (theme: string) => void;
}

const defaultContextValue: ThemeContextType = {
    theme: 'classicGreen',
    setTheme: theme => console.warn('no theme provider')
};

export const ThemeContext = createContext<ThemeContextType>(defaultContextValue)