import { router, publicProcedure } from "./trpc";
import { userRouter } from "./user";

export const appRouter = router({
    test: publicProcedure.query(() => "ok"),
    user: userRouter,
});

export type AppRouter = typeof appRouter;
