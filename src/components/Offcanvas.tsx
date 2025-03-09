'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { LayoutDashboard, Users, UserPlus, Briefcase, CalendarCheck, FileText, Settings, ChevronDown, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const menuItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    links: [],
  },
  {
    label: 'Membership Type',
    icon: Briefcase,
    links: [
      { href: '/membership/list', label: 'Membership' },
      { href: '/category/list', label: 'Category' },
    ],
  },
  {
    label: 'Member Management',
    icon: Users,
    links: [
      { href: '/staff-member/list', label: 'Staff Member' },
      { href: '/member/list', label: 'Member' },
      { href: '/role/list', label: 'Role' },
      { href: '/specialization/list', label: 'Specialization' },
    ],
  },
  {
    label: 'Group',
    href: '/group/list',
    icon: UserPlus,
    links: [],
  },
  {
    label: 'Attendance',
    icon: CalendarCheck,
    links: [
      { href: '/member-attendance', label: 'Member Attendance' },
      { href: '/staff-attendance', label: 'Staff Member Attendance' },
    ],
  },
  {
    label: 'Reports',
    icon: FileText,
    links: [
      { href: '/attendance-report', label: 'Attendance Report' },
      { href: '/membership-report', label: 'Membership Report' },
    ],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    links: [],
  },
]

export function OffcanvasSidebar() {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)

  const handleVisibleChange = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label))
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button  size="icon" className="fixed top-4 left-4 z-50 ">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Dashboard Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-4 space-y-1 px-2">
          {menuItems.map((item, index) => (
            <div key={index} className="py-1">
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                  {item.label}
                </Link>
              ) : (
                <div>
                  <button
                    onClick={() => handleVisibleChange(item.label)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                      {item.label}
                    </div>
                    {item.links.length > 0 && (
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform duration-200',
                          openDropdown === item.label ? 'rotate-180' : ''
                        )}
                      />
                    )}
                  </button>
                  {item.links.length > 0 && (
                    <div
                      className={cn(
                        'mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out',
                        openDropdown === item.label ? 'max-h-96' : 'max-h-0'
                      )}
                    >
                      {item.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className="flex items-center rounded-md py-2 pl-11 pr-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => setOpen(false)}
                        >
                          <ChevronRight className="mr-3 h-3 w-3" />
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

