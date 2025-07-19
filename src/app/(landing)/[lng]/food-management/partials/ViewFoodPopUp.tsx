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

const saveToSessionStorage = (data: any) => {
  sessionStorage.setItem(EDIT_FOOD_STORAGE_KEY, JSON.stringify(data))
}

const getFromSessionStorage = () => {
  const stored = sessionStorage.getItem(EDIT_FOOD_STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

const clearSessionStorage = () => {
  sessionStorage.removeItem(EDIT_FOOD_STORAGE_KEY)
}

interface Props {
  open: boolean
  onClose: () => void
  token: string
  foodId: number
  getFoods: () => void
}
interface Option {
  value: string
  label: string
  labelFr?: string // Add French label
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
  allowMultiLang: boolean // Add this line
  attributes: FoodAttributes
  describe: FoodDescribe
  images: FoodImage[]
  healthBenefits: HealthBenefit[]
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
  const [editedData, setEditedData] = useState<any>(null)
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  useEffect(() => {
    if (token && foodId) {
      const getfoodsDetailsByFoodId = async (): Promise<void> => {
        const response = await getFoodsById(token, foodId)
        if (response.status === 200) {
          setFoodDetails(response.data)
          // Initialize session storage with API data including foodId
          const dataWithId = { ...response.data, foodId }
          saveToSessionStorage(dataWithId)
          setEditedData(dataWithId)
          setAllowMultiLang(response.data.allowMultiLang ?? false)
        } else {
          console.error("Failed to get food details")
        }
      }
      void getfoodsDetailsByFoodId()
    }
  }, [token, foodId])

  useEffect(() => {
    if (token) {
      // Fetch categories from API
      void getCatagoryFoodType(token, "Type").then(res => {
        if (res?.status === 200 && Array.isArray(res.data)) {
          setCategoryOptionsApi(
            res.data.map((item: any) => ({
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
    if (token) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          // Fetch both food details and benefit tags in parallel
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
      fetchData()
    }
  }, [token, foodId])

  // handle delete user by id
  const handleDeleteFoodById = async (): Promise<void> => {
    const response = await deleteFoodById(token, foodId)
    if (response.status === 200 && response.data.success) {
      toast.success(response.data.message)
      onClose()
      setConfirmDeleteOpen(false)
      getFoods()
    } else {
      toast.error("Failed to delete user", {
        description: response.data.message
      })
      setConfirmDeleteOpen(false)
    }
  }

  // Refs for each RichTextEditor
  const selectionRef = useRef<RichTextEditorHandle>(null)
  const preparationRef = useRef<RichTextEditorHandle>(null)
  const conservationRef = useRef<RichTextEditorHandle>(null)

  // Shared data arrays with proper French translations
  const categories: Option[] = [
    { value: "fruits", label: "Fruits" },
    { value: "vegetables", label: "Vegetables" },
    { value: "dairy", label: "Dairy" },
    { value: "grains", label: "Grains" }
  ]

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

  // Add image upload handler
  const handleImageSelect = async (files: File[] | null): Promise<void> => {
    const file = files?.[0] ?? null
    if (file) {
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
      // Handle image removal
      updateEditedData("images", [])
      setImagePreviewUrls([])
    }
  }

  // Function to update session storage when data changes
  const updateEditedData = (field: string, value: any) => {
    const currentData = getFromSessionStorage() || editedData
    const updatedData = { ...currentData, [field]: value, foodId }
    setEditedData(updatedData)
    saveToSessionStorage(updatedData)

    // Force re-render of both components when healthBenefits change
    if (field === "healthBenefits") {
      console.log("Updating healthBenefits in main component:", value)
      // Update the foodDetails state to trigger re-render in both tabs
      setFoodDetails(prev => {
        if (!prev) return null
        const updated = {
          ...prev,
          healthBenefits: value.map((benefit: any) => ({
            healthBenefit: benefit.healthBenefit || "",
            healthBenefitFR: benefit.healthBenefitFR || ""
          }))
        }
        console.log("Updated foodDetails:", updated.healthBenefits)
        return updated
      })

      // Also update editedData to ensure consistency
      setEditedData(prev => ({
        ...prev,
        healthBenefits: value
      }))
    }
  }

  // Function to update nested data
  const updateNestedData = (
    parentField: string,
    childField: string,
    value: any
  ) => {
    const currentData = getFromSessionStorage() || editedData
    const updatedData = {
      ...currentData,
      [parentField]: {
        ...currentData[parentField],
        [childField]: value
      },
      foodId
    }
    setEditedData(updatedData)
    saveToSessionStorage(updatedData)
  }

  // API function to save changes
  const handleSaveChanges = async () => {
    const dataToSave = getFromSessionStorage()
    if (!dataToSave || !dataToSave.foodId) return

    try {
      const { foodId: savedFoodId, ...rawData } = dataToSave

      // Transform the session storage data to match CreateFoodDto format
      const updateData = {
        name: rawData.name,
        nameFR: rawData.nameFR || "",
        category: rawData.category,
        categoryFR: rawData.categoryFR || "",
        country: rawData.country,
        seasons:
          rawData.seasons?.map((season: any) => ({
            foodId: savedFoodId,
            season: season.season || season,
            seasonFR: season.seasonFR || ""
          })) || [],
        attributes: {
          fiber: Number(rawData.attributes?.fiber) || 0,
          proteins: Number(rawData.attributes?.proteins) || 0,
          vitamins: rawData.attributes?.vitamins || "",
          vitaminsFR: rawData.attributes?.vitaminsFR || "",
          minerals: rawData.attributes?.minerals || "",
          mineralsFR: rawData.attributes?.mineralsFR || "",
          fat: Number(rawData.attributes?.fat) || 0,
          sugar: Number(rawData.attributes?.sugar) || 0
        },
        describe: {
          selection: rawData.describe?.selection || "",
          selectionFR: rawData.describe?.selectionFR || "",
          preparation: rawData.describe?.preparation || "",
          preparationFR: rawData.describe?.preparationFR || "",
          conservation: rawData.describe?.conservation || "",
          conservationFR: rawData.describe?.conservationFR || ""
        },
        images:
          rawData.images?.map((img: any) => ({
            image: typeof img === "string" ? img : img.image
          })) || [],
        healthBenefits:
          rawData.healthBenefits?.map((benefit: any) => ({
            healthBenefit:
              typeof benefit === "string" ? benefit : benefit.healthBenefit,
            healthBenefitFR:
              typeof benefit === "string" ? "" : benefit.healthBenefitFR || ""
          })) || [],
        allowMultiLang: rawData.allowMultiLang || false
      }

      console.log("Saving food with ID:", savedFoodId, "Data:", updateData)

      const response = await putFoodById(token, savedFoodId, updateData)
      if (response.status === 200 || response.status === 201) {
        toast.success("Food item updated successfully!")
        clearSessionStorage()
        getFoods()
        onClose()
      } else {
        toast.error("Failed to update food item")
      }
    } catch (error) {
      toast.error("Error updating food item")
      console.error("Update error:", error)
    }
  }

  const handleClose = () => {
    clearSessionStorage()
    onClose()
  }

  // Add category/season/country synchronization function
  const handleSelectSync = (
    fieldName: "category" | "season" | "country",
    value: string,
    lang: "en" | "fr"
  ) => {
    if (fieldName === "category") {
      // Find the selected option from API categories
      const selected = categoryOptionsApi.find(
        opt => (lang === "en" ? opt.valueEn : opt.valueFr) === value
      )
      if (selected) {
        updateEditedData("category", selected.valueEn || selected.value)
        updateEditedData("categoryFR", selected.valueFr || selected.label)
      }
    }

    if (fieldName === "season") {
      // Sync season between languages
      if (lang === "en") {
        const found = seasonSyncMap.find(m => m.en === value)
        if (found) {
          updateEditedData("seasons", [
            {
              season: found.en,
              seasonFR: found.fr,
              foodId: foodDetails?.seasons?.[0]?.foodId || 0
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
              foodId: foodDetails?.seasons?.[0]?.foodId || 0
            }
          ])
        }
      }
    }

    if (fieldName === "country") {
      // Sync country between languages
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
        {isLoading ? (
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
            <DialogTitle>View Food Item</DialogTitle>

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

              {/* Render each tab's content component */}
              <ViewFoodEnglish
                selectionRef={selectionRef}
                preparationRef={preparationRef}
                conservationRef={conservationRef}
                foodDetails={editedData || foodDetails}
                categories={categoryOptionsApi}
                seasons={seasons}
                countries={countries}
                benefitTags={benefitTags}
                updateEditedData={updateEditedData}
                updateNestedData={updateNestedData}
                handleSelectSync={handleSelectSync}
                handleImageSelect={handleImageSelect}
                imagePreviewUrls={imagePreviewUrls}
              />

              {allowMultiLang && (
                <ViewFoodFranch
                  selectionRef={selectionRef}
                  preparationRef={preparationRef}
                  conservationRef={conservationRef}
                  categories={categoryOptionsApi}
                  seasons={seasons}
                  countries={countries}
                  foodDetails={editedData || foodDetails}
                  benefitTags={benefitTags}
                  updateEditedData={updateEditedData}
                  updateNestedData={updateNestedData}
                  handleSelectSync={handleSelectSync}
                  handleImageSelect={handleImageSelect}
                  imagePreviewUrls={imagePreviewUrls}
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
            <Button onClick={handleSaveChanges}>Save changes</Button>
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
