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

    useEffect(() => {
        const storedToken = sessionStorage.getItem("token");
        if(storedToken) setToken(storedToken);
        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        sessionStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        setToken(null);
        router.push("/login");
    };

    

    return (
        <AuthContext.Provider value={{ token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);