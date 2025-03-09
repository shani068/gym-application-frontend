'use client'

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"




export function withPublic(Component: React.ComponentType) {
    return function PublicRoute(props: any) {
        const {token, isLoading} = useAuth()
        const router = useRouter()

        useEffect(()=>{
            if(token && !isLoading){
                router.replace("/")
            }
        }, [token, isLoading])
        if(isLoading) return <div>Loading...</div>
        if(token) return null;

        return <Component {...props} />
    }
}