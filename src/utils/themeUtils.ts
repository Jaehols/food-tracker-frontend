import {UserSettings} from "~/server/api/routers/userSettings";


const themeMapping: Record<string, string> = {
    "CLASSIC-GREEN": "classicGreen",
    "LIGHT": "light",
    "PURPLE-MOONLIGHT": "purpleMoonlight",
    "PINK": "pink"
};

export const convertThemeStringOnSettings = (settings: UserSettings) => {
    const key = settings.preferredTheme;

    const mappedTheme = themeMapping[key];
    return mappedTheme ? { ...settings, preferredTheme: mappedTheme } : settings;
};

export const frontendThemeToBackendTheme = (input: string) => {
    for (const [key, value] of Object.entries(themeMapping)) {
        if (value === input) {
            return key;
        }
    }
    return "CLASSIC-GREEN";
}

export const backendThemeToFrontendTheme = (inputKey: string): string | undefined => {
    return themeMapping[inputKey];
};