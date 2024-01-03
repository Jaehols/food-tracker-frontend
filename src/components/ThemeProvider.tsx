import {ReactNode, useContext, useEffect, useState} from "react";
import {ThemeContext} from "~/pages/ThemeContext";
import {UserSettingsContext} from "~/components/UserSettingsProvider";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const userSettings = useContext(UserSettingsContext);
    const [theme, setTheme] = useState('classicGreen');

    useEffect(() => {
        if (userSettings?.preferredTheme) {
            setTheme(userSettings.preferredTheme);
        }
    }, [userSettings]);

    const contextValue = {
        theme,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};
