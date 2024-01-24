import {z} from "zod";

import {createTRPCRouter, privateProcedure} from "~/server/api/trpc";
import {env} from "~/env";
import {convertThemeStringOnSettings} from "~/utils/themeUtils";

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


export const userSettingsRouter = createTRPCRouter({

    getUserSettings: privateProcedure
        .query(async ({ ctx }): Promise<UserSettings> => {
            const response = await fetch(baseUrl+`userSettings/${ctx.userId}`);
            if (!response.ok) {
                return defaultSetting;
            }
            return convertThemeStringOnSettings(await response.json() as UserSettings);
        }),

    postUserSettings: privateProcedure.input(
        z.object({
            preferredTheme: z.string(),
            energyShown: z.boolean(),
            energyUnit: z.string()
        })
    ).mutation(async ({ input, ctx }): Promise<{ location: string }> => {
        const inputWithDate = {...input, lastUpdated: new Date().toISOString()};
        const response = await fetch(baseUrl+`userSettings/${ctx.userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputWithDate)
        });
        if (!response.ok) {
            console.log(response);
            throw new Error('Failed to post user settings');
        }
        return { location: response.headers.get('Location') ?? '' };
    }),
});
