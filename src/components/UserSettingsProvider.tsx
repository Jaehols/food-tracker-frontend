import React, {useState, useEffect, useContext, ReactNode, createContext} from 'react';
import {UserSettings} from "~/server/api/routers/userSettings";
import {api} from "~/utils/api";
import {LoadingSpinner} from "~/components/loading";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export const UserSettingsContext = createContext<UserSettings | null | undefined>(null);

type UserSettingsProviderProps = {
    children: ReactNode;
};


const UserSettingsProvider: React.FC<UserSettingsProviderProps> = ({ children }) => {
    const { data: userSettings, isLoading: settingsLoading, isError: settingsError } = api.userSettings.getUserSettings.useQuery();

    if (settingsLoading) {
        return null;
    }

    if (settingsError) {
        console.error('Failed to fetch user settings:', error);
    }

    return (
        <UserSettingsContext.Provider value={userSettings}>
            {children}
        </UserSettingsContext.Provider>
    );
}
export default UserSettingsProvider;
