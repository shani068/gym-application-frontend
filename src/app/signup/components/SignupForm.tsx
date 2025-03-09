"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { usePostRequest } from "@/hooks/AxiosRequest"
import { API_BASE_URL } from "@/lib/constant"
import { useToast } from "@/hooks/useToast"
import Link from "next/link"

const signUpSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{11}$/, "Phone number must be 11 digits"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUpForm() {
    const { mutate, isLoading } = usePostRequest(`${API_BASE_URL}/user/register`)
    const { toastSuccess, toastError } = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    })

    const onSubmit = async (data: SignUpFormData) => {
        
        // Here you would typically send the data to your backend
        mutate(data, {
            onSuccess: (data) => {
                console.log("data", data)
                toastSuccess(data?.message)
                reset()
            },
            onError: (error: any) => {
                console.log("error", error)
                toastError("Failed to sign up")
                // if (error?.response?.status === 409) {
                //     return toastError("User already exists")
                // }
            }
        })
        
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" {...register("username")} />
                        {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" {...register("phone")} />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" {...register("address")} />
                        {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...register("password")} />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center">
                    <Button type="submit" className="w-fit mx-auto px-10" disabled={isLoading}>
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </Button>
                    <div>
                        <p>Already have an account? <Link href="/login" className="text-blue-500">Login</Link></p>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}

