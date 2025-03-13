'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Pencil, Trash2, FileDown, Printer, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useDeleteRequest, useGetRequest } from '@/hooks/AxiosRequest'
import { API_BASE_URL } from '@/lib/constant'
import { useToast } from '@/hooks/useToast'
import { useQueryClient } from '@tanstack/react-query'
import PreLoader from '@/components/PreLoader'



export interface IMember {
    _id: string,
    name: string
    period: string
    category: {
        name: string;
    }
    amount: number
}

export interface IGetMemberShipRequestResponse {
    data: {
        data: IMember[]
    } | undefined,
    isLoading: boolean;
    error: any;
}


type SortKey = keyof IMember
type SortOrder = 'asc' | 'desc'


export default function MembershipList() {
    const [searchTerm, setSearchTerm] = useState('')
    const [sortKey, setSortKey] = useState<SortKey>('_id')
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
    const queryClient = useQueryClient();
    const { toastSuccess, toastError } = useToast()
    const { data, isLoading, error }: IGetMemberShipRequestResponse = useGetRequest(`${API_BASE_URL}/memberShipTypes/membership`, 'membershipList')
    const { mutate, isPending } = useDeleteRequest(`${API_BASE_URL}/memberShipTypes/delete-memberShip`)
    const initialData = data?.data;
    // console.log("initialData", initialData);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortOrder('asc')
        }
    }

    const sortedData = initialData?.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[sortKey] > b[sortKey] ? 1 : -1
        }
        return a[sortKey] < b[sortKey] ? 1 : -1
    })

    const filteredData = sortedData?.filter(member =>
        Object.values(member).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
        if (sortKey !== columnKey) return null
        return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
    }

    const handleDelete = (id: string) => {
        mutate(id, {
            onSuccess: () => {
                console.log("success");
                toastSuccess("Membership deleted successfully!")
                queryClient.invalidateQueries({
                    queryKey: ["membershipList"]
                })
            },
            onError: (error) => {
                console.log("error", error);
                toastError("Failed to delete membership!")
            }
        })
    }

    return (
        <>
            {isLoading || isPending && <PreLoader />}
            <Card className="w-full max-w-6xl mx-auto">
                <CardHeader className="flex  flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <CardTitle className="text-2xl font-bold">Membership List</CardTitle>
                    <Link className="bg-teal-500 print:hidden hover:bg-teal-600 px-3 py-2 rounded" href="/membership/add">Add New Membership</Link>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex flex-col print:hidden sm:flex-row sm:justify-between gap-4">
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex items-center gap-2" onClick={() => window.print()}>
                                    <Printer className="w-4 h-4" />
                                    Print
                                </Button>
                            </div>
                            <div className="flex-1 sm:max-w-xs">
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('_id')}
                                        >
                                            <div className="flex items-center">
                                                S.No
                                                <SortIcon columnKey="_id" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center">
                                                Name
                                                <SortIcon columnKey="name" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('period')}
                                        >
                                            <div className="flex items-center">
                                                Period
                                                <SortIcon columnKey="period" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('category')}
                                        >
                                            <div className="flex items-center">
                                                Category
                                                <SortIcon columnKey="category" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('amount')}
                                        >
                                            <div className="flex items-center">
                                                Amount
                                                <SortIcon columnKey="amount" />
                                            </div>
                                        </TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredData && filteredData?.length > 0 ? (
                                        filteredData?.map((member, index) => (
                                            <TableRow key={member._id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{member.name}</TableCell>
                                                <TableCell>{member.period}</TableCell>
                                                <TableCell>{member.category?.name}</TableCell>
                                                <TableCell>${member.amount}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600">
                                                            <Link href={`/membership/edit/${member._id}`} >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button size="icon" onClick={() => handleDelete(member._id)} variant="ghost" className="h-8 w-8 text-red-600">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableCell className='text-center tracking-wide' colSpan={6}>No MemberShip Data</TableCell>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {filteredData?.length} of {initialData?.length} entries
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" disabled>
                                    Previous
                                </Button>
                                <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                                    1
                                </Button>
                                <Button variant="outline" disabled>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

