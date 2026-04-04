import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { saveUser } from "@/lib/store";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  plan: "free" | "pro";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("codegenie_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    const id = crypto.randomUUID();
    const mockUser: User = {
      id,
      name: email.split("@")[0],
      email,
      role: email === "prasanna23537@gmail.com" ? "admin" : "user",
      plan: "free",
    };
    setUser(mockUser);
    localStorage.setItem("codegenie_user", JSON.stringify(mockUser));
    saveUser({ ...mockUser, createdAt: new Date().toISOString() });
  };

  const register = async (name: string, email: string, _password: string) => {
    const id = crypto.randomUUID();
    const mockUser: User = {
      id,
      name,
      email,
      role: email === "prasanna23537@gmail.com" ? "admin" : "user",
      plan: "free",
    };
    setUser(mockUser);
    localStorage.setItem("codegenie_user", JSON.stringify(mockUser));
    saveUser({ ...mockUser, createdAt: new Date().toISOString() });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("codegenie_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
