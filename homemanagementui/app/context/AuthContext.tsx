"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface User {
  id?: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Helper function to normalize user data from various backend response formats
function normalizeUser(data: Record<string, unknown>): User | null {
  if (!data) return null;

  // Handle case where user is just an email string: {"user": "email@example.com"}
  if (typeof data.user === "string") {
    const email = data.user;
    const name = email.split("@")[0];
    return {
      id: email,
      email,
      name,
      picture: "",
    };
  }

  // Try to find user object in common locations
  const userData = (data.user || data.principal || data.account || data) as Record<string, unknown>;

  // If userData is still not an object, return null
  if (typeof userData !== "object" || userData === null) {
    console.log("normalizeUser: userData is not an object:", userData);
    return null;
  }

  // Extract fields with fallbacks for different naming conventions
  const id = (userData.id || userData.sub || userData.userId || "") as string;
  const email = (userData.email || userData.mail || userData.username || userData.emailAddress || "") as string;
  const firstName = (userData.firstName || userData.givenName || userData.given_name || "") as string;
  const lastName = (userData.lastName || userData.familyName || userData.family_name || "") as string;
  const name = (userData.name || userData.displayName || userData.fullName ||
                (firstName && lastName ? `${firstName} ${lastName}` : firstName) ||
                (email ? email.split("@")[0] : "") || "User") as string;
  const picture = (userData.picture || userData.imageUrl || userData.avatar ||
                   userData.profilePicture || userData.photo || userData.image || "") as string;

  // Must have at least email or id to be valid
  if (!email && !id) {
    console.log("normalizeUser: No email or id found in:", userData);
    return null;
  }

  return { id, email, name, firstName, lastName, picture };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch session from backend
  const fetchSession = useCallback(async () => {
    try {
      console.log("Fetching session from:", `${API_BASE_URL}/api/session`);

      const response = await fetch(`${API_BASE_URL}/api/session`, {
        credentials: "include",
        headers: {
          "Accept": "application/json",
        },
      });

      console.log("Session response status:", response.status);

      if (response.ok) {
        const text = await response.text();
        console.log("Session response text:", text);

        if (text) {
          const sessionData = JSON.parse(text);
          console.log("Parsed session data:", sessionData);

          const normalizedUser = normalizeUser(sessionData);
          console.log("Normalized user:", normalizedUser);

          if (normalizedUser) {
            setUser(normalizedUser);
            localStorage.removeItem("auth_user");
            return true;
          }
        }
      }

      // Fallback: check localStorage for user set during OAuth success redirect
      // (handles cross-origin cookie issues between www.aneighboratx.com and aneighboratx.com)
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        try {
          const storedUser = JSON.parse(stored);
          if (storedUser?.email) {
            setUser(storedUser);
            return true;
          }
        } catch {
          localStorage.removeItem("auth_user");
        }
      }

      setUser(null);
      return false;
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setUser(null);
      return false;
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      await fetchSession();
      setIsLoading(false);
    };

    checkSession();
  }, [fetchSession]);

  // Redirect to OAuth login
  const login = useCallback(() => {
    window.location.href = `${API_BASE_URL}/api/auth/oauth2/authorize/google`;
  }, []);

  // Logout - call backend to clear session
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("auth_user");
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`;
    }
  }, []);

  // Refresh session
  const refreshSession = useCallback(async () => {
    await fetchSession();
  }, [fetchSession]);

  const isAuthenticated = !!user;

  console.log("AuthContext state:", { user, isAuthenticated, isLoading });

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
