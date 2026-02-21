import { initTRPC } from "@trpc/server";

export async function createTRPCContext() {
    return {};
}

export const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
