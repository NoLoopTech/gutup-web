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
import React from "react"

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
  countries: Array<{ value: string; label: string }>
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
}

export default function ViewFoodFrench({
  selectionRef,
  preparationRef,
  conservationRef,
  categories,
  seasons,
  countries,
  foodDetails,
  benefitTags
}: ViewFoodFrenchProps): JSX.Element {
  return (
    <TabsContent value="french">
      {/* French Tab Content */}
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Label className="block mb-1 text-black">Nom</Label>
          <Input
            placeholder="Entrez le nom de l'aliment"
            value={foodDetails?.nameFR ?? ""}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Catégorie</Label>
          <Select value={foodDetails?.categoryFR ?? ""} disabled>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(option => (
                <SelectItem
                  key={option.value}
                  // Use French value/label if available
                  value={option.valueFr ?? option.value}
                >
                  {option.labelFr ?? option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block mb-1 text-black">Mois</Label>
          <Select value={foodDetails?.seasons?.[0]?.seasonFR ?? ""} disabled>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Sélectionner un mois" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map(option => (
                <SelectItem 
                  key={option.value} 
                  value={option.labelFr ?? option.label} // Change this line
                >
                  {option.labelFr ?? option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block mb-1 text-black">Pays</Label>
          <Select value={foodDetails?.country ?? ""} disabled>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Sélectionner un pays" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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
            value={foodDetails?.attributes?.fiber ?? ""}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Protéines</Label>
          <Input
            placeholder="Détails du fournisseur si applicable"
            value={foodDetails?.attributes?.proteins ?? ""}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Vitamines</Label>
          <Input
            placeholder="Détails du fournisseur si applicable"
            value={foodDetails?.attributes?.vitaminsFR ?? ""}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Minéraux</Label>
          <Input
            placeholder="Détails du fournisseur si applicable"
            value={foodDetails?.attributes?.mineralsFR ?? ""}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Graisses</Label>
          <Input
            placeholder="Détails du fournisseur si applicable"
            value={foodDetails?.attributes?.fat ?? ""}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Sucres</Label>
          <Input
            placeholder="Détails du fournisseur si applicable"
            value={foodDetails?.attributes?.sugar ?? ""}
            disabled
          />
        </div>
      </div>

      <div className="w-[100%]">
        <LableInput
          title="Bienfaits pour la santé"
          placeholder="Ajoutez jusqu'à 6 bienfaits alimentaires ou moins"
          benefits={
            foodDetails?.healthBenefits?.map(b => b.healthBenefitFR) ?? []
          }
          name="benefits"
          width="w-[32%]"
          disable={true}
          suggestions={benefitTags}
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
            onChange={() => {}}
            readOnly
          />
        </div>
        <div>
          <span className="block mb-2 text-sm text-black">Préparation</span>
          <RichTextEditor
            ref={preparationRef}
            initialContent={foodDetails?.describe?.preparationFR ?? ""}
            onChange={() => {}}
            readOnly
          />
        </div>
        <div>
          <span className="block mb-2 text-sm text-black">Conservation</span>
          <RichTextEditor
            ref={conservationRef}
            initialContent={foodDetails?.describe?.conservationFR ?? ""}
            onChange={() => {}}
            readOnly
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
          disabled
        />
      </div>
    </TabsContent>
  )
}
