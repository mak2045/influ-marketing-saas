"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import {
    User,
    onAuthStateChanged,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";

export interface UserProfile {
    uid: string;
    role: "BRAND" | "CREATOR";
    displayName?: string;
    email?: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    role: "BRAND" | "CREATOR" | null;
    loading: boolean;
    signOut: () => Promise<void>;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string, displayName: string, role: "BRAND" | "CREATOR") => Promise<void>;
    googleSignIn: (role: "BRAND" | "CREATOR") => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    role: null,
    loading: true,
    signOut: async () => { },
    signIn: async () => { },
    signUp: async () => { },
    googleSignIn: async () => { },
    sendPasswordReset: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [role, setRole] = useState<"BRAND" | "CREATOR" | null>(null);
    const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
    const router = useRouter();
    const createProfileMutation = trpc.user.createProfile.useMutation();
    const hasLoggedOutRef = useRef(false);

    // TEMP DEBUG FIX - bypass Firestore issues
    useEffect(() => {
        if (user) {
            setAuthStatus("authenticated");
            setRole("CREATOR"); // Default role for testing
        } else {
            setAuthStatus("unauthenticated");
            setRole(null);
        }
    }, [user]);

    // 1. Listen for Firebase auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setAuthLoading(false);
            if (firebaseUser) {
                hasLoggedOutRef.current = false;
            } else {
                // User logged out — reset role
                setRole(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // 2. Fetch profile from Firestore via tRPC (uses createProfileMutation from line 57)
    const { data: profile, isLoading: profileLoading, refetch } = trpc.user.getProfile.useQuery(
        { uid: user?.uid || "" },
        {
            enabled: !!user && authStatus === "authenticated",
            retry: 1,
            staleTime: Infinity,
        }
    );

    useEffect(() => {
        if (user && profile && profile.exists === false && authStatus === "authenticated") {
            console.log("🆕 Auto-creating profile for new user:", user.uid);
            // Auto-create with default CREATOR role for existing Firebase users without Firestore profile
            createProfileMutation.mutate({
                uid: user.uid,
                email: user.email || "",
                displayName: user.displayName || user.email?.split("@")[0] || "User",
                role: "CREATOR",
            }, {
                onSuccess: () => {
                    console.log("✅ Profile auto-created successfully");
                    setRole("CREATOR");
                    refetch();
                },
                onError: (error) => {
                    console.error("❌ Failed to auto-create profile:", error);
                }
            });
        }
    }, [user, profile, authStatus, refetch]);

    // 4. Combined loading state
    const loading = authLoading || (!!user && profileLoading);

    // 5. Set role ONCE when profile loads
    useEffect(() => {
        if (!profileLoading && profile && profile.role) {
            if (profile.role === "BRAND" || profile.role === "CREATOR") {
                setRole(profile.role);
            }
        }
    }, [profile, profileLoading]);

    // --- Auth methods ---

    const signOut = useCallback(async () => {
        hasLoggedOutRef.current = true;
        await firebaseSignOut(auth);
        setUser(null);
        setRole(null);
        router.push("/login");
    }, [router]);

    const signIn = useCallback(async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    }, []);

    const signUp = useCallback(async (email: string, pass: string, displayName: string, signUpRole: "BRAND" | "CREATOR") => {
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, pass);
            // Explicit Firestore write via tRPC
            await createProfileMutation.mutateAsync({
                uid: cred.user.uid,
                email,
                displayName,
                role: signUpRole,
            });
        } catch (error) {
            console.error("Sign up error:", error);
            throw error;
        }
    }, [createProfileMutation]);

    const googleSignIn = useCallback(async (signUpRole: "BRAND" | "CREATOR") => {
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);

        // For Google sign-in, getProfile will auto-create if doc doesn't exist.
        // But if the user is brand-new, we want to set their chosen role.
        const isNewUser = cred.user.metadata.creationTime === cred.user.metadata.lastSignInTime;
        if (isNewUser) {
            await createProfileMutation.mutateAsync({
                uid: cred.user.uid,
                email: cred.user.email || "",
                displayName: cred.user.displayName || "User",
                role: signUpRole,
            });
        }
    }, [createProfileMutation]);

    const sendPasswordReset = useCallback(async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            profile: profile as UserProfile ?? null,
            role,
            loading,
            signOut,
            signIn,
            signUp,
            googleSignIn,
            sendPasswordReset,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
