"use client"

import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import LableInput from "@/components/Shared/LableInput/LableInput"
import type { RichTextEditorHandle } from "@/components/Shared/TextEditor/RichTextEditor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { TabsContent } from "@/components/ui/tabs"
import { useTranslation } from "@/query/hooks/useTranslation"
import dynamic from "next/dynamic"
import React, { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)

interface ViewFoodFrenchProps {
  selectionRef: React.Ref<RichTextEditorHandle>
  preparationRef: React.Ref<RichTextEditorHandle>
  conservationRef: React.Ref<RichTextEditorHandle>
  categories: Array<{
    value: string
    label: string
    valueEn?: string
    valueFr?: string
    labelEn?: string
    labelFr?: string
  }>
  seasons: Array<{
    value: string
    label: string
    labelFr?: string
  }>
  countries: Array<{ value: string; label: string; labelFr?: string }>
  foodDetails?: {
    name: string
    nameFR: string
    category: string
    categoryFR: string
    country: string
    seasons: Array<{
      season: string
      seasonFR: string
      foodId: number
    }>
    attributes: {
      fiber: string
      fiberFR: string
      proteins: string
      proteinsFR: string
      vitamins: string
      vitaminsFR: string
      minerals: string
      mineralsFR: string
      fat: string
      fatFR: string
      sugar: string
      sugarFR: string
    }
    describe: {
      selection: string
      selectionFR: string
      preparation: string
      preparationFR: string
      conservation: string
      conservationFR: string
    }
    healthBenefits: Array<{
      healthBenefit: string
      healthBenefitFR: string
    }>
    images: Array<{
      image: string
    }>
  }
  benefitTags: Array<{ tagName: string; tagNameFr: string }>
  updateEditedData: (field: string, value: any) => void
  updateNestedData: (
    parentField: string,
    childField: string,
    value: any
  ) => void
  handleSelectSync: (
    fieldName: "category" | "season" | "country",
    value: string,
    lang: "en" | "fr"
  ) => void
  handleImageSelect: (files: File[] | null) => Promise<void>
  imagePreviewUrls: string[]
  token: string
}

export default function ViewFoodFrench({
  selectionRef,
  preparationRef,
  conservationRef,
  categories,
  seasons,
  countries,
  foodDetails,
  benefitTags,
  updateEditedData,
  updateNestedData,
  handleSelectSync,
  handleImageSelect,
  imagePreviewUrls,
  token
}: ViewFoodFrenchProps): JSX.Element {
  const { translateText } = useTranslation()
  const [pendingNewBenefitsFr, setPendingNewBenefitsFr] = useState<
    Array<{ tagName: string; tagNameFr: string }>
  >([])

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    season: [] as string[],
    country: "",
    fiber: "",
    proteins: "",
    vitamins: "",
    minerals: "",
    fat: "",
    sugar: "",
    benefits: [] as string[]
  })

  // Dropdown open state for months
  const [isMonthsDropdownOpen, setIsMonthsDropdownOpen] = useState(false)

  // Click-away handler for dropdown
  React.useEffect(() => {
    if (!isMonthsDropdownOpen) return
    function handleClick(e: MouseEvent): void {
      const dropdown = document.getElementById("months-dropdown-fr")
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setIsMonthsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [isMonthsDropdownOpen])

  const [, setLocalSeasons] = useState(foodDetails?.seasons ?? [])

  useEffect(() => {
    // Reset local state when foodDetails changes
    setLocalSeasons(foodDetails?.seasons ?? [])
  }, [foodDetails])

  useEffect(() => {
    if (foodDetails) {
      // Find the French equivalent of the country
      const countryFr =
        countries.find(c => c.value === foodDetails.country)?.labelFr ??
        foodDetails.country ??
        ""
      // For season, use array of seasonFR
      setFormData({
        name: foodDetails.nameFR || "",
        category: foodDetails.categoryFR || "",
        season: foodDetails.seasons?.map(s => s.seasonFR) || [],
        country: countryFr,
        fiber: foodDetails.attributes?.fiberFR || "",
        proteins: foodDetails.attributes?.proteinsFR || "",
        vitamins: foodDetails.attributes?.vitaminsFR || "",
        minerals: foodDetails.attributes?.mineralsFR || "",
        fat: foodDetails.attributes?.fatFR || "",
        sugar: foodDetails.attributes?.sugarFR || "",
        benefits:
          foodDetails.healthBenefits
            ?.map(b => b.healthBenefitFR)
            .filter(Boolean) || []
      })
    }
  }, [foodDetails, countries])

  const handleInputChange = (field: string, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Update session storage based on field type
    switch (field) {
      case "name":
        updateEditedData("nameFR", value)
        break
      case "fiber":
        updateNestedData("attributes", "fiberFR", value)
        break
      case "proteins":
        updateNestedData("attributes", "proteinsFR", value)
        break
      case "fat":
        updateNestedData("attributes", "fatFR", value)
        break
      case "sugar":
        updateNestedData("attributes", "sugarFR", value)
        break

      case "vitamins":
        updateNestedData("attributes", "vitaminsFR", value)
        break
      case "minerals":
        updateNestedData("attributes", "mineralsFR", value)
        break
    }
  }

  // New function to handle select changes with sync
  const handleSelectChange = (
    field: "category" | "season" | "country",
    value: string
  ): void => {
    setFormData(prev => ({ ...prev, [field]: value }))
    handleSelectSync(field, value, "fr")
  }

  // Modified to not add to database immediately
  const handleAddNewBenefit = async (
    benefit: string
  ): Promise<{ tagName: string; tagNameFr: string }> => {
    try {
      const tagName = await translateText(benefit)
      const newBenefit = { tagName, tagNameFr: benefit }

      setPendingNewBenefitsFr(prev => [...prev, newBenefit])

      return newBenefit
    } catch (error) {
      console.error("Error translating new benefit:", error)
      const newBenefit = { tagName: benefit, tagNameFr: benefit }
      setPendingNewBenefitsFr(prev => [...prev, newBenefit])
      return newBenefit
    }
  }

  // Store pending benefits in session storage
  React.useEffect(() => {
    if (pendingNewBenefitsFr.length > 0) {
      const existing = JSON.parse(
        sessionStorage.getItem("pendingNewBenefits") ?? "[]"
      )
      const combined = [...existing, ...pendingNewBenefitsFr]
      // Remove duplicates
      const unique = combined.filter(
        (benefit, index, self) =>
          index === self.findIndex(b => b.tagName === benefit.tagName)
      )
      sessionStorage.setItem("pendingNewBenefits", JSON.stringify(unique))
    }
  }, [pendingNewBenefitsFr])

  return (
    <TabsContent value="french">
      {/* French Tab Content */}
      <div className="grid grid-cols-1 gap-4 mb-5 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Label className="block mb-2 text-black">Nom</Label>
          <Input
            placeholder="Entrez le nom de l'aliment"
            value={formData.name}
            onChange={e => {
              handleInputChange("name", e.target.value)
            }}
          />
        </div>
        <div>
          <Label className="block mb-2 text-black">Catégorie</Label>
          <Select
            value={formData.category}
            onValueChange={value => {
              handleSelectChange("category", value)
            }}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {[...categories]
                .sort((a, b) =>
                  (a.labelFr ?? a.label).localeCompare(b.labelFr ?? b.label)
                )
                .map(option => (
                  <SelectItem
                    key={option.value}
                    value={
                      option.valueFr && option.valueFr.trim() !== ""
                        ? option.valueFr
                        : option.value || option.label
                    }
                  >
                    {option.labelFr ??
                      option.label.charAt(0).toUpperCase() +
                        option.label.slice(1)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block mb-1 text-black">Mois</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`overflow-x-auto overflow-y-hidden justify-between w-full mt-1 ${
                  (foodDetails?.seasons?.map(s => s.seasonFR) ?? []).length ===
                  0
                    ? "text-gray-500 font-normal hover:text-gray-500"
                    : ""
                }`}
                style={{ scrollbarWidth: "none" }}
              >
                {(foodDetails?.seasons?.map(s => s.seasonFR) ?? []).length > 0
                  ? foodDetails?.seasons?.map(s => s.seasonFR).join(", ")
                  : "Sélectionner des mois"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-full overflow-auto max-h-64"
              style={{ scrollbarWidth: "none" }}
            >
              <DropdownMenuItem
                onSelect={e => {
                  e.preventDefault()
                  const allMonthValues = seasons.map(m => m.labelFr ?? m.label)
                  const selectedMonths = formData.season
                  const isAllSelected = allMonthValues.every(m =>
                    selectedMonths.includes(m)
                  )
                  const updated = isAllSelected ? [] : allMonthValues
                  const newSeasons = updated.map(frMonth => {
                    const found = seasons.find(
                      m => (m.labelFr ?? m.label) === frMonth
                    )
                    return {
                      season: found?.label ?? frMonth,
                      seasonFR: frMonth,
                      foodId: foodDetails?.seasons?.[0]?.foodId ?? 0
                    }
                  })
                  updateEditedData("seasons", newSeasons)
                  setFormData(prev => ({
                    ...prev,
                    season: updated
                  }))
                }}
                className="cursor-pointer flex items-center gap-2 font-semibold text-xs text-muted-foreground"
              >
                <span className="flex items-center justify-center w-4 h-4">
                  {seasons.every(m =>
                    formData.season.includes(m.labelFr ?? m.label)
                  ) && (
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                <span>Tous les mois</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {seasons.map(month => {
                const selectedMonths = formData.season
                const isSelected = selectedMonths.includes(
                  month.labelFr ?? month.label
                )
                return (
                  <DropdownMenuItem
                    key={month.value}
                    onSelect={e => {
                      e.preventDefault()
                      let updated = [...selectedMonths]
                      if (isSelected) {
                        updated = updated.filter(
                          m => m !== (month.labelFr ?? month.label)
                        )
                      } else {
                        updated = [...updated, month.labelFr ?? month.label]
                      }
                      const newSeasons = updated.map(frMonth => {
                        const found = seasons.find(
                          m => (m.labelFr ?? m.label) === frMonth
                        )
                        return {
                          season: found?.label ?? frMonth,
                          seasonFR: frMonth,
                          foodId: foodDetails?.seasons?.[0]?.foodId ?? 0
                        }
                      })
                      updateEditedData("seasons", newSeasons)
                      setFormData(prev => ({
                        ...prev,
                        season: updated
                      }))
                    }}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <span className="flex items-center justify-center w-4 h-4">
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                    <span>{month.labelFr ?? month.label}</span>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Label className="block mb-2 text-black">Pays</Label>
          <Select
            value={formData.country}
            onValueChange={value => {
              handleSelectChange("country", value)
            }}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Sélectionner un pays" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(option => (
                <SelectItem
                  key={option.value}
                  value={
                    option.labelFr && option.labelFr.trim() !== ""
                      ? option.labelFr
                      : option.value || option.label
                  }
                >
                  {option.labelFr ?? option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-2" />

      <h3 className="mb-4 text-lg font-semibold text-black">
        Attributs alimentaires
      </h3>
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Label className="block mb-2 text-black">Fibres</Label>
          <Input
            placeholder="Fournir des détails le cas échéant"
            value={formData.fiber}
            onChange={e => {
              handleInputChange("fiber", e.target.value)
            }}
          />
        </div>
        <div>
          <Label className="block mb-2 text-black">Protéines</Label>
          <Input
            placeholder="Fournir des détails le cas échéant"
            value={formData.proteins}
            onChange={e => {
              handleInputChange("proteins", e.target.value)
            }}
          />
        </div>
        <div>
          <Label className="block mb-2 text-black">Vitamines</Label>
          <Input
            placeholder="Détails du fournisseur si applicable"
            value={formData.vitamins}
            onChange={e => {
              handleInputChange("vitamins", e.target.value)
            }}
          />
        </div>
        <div>
          <Label className="block mb-2 text-black">Minéraux</Label>
          <Input
            placeholder="Détails du fournisseur si applicable"
            value={formData.minerals}
            onChange={e => {
              handleInputChange("minerals", e.target.value)
            }}
          />
        </div>
        <div>
          <Label className="block mb-2 text-black">Graisses</Label>
          <Input
            placeholder="Indiquez la quantité si applicable"
            value={formData.fat}
            onChange={e => {
              handleInputChange("fat", e.target.value)
            }}
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Sucres</Label>
          <Input
            placeholder="Indiquez la quantité si applicable"
            value={formData.sugar}
            onChange={e => {
              handleInputChange("sugar", e.target.value)
            }}
          />
        </div>
      </div>

      <div className="w-[100%]">
        <LableInput
          title="Bienfaits pour la santé"
          placeholder="Ajoutez jusqu'à 6 bienfaits alimentaires ou moins"
          benefits={formData.benefits}
          name="benefits"
          width="w-[32%]"
          disable={false}
          suggestions={benefitTags}
          activeLang="fr"
          onAddNewBenefit={handleAddNewBenefit}
          onSelectSuggestion={benefit => {
            const currentData = foodDetails?.healthBenefits ?? []

            const updatedHealthBenefits = [
              ...currentData,
              {
                healthBenefit: benefit.tagName,
                healthBenefitFR: benefit.tagNameFr
              }
            ]

            updateEditedData("healthBenefits", updatedHealthBenefits)
          }}
          onRemoveBenefit={removed => {
            const currentData = foodDetails?.healthBenefits ?? []

            const updatedHealthBenefits = currentData.filter(
              b =>
                b.healthBenefit !== removed.tagName &&
                b.healthBenefitFR !== removed.tagNameFr
            )

            updateEditedData("healthBenefits", updatedHealthBenefits)
            setPendingNewBenefitsFr(prev =>
              prev.filter(p => p.tagNameFr !== removed.tagNameFr)
            )
          }}
          onChange={(newBenefits: string[]) => {
            const currentData = foodDetails?.healthBenefits ?? []
            const healthBenefits = newBenefits.map((benefit, index) => ({
              healthBenefit: currentData[index]?.healthBenefit || "",
              healthBenefitFR: benefit
            }))

            updateEditedData("healthBenefits", healthBenefits)
            setFormData(prev => ({ ...prev, benefits: newBenefits }))
          }}
        />
      </div>

      <Separator className="my-2" />

      <h3 className="mb-4 text-lg font-semibold text-black">
        Décrire l'aliment
      </h3>
      <div className="flex flex-col gap-6">
        <div>
          <span className="block mb-2 text-sm text-black">Sélection</span>
          <RichTextEditor
            ref={selectionRef}
            initialContent={foodDetails?.describe?.selectionFR ?? ""}
            onChange={content => {
              updateNestedData("describe", "selectionFR", content)
            }}
          />
        </div>
        <div>
          <span className="block mb-2 text-sm text-black">Préparation</span>
          <RichTextEditor
            ref={preparationRef}
            initialContent={foodDetails?.describe?.preparationFR ?? ""}
            onChange={content => {
              updateNestedData("describe", "preparationFR", content)
            }}
          />
        </div>
        <div>
          <span className="block mb-2 text-sm text-black">Conservation</span>
          <RichTextEditor
            ref={conservationRef}
            initialContent={foodDetails?.describe?.conservationFR ?? ""}
            onChange={content => {
              updateNestedData("describe", "conservationFR", content)
            }}
          />
        </div>
      </div>

      <div className="w-full pb-6 mt-6 sm:w-2/5">
        <h3 className="mb-4 text-lg font-semibold text-black">
          Télécharger des images
        </h3>
        <ImageUploader
          title="Sélectionnez des images pour votre aliment"
          onChange={handleImageSelect}
          previewUrls={
            imagePreviewUrls.length > 0
              ? imagePreviewUrls
              : foodDetails?.images?.map(img => img.image) ?? []
          }
          uploadText="Cliquez pour télécharger ou faites glisser et déposez"
          uploadSubText="SVG, PNG, JPG ou GIF (MAX. 800x400px)"
        />
      </div>
    </TabsContent>
  )
}
