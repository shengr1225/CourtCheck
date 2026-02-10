import React, { createContext, useContext, useState } from "react";
import { apiFetch } from "@/lib/api";

type User = {
    userId: string;
    email: string;
    name: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    requestOtp: (email: string) => Promise<void>;
    verifyOtp: (email: string, code: string, name?: string) => Promise<void>;
    getCurrentUser: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Auth API Calls
    async function requestOtp(email: string) {
        await apiFetch("/api/auth/request", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    }

    async function verifyOtp(email: string, code: string, name?: string) {
        const data = await apiFetch("/api/auth/verify", {
            method: "POST",
            body: JSON.stringify({ email, code, name }),
        });

        if (data.ok) {
            setUser(data.user);
        } else {
            throw new Error(data.error || "Verification failed");
        }
    }

    async function getCurrentUser() {
        try {
            const data = await apiFetch("/api/auth/me");
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        await apiFetch("/api/auth/logout", {
            method: "POST",
        });
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, requestOtp, verifyOtp, getCurrentUser, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("AuthContext missing");
    return ctx;
}