import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

const apiVersion = "v1/";
const baseUrl: string = env.BASE_API_URL + apiVersion + "food-diary/";

type FoodDiaryEntry = {
    entryId: string;
    userId: string;
    entryTime: string;
    mealDescription: string;
    additionalComments: string;
    kilojoules: number;
};

export const foodEntryRouter = createTRPCRouter({
  getFoodDiaryEntry: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input }): Promise<FoodDiaryEntry> => {
        const response = await fetch(baseUrl+`entry/${input.id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch food diary entry');
        }
        const diaryEntry: FoodDiaryEntry = await response.json() as FoodDiaryEntry;
        return diaryEntry;
   }),
});
