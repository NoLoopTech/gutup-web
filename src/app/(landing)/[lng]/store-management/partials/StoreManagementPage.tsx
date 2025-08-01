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
import { MoreVertical } from "lucide-react"
import { useEffect, useRef, useState, useMemo } from "react"
import {
  AddNewStore,
  getAllStores,
  deleteStoreById,
  updateStoreById,
  updateStoreStatusById
} from "@/app/api/store"
import { Badge } from "@/components/ui/badge"
import AddStorePopUp from "./AddStorePopUp"
import { Label } from "@/components/ui/label"
import { useStoreStore } from "@/stores/useStoreStore"
import { uploadImageToFirebase } from "@/lib/firebaseImageUtils"
import {
  type translationsTypes,
  defaultTranslations,
  type StoreManagementDataType,
  type shopStatusDataType
} from "@/types/storeTypes"
import { toast } from "sonner"
import { loadLanguage } from "@/../../src/i18n/locales"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import EditStorePopUp from "./EditStorePopUp"
import { transformStoreDataToApiRequest } from "@/helpers/storeHelpers"

interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface dataListTypes {
  value: string
  label: string
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const [editStoreOpen, setEditStoreOpen] = useState<boolean>(false)
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null)
  const [storeId, setStoreId] = useState<number>(0)
  const [translations, setTranslations] =
    useState<translationsTypes>(defaultTranslations)
  const [activeRowId, setActiveRowId] = useState<number | null>(null)

  // Get store data from zustand store
  const {
    allowMultiLang,
    activeLang,
    storeData,
    setTranslationField,
    resetForm
  } = useStoreStore()

  // Load translations based on the current language
  useEffect(() => {
    const loadTranslations = async (): Promise<void> => {
      const langData = await loadLanguage(activeLang, "store")
      setTranslations(langData)
    }

    void loadTranslations()
  }, [activeLang])

  // handle open add food popup
  const handleOpenAddStorePopUp = (): void => {
    setOpenAddStorePopUp(true)
  }

  // handle close add food popup
  const handleCloseAddStorePopUp = (): void => {
    resetForm()
    sessionStorage.removeItem("store-store")
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
      if (response?.status === 200 && response?.data) {
        setStores(response.data)
      } else if (response?.data && Array.isArray(response.data)) {
        setStores(response.data)
      } else {
        console.warn("No stores found or unexpected format:", response)
        setStores([])
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error)
      toast.error("Failed to load stores")
      setStores([])
    }
  }

  useEffect(() => {
    void getStores()
  }, [])

  const uploadStoreImageAndSetUrl = async (): Promise<string | undefined> => {
    const imageFile: string | File | null | undefined =
      storeData[activeLang].storeImage

    if (!imageFile) return

    const folder = "stores"
    const fileNamePrefix = "store-image"
    const fileName = `${fileNamePrefix}-${Date.now()}`

    let fileToUpload: File | Blob

    if (typeof imageFile === "string") {
      try {
        const blob = await fetch(imageFile).then(async res => await res.blob())
        fileToUpload = blob
      } catch (err) {
        console.error("Failed to convert string to Blob", err)
        return
      }
    } else {
      fileToUpload = imageFile
    }

    const uploadedUrl = await uploadImageToFirebase(
      fileToUpload,
      folder,
      fileName
    )

    // Update the store image URL in the store
    setTranslationField("storeData", activeLang, "storeImage", uploadedUrl)

    return uploadedUrl
  }

  const handleAddStore = async (): Promise<void> => {
    try {
      setIsLoading(true)

      // Upload image first and wait for it to complete
      await uploadStoreImageAndSetUrl()

      const transformedData = transformStoreDataToApiRequest(
        storeData,
        activeLang,
        allowMultiLang
      )

      const requestBody = {
        ...transformedData,
        allowMultiLang
      }

      const existingPhone = stores.some(
        store => store.phoneNumber === requestBody.phoneNumber
      )
      const existingEmail = stores.some(
        store => store.email === requestBody.email
      )

      if (existingPhone && existingEmail) {
        toast.error(
          translations.phoneEmailAlreadyExists ||
            "Phone number and email already exist"
        )
        return
      } else if (existingPhone) {
        toast.error(
          translations.phoneAlreadyExists || "Phone number already exists"
        )
        return
      } else if (existingEmail) {
        toast.error(translations.emailAlreadyExists || "Email already exists")
        return
      }

      const response = await AddNewStore(token, requestBody)
      if (response && (response.status === 201 || response.status === 200)) {
        toast.success(
          translations.formSubmittedSuccessfully || "Store added successfully"
        )
        setOpenAddStorePopUp(false)
        await getStores()
        resetForm()
        sessionStorage.removeItem("store-store")
      } else {
        console.error("Unexpected response structure:", response)
        console.error("Response status was:", response?.status)
        toast.error(translations.storeCreationFailed || "Failed to add store")
      }
    } catch (error) {
      toast.error("System error. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStore = (storeId: number): void => {
    setStoreId(storeId)
    setConfirmDeleteOpen(true)
  }

  const handleDeleteStoreById = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await deleteStoreById(token, storeId)

      // Check if response is an error object
      if (response?.response?.status) {
        const errorMessage =
          response.response?.data?.message || "Failed to delete store"
        toast.error(errorMessage)
        setConfirmDeleteOpen(false)
        return
      }

      // Check for successful response
      if (response?.data) {
        toast.success("Store deleted successfully")
        setConfirmDeleteOpen(false)
        await getStores()
      } else {
        toast.error("Failed to delete store")
        setConfirmDeleteOpen(false)
      }
    } catch (error) {
      console.error("Error deleting store:", error)
      toast.error("Failed to delete store")
    } finally {
      setIsLoading(false)
    }
  }

  // handle close delete confirmation popup
  const handleCloseDeleteConfirmationPopup = (): void => {
    setConfirmDeleteOpen(false)
  }

  // handle edit store
  const handleEditStore = (store: StoreManagementDataType): void => {
    setSelectedStoreId(store.id ?? null)
    setEditStoreOpen(true)
  }

  // handle close edit store popup
  const handleCloseEditStorePopup = (): void => {
    setEditStoreOpen(false)
    setSelectedStoreId(null)
  }

  // handle update store
  const handleUpdateStore = async (): Promise<void> => {
    if (!selectedStoreId) return

    try {
      setIsLoading(true)
      const transformedData = transformStoreDataToApiRequest(
        storeData,
        activeLang,
        allowMultiLang
      )

      const requestBody = {
        ...transformedData,
        allowMultiLang
      }

      const response = await updateStoreById(
        token,
        selectedStoreId,
        requestBody
      )

      if (response?.data) {
        toast.success("Store updated successfully")
        setEditStoreOpen(false)
        await getStores()
        resetForm()
        sessionStorage.removeItem("store-store")
      } else {
        console.error("Unexpected response structure:", response)
        toast.error("Failed to update store")
      }
    } catch (error) {
      console.error("Error updating store:", error)
      toast.error("System error. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleShopStatus = async (
    store: shopStatusDataType
  ): Promise<void> => {
    try {
      setIsLoading(true)
      if (typeof store.id === "number") {
        const newStatus = !store.shopStatus
        const fullStore = stores.find(s => s.id === store.id)
        if (!fullStore) {
          toast.error("Store not found")
          setIsLoading(false)
          return
        }
        const requestBody = {
          ...fullStore,
          shopStatus: newStatus
        }
        const response = await updateStoreStatusById(
          token,
          store.id,
          requestBody
        )
        if (response?.data) {
          toast.success(
            `Store status changed to ${newStatus ? "Active" : "Inactive"}`
          )
          await getStores()
        } else {
          toast.error("Failed to change store status")
        }
      } else {
        toast.error("Invalid store ID")
      }
    } catch (error) {
      toast.error("System error. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

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
      cell: (row: StoreManagementDataType) => {
        const ingredientsCount = row.ingredients?.length ?? 0
        const categoriesCount = row.categories?.length ?? 0
        const ingAndCatCount = row.ingAndCatData?.length ?? 0

        // Use ingredients + categories if available, otherwise fall back to ingAndCatData
        const totalCount =
          row.ingredients ?? row.categories
            ? ingredientsCount + categoriesCount
            : ingAndCatCount

        return <Label className="text-gray-500">{totalCount} Available</Label>
      }
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
      cell: () => null // We'll render dropdown at row level
    }
  ]

  // Dropdown renderer for row
  const renderRowDropdown = (row: StoreManagementDataType) => (
    <div className="row-action-popup">
      <DropdownMenu
        open={activeRowId === row.id}
        onOpenChange={open => setActiveRowId(open ? row.id : null)}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-6"
            size="icon"
            tabIndex={-1}
          >
            <MoreVertical className="w-5 h-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation()
              void handleToggleShopStatus({
                id: row.id,
                shopStatus: row.shopStatus
              })
              setActiveRowId(null)
            }}
          >
            {row.shopStatus ? "Inactive" : "Active"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation()
              handleEditStore(row)
              setActiveRowId(null)
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation()
              if (row.id) {
                handleDeleteStore(row.id)
              }
              setActiveRowId(null)
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

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

  // Outside click detection for dropdown
  const tableContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (activeRowId === null) return
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      // Only close if click is outside both the table container and any open popup/trigger
      if (
        tableContainerRef.current &&
        !tableContainerRef.current.contains(target) &&
        !target.closest('.row-action-trigger') &&
        !target.closest('.row-action-popup')
      ) {
        setActiveRowId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeRowId])

  return (
    <div className="space-y-4" ref={tableContainerRef}>
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap w-[80%] gap-2">
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
        activeRowId={activeRowId}
        setActiveRowId={setActiveRowId}
        renderRowDropdown={renderRowDropdown}
      />

      {/* add store popup */}
      <AddStorePopUp
        open={openAddStorePopUp}
        onClose={handleCloseAddStorePopUp}
        onAddStore={handleAddStore}
        isLoading={isLoading}
      />

      {/* edit store popup */}
      <EditStorePopUp
        open={editStoreOpen}
        onClose={handleCloseEditStorePopup}
        onUpdateStore={handleUpdateStore}
        isLoading={isLoading}
        storeId={selectedStoreId}
        token={token}
      />

      {/* delete confirmation popup  */}
      <AlertDialog
        open={confirmDeleteOpen}
        onOpenChange={handleCloseDeleteConfirmationPopup}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Store</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this store?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteConfirmationPopup}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStoreById}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
