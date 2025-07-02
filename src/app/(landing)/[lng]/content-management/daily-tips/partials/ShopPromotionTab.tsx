"use client"

import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import { Button } from "@/components/ui/button"
import { CustomTable } from "@/components/Shared/Table/CustomTable"
import SearchBar from "@/components/Shared/SearchBar/SearchBar"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { toast } from "sonner"
import { type translationsTypes } from "@/types/dailyTipTypes"
import { useTranslation } from "@/query/hooks/useTranslation"
import { useDailyTipStore } from "@/stores/useDailyTipStore"
import { Textarea } from "@/components/ui/textarea"
import {
  deleteImageFromFirebase,
  uploadImageToFirebase
} from "@/lib/firebaseImageUtils"
import { useFoodList } from "@/query/hooks/useFoodList"

interface Option {
  value: string
  label: string
}

interface Ingredient {
  id: number
  name: string
  displayStatus: boolean
}

interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
}

type FieldNames =
  | "reason"
  | "shopName"
  | "shopLocation"
  | "subDescription"
  | "shopCategory"
  | "mobileNumber"
  | "email"
  | "mapsPin"
  | "facebook"
  | "instagram"
  | "website"

const reason: Record<string, Option[]> = {
  en: [
    { value: "stress", label: "Stress" },
    { value: "anxiety", label: "Anxiety" },
    { value: "depression", label: "Depression" }
  ],
  fr: [
    { value: "stresser", label: "Stresser" },
    { value: "anxiété", label: "Anxiété" },
    { value: "dépression", label: "Dépression" }
  ]
}

export default function ShopPromotionTab({
  translations,
  onClose,
  token
}: {
  translations: translationsTypes
  token: string
  onClose: () => void
}): JSX.Element {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(2)
  const { translateText } = useTranslation()
  const { activeLang, translationsData, setTranslationField } =
    useDailyTipStore()
  const [isTranslating, setIsTranslating] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const { foods: foodsList } = useFoodList(token)
  const [ingredientData, setIngredientData] = useState<Ingredient[]>([])

  const updateStoreWithIngredients = (updated: Ingredient[]) => {
    const mapped = updated.map(i => ({
      foodId: i.id,
      name: i.name,
      dispalyStatus: i.displayStatus
    }))
    setTranslationField("shopPromotionData", "en", "shopPromoteFoods", mapped)
    setTranslationField("shopPromotionData", "fr", "shopPromoteFoods", mapped)
  }

  const handleToggleStatus = (id: number, checked: boolean) => {
    const updated = ingredientData.map(i =>
      i.id === id ? { ...i, displayStatus: checked } : i
    )
    setIngredientData(updated)
    form.setValue("ingredientData", updated as [Ingredient, ...Ingredient[]], {
      shouldValidate: true
    })
    updateStoreWithIngredients(updated)
  }

  const handleRemoveIngredient = (id: number) => {
    const updated = ingredientData.filter(i => i.id !== id)
    setIngredientData(updated)
    form.setValue("ingredientData", updated as [Ingredient, ...Ingredient[]], {
      shouldValidate: true
    })
    updateStoreWithIngredients(updated)
  }

  // Validate only inputs and select
  const FormSchema = z.object({
    shopName: z.string().min(1, { message: translations.required }),
    reason: z.string().nonempty(translations.pleaseSelectAReasonToDisplay),
    shopLocation: z.string().min(2, { message: translations.required }),
    shopCategory: z.string().min(2, { message: translations.required }),
    subDescription: z.string().nonempty(translations.required).min(10, {
      message: translations.subDescriptionMustBeAtLeast10CharactersLong
    }),
    mobileNumber: z
      .string()
      .nonempty(translations.required)
      .regex(/^(\+\d{11}|\d{10})$/, translations.invalidMobileNumberFormat),
    email: z
      .string()
      .nonempty(translations.required)
      .email({ message: translations.invalidEmailAddress }),
    mapsPin: z.string().min(1, { message: translations.required }),
    facebook: z
      .string()
      .optional()
      .refine(val => !val || /^https?:\/\/.+$/.test(val), {
        message: translations.invalidFacebookURL
      }),
    instagram: z
      .string()
      .optional()
      .refine(val => !val || /^https?:\/\/.+$/.test(val), {
        message: translations.invalidInstagramURL
      }),
    website: z
      .string()
      .optional()
      .refine(val => !val || /^https?:\/\/.+$/.test(val), {
        message: translations.invalidWebsiteURL
      }),
    ingredientData: z
      .array(
        z.object({
          id: z.number(),
          name: z.string(),
          displayStatus: z.boolean()
        })
      )
      .nonempty(translations.atLeastOneIngredientCategoryMustBeAdded),
    image: z.string().nonempty(translations.required)
  })

  const handleInputChange = (fieldName: FieldNames, value: string) => {
    form.setValue(fieldName, value, { shouldValidate: true, shouldDirty: true })
    setTranslationField("shopPromotionData", activeLang, fieldName, value)
    if (fieldName !== "subDescription" || "shopCategory") {
      setTranslationField("shopPromotionData", "fr", fieldName, value)
    }
  }

  const handleInputBlur = async (fieldName: FieldNames, value: string) => {
    if (activeLang === "en" && value.trim()) {
      try {
        setIsTranslating(true)
        const translated = await translateText(value)
        setTranslationField("shopPromotionData", "fr", fieldName, translated)
      } finally {
        setIsTranslating(false)
      }
    }
  }

  // handle change reason function
  const handleReasonsChange = (value: string) => {
    form.setValue("reason", value)
    setTranslationField("shopPromotionData", activeLang, "reason", value)

    const current = reason[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = reason[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "shopPromotionData",
        oppositeLang,
        "reason",
        opposite[index].value
      )
    }
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: translationsData.shopPromotionData[activeLang]
  })

  // Update form when lang changes
  useEffect(() => {
    form.reset(translationsData.shopPromotionData[activeLang])
  }, [activeLang, form.reset, translationsData.shopPromotionData])

  // Define functions to handle page changes
  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  const handleImageSelect = async (files: File[] | null) => {
    const file = files?.[0] ?? null
    if (file) {
      try {
        setIsTranslating(true)
        const imageUrl = await uploadImageToFirebase(file, "daily-tip")

        form.setValue("image", imageUrl, {
          shouldValidate: true,
          shouldDirty: true
        })
        setTranslationField("shopPromotionData", "en", "image", imageUrl)
        setTranslationField("shopPromotionData", "fr", "image", imageUrl)

        setPreviewUrls([imageUrl]) // For single image preview
      } catch (error) {
        toast.error("Image upload failed. Please try again.")
        console.error("Firebase upload error:", error)
      } finally {
        setIsTranslating(false)
      }
    }
  }

  useEffect(() => {
    const existingUrl = translationsData.shopPromotionData[activeLang].image
    if (existingUrl) {
      setPreviewUrls([existingUrl])
    } else {
      setPreviewUrls([])
    }

    form.reset(translationsData.shopPromotionData[activeLang])
  }, [activeLang, form.reset, translationsData.shopPromotionData])

  const handleCancel = async (): Promise<void> => {
    //  Combine all possible image URLs (preview + stored)
    const possibleImages = [
      translationsData.basicLayoutData[activeLang]?.image,
      translationsData.shopPromotionData?.[activeLang]?.image
    ]
    const uniqueImageUrls = Array.from(new Set(possibleImages)).filter(Boolean)

    //  Delete images from Firebase
    await Promise.all(
      uniqueImageUrls.map(async url => {
        try {
          await deleteImageFromFirebase(url)
        } catch (err) {
          console.error("Image deletion failed:", url, err)
        }
      })
    )

    setTranslationField("basicLayoutData", "en", "image", "")
    setTranslationField("basicLayoutData", "fr", "image", "")
    setTranslationField("shopPromotionData", "en", "image", "")
    setTranslationField("shopPromotionData", "fr", "image", "")

    //  Remove session data
    sessionStorage.removeItem("daily-tip-storage")

    // Clear preview image state
    setPreviewUrls([])

    // Close the modal or section
    onClose()
  }

  const handleSelectFood = (item: {
    id: number
    name: string
    displayStatus?: boolean
  }) => {
    const alreadyExists = ingredientData.some(i => i.id === item.id)
    if (alreadyExists) {
      toast.warning("Ingredient already added")
      return
    }

    const newIngredient: Ingredient = {
      id: item.id,
      name: item.name,
      displayStatus: item.displayStatus ?? false
    }

    const updated = [...ingredientData, newIngredient]
    setIngredientData(updated)
    form.setValue("ingredientData", updated as [Ingredient, ...Ingredient[]], {
      shouldValidate: true
    })

    updateStoreWithIngredients(updated)
  }

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    console.log(data)
    toast("Form submitted", {
      description: JSON.stringify(data, null, 2)
    })
  }

  useEffect(() => {
    form.reset(translationsData.shopPromotionData[activeLang])

    const foods =
      translationsData.shopPromotionData[activeLang]?.shopPromoteFoods ?? []
    const mappedFoods: Ingredient[] = foods.map(f => ({
      id: f.foodId,
      name: "", // You must map the ID to a name below
      displayStatus: f.dispalyStatus
    }))

    // map name from `foods` list fetched from API
    const enrichedFoods = mappedFoods.map(f => {
      const foodInfo = foodsList.find(food => food.id === f.id)
      return {
        ...f,
        name: foodInfo?.name ?? `Unknown (${f.id})`
      }
    })

    setIngredientData(enrichedFoods)
  }, [activeLang, form.reset, translationsData.shopPromotionData, foodsList])

  const ingredientColumns: Array<Column<Ingredient>> = [
    { header: "Ingredient Name", accessor: "name" },
    {
      header: "Main Ingredient",
      accessor: row => (
        <Switch
          checked={row.displayStatus}
          onCheckedChange={checked => handleToggleStatus(row.id, checked)}
          className="scale-75"
          style={{ minWidth: 28, minHeight: 16 }}
        />
      )
    },
    {
      header: "Action",
      accessor: row => (
        <Button
          variant="ghost"
          className="text-red-500 hover:underline"
          onClick={() => handleRemoveIngredient(row.id)}
        >
          Remove
        </Button>
      )
    }
  ]

  return (
    <div className="relative">
      {isTranslating && (
        <div className="flex absolute inset-0 z-50 justify-center items-center bg-white/60">
          <span className="w-10 h-10 rounded-full border-t-4 border-blue-500 border-solid animate-spin" />
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3 text-black">
            {/* Shop Name */}
            <div className="flex items-start lg:justify-end lg:-mt-[4.8rem]">
              <div className="w-[25.5rem]">
                <FormField
                  control={form.control}
                  name="shopName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.shopName}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={translations.enterShopName}
                          {...field}
                          onChange={e =>
                            handleInputChange("shopName", e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Reason */}
            <div className="w-full md:w-[25.5rem] mt-[-0.3rem]">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.reasonToDisplay}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={handleReasonsChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={translations.selectReason}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {reason[activeLang].map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              {/* Location */}
              <FormField
                control={form.control}
                name="shopLocation"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.shopLocation}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterShopLocation}
                        {...field}
                        onChange={e =>
                          handleInputChange("shopLocation", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category */}
              <FormField
                control={form.control}
                name="shopCategory"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.shopCategory}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterShopCategory}
                        {...field}
                        onChange={e =>
                          handleInputChange("shopCategory", e.target.value)
                        }
                        onBlur={() =>
                          handleInputBlur("shopCategory", field.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sub Description */}
            <div className="pb-1">
              <FormField
                control={form.control}
                name="subDescription"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-2">
                    <FormLabel>{translations.subDescription}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={translations.describeInDetail}
                        className="h-14"
                        {...field}
                        onChange={e =>
                          handleInputChange("subDescription", e.target.value)
                        }
                        onBlur={() =>
                          handleInputBlur("subDescription", field.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Store Contact */}
            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.mobileNumber}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+123456789"
                        {...field}
                        onChange={e =>
                          handleInputChange("mobileNumber", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.email}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@example.com"
                        {...field}
                        onChange={e =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mapsPin"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.mapsPin}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterGoogleMapsLocation}
                        {...field}
                        onChange={e =>
                          handleInputChange("mapsPin", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-6 pb-1">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.facebook}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterFacebookURL}
                        {...field}
                        onChange={e =>
                          handleInputChange("facebook", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.instagram}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterInstagramURL}
                        {...field}
                        onChange={e =>
                          handleInputChange("instagram", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.website}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterWebsiteURL}
                        {...field}
                        onChange={e =>
                          handleInputChange("website", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Select Featured Ingredients */}
            <div className="flex flex-row gap-2 items-center mb-4">
              <SearchBar
                title="Select Food"
                placeholder="Search for food..."
                dataList={foodsList}
                onSelect={handleSelectFood}
              />
            </div>

            <FormField
              control={form.control}
              name="ingredientData"
              render={({ field }) => (
                <>
                  <CustomTable
                    columns={ingredientColumns}
                    data={ingredientData.slice(
                      (page - 1) * pageSize,
                      page * pageSize
                    )}
                    page={page}
                    pageSize={pageSize}
                    totalItems={ingredientData.length}
                    pageSizeOptions={[1, 5, 10]}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                  {ingredientData.length === 0 && (
                    <FormMessage className="text-red-500">
                      At least one ingredient/category must be added.
                    </FormMessage>
                  )}
                </>
              )}
            />

            <Separator />

            <div className="flex justify-between items-center mt-4 mb-4">
              <h2 className="text-lg font-bold text-black">
                {translations.uploadImages}
              </h2>
            </div>

            {/* Image Uploader */}
            <div className="pb-8 w-full sm:w-2/5">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader
                        title={translations.selectImagesForYourFoodItem}
                        previewUrls={previewUrls ? previewUrls : []}
                        onChange={handleImageSelect}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex fixed bottom-0 left-0 z-50 justify-between px-8 py-2 w-full bg-white border-t border-gray-200">
            <Button
              variant="outline"
              onClick={async () => {
                await handleCancel()
              }}
            >
              {translations.cancel}
            </Button>
            <Button type="submit">{translations.save}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
