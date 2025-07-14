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
import { useState, useEffect, useMemo } from "react"
import { AddNewStore, getAllStores, deleteStoreById, updateStoreById } from "@/app/api/store"
import { Badge } from "@/components/ui/badge"
import AddStorePopUp from "./AddStorePopUp"
import { Label } from "@/components/ui/label"
import { useStoreStore } from "@/stores/useStoreStore"
import { uploadImageToFirebase } from "@/lib/firebaseImageUtils"
import {
  transformStoreDataToApiRequest,
  type translationsTypes,
  defaultTranslations,
  type StoreManagementDataType
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
import ViewStorePopUp from "./ViewStorePopUp"
import EditStorePopUp from "./EditStorePopUp"

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
  const [viewStoreOpen, setViewStoreOpen] = useState<boolean>(false)
  const [editStoreOpen, setEditStoreOpen] = useState<boolean>(false)
  const [, setSelectedStoreForView] = useState<StoreManagementDataType | null>(
    null
  )
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null)
  const [storeId, setStoreId] = useState<number>(0)
  const [translations, setTranslations] =
    useState<translationsTypes>(defaultTranslations)

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
      // Convert data URL or blob URL to Blob
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

      // Transform availData to ingAndCatData format
      const ingAndCatData =
        storeData[activeLang]?.availData?.map((item: any) => ({
          name: item.name,
          nameFR: allowMultiLang
            ? storeData.fr?.availData?.find(
                (frItem: any) => frItem.id === item.id
              )?.name || item.name
            : item.name,
          type: item.type.toLowerCase(),
          typeFR: allowMultiLang
            ? storeData.fr?.availData?.find(
                (frItem: any) => frItem.id === item.id
              )?.type?.toLowerCase() ||
              (item.type.toLowerCase() === "ingredient"
                ? "ingrédient"
                : "catégorie")
            : item.type.toLowerCase(),
          availability: item.status === "Active",
          display: item.display
        })) || []

      const requestBody = {
        ...transformedData,
        descriptionFR: allowMultiLang
          ? storeData.fr?.about || transformedData.description
          : transformedData.description,
        categoryFR: allowMultiLang
          ? storeData.fr?.category || transformedData.category
          : transformedData.category,
        ingAndCatData,
        categories: [],
        ingredients: [],
        allowMultiLang
      }

      const existingPhone = stores.some(
        store => store.phoneNumber === requestBody.phoneNumber
      )
      const existingEmail = stores.some(
        store => store.email === requestBody.email
      )

      if (existingPhone && existingEmail) {
        toast.error(translations.phoneEmailAlreadyExists)
        return
      } else if (existingPhone) {
        toast.error(translations.phoneAlreadyExists)
        return
      } else if (existingEmail) {
        toast.error(translations.emailAlreadyExists)
        return
      }

      const response = await AddNewStore(token, requestBody)

      if (response?.data) {
        toast.success(
          translations.formSubmittedSuccessfully || "Store added successfully"
        )
        setOpenAddStorePopUp(false)
        await getStores()
        resetForm()
        sessionStorage.removeItem("store-store")
      } else {
        console.error("Unexpected response structure:", response)
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

  // handle view store
  const handleViewStore = (store: StoreManagementDataType): void => {
    setSelectedStoreForView(store)
    setSelectedStoreId(store.id ?? null)
    setViewStoreOpen(true)
  }

  // handle close view store popup
  const handleCloseViewStorePopup = (): void => {
    setViewStoreOpen(false)
    setSelectedStoreForView(null)
    setSelectedStoreId(null)
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

      // Get current store and build update request
      const transformedData = transformStoreDataToApiRequest(
        storeData,
        activeLang,
        allowMultiLang
      )

      // Transform availData to ingAndCatData format
      const ingAndCatData =
        storeData[activeLang]?.availData?.map((item: any) => ({
          name: item.name,
          nameFR: allowMultiLang
            ? storeData.fr?.availData?.find(
                (frItem: any) => frItem.id === item.id
              )?.name || item.name
            : item.name,
          type: item.type.toLowerCase(),
          typeFR: allowMultiLang
            ? item.type.toLowerCase() === "ingredient"
              ? "ingrédient"
              : "catégorie"
            : item.type.toLowerCase(),
          availability: item.status === "Active",
          display: item.display
        })) || []

      const requestBody = {
        ...transformedData,
        ingAndCatData,
        allowMultiLang
      }

      const response = await updateStoreById(token, selectedStoreId, requestBody)

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

  const columns: Column<StoreManagementDataType>[] = [
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
          {row.ingAndCatData?.length ?? 0} Available
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
            <DropdownMenuItem
              onClick={() => {
                handleViewStore(row)
              }}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleEditStore(row)
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (row.id) {
                  handleDeleteStore(row.id)
                }
              }}
            >
              Delete
            </DropdownMenuItem>
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

      {/* add store popup */}
      <AddStorePopUp
        open={openAddStorePopUp}
        onClose={handleCloseAddStorePopUp}
        onAddStore={handleAddStore}
        isLoading={isLoading}
      />

      {/* view store popup */}
      <ViewStorePopUp
        open={viewStoreOpen}
        onClose={handleCloseViewStorePopup}
        storeId={selectedStoreId}
        token={token}
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
