import {z} from "zod";

import {createTRPCRouter, privateProcedure, publicProcedure} from "~/server/api/trpc";
import {env} from "~/env";

const apiVersion = "v1/";
const baseUrl: string = env.BASE_API_URL + apiVersion + "food-diary/";

export type FoodDiaryEntry = {
    entryId: string;
    userId: string;
    entryTime: string;
    createdTime: string;
    mealDescription: string;
    additionalComments: string;
    kilojoules: number;
    entryType: string
};

export const foodEntryRouter = createTRPCRouter({
  getFoodDiaryEntry: publicProcedure
    .input(z.object({ id: z.string().uuid(), userId: z.string() }))
      .query(async ({ input }): Promise<FoodDiaryEntry> => {
        const response = await fetch(baseUrl+`entry/${input.id}`+`?userId=${input.userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch food diary entry');
        }
        return await response.json() as FoodDiaryEntry;
   }),

  getAllEntriesForUser: privateProcedure
      .query(async ({ ctx }): Promise<FoodDiaryEntry[]> => {
        const response = await fetch(baseUrl+`entriesByAuthor/${ctx.userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch food diary entries');
        }
        console.log(response)
        return await response.json() as FoodDiaryEntry[];
      }),

  getAllEntriesForUserInDateRange: privateProcedure
        .input(z.object({ startDate: z.string(), endDate: z.string() }))
        .query(async ({ input , ctx}): Promise<FoodDiaryEntry[]> => {
            const response = await fetch(baseUrl+`entriesByAuthor/${ctx.userId}`+`?startDate=${input.startDate}`+`&endDate=${input.endDate}`);
            if (!response.ok) {
                throw new Error('Failed to fetch food diary entries');
            }
            return await response.json() as FoodDiaryEntry[];
        }),

  postFoodDiaryEntry: privateProcedure.input(
        z.object({
            entryTime: z.string(),
            mealDescription: z.string(),
            additionalComments: z.string(),
            kilojoules: z.number()
        })
    ).mutation(async ({ input, ctx }): Promise<{ location: string }> => {
        const inputWithUserId = {...input, userId: ctx.userId};
        const response = await fetch(baseUrl+`new-entry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputWithUserId)
        });
        if (!response.ok) {
            throw new Error('Failed to post food diary entry');
        }
        const location = response.headers.get('Location') ?? ``;
        return {location: location};
    }),
});
