import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import trpc from "~/pages/api/trpc/[trpc]";

type FoodDiaryEntry = {
    entryId: string;
    userId: string;
    entryTime: string;
    mealDescription: string;
    additionalComments: string;
    kilojoules: number;
};

export const foodDiaryRouter = createTRPCRouter({
  getFoodDiaryEntry: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input }): Promise<FoodDiaryEntry> => {
        const response = await fetch(`http://localhost:8080/api/v1/food-diary/entry/${input.id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch food diary entry');
        }
        const data: FoodDiaryEntry = await response.json() as FoodDiaryEntry;
        return data;
   }),
});
