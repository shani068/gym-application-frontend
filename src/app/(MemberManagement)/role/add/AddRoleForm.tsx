'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { usePostRequest } from '@/hooks/AxiosRequest'
import { API_BASE_URL } from '@/lib/constant'
import { useToast } from '@/hooks/useToast'

const RoleSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(10, "Description is too short"),
})

type Inputs = z.infer<typeof RoleSchema>


export default function AddRoleForm() {
    const router = useRouter()
    const { toastError, toastSuccess } = useToast()
    const { register, reset, handleSubmit, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(RoleSchema)
    })
    
    const { mutate, isLoading } = usePostRequest(`${API_BASE_URL}/memberManagement/add-role`)
    const onSubmit: SubmitHandler<Inputs> = (formData) => {
        
        // Handle form submission here
        console.log(formData)

        mutate(formData, {
            onSuccess: (data) => {
                console.log(data)
                toastSuccess(data?.message)
                reset()
            },
            onError: (error: any) => {
                console.log("error", error)
                if (error?.response?.status === 409) {
                    return toastError("Specialization already exist")
                }
            }
        })
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-3xl">
            <Card className="bg-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <CardTitle className="text-2xl font-bold">Add Role</CardTitle>
                    <Button
                        onClick={() => router.push('/role/list')}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Role List
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name"> Name</Label>
                            <Input
                                id="name"
                                placeholder=" Name"
                                {...register("name", { required: "Name field is required" })}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description"> Description</Label>
                            <Textarea
                                id="description"
                                placeholder=" Description"
                                {...register("description", { required: "Description field is required" })}
                                className="min-h-[150px] w-full"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                className="bg-teal-500 hover:bg-teal-600 min-w-[100px]"
                            >
                                {
                                    isLoading ? "Saving..." : "Save"
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

