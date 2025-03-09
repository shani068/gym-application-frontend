"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetRequest, usePostMultiPartRequest, usePostRequest } from "@/hooks/AxiosRequest"
import { API_BASE_URL } from "@/lib/constant"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { IGetRequestResponse } from "../../role/list/RoleList"
import { useToast } from "@/hooks/useToast"

const addStaffMemberSchema = z.object({
  firstName: z.string().min(3, "First Name must be at least 3 characters"),
  lastName: z.string().min(3, "Last Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  roleName: z.string().nonempty("Role is required"),
  specializationName: z.string().nonempty("Specialization is required"),
  gender: z.string().min(1, "Please select a gender"),
  dateOfBirth: z.date(),
  image: z.any(),
})

type IAddStaffMember = z.infer<typeof addStaffMemberSchema>

export default function AddStaffMember() {
  const router = useRouter()
  const [image, setImage] = useState<string>()
  const {toastSuccess, toastError} = useToast()
  const { data: rolesList }: IGetRequestResponse = useGetRequest(
    `${API_BASE_URL}/memberManagement/role-list`,
    "rolesList",
  )
  const { data: specializationList }: IGetRequestResponse = useGetRequest(
    `${API_BASE_URL}/memberManagement/specialization-list`,
    "specializationList",
  )
  const { mutate, isLoading } = usePostMultiPartRequest(`${API_BASE_URL}/memberManagement/add-staff`)
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<IAddStaffMember>({
    resolver: zodResolver(addStaffMemberSchema),
    defaultValues: {
      gender: "male",
    },
  })

  const roleData = rolesList?.data || []
  const specializationData = specializationList?.data || []
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log("file", file)
    if (file) {
      setImage(URL.createObjectURL(file))
      setValue("image", file)
    }
  }

  const onSubmit: SubmitHandler<IAddStaffMember> = (formData) => {
    console.log("formData", formData)
    const formDataToSend = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      if(key !== "image"){
        if(key === "dateOfBirth" && value instanceof Date){
          formDataToSend.append(key, value.toISOString())
        }else {
          formDataToSend.append(key, value as string)
        }
      }
    })

    if(formData.image instanceof File){
      formDataToSend.append("image", formData.image)
    }
    mutate(formDataToSend, {
      onSuccess: (data) => {
        console.log("Successfully added staff member",data)
        toastSuccess(data?.message)
        reset()
        router.push("/staff-member/list")
        setImage("")
      },
      onError: (error) => {
        console.log("Error adding staff member", error)
      }
    })
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Staff Member</h1>
        <Button
          variant="default"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => router.push("/staff-member/list")}
        >
          ← Staff Member List
        </Button>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Personal Information</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="image">Image</Label>
              <div className="mt-2 flex items-center gap-4">
                {image && (
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full max-w-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register("firstName")} placeholder="First Name" className="mt-2" />
                {errors.firstName && (
                  <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} placeholder="Last Name" className="mt-2" />
                {errors.lastName && (
                  <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label>Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue="male"
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>}
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-2 justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div>
              <Label htmlFor="role">Assign Role</Label>
              <Controller
                name="roleName"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleData?.length > 0 ? (
                        roleData?.map((role) => (
                          <SelectItem key={role._id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          No roles available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Controller
                name="specializationName"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializationData?.length > 0 ? (
                        specializationData?.map((specialization) => (
                          <SelectItem key={specialization._id} value={specialization.name}>
                            {specialization.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          No specialization available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Contact Information</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} className="mt-2" />
              {errors.address && (
                <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} className="mt-2" />
                {errors.city && (
                  <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.city.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register("state")} className="mt-2" />
                {errors.state && (
                  <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} type="tel" className="mt-2" />
                {errors.phone && (
                  <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...register("email")} type="email" className="mt-2" />
                {errors.email && (
                  <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
            {isLoading ? "...Saving" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  )
}

