"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ViewFoodEnglish from "./ViewFoodEnglish"

import type { RichTextEditorHandle } from "@/components/Shared/TextEditor/RichTextEditor"
import ViewFoodFranch from "./ViewFoodFranch"
import { deleteFoodById, getFoodsById } from "@/app/api/foods"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
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
  category: string
  season: string
  country: string
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

  useEffect(() => {
    if (token && foodId) {
      const getfoodsDetailsByFoodId = async (): Promise<void> => {
        const response = await getFoodsById(token, foodId)
        if (response.status === 200) {
          setFoodDetails(response.data)
        } else {
          console.error("Failed to get user details")
        }
      }
      void getfoodsDetailsByFoodId()
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

  // Shared data arrays
  const categories: Option[] = [
    { value: "fruits", label: "Fruits" },
    { value: "vegetables", label: "Vegetables" },
    { value: "dairy", label: "Dairy" },
    { value: "grains", label: "Grains" }
  ]
  const seasons: Option[] = [
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "autumn", label: "Autumn" },
    { value: "winter", label: "Winter" }
  ]
  const countries: Option[] = [
    { value: "switzerland", label: "Switzerland" },
    { value: "france", label: "France" },
    { value: "germany", label: "Germany" },
    { value: "italy", label: "Italy" }
  ]

  // handle open delete confirmation popup
  const handleOpenDeleteConfirmationPopup = (): void => {
    setConfirmDeleteOpen(true)
  }
  // handle close delete confirmation popup
  const handleCloseDeleteConfirmationPopup = (): void => {
    setConfirmDeleteOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="h-full p-2 overflow-y-auto"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none" // IE/Edge
          }}
        >
          <DialogTitle>Add New Food Item</DialogTitle>

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
              foodDetails={foodDetails ?? null}
            />

            {allowMultiLang && (
              <ViewFoodFranch
                categories={categories}
                seasons={seasons}
                countries={countries}
                selectionRef={selectionRef}
                preparationRef={preparationRef}
                conservationRef={conservationRef}
              />
            )}
          </Tabs>
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full gap-2">
            <Button
              variant="outline"
              onClick={handleOpenDeleteConfirmationPopup}
            >
              Delete Food
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
