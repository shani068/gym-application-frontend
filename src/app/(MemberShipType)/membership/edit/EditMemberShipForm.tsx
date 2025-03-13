"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { useGetRequest, usePostRequest, usePutRequest } from "@/hooks/AxiosRequest"
import { API_BASE_URL } from "@/lib/constant"
import type { IGetRequestResponse } from "@/app/(MemberShipType)/category/list/CategoryList"
import { useToast } from "@/hooks/useToast"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"

const addMemberShipSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    categoryName: z.string().nonempty("Category is required"),
    period: z.number().min(1, "Period must be at least 1 day"),
    amount: z.number().min(0, "Amount must be a positive number"),
    description: z.string(),
})

type IAddMemberShip = z.infer<typeof addMemberShipSchema>
interface IUpdateMemberShipResponse{
    status: number;
    message: string;
}
interface IMemberShipData {
    name: string;
    categoryName: string;
    period: number;
    amount: number;
    description: string;
  }

export default function EditMembershipForm() {
    const router = useRouter()
    const { toastSuccess, toastError } = useToast()
    const searchParams = useParams();
    const {
        data,
        error: memberShipListError,
    }: IGetRequestResponse = useGetRequest(`${API_BASE_URL}/memberShipTypes/memberShip-detail`, "memBerShipList", { id: searchParams.id as string })
    const {mutate, isPending: isLoadingMemberShip} = usePutRequest<IUpdateMemberShipResponse>(`${API_BASE_URL}/memberShipTypes/memberShip-detail`)
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IAddMemberShip>({
        resolver: zodResolver(addMemberShipSchema),
    })

    const categories = data?.data || []
    console.log("categories", data)

    useEffect(()=>{
        reset({
            name: data?.data?.name,
            categoryName: data?.data?.categoryName,
            period: data?.data?.period,
            amount: data?.data?.amount,
            description: data?.data?.description,
        })
    },[data, reset])
    const onSubmit: SubmitHandler<IMemberShipData> = (formData) => {
        // console.log(data)
        mutate(formData, 
            {
                onSuccess: (data) => {
                    toastSuccess(data?.message)
                    reset()
                    router.push('/membership/list')
                },
                onError: (error: any) => {
                    console.log("error", error)
                    toastError("Failed to add membership")
                }
            }
        )
        
    }

    if (memberShipListError) {
        console.error(memberShipListError)
        toastError("Failed to fetch MemberShip list!")
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-3xl">
            <Card className="bg-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <CardTitle className="text-2xl font-bold">Add Membership</CardTitle>
                    <Button onClick={() => router.push("/membership/list")} className="bg-green-500 hover:bg-green-600">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Membership List
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Membership Name</Label>
                            <Input id="name" placeholder="Membership Name" {...register("name")} className="w-full" />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Membership Category</Label>
                            <Controller
                                name="categoryName"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.length > 0 ? (
                                                categories.map((category) => (
                                                    <SelectItem key={category._id} value={category.name}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="empty" disabled>
                                                    No categories available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.categoryName && <p className="text-red-500 text-sm">{errors.categoryName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="period">Membership Period (days)</Label>
                            <Input
                                id="period"
                                type="number"
                                placeholder="No. Of Days"
                                {...register("period", { valueAsNumber: true })}
                                className="w-full"
                            />
                            {errors.period && <p className="text-red-500 text-sm">{errors.period.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Membership Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Membership Amount"
                                {...register("amount", { valueAsNumber: true })}
                                className="w-full"
                            />
                            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Membership Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Membership Description"
                                {...register("description")}
                                className="min-h-[150px] w-full"
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="bg-teal-500 hover:bg-teal-600 min-w-[100px]">
                                {
                                    isLoadingMemberShip ? "Saving..." : "Save"
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

