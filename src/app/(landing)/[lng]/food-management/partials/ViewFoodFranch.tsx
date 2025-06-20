"use client"

import React from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import dynamic from "next/dynamic"
import type { RichTextEditorHandle } from "@/components/Shared/TextEditor/RichTextEditor"
import LableInput from "@/components/Shared/LableInput/LableInput"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)

interface ViewFoodFrenchProps {
  selectionRef: React.Ref<RichTextEditorHandle>
  preparationRef: React.Ref<RichTextEditorHandle>
  conservationRef: React.Ref<RichTextEditorHandle>
  categories: Array<{ value: string; label: string }>
  seasons: Array<{ value: string; label: string }>
  countries: Array<{ value: string; label: string }>
}

export default function ViewFoodFrench({
  selectionRef,
  preparationRef,
  conservationRef,
  categories,
  seasons,
  countries
}: ViewFoodFrenchProps): JSX.Element {
  return (
    <TabsContent value="french">
      {/* French Tab Content */}
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Label className="block mb-1 text-black">Nom</Label>
          <Input placeholder="Entrez le nom de l'aliment" />
        </div>
        <div>
          <Label className="block mb-1 text-black">Catégorie</Label>
          <Select>
            <SelectTrigger
              id="categorySelect"
              name="categorySelect"
              className="w-full mt-1"
            >
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block mb-1 text-black">Saison</Label>
          <Select>
            <SelectTrigger
              id="seasonSelect"
              name="seasonSelect"
              className="w-full mt-1"
            >
              <SelectValue placeholder="Sélectionner une saison" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block mb-1 text-black">Pays</Label>
          <Select>
            <SelectTrigger
              id="countrySelect"
              name="countrySelect"
              className="w-full mt-1"
            >
              <SelectValue placeholder="Sélectionner un comptoir" />
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
          <Input placeholder="Détails du fournisseur si applicable" />
        </div>
        <div>
          <Label className="block mb-1 text-black">Protéines</Label>
          <Input placeholder="Détails du fournisseur si applicable" />
        </div>
        <div>
          <Label className="block mb-1 text-black">Vitamines</Label>
          <Input placeholder="Détails du fournisseur si applicable" />
        </div>
        <div>
          <Label className="block mb-1 text-black">Minéraux</Label>
          <Input placeholder="Détails du fournisseur si applicable" />
        </div>
        <div>
          <Label className="block mb-1 text-black">Graisses</Label>
          <Input placeholder="Détails du fournisseur si applicable" />
        </div>
        <div>
          <Label className="block mb-1 text-black">Sucres</Label>
          <Input placeholder="Détails du fournisseur si applicable" />
        </div>
        <div
          className="col-span-1 sm:col-span-2 md:col-span-1"
          style={{ width: "100%" }}
        >
          <LableInput
            title="Bienfaits pour la santé"
            placeholder="Add up to 6 food benefits or lower"
            benefits={[]}
          />
        </div>
      </div>

      <Separator className="my-2" />

      <h3 className="mb-4 text-lg font-semibold text-black">
        Décrire l'aliment
      </h3>
      <div className="flex flex-col gap-6">
        <div>
          <span className="block mb-2 text-sm text-black">Sélection</span>
          <RichTextEditor ref={selectionRef} />
        </div>
        <div>
          <span className="block mb-2 text-sm text-black">Préparation</span>
          <RichTextEditor ref={preparationRef} />
        </div>
        <div>
          <span className="block mb-2 text-sm text-black">Conservation</span>
          <RichTextEditor ref={conservationRef} />
        </div>
      </div>

      <div className="w-full pb-6 mt-6 sm:w-2/5">
        <h3 className="mb-4 text-lg font-semibold text-black">
          Télécharger des images
        </h3>
        <ImageUploader title="Sélectionnez des images pour votre aliment" />
      </div>
    </TabsContent>
  )
}
