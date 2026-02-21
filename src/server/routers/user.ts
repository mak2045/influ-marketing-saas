import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";

export const userRouter = router({
    getProfile: publicProcedure
        .input(z.object({ uid: z.string() }))
        .query(async ({ input }) => {
            try {
                if (!input.uid) {
                    return { uid: "", role: null };
                }

                const docRef = adminDb.collection("users").doc(input.uid);
                const doc = await docRef.get();

                if (!doc.exists) {
                    console.warn("⚠️ No Firestore doc for uid:", input.uid, "- returning null profile");
                    // Return null profile - client will handle auto-creation via createProfile
                    return { uid: input.uid, role: null, exists: false };
                }

                const data = doc.data();
                console.log("✅ Profile found for uid:", input.uid, "- role:", data?.role);
                return {
                    uid: doc.id,
                    ...data,
                    exists: true
                };
            } catch (error: any) {
                console.error("❌ Error in getProfile:", error.message);
                // Return a minimal profile instead of throwing
                return { uid: input.uid, role: null, exists: false, error: error.message };
            }
        }),

    createProfile: publicProcedure
        .input(z.object({
            uid: z.string(),
            email: z.string().email(),
            displayName: z.string(),
            role: z.enum(["BRAND", "CREATOR", "ADMIN"]),
        }))
        .mutation(async ({ input }) => {
            const { uid, email, displayName, role } = input;
            console.log("📝 Creating profile for uid:", uid, "role:", role);

            await adminDb.collection("users").doc(uid).set({
                uid,
                email,
                displayName,
                role,
                createdAt: new Date().toISOString(),
            });

            return { success: true, uid, role };
        }),

    updateProfile: publicProcedure
        .input(z.object({
            uid: z.string(),
            displayName: z.string().optional(),
            role: z.enum(["BRAND", "CREATOR", "ADMIN"]).optional(),
        }))
        .mutation(async ({ input }) => {
            const { uid, ...data } = input;
            await adminDb.collection("users").doc(uid).set(data, { merge: true });
            return { success: true };
        }),
});
