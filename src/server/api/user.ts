import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";

export const userRouter = router({
    // READ profile on login
    // If document does NOT exist, auto-create with default role = CREATOR
    getProfile: publicProcedure
        .input(z.object({ uid: z.string() }))
        .query(async ({ input }) => {
            try {
                console.log("🔍 getProfile called for uid:", input.uid);
                const docRef = adminDb.collection("users").doc(input.uid);
                const doc = await docRef.get();

                if (!doc.exists) {
                    console.warn("⚠️ No Firestore doc for uid:", input.uid);
                    console.log("📝 Auto-creating profile with default role CREATOR");

                    // Auto-create with default role
                    const newProfile = {
                        uid: input.uid,
                        role: "CREATOR" as const,
                        createdAt: new Date().toISOString(),
                    };

                    await docRef.set(newProfile);
                    console.log("✅ Profile auto-created:", newProfile);
                    return newProfile;
                }

                const data = doc.data()!;
                console.log("✅ Profile found:", { uid: doc.id, role: data.role });
                return { uid: doc.id, ...data };
            } catch (error) {
                console.error("❌ Error in getProfile:", error);
                throw error;
            }
        }),

    // CREATE profile on signup (explicit Firestore write)
    createProfile: publicProcedure
        .input(z.object({
            uid: z.string(),
            email: z.string().email(),
            displayName: z.string(),
            role: z.enum(["BRAND", "CREATOR"]),
        }))
        .mutation(async ({ input }) => {
            const { uid, email, displayName, role } = input;
            console.log("📝 createProfile:", { uid, email, role });

            const profileData = {
                uid,
                email,
                displayName,
                role,
                createdAt: new Date().toISOString(),
            };

            // Explicit Firestore write
            await adminDb.collection("users").doc(uid).set(profileData);
            console.log("✅ Profile created in Firestore");
            return { success: true, profile: profileData };
        }),

    // UPDATE profile (explicit Firestore write with merge)
    updateProfile: publicProcedure
        .input(z.object({
            uid: z.string(),
            displayName: z.string().optional(),
            role: z.enum(["BRAND", "CREATOR"]).optional(),
        }))
        .mutation(async ({ input }) => {
            const { uid, ...data } = input;
            console.log("📝 updateProfile:", { uid, data });

            // Explicit Firestore merge write
            await adminDb.collection("users").doc(uid).set(data, { merge: true });
            console.log("✅ Profile updated in Firestore");
            return { success: true };
        }),
});
