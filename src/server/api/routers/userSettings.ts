import {z} from "zod";

import {createTRPCRouter, privateProcedure} from "~/server/api/trpc";
import {env} from "~/env";

const apiVersion = "v1/";
const baseUrl: string = env.BASE_API_URL + apiVersion + "user/";

const defaultSetting: UserSettings = {
    userId: "",
    lastUpdated: "",
    preferredTheme: "classicGreen",
    energyShown: false,
    energyUnit: "KILOJOULES"
}

export type UserSettings = {
    userId: string;
    lastUpdated: string;
    preferredTheme: string;
    energyShown: boolean;
    energyUnit: string;
}
const themeMapping: Record<string, string> = {
    "CLASSIC-GREEN": "classicGreen",
    "LIGHT": "light",
    "PURPLE-MOONLIGHT": "purpleMoonlight",
    "PINK": "pink"
};

const convertThemeStringOnSettings = (settings: UserSettings) => {
    const key = settings.preferredTheme;

    const mappedTheme = themeMapping[key];
    return mappedTheme ? { ...settings, preferredTheme: mappedTheme } : settings;
};

export const userSettingsRouter = createTRPCRouter({

    getUserSettings: privateProcedure
        .query(async ({ ctx }): Promise<UserSettings> => {
            const response = await fetch(baseUrl+`userSettings/${ctx.userId}`);
            if (!response.ok) {
                return defaultSetting;
            }
            return convertThemeStringOnSettings(await response.json() as UserSettings);
        }),
});
