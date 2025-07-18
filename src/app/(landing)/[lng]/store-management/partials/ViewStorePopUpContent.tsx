"use client"

import React, { useState, useEffect } from "react"
import { DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { getStoreById } from "@/app/api/store"
import { toast } from "sonner"
import { type translationsTypes } from "@/types/storeTypes"

interface StoreData {
  id: number
  storeName: string
  category: string
  categoryFR: string
  storeLocation: string
  shopStatus: boolean
  deliverible: boolean
  storeMapLocation: string
  startTime: string
  endTime: string
  storeType: string
  storeTypeFR: string
  subscriptionType: string
  subscriptionTypeFR: string
  phoneNumber: string
  email: string
  mapsPin: string
  facebook: string
  instagram: string
  website: string
  description: string
  descriptionFR: string
  storeImage: string
  ingredients: any[]
  categories: any[]
}

interface AvailableItem {
  ingOrCatId: number
  name: string
  type: string
  status: "Active" | "Inactive"
  display: boolean
}

interface ViewStorePopUpContentProps {
  translations: translationsTypes
  onClose: () => void
  storeId: number | null
  token: string
  activeLang: "en" | "fr"
}

const categoryOptions: Record<string, any[]> = {
  en: [
    { value: "breakfast", label: "Breakfast" },
    { value: "dinner", label: "Dinner" },
    { value: "dairy", label: "Dairy" },
    { value: "farmers-market", label: "Farmers' market" },
    { value: "farm", label: "Farm" },
    { value: "farm-vending-machine", label: "Farm vending machine" },
    { value: "local-cooperative", label: "Local cooperative" },
    {
      value: "direct-from-farm-livestock",
      label: "Direct-from-farm livestock"
    },
    { value: "pick-your-own-farm", label: "Pick-your-own farm" },
    { value: "farm-drive-thru", label: "Farm drive-thru" },
    { value: "microfarm", label: "Microfarm" },
    { value: "farm-baskets", label: "Farm baskets" },
    { value: "greengrocer", label: "Greengrocer" },
    { value: "grocery-store", label: "Grocery store" },
    { value: "organic-store", label: "Organic store" },
    { value: "vegan-store", label: "Vegan store" },
    { value: "bulk-grocery", label: "Bulk grocery" },
    { value: "zero-waste-store", label: "Zero-waste store" },
    { value: "parapharmacy", label: "Parapharmacy" },
    { value: "pharmacy", label: "Pharmacy" },
    { value: "herbalist-shop", label: "Herbalist shop" },
    { value: "diet-store", label: "Diet store" },
    { value: "ayurvedic-store", label: "Ayurvedic store" },
    { value: "butcher", label: "Butcher" },
    { value: "cheese-store", label: "Cheese store" },
    { value: "creamery", label: "Creamery" },
    { value: "bakery", label: "Bakery" },
    { value: "fishmonger", label: "Fishmonger" },
    { value: "oil-mill", label: "Oil mill" },
    { value: "beekeeper", label: "Beekeeper" },
    { value: "coffee-roaster", label: "Coffee roaster" },
    { value: "brewery", label: "Brewery" },
    { value: "pastry-shop", label: "Pastry shop" },
    { value: "chocolate-factory", label: "Chocolate factory" },
    { value: "organic-marketplace", label: "Organic marketplace" },
    { value: "ethical-marketplace", label: "Ethical marketplace" },
    { value: "direct-sales-platform", label: "Direct sales platform" },
    { value: "online-organic-store", label: "Online organic store" },
    { value: "online-bulk-store", label: "Online bulk store" },
    { value: "online-superfood-store", label: "Online superfood store" },
    { value: "farm-basket-platform", label: "Farm basket delivery platform" },
    { value: "dietary-supplements", label: "Dietary supplements" },
    { value: "superfood-producer", label: "Superfood producer" },
    { value: "legume-grower", label: "Legume grower" },
    { value: "oilseed-producer", label: "Oilseed producer" },
    { value: "cereal-producer", label: "Cereal producer" },
    { value: "tofu-producer", label: "Tofu producer" },
    { value: "spice-producer", label: "Spice producer" },
    { value: "spirulina-farmer", label: "Spirulina farmer" },
    { value: "mushroom-grower", label: "Mushroom grower" },
    { value: "medicinal-herb-grower", label: "Medicinal herb grower" },
    { value: "aromatic-plant-grower", label: "Aromatic plant grower" },
    { value: "dried-fruit-producer", label: "Dried fruit producer" },
    { value: "craft-beverage-producer", label: "Craft beverage producer" },
    { value: "sprouted-seed-producer", label: "Sprouted seed producer" },
    { value: "vinegar-maker", label: "Vinegar maker" },
    {
      value: "plant-based-beverage-producer",
      label: "Plant-based beverage producer"
    },
    { value: "kefir-kombucha-brewer", label: "Kefir / Kombucha brewer" },
    { value: "seaweed-producer", label: "Seaweed producer" },
    {
      value: "fermented-products-producer",
      label: "Fermented products producer"
    }
  ],
  fr: [
    { value: "breakfast", label: "Petit déjeuner" },
    { value: "dinner", label: "Dîner" },
    { value: "dairy", label: "Produits laitiers" },
    { value: "farmers-market", label: "Marché de producteurs" },
    { value: "farm", label: "Ferme" },
    { value: "farm-vending-machine", label: "Distributeur automatique" },
    { value: "local-cooperative", label: "Coopérative locale" },
    { value: "direct-from-farm-livestock", label: "Élevage fermier" },
    { value: "pick-your-own-farm", label: "Cueillette à la ferme" },
    { value: "farm-drive-thru", label: "Drive fermier" },
    { value: "microfarm", label: "Microferme" },
    { value: "farm-baskets", label: "Paniers" },
    { value: "greengrocer", label: "Primeur" },
    { value: "grocery-store", label: "Épicerie de quartier" },
    { value: "organic-store", label: "Magasin bio" },
    { value: "vegan-store", label: "Magasin végan" },
    { value: "bulk-grocery", label: "Épicerie vrac" },
    { value: "zero-waste-store", label: "Épicerie zéro déchet" },
    { value: "parapharmacy", label: "Parapharmacie" },
    { value: "pharmacy", label: "Pharmacie" },
    { value: "herbalist-shop", label: "Herboristerie" },
    { value: "diet-store", label: "Magasin diététique" },
    { value: "ayurvedic-store", label: "Magasin ayurvédique" },
    { value: "butcher", label: "Boucherie" },
    { value: "cheese-store", label: "Fromagerie" },
    { value: "creamery", label: "Crèmerie" },
    { value: "bakery", label: "Boulangerie" },
    { value: "fishmonger", label: "Poissonnerie" },
    { value: "oil-mill", label: "Huilerie" },
    { value: "beekeeper", label: "Apiculteur" },
    { value: "coffee-roaster", label: "Torréfacteur" },
    { value: "brewery", label: "Brasserie" },
    { value: "pastry-shop", label: "Pâtisserie" },
    { value: "chocolate-factory", label: "Chocolaterie" },
    { value: "organic-marketplace", label: "Marketplace bio" },
    { value: "ethical-marketplace", label: "Marketplace éthique" },
    { value: "direct-sales-platform", label: "Plateforme de vente directe" },
    { value: "online-organic-store", label: "Magasin bio en ligne" },
    { value: "online-bulk-store", label: "Vente en ligne de vrac" },
    {
      value: "online-superfood-store",
      label: "Vente en ligne de super-aliments"
    },
    { value: "farm-basket-platform", label: "Plateforme de paniers" },
    { value: "dietary-supplements", label: "Compléments alimentaires" },
    { value: "superfood-producer", label: "Producteur de super-aliment" },
    { value: "legume-grower", label: "Producteur de légumineuses" },
    { value: "oilseed-producer", label: "Producteur d'oléagineux" },
    { value: "cereal-producer", label: "Producteur de céréales" },
    { value: "tofu-producer", label: "Producteur de tofu" },
    { value: "spice-producer", label: "Producteur d'épices" },
    { value: "spirulina-farmer", label: "Producteur de spiruline" },
    { value: "mushroom-grower", label: "Producteur de champignons" },
    {
      value: "medicinal-herb-grower",
      label: "Producteur de plantes médicinales"
    },
    {
      value: "aromatic-plant-grower",
      label: "Producteur de plantes aromatiques"
    },
    { value: "dried-fruit-producer", label: "Producteur de fruits secs" },
    {
      value: "craft-beverage-producer",
      label: "Producteur de boissons artisanales"
    },
    { value: "sprouted-seed-producer", label: "Producteur de graines germées" },
    { value: "vinegar-maker", label: "Producteur de vinaigre" },
    {
      value: "plant-based-beverage-producer",
      label: "Producteur de boissons végétales"
    },
    { value: "kefir-kombucha-brewer", label: "Producteur de kéfir / kombucha" },
    { value: "seaweed-producer", label: "Producteur d'algues" },
    {
      value: "fermented-products-producer",
      label: "Producteur de produits fermentés"
    }
  ]
}

const storeTypeOptions: Record<string, any[]> = {
  en: [
    { value: "physical", label: "Physical" },
    { value: "online", label: "Online" }
  ],
  fr: [
    { value: "physical", label: "Physique" },
    { value: "online", label: "En ligne" }
  ]
}

export default function ViewStorePopUpContent({
  translations,
  onClose,
  storeId,
  token,
  activeLang
}: ViewStorePopUpContentProps): JSX.Element {
  const [storeData, setStoreData] = useState<StoreData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [availData, setAvailData] = useState<AvailableItem[]>([])
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(5)

  // Fetch store data
  useEffect(() => {
    const fetchStoreData = async (): Promise<void> => {
      if (!storeId || !token) return

      try {
        setIsLoading(true)
        const response = await getStoreById(token, storeId)

        if (response?.data) {
          setStoreData(response.data)

          // Transform ingredients and categories to availData format
          const ingredients =
            response.data.ingredients?.map((item: any) => ({
              id: item.id,
              name: activeLang === "en" ? item.name : item.nameFR,
              type: "Ingredient",
              status: item.availability
                ? "Active"
                : ("Inactive" as "Active" | "Inactive"),
              display: item.display
            })) || []

          const categories =
            response.data.categories?.map((item: any) => ({
              id: item.id,
              name: activeLang === "en" ? item.name : item.nameFR,
              type: "Category",
              status: item.availability
                ? "Active"
                : ("Inactive" as "Active" | "Inactive"),
              display: item.display
            })) || []

          setAvailData([...ingredients, ...categories])
        } else {
          toast.error("Failed to load store data")
        }
      } catch (error) {
        console.error("Error fetching store data:", error)
        toast.error("Failed to load store data")
      } finally {
        setIsLoading(false)
      }
    }

    void fetchStoreData()
  }, [storeId, token, activeLang])

  // table columns for available ingredients and categories
  const availColumns = [
    {
      header: translations.availableIngredientsAndCategories,
      accessor: "name" as const
    },
    {
      header: translations.type,
      accessor: (row: AvailableItem) => (
        <Badge className="bg-white text-black text-xs px-2 py-1 rounded-md border border-gray-100 hover:bg-white">
          {translations[row.type?.toLowerCase() as keyof typeof translations] ||
            row.type}
        </Badge>
      )
    },
    {
      header: translations.availabilityStatus,
      accessor: (row: AvailableItem) => (
        <Badge
          className={
            row.status === "Active"
              ? "bg-green-200 text-black text-xs px-2 py-1 rounded-md border border-green-500 hover:bg-green-100 transition-colors"
              : "bg-gray-200 text-black text-xs px-2 py-1 rounded-md border border-gray-500 hover:bg-gray-100 transition-colors"
          }
        >
          {translations[
            row.status.toLowerCase() as keyof typeof translations
          ] ?? row.status}
        </Badge>
      )
    },
    {
      header: translations.displayStatus,
      accessor: (row: AvailableItem) => (
        <Switch checked={row.display} className="scale-75" disabled />
      )
    }
  ]

  // Define functions to handle page changes
  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="w-10 h-10 rounded-full border-t-4 border-blue-500 border-solid animate-spin" />
      </div>
    )
  }

  if (!storeData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-red-500">Failed to load store data</div>
      </div>
    )
  }

  return (
    <div className="pb-6">
      {/* Store info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label className="block mb-1 text-black">
            {translations.storeName}
          </Label>
          <Input value={storeData.storeName} disabled className="bg-gray-50" />
        </div>
        <div>
          <Label className="block mb-1 text-black">
            {translations.category}
          </Label>
          <Select value={storeData.category} disabled>
            <SelectTrigger className="w-full mt-1 bg-gray-50">
              <SelectValue>
                {activeLang === "en"
                  ? categoryOptions[activeLang]?.find(
                      option => option.value === storeData.category
                    )?.label
                  : storeData.categoryFR}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categoryOptions[activeLang]?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block mb-1 text-black">
            {translations.storeLocation}
          </Label>
          <Input
            value={storeData.storeLocation}
            disabled
            className="bg-gray-50"
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">
            {translations.storeType}
          </Label>
          <Select value={storeData.storeType} disabled>
            <SelectTrigger className="w-full mt-1 bg-gray-50">
              <SelectValue>
                {activeLang === "en"
                  ? storeTypeOptions[activeLang]?.find(
                      option => option.value === storeData.storeType
                    )?.label
                  : storeData.storeTypeFR}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {storeTypeOptions[activeLang]?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label>{translations.time}</Label>
          <div className="flex gap-7 items-center">
            <div className="flex flex-col">
              <Label htmlFor="time-from" className="text-xs text-gray-400">
                {translations.from}
              </Label>
              <Input
                type="time"
                value={storeData.startTime}
                disabled
                className="h-6 bg-gray-50 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="time-to" className="text-xs text-gray-400">
                {translations.to}
              </Label>
              <Input
                type="time"
                value={storeData.endTime}
                disabled
                className="h-6 bg-gray-50 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
        </div>
        <div></div>
        <div>
          <Label className="text-black mb-1 block">
            {translations.subscription}
          </Label>
          <div className="flex items-center gap-4 mt-2">
            <Switch
              checked={storeData.subscriptionType === "premium"}
              disabled
            />
            <Label className="text-Primary-300">
              {activeLang === "en"
                ? storeData.subscriptionType
                : storeData.subscriptionTypeFR}
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Contact info */}
      <DialogTitle className="pt-4">{translations.storeContact}</DialogTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 mb-6">
        <div>
          <Label className="block mb-1 text-black">
            {translations.mobileNumber}
          </Label>
          <Input
            value={storeData.phoneNumber}
            disabled
            className="bg-gray-50"
          />
          <div className="text-xs text-gray-500 mt-1">
            {translations.required}
          </div>
        </div>
        <div>
          <Label className="block mb-1 text-black">{translations.email}</Label>
          <Input value={storeData.email} disabled className="bg-gray-50" />
          <div className="text-xs text-gray-500 mt-1">
            {translations.required}
          </div>
        </div>
        <div>
          <Label className="block mb-1 text-black">
            {translations.facebook}
          </Label>
          <Input value={storeData.facebook} disabled className="bg-gray-50" />
        </div>
        <div>
          <Label className="block mb-1 text-black">
            {translations.instagram}
          </Label>
          <Input value={storeData.instagram} disabled className="bg-gray-50" />
        </div>
        <div>
          <Label className="block mb-1 text-black">
            {translations.website}
          </Label>
          <Input value={storeData.website} disabled className="bg-gray-50" />
        </div>
      </div>

      <Separator />

      {/* Available Products */}
      <DialogTitle className="pt-4">
        {translations.availableProducts}
      </DialogTitle>
      <div className="flex flex-col gap-4 pt-4">
        <CustomTable
          columns={availColumns}
          data={availData.slice((page - 1) * pageSize, page * pageSize)}
          page={page}
          pageSize={pageSize}
          totalItems={availData.length}
          pageSizeOptions={[1, 5, 10]}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <Separator />

      {/* About The Shop */}
      <DialogTitle className="pt-4">{translations.aboutTheShop}</DialogTitle>
      <div className="flex flex-col gap-6 pt-4 pb-6">
        <div>
          <Label>{translations.aboutUs}</Label>
          <div
            className="mt-2 p-3 bg-gray-50 border rounded-md min-h-[100px]"
            dangerouslySetInnerHTML={{
              __html:
                activeLang === "en"
                  ? storeData.description
                  : storeData.descriptionFR
            }}
          />
        </div>
      </div>

      <Separator />

      {/* Store Image */}
      <DialogTitle className="pt-4">{translations.uploadImages}</DialogTitle>
      <div className="pt-4 w-full sm:w-2/5 pb-8">
        {storeData.storeImage && (
          <div className="space-y-2">
            <Label>{translations.selectImagesForYourStore}</Label>
            <img
              src={storeData.storeImage}
              alt="Store"
              className="w-full h-48 object-cover rounded-lg border"
            />
          </div>
        )}
      </div>

      <DialogFooter>
        {/* Close button */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t py-4 px-4 flex justify-end gap-2 z-50">
          <Button type="button" variant="outline" onClick={onClose}>
            {translations.close || "Close"}
          </Button>
        </div>
      </DialogFooter>
    </div>
  )
}
