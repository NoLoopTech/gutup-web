"use client"

import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Store } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { getAllStores } from "@/app/api/store"
import { Badge } from "@/components/ui/badge"
import AddStorePopUp from "./AddStorePopUp"
import { Label } from "@/components/ui/label"

interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface StoreManagementDataType {
  storeName: string
  storeLocation: string
  storeType: string
  phoneNumber: string
  shopStatus: boolean
  ingredients: string
  subscriptionType: string
}

interface dataListTypes {
  value: string
  label: string
}

export default function StoreManagementPage({
  token
}: {
  token: string
}): JSX.Element {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [stores, setStores] = useState<StoreManagementDataType[]>([])
  const [openAddStorePopUp, setOpenAddStorePopUp] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [selectedStoreType, setSelectedStoreType] = useState<string>("")

  // handle open add food popup
  const handleOpenAddStorePopUp = (): void => {
    setOpenAddStorePopUp(true)
  }

  // handle close add food popup
  const handleCloseAddStorePopUp = (): void => {
    setOpenAddStorePopUp(false)
  }

  // handle search text change
  const handleSearchTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchText(e.target.value)
  }

  // handle get stores
  const getStores = async (): Promise<void> => {
    try {
      const response = await getAllStores(token)
      if (response.status === 200) {
        setStores(response.data)
      } else {
        console.warn("No stores found or wrong format:", response)
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error)
    }
  }

  useEffect(() => {
    void getStores()
  }, [])

  const columns: Array<Column<StoreManagementDataType>> = [
    {
      accessor: "storeName",
      header: "Store Name"
    },
    {
      accessor: "storeLocation",
      header: "Location"
    },
    {
      accessor: "subscriptionType",
      header: "Subscriptions",
      className: "w-25",
      cell: (row: StoreManagementDataType) => (
        <Badge
          className={
            row.subscriptionType === "premium"
              ? "bg-[#B2FFAB] text-green-700 hover:bg-green-200 border border-green-700 capitalize"
              : "bg-red-300 text-red-700 hover:bg-red-200 border border-red-700 capitalize"
          }
        >
          {row.subscriptionType}
        </Badge>
      )
    },
    {
      accessor: "storeType",
      header: "Store Type",
      className: "w-40 capitalize",
      cell: (row: StoreManagementDataType) => (
        <Badge variant={"outline"}>{row.storeType}</Badge>
      )
    },
    {
      accessor: "phoneNumber",
      header: "Contact Information"
    },
    {
      accessor: "ingredients",
      header: "Products Available",
      cell: (row: StoreManagementDataType) => (
        <Label className="text-gray-500">
          {row.ingredients.length} Available
        </Label>
      )
    },
    {
      accessor: "shopStatus",
      header: "Status",
      className: "w-28",
      cell: (row: StoreManagementDataType) => (
        <Badge
          className={
            row.shopStatus
              ? "bg-[#B2FFAB] text-green-700 hover:bg-green-200 border border-green-700"
              : "bg-red-300 text-red-700 hover:bg-red-200 border border-red-700 "
          }
        >
          {row.shopStatus ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      id: "actions",
      className: "w-12",
      cell: (row: StoreManagementDataType) => (
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

  // filter stores (for table)
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const nameMatch = store.storeName
        .toLowerCase()
        .includes(searchText.toLowerCase())
      const locationMatch =
        selectedLocation === "" || store.storeLocation === selectedLocation

      const typeMatch =
        selectedStoreType === "" ||
        store.storeType.toLowerCase() === selectedStoreType.toLowerCase()

      return nameMatch && locationMatch && typeMatch
    })
  }, [stores, searchText, selectedLocation, selectedStoreType])

  const pageSizeOptions = [5, 10, 20]
  const totalItems = filteredStores.length

  // paginate data (for table)
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredStores.slice(startIndex, endIndex)
  }, [filteredStores, page, pageSize])

  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  // handle clear search values
  const handleClearSearchValues = (): void => {
    setSearchText("")
    setSelectedLocation("")
    setSelectedStoreType("")
  }

  const locations: dataListTypes[] = [
    { value: "Lagos", label: "Lagos" },
    { value: "Abuja", label: "Abuja" },
    { value: "Kano", label: "Kano" },
    { value: "Kaduna", label: "Kaduna" }
  ]

  const storeTypes: dataListTypes[] = [
    { value: "Online", label: "Online" },
    { value: "Physical", label: "Physical" }
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap w-[80%] gap-2">
          {/* search stores by name */}
          <Input
            className="max-w-xs"
            placeholder="Search by store name..."
            value={searchText}
            onChange={handleSearchTextChange}
          />

          {/* select location */}
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {locations.map(item => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* select Store Type */}
          <Select
            value={selectedStoreType}
            onValueChange={setSelectedStoreType}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Store Type" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {storeTypes.map(item => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* clear filters button */}
          {(searchText || selectedLocation || selectedStoreType) && (
            <Button variant="outline" onClick={handleClearSearchValues}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* add new food button */}
        <Button onClick={handleOpenAddStorePopUp}>Add New</Button>
      </div>

      {/* foods management table */}
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

      {/* add food popup */}
      <AddStorePopUp
        open={openAddStorePopUp}
        onClose={handleCloseAddStorePopUp}
      />
    </div>
  )
}
