"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useGetRequest, usePutRequest } from "@/hooks/AxiosRequest"
import { API_BASE_URL } from "@/lib/constant"
import { useToast } from "@/hooks/useToast"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { useEffect } from "react"

interface ICategory {
  _id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface IMemberShip {
  _id: string
  name: string
  category: ICategory
  period: string
  amount: number
  description: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface IMemberShipApiResponse {
  statusCode: number
  message: string
  data: IMemberShip
  success: boolean
}

interface IMemberShipData {
  name: string
  categoryName: string
  period: number
  amount: number
  description: string
}

interface ICategoriesApiResponse {
  statusCode: number
  message: string
  data: ICategory[]
  success: boolean
}
interface IPutApiResponse {
  status: number
  message: string
}

export default function EditMembershipForm() {
  const router = useRouter()
  const { toastSuccess, toastError } = useToast()
  const searchParams = useParams()

  // Fetch membership data
  const { data, error: memberShipError } = useGetRequest<IMemberShipApiResponse>(
    `${API_BASE_URL}/memberShipTypes/memberShip-detail`,
    "memBerShipList",
    { id: searchParams.id as string },
  )

  const { data: categoriesData, error: categoriesError } = useGetRequest<ICategoriesApiResponse>(
    `${API_BASE_URL}/memberShipTypes/category-list`,
    "categoriesList",
  )

  const { mutate, isPending: isLoadingMemberShip } = usePutRequest<IPutApiResponse>(
    `${API_BASE_URL}/memberShipTypes/memberShip-detail/${searchParams.id}`,
  )

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IMemberShipData>()

  const categories = categoriesData?.data || []
  const membership = data?.data
  console.log("categories", categories)
  console.log("membership", membership)
  useEffect(() => {
    if (membership) {
      reset({
        name: membership.name ,
        categoryName: membership.category?.name ,
        period: Number(membership.period),
        amount: membership.amount,
        description: membership.description ,
      })
    }
  }, [membership, reset])

  const onSubmit: SubmitHandler<IMemberShipData> = (formData) => {
    mutate(formData, {
      onSuccess: (data) => {
        toastSuccess(data?.message)
        router.push("/membership/list")
      },
      onError: (error: any) => {
        console.error("Update error:", error)
        toastError("Failed to update membership")
      },
    })
  }

  if (memberShipError || categoriesError) {
    console.error(memberShipError || categoriesError)
    toastError("Failed to fetch required data")
  }

  if (!membership || !categories.length) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Card className="bg-white shadow-lg p-8">
          <div className="flex justify-center items-center h-40">
            <p>Loading membership data...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Card className="bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-2xl font-bold">Edit Membership</CardTitle>
          <Button onClick={() => router.push("/membership/list")} className="bg-green-500 hover:bg-green-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Membership List
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Membership Name</Label>
              <Input
                id="name"
                placeholder="Membership Name"
                {...register("name", { required: "Name is required" })}
                className="w-full"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Membership Category</Label>
              <Controller
                name="categoryName"
                control={control}
                rules={{ required: "Category is required" }}
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
                {...register("period", {
                  required: "Period is required",
                  valueAsNumber: true,
                })}
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
                {...register("amount", {
                  required: "Amount is required",
                  valueAsNumber: true,
                })}
                className="w-full"
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Membership Description</Label>
              <Textarea
                id="description"
                placeholder="Membership Description"
                {...register("description", { required: "Description is required" })}
                className="min-h-[150px] w-full"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 min-w-[100px]"
                disabled={isLoadingMemberShip}
              >
                {isLoadingMemberShip ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

