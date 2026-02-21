import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";
import { TRPCError } from "@trpc/server";

const applicationSchema = z.object({
    campaignId: z.string(),
    creatorId: z.string(),
    videoUrl: z.string().url().min(1), // Added for clip submission
    notes: z.string().optional(),
    portfolioLinks: z.array(z.string().url()).optional(),
});

export const applicationRouter = router({
    // Create Application
    submit: publicProcedure
        .input(applicationSchema)
        .mutation(async ({ input }) => {
            // 1. Check if already applied
            const existing = await adminDb
                .collection("applications")
                .where("campaignId", "==", input.campaignId)
                .where("creatorId", "==", input.creatorId)
                .get();

            if (!existing.empty) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "You have already applied to this campaign.",
                });
            }

            // 2. Check if campaign exists and is open
            const campaignDoc = await adminDb.collection("campaigns").doc(input.campaignId).get();
            if (!campaignDoc.exists) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Campaign not found.",
                });
            }

            // 3. Create Application
            const docRef = await adminDb.collection("applications").add({
                ...input,
                status: "PENDING",
                createdAt: new Date(),
            });

            // 4. Increment campaign application count (optimistic)
            await adminDb.collection("campaigns").doc(input.campaignId).update({
                applicationCount: (campaignDoc.data()?.applicationCount || 0) + 1
            });

            return { id: docRef.id, ...input };
        }),

    // List Applications (for Creator)
    myApplications: publicProcedure
        .input(z.object({ creatorId: z.string() }))
        .query(async ({ input }) => {
            const snapshot = await adminDb
                .collection("applications")
                .where("creatorId", "==", input.creatorId)
                .orderBy("createdAt", "desc")
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
            }));
        }),

    // List Applications (for Brand/Campaign)
    getByCampaign: publicProcedure
        .input(z.object({ campaignId: z.string() }))
        .query(async ({ input }) => {
            const snapshot = await adminDb
                .collection("applications")
                .where("campaignId", "==", input.campaignId)
                .orderBy("createdAt", "desc")
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
            }));
        }),
});
