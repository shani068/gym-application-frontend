'use client'

import { useState } from 'react'
import { Eye, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from 'next/image'
import Link from 'next/link'
import { useGetRequest } from '@/hooks/AxiosRequest'
import { API_BASE_URL } from '@/lib/constant'

interface StaffMember {
    _id: number
    image: string
    name: string
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

export default function StaffList() {
    const [search, setSearch] = useState('')
    const { data, isLoading } : IGetStaffRequestResponse = useGetRequest(`${API_BASE_URL}/memberManagement/get-staff-list`, "staffList")
    
    const initialStaffList = data?.data || []
    console.log("initialStaffList", initialStaffList)
    const [sortConfig, setSortConfig] = useState<{
        key: keyof StaffMember | null
        direction: 'asc' | 'desc'
    }>({ key: null, direction: 'asc' })

    const filteredStaff = initialStaffList.filter(member =>
        Object.values(member).some(value =>
            value.toString().toLowerCase().includes(search.toLowerCase())
        )
    )

    const handleSort = (key: keyof StaffMember) => {
        setSortConfig({
            key,
            direction:
                sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
        })
    }

    const sortedStaff = initialStaffList.sort((a, b) => {
        if (!sortConfig.key) return 0

        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1
        }
        return aValue < bValue ? 1 : -1
    })

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Staff Member List</h1>
                <Button className="bg-teal-500 hover:bg-teal-600">
                    <Link href="/staff-member/add">Add Staff Member</Link>
                </Button>
            </div>

            <div className="flex gap-2 mb-4">
                <Button variant="outline" className="w-20">PDF</Button>
                <Button variant="outline" className="w-20">Print</Button>
            </div>

            <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Search:</span>
                    <Input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                    />
                </div>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20" onClick={() => handleSort('_id')}>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    S.No
                                    {sortConfig.key === '_id' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead>Photo</TableHead>
                            <TableHead onClick={() => handleSort('name')}>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    Staff Member Name
                                    {sortConfig.key === 'name' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead onClick={() => handleSort('role')}>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    Role
                                    {sortConfig.key === 'role' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead onClick={() => handleSort('email')}>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    Email
                                    {sortConfig.key === 'email' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead onClick={() => handleSort('phone')}>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    Mobile No.
                                    {sortConfig.key === 'phone' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedStaff.map((member, index) => (
                            <TableRow key={member._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <img
                                        src={member.image}
                                        alt={`${member.name}'s photo`}
                                        className="rounded-full w-[80px] p-1 h-[80px] object-cover"
                                    />
                                </TableCell>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.role.name}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>{member.phone}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm">
                <div>Showing 1 to {sortedStaff.length} of {sortedStaff.length} entries</div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="px-4"
                        disabled
                    >
                        Previous
                    </Button>
                    <Button
                        variant="default"
                        className="px-4 bg-blue-500 hover:bg-blue-600"
                    >
                        1
                    </Button>
                    <Button
                        variant="outline"
                        className="px-4"
                        disabled
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

