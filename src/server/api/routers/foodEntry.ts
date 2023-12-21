import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

let post = {
    id: 1,
    name: "Hello World",
};

export const foodEntry = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),


});
