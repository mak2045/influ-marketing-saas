import { router, publicProcedure } from "../trpc";
import { campaignRouter } from "./campaign";
import { applicationRouter } from "./application";
import { userRouter } from "./user";

export const appRouter = router({
    health: publicProcedure.query(async () => {
        return { status: "ok" };
    }),
    test: publicProcedure.query(async () => {
        return "ok";
    }),
    campaign: campaignRouter,
    application: applicationRouter,
    user: userRouter,
});

export type AppRouter = typeof appRouter;
