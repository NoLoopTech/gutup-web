"use client"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react"
import ViewFoodEnglish from "./ViewFoodEnglish"

import {
  deleteFoodById,
  getCatagoryFoodType,
  getFoodsById,
  postFoodTag,
  putFoodById
} from "@/app/api/foods"
import type { RichTextEditorHandle } from "@/components/Shared/TextEditor/RichTextEditor"
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
import { Button } from "@/components/ui/button"
import { uploadImageToFirebase } from "@/lib/firebaseImageUtils"
import { toast } from "sonner"
import ViewFoodFranch from "./ViewFoodFranch"

// Add session storage utilities
const EDIT_FOOD_STORAGE_KEY = "editfood-store"

interface SessionStorageData {
  foodId: number
  name?: string
  nameFR?: string
  category?: string
  categoryFR?: string
  country?: string
  allowMultiLang?: boolean
  seasons?: Array<{ season: string; seasonFR?: string; foodId?: number }>
  attributes?: {
    fiber?: number
    proteins?: number
    vitamins?: string
    vitaminsFR?: string
    minerals?: string
    mineralsFR?: string
    fat?: number
    sugar?: number
  }
  describe?: {
    selection?: string
    selectionFR?: string
    preparation?: string
    preparationFR?: string
    conservation?: string
    conservationFR?: string
  }
  images?: FoodImage[]
  healthBenefits?: Array<{
    healthBenefit: string
    healthBenefitFR?: string
  }>
  [key: string]: any
}

interface ApiCategoryItem {
  tagName: string
  tagNameFr: string
}

const saveToSessionStorage = (data: SessionStorageData): void => {
  sessionStorage.setItem(EDIT_FOOD_STORAGE_KEY, JSON.stringify(data))
}

const getFromSessionStorage = (): SessionStorageData | null => {
  const stored = sessionStorage.getItem(EDIT_FOOD_STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

const clearSessionStorage = (): void => {
  sessionStorage.removeItem(EDIT_FOOD_STORAGE_KEY)
}

interface Props {
  open: boolean
  onClose: () => void
  token: string
  foodId: number | null
  getFoods: () => void
}
interface Option {
  value: string
  label: string
  labelFr?: string
  valueEn?: string
  valueFr?: string
  labelEn?: string
}

interface FoodAttributes {
  fiber: number
  proteins: number
  vitamins: string
  minerals: string
  fat: number
  sugar: number
}

interface FoodDescribe {
  selection: string
  preparation: string
  conservation: string
}

interface FoodImage {
  image: string
}

interface HealthBenefit {
  healthBenefit: string
}

export interface FoodDetailsTypes {
  name: string
  nameFR: string
  category: string
  categoryFR: string
  country: string
  allowMultiLang: boolean
  attributes: FoodAttributes
  describe: FoodDescribe
  images: FoodImage[]
  healthBenefits: HealthBenefit[]
  seasons?: Array<{ season: string; seasonFR?: string; foodId?: number }>
}

export default function ViewFoodPopUp({
  open,
  onClose,
  token,
  foodId,
  getFoods
}: Props): JSX.Element {
  const [allowMultiLang, setAllowMultiLang] = useState(false)
  const [activeTab, setActiveTab] = useState<"english" | "french">("english")
  const [foodDetails, setFoodDetails] = useState<FoodDetailsTypes | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const [categoryOptionsApi, setCategoryOptionsApi] = useState<Option[]>([])
  const [benefitTags, setBenefitTags] = useState<
    Array<{ tagName: string; tagNameFr: string }>
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [editedData, setEditedData] = useState<SessionStorageData | null>(null)
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isDirty, setIsDirty] = useState(false)
  const initialDataRef = useRef<SessionStorageData | null>(null)

  // Track initial data for each tab
  const initialEnglishDataRef = useRef<any>(null)
  const initialFrenchDataRef = useRef<any>(null)

  useEffect(() => {
    if (open && token && foodId !== null && foodId > 0) {
      const getfoodsDetailsByFoodId = async (): Promise<void> => {
        setIsLoading(true)
        const response = await getFoodsById(token, foodId)
        if (response.status === 200) {
          setFoodDetails(response.data)
          const dataWithId: SessionStorageData = { ...response.data, foodId }
          saveToSessionStorage(dataWithId)
          setEditedData(dataWithId)
          setAllowMultiLang(response.data.allowMultiLang ?? false)
          setImagePreviewUrls(
            response.data.images?.map((img: any) => img.image) ?? []
          )
          initialDataRef.current = JSON.parse(JSON.stringify(dataWithId))
          // Set initial data for each tab
          initialEnglishDataRef.current = {
            name: dataWithId.name,
            category: dataWithId.category,
            country: dataWithId.country,
            seasons: dataWithId.seasons,
            attributes: dataWithId.attributes,
            describe: dataWithId.describe,
            images: dataWithId.images,
            healthBenefits: dataWithId.healthBenefits
          }
          initialFrenchDataRef.current = {
            nameFR: dataWithId.nameFR,
            categoryFR: dataWithId.categoryFR,
            country: dataWithId.country, // country is same, but selection is by labelFr
            seasons: dataWithId.seasons,
            attributes: {
              fiber: dataWithId.attributes?.fiber,
              proteins: dataWithId.attributes?.proteins,
              vitaminsFR: dataWithId.attributes?.vitaminsFR,
              mineralsFR: dataWithId.attributes?.mineralsFR,
              fat: dataWithId.attributes?.fat,
              sugar: dataWithId.attributes?.sugar
            },
            describe: {
              selectionFR: dataWithId.describe?.selectionFR,
              preparationFR: dataWithId.describe?.preparationFR,
              conservationFR: dataWithId.describe?.conservationFR
            },
            images: dataWithId.images,
            healthBenefits: dataWithId.healthBenefits
          }
        } else {
          setFoodDetails(null)
          setEditedData(null)
          setImagePreviewUrls([])
          setAllowMultiLang(false)
          initialDataRef.current = null
          initialEnglishDataRef.current = null
          initialFrenchDataRef.current = null
          console.error("Failed to get food details")
        }
        setIsLoading(false)
      }
      void getfoodsDetailsByFoodId()
    } else {
      initialDataRef.current = null
      initialEnglishDataRef.current = null
      initialFrenchDataRef.current = null
    }
  }, [open, token, foodId])

  // Compare current editedData with initialDataRef to set isDirty
  useEffect(() => {
    const current = editedData ?? foodDetails
    if (!current) {
      setIsDirty(false)
      return
    }
    let isChanged = false
    if (activeTab === "english") {
      const englishCurrent = {
        name: current.name,
        category: current.category,
        country: current.country,
        seasons: current.seasons,
        attributes: current.attributes,
        describe: current.describe,
        images: current.images,
        healthBenefits: current.healthBenefits
      }
      isChanged =
        JSON.stringify(englishCurrent) !==
        JSON.stringify(initialEnglishDataRef.current)
    } else if (activeTab === "french") {
      const frenchCurrent = {
        nameFR: (current as any).nameFR ?? "",
        categoryFR: (current as any).categoryFR ?? "",
        country: current.country,
        seasons: current.seasons,
        attributes: {
          fiber: current.attributes?.fiber,
          proteins: current.attributes?.proteins,
          vitaminsFR: (current.attributes as any)?.vitaminsFR ?? "",
          mineralsFR: (current.attributes as any)?.mineralsFR ?? "",
          fat: current.attributes?.fat,
          sugar: current.attributes?.sugar
        },
        describe: {
          selectionFR: (current.describe as any)?.selectionFR ?? "",
          preparationFR: (current.describe as any)?.preparationFR ?? "",
          conservationFR: (current.describe as any)?.conservationFR ?? ""
        },
        images: current.images,
        healthBenefits: current.healthBenefits
      }
      isChanged =
        JSON.stringify(frenchCurrent) !==
        JSON.stringify(initialFrenchDataRef.current)
    }
    setIsDirty(isChanged)
  }, [editedData, foodDetails, activeTab])

  useEffect(() => {
    if (token) {
      // Fetch categories from API
      void getCatagoryFoodType(token, "Type").then(res => {
        if (res?.status === 200 && Array.isArray(res.data)) {
          setCategoryOptionsApi(
            res.data.map((item: ApiCategoryItem) => ({
              value: item.tagName,
              label: item.tagName,
              valueEn: item.tagName,
              valueFr: item.tagNameFr,
              labelEn: item.tagName,
              labelFr: item.tagNameFr
            }))
          )
        }
      })
    }
  }, [token])

  // Update the useEffect for fetching benefit tags
  useEffect(() => {
    if (token && foodId !== null && foodId > 0) {
      const fetchData = async (): Promise<void> => {
        setIsLoading(true)
        try {
          const [foodResponse, benefitsResponse] = await Promise.all([
            getFoodsById(token, foodId),
            getCatagoryFoodType(token, "Benefit")
          ])

          if (foodResponse.status === 200) {
            setFoodDetails(foodResponse.data)
          }

          if (
            benefitsResponse?.status === 200 &&
            Array.isArray(benefitsResponse.data)
          ) {
            setBenefitTags(benefitsResponse.data)
          }
        } catch (error) {
          console.error("Failed to fetch data:", error)
        } finally {
          setIsLoading(false)
        }
      }
      void fetchData()
    }
  }, [token, foodId])

  // handle delete user by id
  const handleDeleteFoodById = async (): Promise<void> => {
    if (foodId === null || foodId <= 0) return

    try {
      const response = await deleteFoodById(token, foodId)

      if (response.error) {
        toast.error("Failed to delete food", {
          description: response.data?.message || "An error occurred"
        })
        setConfirmDeleteOpen(false)
        return
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Food deleted successfully")
        clearSessionStorage()
        onClose()
        setConfirmDeleteOpen(false)
        getFoods()
      } else {
        toast.error("Failed to delete food", {
          description: response.data?.message || "Unknown error"
        })
        setConfirmDeleteOpen(false)
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete food", {
        description: "An unexpected error occurred"
      })
      setConfirmDeleteOpen(false)
    }
  }

  // Refs for each RichTextEditor
  const selectionRef = useRef<RichTextEditorHandle>(null)
  const preparationRef = useRef<RichTextEditorHandle>(null)
  const conservationRef = useRef<RichTextEditorHandle>(null)

  // Add translation mapping for seasons
  const seasonSyncMap = [
    { en: "January", fr: "Janvier", frLabel: "Janvier" },
    { en: "February", fr: "Février", frLabel: "Février" },
    { en: "March", fr: "Mars", frLabel: "Mars" },
    { en: "April", fr: "Avril", frLabel: "Avril" },
    { en: "May", fr: "Mai", frLabel: "Mai" },
    { en: "June", fr: "Juin", frLabel: "Juin" },
    { en: "July", fr: "Juillet", frLabel: "Juillet" },
    { en: "August", fr: "Août", frLabel: "Août" },
    { en: "September", fr: "Septembre", frLabel: "Septembre" },
    { en: "October", fr: "Octobre", frLabel: "Octobre" },
    { en: "November", fr: "Novembre", frLabel: "Novembre" },
    { en: "December", fr: "Décembre", frLabel: "Décembre" }
  ]

  const seasons: Option[] = [
    { value: "January", label: "January", labelFr: "Janvier" },
    { value: "February", label: "February", labelFr: "Février" },
    { value: "March", label: "March", labelFr: "Mars" },
    { value: "April", label: "April", labelFr: "Avril" },
    { value: "May", label: "May", labelFr: "Mai" },
    { value: "June", label: "June", labelFr: "Juin" },
    { value: "July", label: "July", labelFr: "Juillet" },
    { value: "August", label: "August", labelFr: "Août" },
    { value: "September", label: "September", labelFr: "Septembre" },
    { value: "October", label: "October", labelFr: "Octobre" },
    { value: "November", label: "November", labelFr: "Novembre" },
    { value: "December", label: "December", labelFr: "Décembre" }
  ]

  const countries: Option[] = [
    { value: "switzerland", label: "Switzerland", labelFr: "Suisse" },
    { value: "france", label: "France", labelFr: "France" },
    { value: "germany", label: "Germany", labelFr: "Allemagne" },
    { value: "italy", label: "Italy", labelFr: "Italie" }
  ]

  // handle open delete confirmation popup
  const handleOpenDeleteConfirmationPopup = (): void => {
    setConfirmDeleteOpen(true)
  }
  // handle close delete confirmation popup
  const handleCloseDeleteConfirmationPopup = (): void => {
    setConfirmDeleteOpen(false)
  }

  // Function to update session storage when data changes
  const updateEditedData = (field: string, value: any): void => {
    if (foodId === null) return

    const currentData = getFromSessionStorage() ?? editedData
    const updatedData: SessionStorageData = {
      ...currentData,
      [field]: value,
      foodId
    }
    setEditedData(updatedData)
    saveToSessionStorage(updatedData)

    // Force re-render of both components when healthBenefits change
    if (field === "healthBenefits" && Array.isArray(value)) {
      setFoodDetails(prev => {
        if (!prev) return null
        const updated = {
          ...prev,
          healthBenefits: value.map(
            (benefit: {
              healthBenefit?: string
              healthBenefitFR?: string
            }) => ({
              healthBenefit: benefit.healthBenefit ?? "",
              healthBenefitFR: benefit.healthBenefitFR ?? ""
            })
          )
        }
        return updated
      })

      setEditedData(prev =>
        prev
          ? {
              ...prev,
              healthBenefits: value as Array<{
                healthBenefit: string
                healthBenefitFR?: string
              }>
            }
          : null
      )
    }
  }

  // Function to update nested data
  const updateNestedData = (
    parentField: string,
    childField: string,
    value: any
  ): void => {
    if (foodId === null) return

    const currentData = getFromSessionStorage() ?? editedData
    const updatedData: SessionStorageData = {
      ...currentData,
      [parentField]: {
        ...((currentData?.[parentField] as Record<string, unknown>) ?? {}),
        [childField]: value
      },
      foodId
    }
    setEditedData(updatedData)
    saveToSessionStorage(updatedData)
  }

  // Add image upload handler
  const handleImageChange = async (files: File[] | null): Promise<void> => {
    const file = files?.[0] ?? null
    if (file) {
      if (foodId === null || foodId <= 0) {
        toast.error("Invalid food ID")
        return
      }

      try {
        setIsLoading(true)

        // Upload image to Firebase
        const imageUrl = await uploadImageToFirebase(
          file,
          "edit-food",
          `${foodId}_${file.name}`
        )

        // Update session storage with the new image URL
        updateEditedData("images", [{ image: imageUrl }])
        setImagePreviewUrls([imageUrl])
      } catch (error) {
        toast.error("Image upload failed. Please try again.")
        console.error("Firebase upload error:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      updateEditedData("images", [])
      setImagePreviewUrls([])
    }
  }

  // API function to save changes
  const handleSaveChanges = async (): Promise<void> => {
    const dataToSave = getFromSessionStorage()
    if (!dataToSave?.foodId) return

    try {
      const { foodId: savedFoodId, ...rawData } = dataToSave

      // Get pending new benefits from session storage
      const pendingBenefits = JSON.parse(
        sessionStorage.getItem("pendingNewBenefits") ?? "[]"
      ) as Array<{ tagName: string; tagNameFr: string }>

      if (pendingBenefits.length > 0) {
        const benefitResponse = await getCatagoryFoodType(token, "Benefit")
        const existingTags = Array.isArray(benefitResponse?.data)
          ? benefitResponse.data.map((b: any) => b.tagName)
          : []

        // Add only new benefits that don't exist
        for (const benefit of pendingBenefits) {
          if (!existingTags.includes(benefit.tagName)) {
            try {
              const response = await postFoodTag(token, {
                tagName: benefit.tagName,
                tagNameFr: benefit.tagNameFr
              })

              if (response.status === 200 || response.status === 201) {
                // Optionally handle success, or leave empty
              }
            } catch (error) {
              console.error(
                `Failed to add benefit "${benefit.tagName}" to database:`,
                error
              )
            }
          }
        }

        // Clear pending benefits after adding to database
        sessionStorage.removeItem("pendingNewBenefits")
      }

      // Transform the session storage data
      const updateData = {
        name: rawData.name ?? "",
        nameFR: rawData.nameFR ?? "",
        category: rawData.category ?? "",
        categoryFR: rawData.categoryFR ?? "",
        country: rawData.country ?? "",
        seasons:
          rawData.seasons?.map(season => ({
            foodId: savedFoodId,
            season: season.season ?? "",
            seasonFR: season.seasonFR ?? ""
          })) ?? [],
        attributes: {
          fiber: Number(rawData.attributes?.fiber) ?? 0,
          proteins: Number(rawData.attributes?.proteins) ?? 0,
          vitamins: rawData.attributes?.vitamins ?? "",
          vitaminsFR: rawData.attributes?.vitaminsFR ?? "",
          minerals: rawData.attributes?.minerals ?? "",
          mineralsFR: rawData.attributes?.mineralsFR ?? "",
          fat: Number(rawData.attributes?.fat) ?? 0,
          sugar: Number(rawData.attributes?.sugar) ?? 0
        },
        describe: {
          selection: rawData.describe?.selection ?? "",
          selectionFR: rawData.describe?.selectionFR ?? "",
          preparation: rawData.describe?.preparation ?? "",
          preparationFR: rawData.describe?.preparationFR ?? "",
          conservation: rawData.describe?.conservation ?? "",
          conservationFR: rawData.describe?.conservationFR ?? ""
        },
        images:
          rawData.images?.map(img => ({
            image: typeof img === "string" ? img : img.image
          })) ?? [],
        healthBenefits:
          rawData.healthBenefits?.map(benefit => ({
            healthBenefit: benefit.healthBenefit ?? "",
            healthBenefitFR: benefit.healthBenefitFR ?? ""
          })) ?? [],
        allowMultiLang: rawData.allowMultiLang ?? false
      }

      const response = await putFoodById(token, savedFoodId, updateData)
      if (response.status === 200 || response.status === 201) {
        toast.success("Food item updated successfully!")
        clearSessionStorage()
        getFoods()
        onClose()
        setIsDirty(false)
      } else {
        toast.error("Failed to update food item")
      }
    } catch (error) {
      toast.error("Error updating food item")
      console.error("Update error:", error)
    }
  }

  const handleClose = (): void => {
    clearSessionStorage()
    sessionStorage.removeItem("pendingNewBenefits")
    setEditedData(null)
    setImagePreviewUrls([])
    setFoodDetails(null)
    setIsLoading(true)
    setIsDirty(false) // Reset dirty on close
    onClose()
  }

  // Add category/season/country synchronization function
  const handleSelectSync = (
    fieldName: "category" | "season" | "country",
    value: string,
    lang: "en" | "fr"
  ): void => {
    if (fieldName === "category") {
      const selected = categoryOptionsApi.find(
        opt => (lang === "en" ? opt.valueEn : opt.valueFr) === value
      )
      if (selected) {
        updateEditedData("category", selected.valueEn ?? selected.value)
        updateEditedData("categoryFR", selected.labelFr ?? selected.label)
      }
    }

    if (fieldName === "season") {
      if (lang === "en") {
        const found = seasonSyncMap.find(m => m.en === value)
        if (found) {
          updateEditedData("seasons", [
            {
              season: found.en,
              seasonFR: found.fr,
              foodId: foodDetails?.seasons?.[0]?.foodId ?? 0
            }
          ])
        }
      } else if (lang === "fr") {
        const found = seasonSyncMap.find(m => m.fr === value)
        if (found) {
          updateEditedData("seasons", [
            {
              season: found.en,
              seasonFR: found.fr,
              foodId: foodDetails?.seasons?.[0]?.foodId ?? 0
            }
          ])
        }
      }
    }

    if (fieldName === "country") {
      const countryOption = countries.find(c =>
        lang === "en" ? c.value === value.toLowerCase() : c.labelFr === value
      )
      if (countryOption) {
        updateEditedData("country", countryOption.value)
      }
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) {
          handleClose()
        }
      }}
    >
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        {isLoading || (!foodDetails && !editedData) ? (
          <div className="flex items-center justify-center h-full">
            Loading...
          </div>
        ) : (
          <div
            className="h-full p-2 overflow-y-auto"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none" // IE/Edge
            }}
          >
            <DialogTitle>View / Edit Food Item</DialogTitle>
            <Tabs
              value={activeTab}
              onValueChange={val => {
                setActiveTab(val as "english" | "french")
              }}
              className="w-full"
            >
              <div className="flex flex-col items-start justify-between gap-4 mt-4 mb-6 sm:flex-row sm:items-center">
                <TabsList>
                  <TabsTrigger value="english">English</TabsTrigger>
                  {allowMultiLang && (
                    <TabsTrigger value="french">French</TabsTrigger>
                  )}
                </TabsList>
                <div className="flex items-center gap-2">
                  <Switch
                    id="multi-lang"
                    checked={allowMultiLang}
                    onCheckedChange={val => {
                      setAllowMultiLang(val)
                      updateEditedData("allowMultiLang", val)
                      if (!val) setActiveTab("english")
                    }}
                  />
                  <Label htmlFor="multi-lang" className="text-Primary-300">
                    Allow Multi Lang
                  </Label>
                </div>
              </div>
              <ViewFoodEnglish
                key={editedData?.foodId ?? "empty-english"}
                selectionRef={selectionRef}
                preparationRef={preparationRef}
                conservationRef={conservationRef}
                foodDetails={
                  (editedData ?? foodDetails) as FoodDetailsTypes | null
                }
                categories={categoryOptionsApi}
                seasons={seasons}
                countries={countries}
                benefitTags={benefitTags}
                updateEditedData={updateEditedData}
                updateNestedData={updateNestedData}
                handleSelectSync={handleSelectSync}
                handleImageSelect={handleImageChange}
                imagePreviewUrls={imagePreviewUrls}
                token={token}
              />
              {allowMultiLang && (
                <ViewFoodFranch
                  key={editedData?.foodId ?? "empty-french"}
                  selectionRef={selectionRef}
                  preparationRef={preparationRef}
                  conservationRef={conservationRef}
                  categories={categoryOptionsApi}
                  seasons={seasons}
                  countries={countries}
                  foodDetails={
                    (editedData ?? foodDetails) as NonNullable<
                      Parameters<typeof ViewFoodFranch>[0]
                    >["foodDetails"]
                  }
                  benefitTags={benefitTags}
                  updateEditedData={updateEditedData}
                  updateNestedData={updateNestedData}
                  handleSelectSync={handleSelectSync}
                  handleImageSelect={handleImageChange}
                  imagePreviewUrls={imagePreviewUrls}
                  token={token}
                />
              )}
            </Tabs>
          </div>
        )}

        <DialogFooter>
          <div className="flex justify-between w-full gap-2">
            <Button
              variant="outline"
              onClick={handleOpenDeleteConfirmationPopup}
            >
              Delete Food
            </Button>
            <Button onClick={handleSaveChanges} disabled={!isDirty}>
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* delete confirmation popup  */}
      <AlertDialog
        open={confirmDeleteOpen}
        onOpenChange={handleCloseDeleteConfirmationPopup}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Food</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this food?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteConfirmationPopup}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFoodById}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
