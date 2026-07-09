"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/server/auth";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: "CITIZEN" | "OFFICER" | "SUPER_ADMIN";
  agencyId?: string | null;
  phone?: string | null;
}

interface SessionContextType {
  user: User | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const session = await auth.api.getSession({
        headers: new Headers(),
      });

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.fullName,
          role: session.user.role as User["role"],
          agencyId: session.user.agencyId || null,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    setLoading(true);
    await fetchSession();
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={{ user, loading, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
