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

interface IMember {
    _id: string
    image: string
    firstName: string
    lastName: string
    memberShipValidFrom: string
    memberShipValidTo: string
    email: string
    phone: string
}

interface IGetMembersListResponse {
    data: {
        data: IMember[]
    } | undefined,
    isLoading: boolean,
    error: any,
}

export default function MemberList() {
    const [search, setSearch] = useState('')
    const {data, isLoading} : IGetMembersListResponse = useGetRequest(`${API_BASE_URL}/memberManagement/get-members-list`, "Members List")
    const initialMembers = data?.data || [];

    const [sortConfig, setSortConfig] = useState<{
        key: keyof IMember | null
        direction: 'asc' | 'desc'
    }>({ key: null, direction: 'asc' })

    const filteredStaff = initialMembers?.filter(member =>
        Object.values(member).some(value =>
            value.toString().toLowerCase().includes(search.toLowerCase())
        )
    )

    const handleSort = (key: keyof IMember) => {
        setSortConfig({
            key,
            direction:
                sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
        })
    }

    const sortedStaff = filteredStaff?.sort((a, b) => {
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
                <h1 className="text-2xl font-bold">Member List</h1>
                <Link className="bg-teal-500 hover:bg-teal-600" href="/member/add">Add Member</Link>

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
                            <TableHead onClick={() => handleSort('firstName')}>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    Staff Member Name
                                    {sortConfig.key === 'firstName' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead onClick={() => handleSort('memberShipValidFrom')}>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    Join Date
                                    {sortConfig.key === 'memberShipValidFrom' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead onClick={() => handleSort('memberShipValidTo')}>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    Expire Date
                                    {sortConfig.key === 'memberShipValidTo' && (
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
                        {sortedStaff?.map((member, index) => (
                            <TableRow key={member._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <img
                                        src={member.image}
                                        alt={`Profile photo`}
                                        className="rounded-full w-[60px] h-[60px] object-cover"
                                    />
                                </TableCell>
                                <TableCell>{`${member.firstName} ${member.lastName}`}</TableCell>
                                <TableCell>{new Date(member.memberShipValidFrom).toDateString()}</TableCell>
                                <TableCell>{new Date(member.memberShipValidTo).toDateString()}</TableCell>
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
                <div>Showing 1 to {sortedStaff?.length} of {sortedStaff?.length} entries</div>
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

