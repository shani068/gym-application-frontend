"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { jwtDecode } from "jwt-decode";
import { useAuth } from '@/contexts/auth-context';
import { SubmitHandler, useForm } from "react-hook-form"
import { useGetRequest, usePostRequest, usePutRequest } from "@/hooks/AxiosRequest"
import { API_BASE_URL } from "@/lib/constant"
import { useToast } from "@/hooks/useToast"
import { useRouter } from "next/navigation"


interface MyJwtPayload {
    username: string;
    email: string;
    phone: string;
    address: string;
    password: string;
}
interface ApiProfileResponse {
    data: {
        username: string;
        email: string;
        phone:string;
        address:string;
    };
}


export default function ProfileEditForm() {
    const { toastError, toastSuccess } = useToast()
    // const { token } = useAuth();
    // const decode = token ? jwtDecode<MyJwtPayload>(token) : null;
    // const { username, email, phone, address } = decode || {};
    const { register, handleSubmit, reset } = useForm<MyJwtPayload>();
    const router = useRouter()

    const { data } = useGetRequest<ApiProfileResponse>(`${API_BASE_URL}/user/user-details`, "profile")
    console.log("decoded token ", data)
    const { mutate, isLoading } = usePutRequest(`${API_BASE_URL}/user/update-profile`)

    useEffect(() => {
        reset({
            username: data?.data?.username,
            email: data?.data?.email,
            phone: data?.data?.phone,
            address: data?.data?.address
        })
    }, [data, reset])
    const onSubmit: SubmitHandler<MyJwtPayload> = (formData) => {
        // Here you would typically send the data to your API
        console.log("Form submitted:", formData)
        mutate(formData, {
            onSuccess: (data) => {
                // Show success message or redirect
                toastSuccess(data?.message)
                reset()
                router.push("/")
            },
            onError: (error) => {
                // Show error message or redirect
                toastError("Profile update failed")
                console.log("error", error)
            }
        })
        // Show success message or redirect
    }

    return (
        <Card className="w-full max-w-3xl mx-auto shadow-md">
            <CardHeader className="border-b bg-muted/20">
                <CardTitle className="text-xl font-bold">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username"  {...register("username")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" {...register("phone")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" {...register("address")} />
                    </div>



                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            {...register("password")}
                            className="bg-blue-50"
                        />
                        <p className="text-sm text-red-500 mt-1">(Leave password empty if not change in password.)</p>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                            {
                                isLoading ? "Loading..." : "Update"
                            }
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

