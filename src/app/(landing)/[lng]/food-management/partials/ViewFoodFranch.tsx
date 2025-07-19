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
import dynamic from "next/dynamic"
import React, { useEffect, useState } from "react"

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
      fiber: number
      proteins: number
      vitamins: string
      vitaminsFR: string
      minerals: string
      mineralsFR: string
      fat: number
      sugar: number
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
  handleSelectSync
}: ViewFoodFrenchProps): JSX.Element {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    season: "",
    country: "",
    fiber: "",
    proteins: "",
    vitamins: "",
    minerals: "",
    fat: "",
    sugar: "",
    benefits: [] as string[]
  })

  useEffect(() => {
    if (foodDetails) {
      setFormData({
        name: foodDetails.nameFR || "",
        category: foodDetails.categoryFR || "",
        season: foodDetails.seasons?.[0]?.seasonFR || "",
        country: foodDetails.country || "",
        fiber: foodDetails.attributes?.fiber?.toString() || "",
        proteins: foodDetails.attributes?.proteins?.toString() || "",
        vitamins: foodDetails.attributes?.vitaminsFR || "",
        minerals: foodDetails.attributes?.mineralsFR || "",
        fat: foodDetails.attributes?.fat?.toString() || "",
        sugar: foodDetails.attributes?.sugar?.toString() || "",
        benefits:
          foodDetails.healthBenefits
            ?.map(b => b.healthBenefitFR)
            .filter(Boolean) || []
      })
    }
  }, [foodDetails])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Update session storage based on field type
    switch (field) {
      case "name":
        updateEditedData("nameFR", value)
        break
      case "fiber":
      case "proteins":
      case "fat":
      case "sugar":
        updateNestedData("attributes", field, parseFloat(value) || 0)
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
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    handleSelectSync(field, value, "fr")
  }

  return (
    <TabsContent value="french">
      {/* French Tab Content */}
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Label className="block mb-1 text-black">Nom</Label>
          <Input
            placeholder="Entrez le nom de l'aliment"
            value={formData.name}
            onChange={e => handleInputChange("name", e.target.value)}
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Catégorie</Label>
          <Select
            value={formData.category}
            onValueChange={value => handleSelectChange("category", value)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.valueFr ?? option.labelFr ?? option.value}
                >
                  {option.labelFr ?? option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block mb-1 text-black">Mois</Label>
          <Select
            value={formData.season}
            onValueChange={value => handleSelectChange("season", value)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Sélectionner un mois" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.labelFr ?? option.label}
                >
                  {option.labelFr ?? option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block mb-1 text-black">Pays</Label>
          <Select
            value={formData.country}
            onValueChange={value => handleSelectChange("country", value)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Sélectionner un pays" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.labelFr ?? option.label}
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
          <Label className="block mb-1 text-black">Fibres</Label>
          <Input
            placeholder="Détails du fournisseur si applicable"
            value={formData.fiber}
            onChange={e => handleInputChange("fiber", e.target.value)}
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Protéines</Label>
          <Input
            placeholder="Détails du fournisseur si applicable"
            value={formData.proteins}
            onChange={e => handleInputChange("proteins", e.target.value)}
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Vitamines</Label>
          <Input
            placeholder="Détails du fournisseur si applicable"
            value={formData.vitamins}
            onChange={e => handleInputChange("vitamins", e.target.value)}
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Minéraux</Label>
          <Input
            placeholder="Détails du fournisseur si applicable"
            value={formData.minerals}
            onChange={e => handleInputChange("minerals", e.target.value)}
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Graisses</Label>
          <Input
            placeholder="Détails du fournisseur si applicable"
            value={formData.fat}
            onChange={e => handleInputChange("fat", e.target.value)}
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Sucres</Label>
          <Input
            placeholder="Détails du fournisseur si applicable"
            value={formData.sugar}
            onChange={e => handleInputChange("sugar", e.target.value)}
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
          onSelectSuggestion={benefit => {
            console.log("French onSelectSuggestion:", benefit)
            // Get current benefits from foodDetails
            const currentData = foodDetails?.healthBenefits || []

            // Add both EN and FR at the same index
            const updatedHealthBenefits = [
              ...currentData,
              {
                healthBenefit: benefit.tagName,
                healthBenefitFR: benefit.tagNameFr
              }
            ]

            console.log(
              "French updated health benefits:",
              updatedHealthBenefits
            )

            // Update session storage
            updateEditedData("healthBenefits", updatedHealthBenefits)

            // Don't update local form state here - let useEffect handle it
          }}
          onRemoveBenefit={removed => {
            console.log("French onRemoveBenefit:", removed)
            const currentData = foodDetails?.healthBenefits || []

            // Find and remove by matching either English or French name
            const updatedHealthBenefits = currentData.filter(
              b =>
                b.healthBenefit !== removed.tagName &&
                b.healthBenefitFR !== removed.tagNameFr
            )

            console.log("French after removal:", updatedHealthBenefits)

            // Update session storage
            updateEditedData("healthBenefits", updatedHealthBenefits)

            // Don't update local form state here - let useEffect handle it
          }}
          onChange={(newBenefits: string[]) => {
            console.log("French onChange:", newBenefits)
            // This is for manual typing - preserve structure
            const currentData = foodDetails?.healthBenefits || []
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
          previewUrls={foodDetails?.images?.map(img => img.image) ?? []}
        />
      </div>
    </TabsContent>
  )
}
