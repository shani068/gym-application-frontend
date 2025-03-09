'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetRequest, usePostMultiPartRequest } from '@/hooks/AxiosRequest'
import { API_BASE_URL } from '@/lib/constant'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/useToast"
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { IGetMemberShipRequestResponse } from '@/app/(MemberShipType)/membership/list/MemberShipList'
import { IGetRequestGroupResponse } from '@/app/group/list/GroupList'


interface StaffMember {
    _id: number
    image: string
    firstName: string
    lastName: string
    role: {
        name: string
    }
    email: string
    phone: string
}
export interface IGetStaffRequestResponse {
    data: {
        data: StaffMember[]
    } | undefined,
    isLoading: boolean;
    error: any;
}
const addMemberSchema = z.object({
    firstName: z.string().min(3, "First Name must be at least 3 characters"),
    lastName: z.string().min(3, "Last Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is too short"),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    groupName: z.string().nonempty("Group name is required"),
    gender: z.string().min(1, "Please select a gender"),
    dateOfBirth: z.date(),
    image: z.any(),
    weight: z.number().min(1, { message: "Weight must be greater than 0" }),
    height: z.number().min(1, "Height must be greater than 0"),
    chest: z.number().min(1, "Chest must be greater than 0"),
    waist: z.number().min(1, "Waist must be greater than 0"),
    thigh: z.number().min(1, "Thigh must be greater than 0"),
    arms: z.number().min(1, "Arms must be greater than 0"),
    fat: z.number().min(1, "Fat must be greater than 0"),
    staffMemberName: z.string().nonempty("Staff Member Name is required"),
    memberShipName: z.string().nonempty("Membership Name is required"),
    memberShipValidFrom: z.date(),
    memberShipValidTo: z.date()
})

type IAddMember = z.infer<typeof addMemberSchema>

export default function AddMemberForm() {
    const router = useRouter()
    const [image, setImage] = useState<string>()
    const {toastSuccess, toastError} = useToast()
    const { register, reset, handleSubmit, formState: { errors }, control, setValue, trigger } = useForm<IAddMember>({
        resolver: zodResolver(addMemberSchema),
        defaultValues: {
            gender: "male",
        },
    })
    const { mutate, isLoading: submitingLoading } = usePostMultiPartRequest(`${API_BASE_URL}/memberManagement/add-member`)
    const { data: GroupList }: IGetRequestGroupResponse = useGetRequest(`${API_BASE_URL}/group/group-list`, "getGroups")
    const { data: staffMember }: IGetStaffRequestResponse = useGetRequest(`${API_BASE_URL}/memberManagement/get-staff-list`, "getStaffList")
    const { data: MemberShip }: IGetMemberShipRequestResponse = useGetRequest(`${API_BASE_URL}/memberShipTypes/membership`, "membershipList")

    const groupData = GroupList?.data || []
    const staffMemberData = staffMember?.data || []
    const membershipData = MemberShip?.data || []
    // console.log("goup", groupData)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(URL.createObjectURL(file))
            setValue("image", file)
        }
    }

    const onSubmit: SubmitHandler<IAddMember> = (formData) => {
        // console.log("form ", formData)
        const formDataToSend = new FormData()

        Object.entries(formData).forEach(([key, value])=>{
            if(key !== "image"){
                if(key === "dateOfBirth" && value instanceof Date){
                    formDataToSend.append(key, value.toISOString())
                }else{
                    formDataToSend.append(key, value as string)
                }
            }
        })

        if(formData.image instanceof File){
            formDataToSend.append("image", formData.image)
        }

        mutate(formDataToSend, {
            onSuccess: (data) => {
                toastSuccess(data?.message)
                reset()
                router.push('/member/list')
                setImage("")
            },
            onError: (error) => {
                console.log("Error adding member", error)
                toastError("Failed to add member")
            }
        })
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Add Member</h1>
                <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => router.push('/member/list')}
                >
                    ← Member List
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
                                        src={image}
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
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" {...register("firstName", { required: "First Name field is required" })} onBlur={() => trigger("firstName")} placeholder="First Name" className="mt-2" />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" {...register("lastName", { required: "Last Name field is required" })} onBlur={() => trigger("lastName")} placeholder="Last Name" className="mt-2" />
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
                                    <RadioGroup onValueChange={field.onChange} value={field.value} defaultValue="male" className="flex gap-4 mt-2">
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
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                        </div>

                        <div>
                            <Label htmlFor="role">Group</Label>
                            <Controller
                                name="groupName"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                groupData?.length > 0 ? (
                                                    groupData?.map((group) => (
                                                        <SelectItem key={group._id} value={group.name}>
                                                            {group.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="empty" disabled>
                                                        No group available
                                                    </SelectItem>
                                                )
                                            }

                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.groupName && (
                                <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.groupName.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-semibold border-b pb-2">Contact Information</h2>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" {...register("address", { required: "Address field is required" })} className="mt-2" />
                            {errors.address && (
                                <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.address.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input id="city" {...register("city", { required: "City field is required" })} className="mt-2" />
                                {errors.city && (
                                    <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.city.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="state">State</Label>
                                <Input id="state" {...register("state", { required: "State field is required" })} className="mt-2" />
                                {errors.state && (
                                    <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.state.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" {...register("phone", { required: "Phone field is required" })} type="tel" className="mt-2" />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.phone.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" {...register("email", { required: "Email field is required" })} type="email" className="mt-2" />
                                {errors.email && (
                                    <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.email.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold border-b pb-2">Physical Information</h2>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="weight">Weight</Label>
                            <Input id="weight" {...register("weight", { required: "Weight field is required", valueAsNumber: true, validate: (value) => value < 0 ? "Weight must be greater than 0" : undefined })} onBlur={() => trigger("weight")} placeholder='Kg' className="mt-2" />
                            {errors.weight && (
                                <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.weight.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="height">Height</Label>
                                <Input id="height" {...register("height", { required: "Height field is required", valueAsNumber: true, validate: (value) => value < 0 ? "Height must be greater than 0" : undefined })} onBlur={() => trigger("height")} placeholder='Centimeter' className="mt-2" />
                                {errors.height && (
                                    <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.height.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="chest">Chest</Label>
                                <Input id="chest" {...register("chest", { required: "Chest field is required", valueAsNumber: true, validate: (value) => value < 0 ? "Chest must be greater than 0" : undefined })} onBlur={() => trigger("chest")} placeholder='Centimeter' className="mt-2" />
                                {errors.chest && (
                                    <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.chest.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="waist">Waist</Label>
                                <Input id="waist" {...register("waist", { required: "Waist field is required", valueAsNumber: true, validate: (value) => value < 0 ? "Waist must be greater than 0" : undefined })} onBlur={() => trigger("waist")} placeholder='Inches' type="text" className="mt-2" />
                                {errors.waist && (
                                    <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.waist.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="thigh">Thigh</Label>
                                <Input id="thigh" {...register("thigh", { required: "Thigh field is required", valueAsNumber: true, validate: (value) => value < 0 ? "Thigh must be greater than 0" : undefined })} onBlur={() => trigger("thigh")} placeholder='Inches' type="text" className="mt-2" />
                                {errors.thigh && (
                                    <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.thigh.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="arms">Arms</Label>
                                <Input id="arms" {...register("arms", { required: "Arms field is required", valueAsNumber: true, validate: (value) => value < 0 ? "Arms must be greater than 0" : undefined })} onBlur={() => trigger("arms")} placeholder='Inches' type="text" className="mt-2" />
                                {errors.arms && (
                                    <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.arms.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="fat">Fat</Label>
                                <Input id="fat" {...register("fat", { required: "Fat field is required", valueAsNumber: true, validate: (value) => value < 0 ? "Fat must be greater than 0" : undefined })} onBlur={() => trigger("fat")} placeholder='Percentage' type="text" className="mt-2" />
                                {errors.fat && (
                                    <p className="text-red-500 text-sm font-semibold tracking-wide italic">{errors.fat.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold border-b pb-2">More Information</h2>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="role">Select Staff Member</Label>
                            <Controller
                                name="staffMemberName"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Staff Member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                staffMemberData?.length > 0 ? (
                                                    staffMemberData?.map((staffMember) => (
                                                        <SelectItem key={staffMember._id} value={`${staffMember.firstName} ${staffMember.lastName}`}>{`${staffMember.firstName} ${staffMember.lastName}`}</SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="empty" disabled>
                                                        No staff members available
                                                    </SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">MemberShip</Label>
                            <Controller
                                name="memberShipName"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select MemberShip" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                membershipData?.length > 0 ? (
                                                    membershipData?.map((membership) => (
                                                        <SelectItem key={membership._id} value={membership.name}>
                                                            {membership.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="empty" disabled>
                                                        No membership available
                                                    </SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <h4 className='mb-0'>Membership Valid From</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Controller
                                    name='memberShipValidFrom'
                                    control={control}
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full mt-2 justify-start text-left font-normal",
                                                        !field && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="memberShipValidTo"
                                    control={control}
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full mt-2 justify-start text-left font-normal",
                                                        !field && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />

                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type='submit' className="bg-teal-500 hover:bg-teal-600">
                        {
                            submitingLoading ? 'Saving...' : 'Save'
                        }
                    </Button>
                </div>
            </form>
        </div>
    )
}

