import { apiFetch } from "@/lib/api";
import React, { createContext, useCallback, useContext, useState } from "react";

type User = {
  userId: string;
  email: string;
  name?: string;
  stripeCustomerId?: string | null;
};

type NextAuthStep = "name" | "main";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<NextAuthStep>;
  getCurrentUser: () => Promise<User | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth API Calls
  const requestOtp = useCallback(async (email: string) => {
    await apiFetch("/api/auth/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }, []);

  async function verifyOtp(email: string, code: string): Promise<NextAuthStep> {
    const data = await apiFetch("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });

    if (data.ok && data.user) {
      setUser(data.user);
      // Decide next step based on whether user has a name
      return data.user.name ? "main" : "name";
    } else {
      throw new Error(data.error || "Verification failed");
    }
  }

  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      const data = await apiFetch("/api/auth/me");
      setUser(data.user);
      return data.user ?? null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", {
      method: "POST",
    });
    setUser(null);
  }, []);

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
