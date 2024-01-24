import React, {ReactNode, createContext, useEffect, useState} from 'react';
import {UserSettings} from "~/server/api/routers/userSettings";
import {api} from "~/utils/api";
import {frontendThemeToBackendTheme} from "~/utils/themeUtils";

interface UserSettingsContextType {
    userSettings: UserSettings | null | undefined;
    updateUserSettings: (newSettings: UserSettings) => void;
    updateUserTheme: (theme: string) => void;
}

export const UserSettingsContext = createContext<UserSettingsContextType>({
    userSettings: null,
    updateUserSettings: () => {},
    updateUserTheme: () => {}
});
type UserSettingsProviderProps = {
    children: ReactNode;
};

const UserSettingsProvider: React.FC<UserSettingsProviderProps> = ({ children }) => {
    const { data: fetchedUserSettings, isLoading: settingsLoading, isError: settingsError } = api.userSettings.getUserSettings.useQuery();
    const [userSettings, setUserSettings] = useState<UserSettings | null| undefined>(fetchedUserSettings);
    const {mutate: postUserSettings} = api.userSettings.postUserSettings.useMutation();

    useEffect(() => {
        if (fetchedUserSettings) {
            setUserSettings(fetchedUserSettings);
        }
    }, [fetchedUserSettings]);

    if (settingsLoading) {
        return null;
    }

    if (settingsError) {
        console.error('Failed to fetch user settings:', settingsError);
    }

    const updateUserSettings = (newSettings: UserSettings) => {
        setUserSettings(newSettings);
        postUserSettings({...newSettings, preferredTheme: frontendThemeToBackendTheme(newSettings.preferredTheme)})
    };

    const updateUserTheme = (theme: string) => {
        if (userSettings) {
            updateUserSettings({...userSettings, preferredTheme: theme});
        }
    }


    return (
        <UserSettingsContext.Provider value={{ userSettings, updateUserSettings, updateUserTheme }}>
            {children}
        </UserSettingsContext.Provider>
    );
}
export default UserSettingsProvider;
