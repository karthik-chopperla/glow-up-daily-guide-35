
import React, { createContext, useEffect, useState, useContext } from "react";

// Type for user
export interface User {
  email: string;
  name: string;
  avatar?: string;
  method: "email" | "google";
}

// Auth context type
interface AuthContextValue {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("hm_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("hm_user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hm_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
