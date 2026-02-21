import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";

export type UserRole = "BRAND" | "CREATOR" | "ADMIN";

interface UserProfile {
    uid: string;
    email?: string;
    displayName?: string;
    role: UserRole | null;
    exists: boolean;
    createdAt?: string;
}

export const userRouter = router({
    // READ profile on login
    getProfile: publicProcedure
        .input(z.object({ uid: z.string() }))
        .query(async ({ input }): Promise<UserProfile> => {
            try {
                if (!input.uid) return { uid: "", role: null, exists: false };

                console.log("🔍 getProfile called for uid:", input.uid);
                const docRef = adminDb.collection("users").doc(input.uid);
                const doc = await docRef.get();

                if (!doc.exists) {
                    console.warn("⚠️ No Firestore doc for uid:", input.uid);
                    return { uid: input.uid, role: null, exists: false };
                }

                const data = doc.data()!;
                console.log("✅ Profile found:", { uid: doc.id, role: data.role });
                return {
                    uid: doc.id,
                    email: data.email,
                    displayName: data.displayName,
                    role: data.role as UserRole,
                    exists: true,
                    createdAt: data.createdAt,
                };
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
            role: z.enum(["BRAND", "CREATOR", "ADMIN"]),
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
            return { success: true, profile: { ...profileData, exists: true } };
        }),

    // UPDATE profile (explicit Firestore write with merge)
    updateProfile: publicProcedure
        .input(z.object({
            uid: z.string(),
            displayName: z.string().optional(),
            role: z.enum(["BRAND", "CREATOR", "ADMIN"]).optional(),
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
