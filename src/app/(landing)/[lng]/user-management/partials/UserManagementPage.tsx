"use client"

import { DateRangePicker } from "@/components/Shared/DateSelect/DateRangePicker"
import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { MoreVertical } from "lucide-react"
import { useState } from "react"
import { RangeKeyDict } from "react-date-range"

interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface UserManagementDataType {
  id: number
  name: string
  email: string
  registeredDate: string
  lastActivity: string
  dailyScorePoints: number
}

export default function UserManagementPage() {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const columns: Column<UserManagementDataType>[] = [
    {
      accessor: "id" as const,
      header: "ID"
    },
    {
      accessor: "name" as const,
      header: "User Name"
    },
    {
      accessor: "email" as const,
      header: "Email"
    },
    {
      accessor: "registeredDate" as const,
      header: "Registration date"
    },
    {
      accessor: "lastActivity" as const,
      header: "Last Activity"
    },
    {
      accessor: "dailyScorePoints" as const,
      header: "Daily Score Points",
      className: "w-40"
    },
    {
      id: "actions",
      header: "",
      className: "w-12",
      cell: (row: UserManagementDataType) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-6"
              size="icon"
            >
              <MoreVertical className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const data: UserManagementDataType[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      registeredDate: "2021-01-01",
      lastActivity: "2021-01-01",
      dailyScorePoints: 100
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      registeredDate: "2021-01-01",
      lastActivity: "2021-01-01",
      dailyScorePoints: 100
    },
    {
      id: 3,
      name: "John Doe",
      email: "john@example.com",
      registeredDate: "2021-01-01",
      lastActivity: "2021-01-01",
      dailyScorePoints: 100
    },
    {
      id: 4,
      name: "John Doe",
      email: "john@example.com",
      registeredDate: "2021-01-01",
      lastActivity: "2021-01-01",
      dailyScorePoints: 100
    },
    {
      id: 5,
      name: "John Doe",
      email: "john@example.com",
      registeredDate: "2021-01-01",
      lastActivity: "2021-01-01",
      dailyScorePoints: 100
    },
    {
      id: 6,
      name: "John Doe",
      email: "john@example.com",
      registeredDate: "2021-01-01",
      lastActivity: "2021-01-01",
      dailyScorePoints: 100
    },
    {
      id: 7,
      name: "John Doe",
      email: "john@example.com",
      registeredDate: "2021-01-01",
      lastActivity: "2021-01-01",
      dailyScorePoints: 100
    },
    {
      id: 8,
      name: "John Doe",
      email: "john@example.com",
      registeredDate: "2021-01-01",
      lastActivity: "2021-01-01",
      dailyScorePoints: 100
    },
    {
      id: 9,
      name: "John Doe",
      email: "john@example.com",
      registeredDate: "2021-01-01",
      lastActivity: "2021-01-01",
      dailyScorePoints: 100
    },
    {
      id: 10,
      name: "John Doe",
      email: "john@example.com",
      registeredDate: "2021-01-01",
      lastActivity: "2021-01-01",
      dailyScorePoints: 100
    },
    {
      id: 11,
      name: "John Doe",
      email: "john@example.com",
      registeredDate: "2021-01-01",
      lastActivity: "2021-01-01",
      dailyScorePoints: 100
    }
  ]

  const pageSizeOptions: number[] = [5, 10, 20]

  const totalItems: number = data.length
  const startIndex: number = (page - 1) * pageSize
  const endIndex: number = startIndex + pageSize
  const paginatedData: UserManagementDataType[] = data.slice(
    startIndex,
    endIndex
  )

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }

  const scorePoints = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 30, label: "30" },
    { value: 40, label: "40" },
    { value: 50, label: "50" },
    { value: 60, label: "60" },
    { value: 70, label: "70" },
    { value: 80, label: "80" },
    { value: 90, label: "90" },
    { value: 100, label: "100" }
  ]

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex gap-2">
          {/* search by user name */}
          <Input className="max-w-xs" placeholder="Search by user name..." />

          {/* select score points */}
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Score Points" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {scorePoints.map(item => (
                  <SelectItem value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Last 7 Days" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* select date range */}
          <div>
            <DateRangePicker
              onChange={(range: RangeKeyDict) => {
                console.log("Selected range:", range)
              }}
            />
          </div>
        </div>
      </div>

      {/* user management table */}
      <CustomTable
        columns={columns}
        data={paginatedData}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        pageSizeOptions={pageSizeOptions}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
