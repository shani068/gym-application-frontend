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

interface Member {
  id: string
  name: string
  photo: string
  status: string
  present: boolean
}

export default function StaffAttendance() {
  const [date, setDate] = useState<Date>()
  const [search, setSearch] = useState("")
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Donna Daniel Blythe Tyson",
      photo: "/placeholder.svg",
      status: "Not Taken",
      present: false
    }
  ])

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase())
  )

  const togglePresent = (id: string) => {
    setMembers(members.map(member => 
      member.id === id 
        ? { ...member, present: !member.present } 
        : member
    ))
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Member Attendance</h1>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "P") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

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
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-left">Member Photo</th>
                  <th className="px-4 py-2 text-left">Member Name</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b">
                    <td className="px-4 py-2">
                      <Button
                        onClick={() => togglePresent(member.id)}
                        className={cn(
                          "w-24",
                          member.present 
                            ? "bg-green-700 hover:bg-green-800" 
                            : "bg-gray-500 hover:bg-gray-600"
                        )}
                      >
                        {member.present ? "Present" : "Absent"}
                      </Button>
                    </td>
                    <td className="px-4 py-2">
                      <Avatar>
                        <AvatarImage src={member.photo} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="px-4 py-2">{member.name}</td>
                    <td className="px-4 py-2">{member.status}</td>
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

 
