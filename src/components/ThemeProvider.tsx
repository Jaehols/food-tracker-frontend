import {ReactNode, useContext, useEffect, useState} from "react";
import {UserSettingsContext} from "~/components/UserSettingsProvider";
import {ThemeContext} from "~/components/ThemeContext";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const userSettings = useContext(UserSettingsContext);
    const [theme, setTheme] = useState('classicGreen');

    useEffect(() => {
        if (userSettings.userSettings?.preferredTheme) {
            setTheme(userSettings.userSettings.preferredTheme);
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
