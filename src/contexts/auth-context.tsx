'use client'

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    token: string | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    isLoading: true,
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const login = (newToken: string) => {
        sessionStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        setToken(null);
        router.push("/login");
    };

    useEffect(() => {
        const validateToken = () => {
            const storedToken = sessionStorage.getItem("token");
            // Add actual token validation logic here (e.g., check expiration)
            return storedToken ? storedToken : null;
        };

        const checkAuth = () => {
            const validToken = validateToken();
            setToken(validToken);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);