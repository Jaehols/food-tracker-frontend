import {ReactNode, useContext, useEffect, useState} from "react";
import {UserSettingsContext} from "~/components/UserSettingsProvider";
import {ReactNode, useState} from "react";
import {ThemeContext} from "~/components/ThemeContext";

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
