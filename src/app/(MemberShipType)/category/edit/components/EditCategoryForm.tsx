'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm, SubmitHandler } from "react-hook-form"
import { API_BASE_URL } from '@/lib/constant'
import { useGetRequest, usePostRequest, usePutRequest } from '@/hooks/AxiosRequest'
import { useToast } from '@/hooks/useToast'
import { useEffect } from 'react';


interface ApiCategoryResponse {
    data: {
      name: string;
      description: string;
    };
  }

  interface CategoryFormData {
    name: string;
    description: string;
  }
interface ApiCategoryResponse {
    status: number;
    message: string;
}


export default function EditCategoryForm() {
    const router = useRouter()
    const { toastSuccess, toastError } = useToast()
    const searchParams = useParams()
    const { data } = useGetRequest<ApiCategoryResponse>(`${API_BASE_URL}/memberShipTypes/category`, 'categoryList', { id: searchParams.id as string })
    console.log("searchParams", data)
    // console.log("id", searchParams.id)
    const {mutate, isPending: submitLoading} = usePutRequest<ApiCategoryResponse>(`${API_BASE_URL}/memberShipTypes/update-category`)
    const {
        register,
        handleSubmit,
        reset,
        trigger,
        formState: { errors },
    } = useForm<CategoryFormData>()

    useEffect(() => {
        reset({
            name: data?.data?.name,
            description: data?.data?.description,
        })


    }, [data, reset])

    const onSubmit: SubmitHandler<CategoryFormData> = (formData) => {
        mutate(
            {id: searchParams.id as string, formData}, 
            {
            onSuccess: (data) => {
                // console.log("data", data)
                toastSuccess(data?.message)
                reset()
                router.push('/category/list')
            },
            onError: (error: any) => {
                console.log("error", error)
                if (error?.response?.status === 409) {
                    return toastError("Category already exists")
                }
            }
        })
    }


    return (
        <div className="container mx-auto px-4 py-6 max-w-3xl">
            <Card className="bg-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <CardTitle className="text-2xl font-bold">Edit Category</CardTitle>
                    <Button
                        onClick={() => router.push('/category/list')}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Category List
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name"> Name</Label>
                            <Input
                                id="name"
                                {...register("name", { required: "Name field is required" })}
                                placeholder=" Name"
                                className="w-full"
                                onBlur={() => trigger("name")}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm font-semibold tracking-wide italic">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description"> Description</Label>
                            <Textarea
                                id="description"
                                placeholder=" Description"
                                className="min-h-[150px] w-full"
                                {...register("description", { required: "Description field is required" })}
                                onBlur={() => trigger("description")}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm font-semibold tracking-wide italic">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                className="bg-teal-500 hover:bg-teal-600 min-w-[100px]"
                            >
                                {
                                    submitLoading ? "Saving..." : "Save"
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

