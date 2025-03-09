 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { usePostRequest } from '@/hooks/AxiosRequest'
import { API_BASE_URL } from '@/lib/constant'
import { useToast } from '@/hooks/useToast'


const GroupSchema = z.object({
    name: z.string(),
    description: z.string(),
})

type IGroupType = z.infer<typeof GroupSchema> 

export default function AddGroupForm() {
    const router = useRouter()
    const { toastSuccess, toastError } = useToast()
    const {register, handleSubmit, reset, formState: {errors}} = useForm<IGroupType>({
        resolver: zodResolver(GroupSchema),

    })

    const { mutate, isLoading } = usePostRequest(`${API_BASE_URL}/group/add-group`)

    const onSubmit: SubmitHandler<IGroupType> = (formData) => {
        console.log(formData)
        mutate(formData, {
            onSuccess: (data) => {
                toastSuccess(data?.message)
                reset()
                router.push('/group/list')
            },
            onError: (error) => {
                console.log('error', error)
                toastError("Failed to add group")
            }
        })
    }


    return (
        <div className="container mx-auto px-4 py-6 max-w-3xl">
            <Card className="bg-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <CardTitle className="text-2xl font-bold">Add Group</CardTitle>
                    <Button
                        onClick={() => router.push('/group/list')}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Group List
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
                            {errors.name && (
                                <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description"> Description</Label>
                            <Textarea
                                id="description"
                                placeholder=" Description"
                                {...register("description", { required: "Description field is required" })}
                                className="min-h-[150px] w-full"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                className="bg-teal-500 hover:bg-teal-600 min-w-[100px]"
                            >
                                {
                                    isLoading ? 'Saving...' : 'Save'
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

