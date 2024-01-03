import {foodEntryRouter} from "~/server/api/routers/foodEntry";
import { createTRPCRouter } from "~/server/api/trpc";
import {userSettingsRouter} from "~/server/api/routers/userSettings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  foodDiary: foodEntryRouter,
  userSettings: userSettingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
