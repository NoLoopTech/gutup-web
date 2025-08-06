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
import { useEffect, useMemo, useRef, useState } from "react"
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

// Define the type for the range object
interface DateRange {
  startDate: Date | null
  endDate: Date | null
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
  const [userId, setUserId] = useState<number>(0)
  const [activeRowId, setActiveRowId] = useState<number | null>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // handle view user overview
  const handleViewUserOverview = (userId: number): void => {
    setUserOverviewPopupOpen(true)
    setUserId(userId)
  }

  // handle close user overview
  const handleCloseUserOverview = (): void => {
    setUserOverviewPopupOpen(false)
  }

  // handle search text change
  const handleSearchTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchText(e.target.value)
  }

  // handle get users
  const getUsers = async (): Promise<void> => {
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
    void getUsers()
  }, [])

  useEffect(() => {
    if (activeRowId === null) return
    function handleClickOutside(event: MouseEvent): void {
      const target = event.target as HTMLElement
      if (
        tableContainerRef.current &&
        !tableContainerRef.current.contains(target) &&
        !target.closest(".row-action-trigger") &&
        !target.closest(".row-action-popup")
      ) {
        setActiveRowId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeRowId])

  const columns: Array<Column<UserManagementDataType>> = useMemo(
    () => [
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
      }
    ],
    []
  )

  // Render row dropdown function (like StoreManagementPage)
  const renderRowDropdown = (row: UserManagementDataType): JSX.Element => (
    <div className="row-action-popup">
      <DropdownMenu
        open={activeRowId === row.id}
        onOpenChange={open => {
          setActiveRowId(open ? row.id : null)
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="row-action-trigger data-[state=open]:bg-muted text-muted-foreground flex size-6"
            size="icon"
            tabIndex={-1}
            onClick={e => {
              e.stopPropagation()
              setActiveRowId(row.id)
            }}
          >
            <MoreVertical className="w-5 h-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation()
              handleViewUserOverview(row.id)
              setActiveRowId(null)
            }}
          >
            View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  const pageSizeOptions: number[] = [5, 10, 20]

  // filter users (for table)
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const nameMatch = user.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
      const scoreMatch =
        selectedScore === "" || user.dailyScore === Number(selectedScore)

      const createdAt = dayjs(user.createdAt)
      const now = dayjs()

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

      let rangeMatch = true
      if (selectedDateRange.startDate && selectedDateRange.endDate) {
        const start = dayjs(selectedDateRange.startDate).startOf("day")
        const end = dayjs(selectedDateRange.endDate).endOf("day")
        rangeMatch = createdAt.isBetween(start, end, null, "[]")
        predefinedDateMatch = rangeMatch
      }

      return nameMatch && scoreMatch && predefinedDateMatch && rangeMatch
    })
  }, [users, searchText, selectedScore, selectedDateFilter, selectedDateRange])

  const totalItems = filteredUsers.length

  // paginate data (for table)
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredUsers.slice(startIndex, endIndex)
  }, [filteredUsers, page, pageSize])

  // handle page change
  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }
  // handle page size change
  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  // handle Score change
  const handleScoreChange = (value: string): void => {
    setSelectedScore(value)
  }

  // handle dates change
  const handleDatesChange = (value: string): void => {
    setSelectedDateFilter(value)
  }

  // handle dates change
  const handleDateRangeChange = (range: DateRange): void => {
    if (!range.startDate || !range.endDate) return
    setSelectedDateRange(range)
  }

  // handle clear search values
  const handleClearSearchValues = (): void => {
    setSearchText("")
    setSelectedScore("")
    setSelectedDateFilter("All")
    setSelectedDateRange({ startDate: null, endDate: null })
  }

  // genarate score points
  const scorePoints = Array.from({ length: 100 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString()
  }))

  return (
    <div className="space-y-4" ref={tableContainerRef}>
      <div className="flex flex-wrap gap-2 ">
        {/* search by user name */}
        <Input
          className="max-w-xs"
          placeholder="Search by user name..."
          value={searchText}
          onChange={handleSearchTextChange}
        />
        {/* select score points */}
        <Select value={selectedScore} onValueChange={handleScoreChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Score Points" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
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
        <Select value={selectedDateFilter} onValueChange={handleDatesChange}>
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
            onChange={handleDateRangeChange}
          />
        </div>

        {/* clear filters button */}
        {(Boolean(searchText) ||
          Boolean(selectedScore) ||
          Boolean(selectedDateFilter !== "All") ||
          Boolean(selectedDateRange.startDate) ||
          Boolean(selectedDateRange.endDate)) && (
          <Button variant="outline" onClick={handleClearSearchValues}>
            Clear Filters
          </Button>
        )}
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
        activeRowId={activeRowId}
        setActiveRowId={setActiveRowId}
        renderRowDropdown={renderRowDropdown}
      />

      <UserOverviewPopup
        open={userOverviewPopupOpen}
        onClose={handleCloseUserOverview}
        token={token}
        userId={userId}
        getUsers={getUsers}
      />
    </div>
  )
}
