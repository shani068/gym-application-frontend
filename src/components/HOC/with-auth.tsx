"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";


export function withAuth(Component: React.ComponentType) {
    return function ProtectedRoute(props: any) {
        const { token, isLoading } = useAuth()
        const router = useRouter()
        console.log(token)
        useEffect(() => {
            if(!token && !isLoading){
                router.replace("/login")
            }
        }, [token, isLoading])

        if(isLoading) return <div>Loading...</div>
        if(!token) return null;

        return <Component {...props} />
    }
}