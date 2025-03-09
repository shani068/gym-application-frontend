 'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface IMemberShipReport {
  id: string
  name: string
  totalMember: number
}

export default function MemberShipReport() {
  const [date, setDate] = useState<Date>()
  const [search, setSearch] = useState("")
  const [members, setMembers] = useState<IMemberShipReport[]>([
    {
      id: "1",
      name: "Donna Daniel Blythe Tyson",
      totalMember: 10,
    }
  ])

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase())
  )


  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Member Attendance</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 bg-teal-500 text-white rounded-t-lg">
          <h2 className="text-xl font-semibold">Member List</h2>
        </div>

        <div className="p-4">
          <div className="flex justify-end mb-4">
            <div className="w-full max-w-xs">
              <Input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Sr.No </th>
                  <th className="px-4 py-2 text-left">MemberShip Name</th>
                  <th className="px-4 py-2 text-left">Total Member</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b">
                    <td className="px-4 py-2">{member.id}</td>
                    <td className="px-4 py-2">
                      {member.name}
                    </td>
                    <td className="px-4 py-2">{member.totalMember}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredMembers.length} to {filteredMembers.length} of {members.length} entries
            </p>
            <Button variant="secondary">Save</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

 

