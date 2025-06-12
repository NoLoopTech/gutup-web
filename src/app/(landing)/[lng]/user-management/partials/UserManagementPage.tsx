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
import { useEffect, useState } from "react"
import UserOverviewPopup from "./UserOverviewPopup"
import { getAllUsers } from "@/app/api/user"
import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"

dayjs.extend(isBetween)

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
  createdAt: string
  updatedAt: string
  dailyScore: number
}

export default function UserManagementPage({
  token
}: {
  token: string
}): JSX.Element {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [users, setUsers] = useState<UserManagementDataType[]>([])
  const [userOverviewPopupOpen, setUserOverviewPopupOpen] =
    useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>("")
  const [selectedScore, setSelectedScore] = useState<string>("")
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("All")
  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: Date | null
    endDate: Date | null
  }>({
    startDate: null,
    endDate: null
  })

  console.log(selectedDateRange)

  const handleViewUserOverview = () => {
    setUserOverviewPopupOpen(true)
  }
  const handleCloseUserOverview = () => {
    setUserOverviewPopupOpen(false)
  }

  // handle get users
  const getUsers = async () => {
    try {
      const response = await getAllUsers(token)
      if (response.status === 200) {
        setUsers(response.data.users)
      } else {
        console.log(response)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

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
      accessor: "createdAt" as const,
      header: "Registration date",
      cell: (row: any) => dayjs(row.createdAt).format("DD/MM/YYYY")
    },
    {
      accessor: "updatedAt" as const,
      header: "Last Activity",
      cell: (row: any) => dayjs(row.updatedAt).format("DD/MM/YYYY")
    },
    {
      accessor: "dailyScore" as const,
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
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={handleViewUserOverview}>
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const pageSizeOptions: number[] = [5, 10, 20]

  const now = dayjs()

  // filter users
  const filteredUsers = users.filter(user => {
    const nameMatch = user.name.toLowerCase().includes(searchText.toLowerCase())
    const scoreMatch =
      selectedScore === "" || user.dailyScore === Number(selectedScore)

    const createdAt = dayjs(user.createdAt)
    const now = dayjs()

    // Predefined filter
    let predefinedDateMatch = true
    if (
      selectedDateFilter !== "All" &&
      !selectedDateRange.startDate &&
      !selectedDateRange.endDate
    ) {
      switch (selectedDateFilter) {
        case "Last 7 Days":
          predefinedDateMatch = createdAt.isAfter(now.subtract(7, "day"))
          break
        case "Last Month":
          predefinedDateMatch = createdAt.isAfter(now.subtract(1, "month"))
          break
        case "Last 3 Months":
          predefinedDateMatch = createdAt.isAfter(now.subtract(3, "month"))
          break
      }
    }

    // Custom range takes priority if selected
    let rangeMatch = true
    if (selectedDateRange.startDate && selectedDateRange.endDate) {
      const start = dayjs(selectedDateRange.startDate).startOf("day")
      const end = dayjs(selectedDateRange.endDate).endOf("day")
      rangeMatch = createdAt.isBetween(start, end, null, "[]")

      // override predefined match if range is used
      predefinedDateMatch = rangeMatch
    }

    return nameMatch && scoreMatch && predefinedDateMatch && rangeMatch
  })

  const totalItems = filteredUsers.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = filteredUsers.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }

  // genarate score points
  const scorePoints = Array.from({ length: 100 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString()
  }))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 ">
        {/* search by user name */}
        <Input
          className="max-w-xs"
          placeholder="Search by user name..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        {/* select score points */}
        <Select
          value={selectedScore}
          onValueChange={value => setSelectedScore(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Score Points" />
          </SelectTrigger>
          <SelectContent className="max-h-40">
            <SelectGroup>
              {scorePoints.map(item => (
                <SelectItem key={item.value} value={item.value.toString()}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* select dates */}
        <Select
          value={selectedDateFilter}
          onValueChange={value => setSelectedDateFilter(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="max-h-40">
            <SelectGroup>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
              <SelectItem value="Last Month">Last Month</SelectItem>
              <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* select date range */}
        <div>
          <DateRangePicker
            value={selectedDateRange}
            onChange={range => {
              if (!range.startDate || !range.endDate) return
              setSelectedDateRange(range)
            }}
          />
        </div>

        {/* clear filters button */}
        <Button
          variant="outline"
          onClick={() => {
            setSearchText("")
            setSelectedScore("")
            setSelectedDateFilter("All")
            setSelectedDateRange({ startDate: null, endDate: null })
          }}
        >
          Clear Filters
        </Button>
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

      <UserOverviewPopup
        open={userOverviewPopupOpen}
        onClose={handleCloseUserOverview}
      />
    </div>
  )
}
