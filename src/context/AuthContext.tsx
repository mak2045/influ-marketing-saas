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
    role: "BRAND" | "CREATOR" | "ADMIN";
    displayName?: string;
    email?: string;
    exists?: boolean;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    role: "BRAND" | "CREATOR" | "ADMIN" | null;
    loading: boolean;
    debugInfo: string;
    signOut: () => Promise<void>;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (email: string, pass: string, displayName: string, role: "BRAND" | "CREATOR" | "ADMIN") => Promise<void>;
    googleSignIn: (role: "BRAND" | "CREATOR" | "ADMIN") => Promise<void>;
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
    const [role, setRole] = useState<"BRAND" | "CREATOR" | "ADMIN" | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>("Initializing...");
    const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
    const [profileTimedOut, setProfileTimedOut] = useState(false);
    const router = useRouter();
    const createProfileMutation = trpc.user.createProfile.useMutation();
    const hasLoggedOutRef = useRef(false);

    // 1. Listen for Firebase auth state
    useEffect(() => {
        setDebugInfo("Connecting to Auth..."); // eslint-disable-line react-hooks/set-state-in-effect
        try {
            const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                console.log("🔥 Auth State Changed:", firebaseUser?.uid || "Logged out");
                setUser(firebaseUser);
                setAuthLoading(false);
                if (firebaseUser) {
                    setAuthStatus("authenticated");
                    setDebugInfo("Authenticated. Syncing profile...");
                    hasLoggedOutRef.current = false;
                } else {
                    setAuthStatus("unauthenticated");
                    setDebugInfo("Logged out.");
                    setRole(null);
                }
            }, (error) => {
                console.error("🔥 Auth State Error:", error);
                setAuthLoading(false);
                setAuthStatus("unauthenticated");
                setDebugInfo("Auth Error: " + error.message);
            });
            return () => unsubscribe();
        } catch (error: unknown) {
            console.error("🔥 Auth Setup Error:", error);
            setAuthLoading(false);
            setDebugInfo("Setup Error: " + error.message);
        }
    }, []);

    // 2. Fetch profile from Firestore via tRPC
    const {
        data: profile,
        isLoading: profileLoading,
        isError: profileError,
        refetch
    } = trpc.user.getProfile.useQuery(
        { uid: user?.uid || "" },
        {
            enabled: !!user && authStatus === "authenticated",
            retry: 1,
            staleTime: Infinity,
        }
    );

    // Profile loading timeout
    useEffect(() => {
        if (profileLoading && !!user) {
            const timer = setTimeout(() => {
                if (profileLoading) {
                    console.warn("⌛ Profile fetch timed out");
                    setProfileTimedOut(true);
                    setDebugInfo("Profile sync taking longer than expected...");
                }
            }, 5000);
            return () => clearTimeout(timer);
        } else {
            setProfileTimedOut(false); // eslint-disable-line react-hooks/set-state-in-effect
        }
    }, [profileLoading, user]);

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
    }, [user, profile, authStatus, refetch, createProfileMutation]);

    // 4. Combined loading state
    const loading = authLoading || (!!user && profileLoading && !profileError && !profileTimedOut);

    // 5. Set role ONCE when profile loads
    useEffect(() => {
        if (!profileLoading && profile && profile.role) {
            if (profile.role === "BRAND" || profile.role === "CREATOR" || profile.role === "ADMIN") {
                setRole(profile.role); // eslint-disable-line react-hooks/set-state-in-effect
            }
        } else if (profileError || profileTimedOut) {
            // Fallback for development/error states to prevent hanging
            console.error("Profile sync issue (Error or Timeout), using fallback");
            // Only use fallback if we're clearly authenticated but profile fetch failed
            if (user && !role) {
                setRole("CREATOR"); // eslint-disable-line react-hooks/set-state-in-effect
            }
        }
    }, [profile, profileLoading, profileError, profileTimedOut, user, role]);

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

    const signUp = useCallback(async (email: string, pass: string, displayName: string, signUpRole: "BRAND" | "CREATOR" | "ADMIN") => {
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

    const googleSignIn = useCallback(async (signUpRole: "BRAND" | "CREATOR" | "ADMIN") => {
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
            debugInfo,
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
