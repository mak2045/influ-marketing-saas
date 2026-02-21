import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";

const campaignSchema = z.object({
    title: z.string().min(5),
    objective: z.string().min(10),
    platforms: z.array(z.string()),
    clip_duration: z.string(), // e.g. "15-30s" or number
    guidelines: z.string(),
    dos: z.string(),
    donts: z.string(),
    brandId: z.string(),
    budget: z.number().min(50),
    payment_model: z.enum(["FIXED", "PERFORMANCE"]),
    status: z.enum(["DRAFT", "LIVE", "CLOSED"]).default("DRAFT"),
});

export const campaignRouter = router({
    // Create Campaign
    create: publicProcedure
        .input(campaignSchema)
        .mutation(async ({ input }) => {
            const docRef = await adminDb.collection("campaigns").add({
                ...input,
                createdAt: new Date(),
                updatedAt: new Date(),
                applicationCount: 0,
            });
            return { id: docRef.id, ...input };
        }),

    // List All Campaigns
    list: publicProcedure.query(async () => {
        try {
            const snapshot = await adminDb
                .collection("campaigns")
                .where("status", "==", "LIVE")
                .orderBy("createdAt", "desc")
                .limit(20)
                .get();

            const campaigns = await Promise.all(snapshot.docs.map(async (doc) => {
                const data = doc.data();

                // Fetch brand name
                let brandName = "Unknown Brand";
                if (data.brandId) {
                    const brandDoc = await adminDb.collection("users").doc(data.brandId).get();
                    if (brandDoc.exists) {
                        brandName = brandDoc.data()?.displayName || "Branded Company";
                    }
                }

                return {
                    id: doc.id,
                    ...data,
                    brandName,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
                };
            }));

            return campaigns as any[];
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            return [];
        }
    }),

    // Update Campaign Status (e.g. DRAFT -> LIVE)
    updateStatus: publicProcedure
        .input(z.object({
            id: z.string(),
            status: z.enum(["DRAFT", "LIVE", "CLOSED"])
        }))
        .mutation(async ({ input }) => {
            await adminDb.collection("campaigns").doc(input.id).update({
                status: input.status,
                updatedAt: new Date(),
            });
            return { success: true };
        }),

    // Delete Campaign
    remove: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            await adminDb.collection("campaigns").doc(input.id).delete();
            return { success: true };
        }),

    // List Campaigns by Brand
    listByBrand: publicProcedure
        .input(z.object({ brandId: z.string() }))
        .query(async ({ input }) => {
            const snapshot = await adminDb
                .collection("campaigns")
                .where("brandId", "==", input.brandId)
                .orderBy("createdAt", "desc")
                .get();

            return snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
                } as any;
            });
        }),

    // Get Single Campaign
    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const doc = await adminDb.collection("campaigns").doc(input.id).get();
            if (!doc.exists) {
                throw new Error("Campaign not found");
            }
            const data = doc.data()!;
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
            } as any;
        }),
});
