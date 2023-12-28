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
  postFoodDiaryEntry: privateProcedure.input(
        z.object({
            entryTime: z.string(),
            mealDescription: z.string(),
            additionalComments: z.string(),
            kilojoules: z.number()
        })
    ).mutation(async ({ input, ctx }): Promise<{ location: string }> => {
        console.log("Anyone home")
        console.log(ctx.userId)
        const inputWithUserId = {...input, userId: ctx.userId};
        console.log("Anyone home")
        console.log(inputWithUserId)
        const response = await fetch(baseUrl+`new-entry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputWithUserId)
        });
        console.log(response)
        if (!response.ok) {
            throw new Error('Failed to post food diary entry');
        }
        const location = response.headers.get('Location') ?? ``;
        return {location: location};
    }),
});
