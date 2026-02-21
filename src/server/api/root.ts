import { router, publicProcedure } from "./trpc";
import { userRouter } from "./user";
import { campaignRouter } from "./campaign";
import { applicationRouter } from "./application";

export const appRouter = router({
    test: publicProcedure.query(() => "ok"),
    user: userRouter,
    campaign: campaignRouter,
    application: applicationRouter,
});

export type AppRouter = typeof appRouter;
