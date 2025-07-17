"use client"

import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
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
import { Badge } from "@/components/ui/badge"
import { Trash } from "lucide-react"
import { getAllFoods } from "@/app/api/foods"
import { useUpdateDailyTipStore } from "@/stores/useUpdateDailyTipStore"
import LocationDropdown from "@/components/Shared/dropdown/LocationDropdown"
import { getLocationDetails } from "@/app/api/location"

interface Food {
  id: number
  name?: string
  tagName?: string
}

interface AvailableItem {
  id: number
  name: string
  status: boolean
  display: boolean
}

interface Option {
  value: string
  label: string
}

interface OptionType {
  value: string
  label: string
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

export default function EditShopPromotionTab({
  translations,
  onClose,
  token,
  userName,
  editDailyTip,
  isLoading
}: {
  translations: translationsTypes
  token: string
  onClose: () => void
  userName: string
  editDailyTip: () => void
  isLoading: boolean
}): JSX.Element {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(5)
  const { translateText } = useTranslation()
  const {
    activeLang,
    translationsData,
    setTranslationField,
    resetTranslations
  } = useDailyTipStore()
  const [isTranslating, setIsTranslating] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [foods, setFoods] = useState<Food[]>([])
  const [ingredientInput, setIngredientInput] = useState<string>("")
  const [selected, setSelected] = useState<Food | null>(null)
  const [availData, setAvailData] = useState<AvailableItem[]>([])
  const [selectedLocationName, setSelectedLocationName] =
    useState<OptionType | null>(null)

  const {
    translationsData: updatedTranslations,
    setUpdatedField,
    resetUpdatedStore
  } = useUpdateDailyTipStore()

  const hasShopPromotionDataUpdates =
    Object.keys(updatedTranslations.shopPromotionData.en).length > 0 ||
    Object.keys(updatedTranslations.shopPromotionData.fr).length > 0

  // fetch once on mount
  useEffect(() => {
    const fetchFoods = async (): Promise<void> => {
      const res = await getAllFoods(token)
      if (res && res.status === 200) {
        setFoods(res.data.foods)
      } else {
        console.error("Failed to fetch foods:", res)
      }
    }
    void fetchFoods()
  }, [token])

  const handleAddIngredient = () => {
    let updatedAvailData: AvailableItem

    // Step 1: Check if the item is already in the availData list by item name
    if (selected) {
      // Check if the item name already exists in availData
      const isItemExists = availData.some(item => item.name === selected.name)

      if (isItemExists) {
        // Show an error and return early if the item already exists in the table
        toast.error("This food item is already in the list!")
        setSelected(null)
        setIngredientInput("")
        return
      }

      // Add the selected item with "Inactive" status if not already added
      updatedAvailData = {
        id: selected.id,
        name: selected.name ?? "",
        status: true,
        display: true
      }
    } else if (ingredientInput.trim()) {
      // Step 2: Check if the custom food item entered by the user already exists
      const isCustomItemExists = availData.some(
        item => item.name.toLowerCase() === ingredientInput.toLowerCase()
      )

      if (isCustomItemExists) {
        // If a custom item already exists in the table, show an error and return
        toast.error("This custom food item is already in the list!")
        setIngredientInput("")
        return
      }

      // Step 3: Add the custom item with "Inactive" status if it doesn't exist
      updatedAvailData = {
        id: 0,
        name: ingredientInput,
        status: false,
        display: true
      }
    } else {
      toast.error("Please select or enter a food item first!")
      return
    }

    // Step 4: Add the new item (either selected or custom) to the availData state
    setAvailData([...availData, updatedAvailData])

    // Save the updated availData into the daily tips store
    setTranslationField("shopPromotionData", activeLang, "shopPromoteFoods", [
      ...availData,
      updatedAvailData
    ])
    setTranslationField(
      "shopPromotionData",
      activeLang === "en" ? "fr" : "en",
      "shopPromoteFoods",
      [...availData, updatedAvailData]
    )

    setUpdatedField("shopPromotionData", activeLang, "shopPromoteFoods", [
      ...availData,
      updatedAvailData
    ])
    setUpdatedField(
      "shopPromotionData",
      activeLang === "en" ? "fr" : "en",
      "shopPromoteFoods",
      [...availData, updatedAvailData]
    )

    // Optionally, show a success message
    toast.success("Food item added successfully!")

    // Reset selected food to null and clear the search bar after item is added
    setSelected(null)
    setIngredientInput("")
  }

  const handleToggleDisplayStatus = (name: string) => {
    // Create a new updatedAvailData array by mapping over the existing availData
    const updatedAvailData = availData.map(item => {
      if (item.name === name) {
        return { ...item, display: !item.display }
      }
      return item
    })

    // Update the state with the new updatedAvailData
    setAvailData(updatedAvailData)

    // Optionally, update translations/store or any other global state
    setTranslationField(
      "shopPromotionData",
      activeLang,
      "shopPromoteFoods",
      updatedAvailData
    )
    setTranslationField(
      "shopPromotionData",
      activeLang === "en" ? "fr" : "en",
      "shopPromoteFoods",
      updatedAvailData
    )
    setTranslationField(
      "shopPromotionData",
      activeLang,
      "shopPromoteFoods",
      updatedAvailData
    )
    setTranslationField(
      "shopPromotionData",
      activeLang === "en" ? "fr" : "en",
      "shopPromoteFoods",
      updatedAvailData
    )

    setUpdatedField(
      "shopPromotionData",
      activeLang,
      "shopPromoteFoods",
      updatedAvailData
    )
    setUpdatedField(
      "shopPromotionData",
      activeLang === "en" ? "fr" : "en",
      "shopPromoteFoods",
      updatedAvailData
    )

    // Optionally show a success message
    toast.success("Display status updated successfully!")
  }

  const handleDeleteAvailItem = (name: string): void => {
    const updated = availData.filter(item => item.name !== name) // Filter out the item by name
    setAvailData(updated) // Update state with the filtered list
    setTranslationField(
      "shopPromotionData",
      activeLang,
      "shopPromoteFoods",
      updated
    ) // Update store
    setTranslationField(
      "shopPromotionData",
      activeLang === "en" ? "fr" : "en",
      "shopPromoteFoods",
      updated
    )

    setUpdatedField(
      "shopPromotionData",
      activeLang,
      "shopPromoteFoods",
      updated
    ) // Update store
    setUpdatedField(
      "shopPromotionData",
      activeLang === "en" ? "fr" : "en",
      "shopPromoteFoods",
      updated
    )
    toast.success("Food item deleted successfully!") // Show success message
  }

  // table columns for available ingredients and categories
  const availColumns = [
    {
      header: "Item",
      accessor: "name" as const
    },
    {
      header: "Status",
      accessor: (row: AvailableItem) => (
        <Badge
          className={
            row.status
              ? "bg-green-200 text-black text-xs px-2 py-1 rounded-md border border-green-500 hover:bg-green-100 transition-colors"
              : "bg-gray-200 text-black text-xs px-2 py-1 rounded-md border border-gray-500 hover:bg-gray-100 transition-colors"
          }
        >
          {row.status ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      header: "Display Status",
      accessor: (row: AvailableItem) => (
        <Switch
          checked={row.display}
          onCheckedChange={() => handleToggleDisplayStatus(row.name)}
          className="scale-75"
        />
      )
    },
    {
      header: "", // No header for delete column
      accessor: (row: AvailableItem) => (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="w-8 h-8 border border-gray-300 hover:bg-gray-100"
          onClick={() => {
            handleDeleteAvailItem(row.name)
          }}
          title={"Delete"}
        >
          <Trash className="w-4 h-4 text-gray-500" />
        </Button>
      ),
      id: "delete"
    }
  ]

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
    availData: z
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
    setUpdatedField("shopPromotionData", activeLang, fieldName, value)
    if (fieldName !== "subDescription" || "shopCategory") {
      setTranslationField("shopPromotionData", "fr", fieldName, value)
      setUpdatedField("shopPromotionData", "fr", fieldName, value)
    }
  }

  const handleInputBlur = async (fieldName: FieldNames, value: string) => {
    if (activeLang === "en" && value.trim()) {
      try {
        setIsTranslating(true)
        const translated = await translateText(value)
        setTranslationField("shopPromotionData", "fr", fieldName, translated)
        setUpdatedField("shopPromotionData", "fr", fieldName, translated)
      } finally {
        setIsTranslating(false)
      }
    }
  }

  // handle change reason function
  const handleReasonsChange = (value: string) => {
    form.setValue("reason", value)
    setTranslationField("shopPromotionData", activeLang, "reason", value)
    setUpdatedField("shopPromotionData", activeLang, "reason", value)

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
      setUpdatedField(
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
        const imageUrl = await uploadImageToFirebase(
          file,
          "daily-tip/temp-daily-tip",
          `temp-daily-tip-image-${userName}`
        )

        form.setValue("image", imageUrl, {
          shouldValidate: true,
          shouldDirty: true
        })
        setTranslationField("shopPromotionData", "en", "image", imageUrl)
        setTranslationField("shopPromotionData", "fr", "image", imageUrl)

        setUpdatedField("shopPromotionData", "en", "image", imageUrl)
        setUpdatedField("shopPromotionData", "fr", "image", imageUrl)

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

    // clear store and session
    await resetTranslations()
    await resetUpdatedStore()

    sessionStorage.removeItem("daily-tip-storage")
    sessionStorage.removeItem("update-daily-tip-storage")

    // Close the modal or section
    onClose()
  }

  const handleLocationName = (value: OptionType | null) => {
    setSelectedLocationName(value)
  }

  const handleLocationSelect = async (value: string[]) => {
    const placeId = value[0]

    const location = await getLocationDetails(placeId)

    if (!location) {
      toast.error("Failed to load location details.")
      return
    }

    const { name, country, lat, lng } = location

    const selectedLocation = {
      value: placeId,
      label: `${name}, ${country}`,
      lat,
      lng
    }

    setSelectedLocationName(selectedLocation)

    form.setValue("shopLocation", selectedLocation.label)

    setTranslationField(
      "shopPromotionData",
      activeLang,
      "shopLocation",
      selectedLocation.label
    )
    setTranslationField(
      "shopPromotionData",
      activeLang === "en" ? "fr" : "en",
      "shopLocation",
      selectedLocation.label
    )

    setUpdatedField(
      "shopPromotionData",
      activeLang,
      "shopLocation",
      selectedLocation.label
    )
    setUpdatedField(
      "shopPromotionData",
      activeLang === "en" ? "fr" : "en",
      "shopLocation",
      selectedLocation.label
    )

    setTranslationField(
      "shopPromotionData",
      activeLang,
      "shopLocationLatLng",
      selectedLocation
    )
    setTranslationField(
      "shopPromotionData",
      activeLang === "en" ? "fr" : "en",
      "shopLocationLatLng",
      selectedLocation
    )

    setUpdatedField(
      "shopPromotionData",
      activeLang,
      "shopLocationLatLng",
      selectedLocation
    )
    setUpdatedField(
      "shopPromotionData",
      activeLang === "en" ? "fr" : "en",
      "shopLocationLatLng",
      selectedLocation
    )
  }

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    editDailyTip()
  }

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
                      <LocationDropdown
                        selectedOption={selectedLocationName}
                        onSelect={handleLocationSelect}
                        onSelectLocation={handleLocationName}
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

            {/* Available Products */}

            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-row flex-1 gap-2 items-center mb-2">
                <div className="flex-1">
                  <SearchBar
                    title="Select Food"
                    placeholder="Search for food..."
                    dataList={foods.map(f => ({
                      id: f.id,
                      name: f.name ?? ""
                    }))}
                    value={ingredientInput}
                    onInputChange={setIngredientInput}
                    onSelect={item => {
                      setSelected({ ...item, id: Number(item.id) } as Food)
                      setIngredientInput(item.name)
                    }}
                  />
                </div>
                <div className="flex items-end mt-7 h-full">
                  <Button type="button" onClick={handleAddIngredient}>
                    {translations.add}
                  </Button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="availData"
                render={({ field }) => (
                  <>
                    <CustomTable
                      columns={availColumns}
                      data={availData.slice(
                        (page - 1) * pageSize,
                        page * pageSize
                      )}
                      page={page}
                      pageSize={pageSize}
                      totalItems={availData.length}
                      pageSizeOptions={[1, 5, 10]}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                    />
                    {availData.length === 0 && (
                      <FormMessage className="text-red-500">
                        At least one ingredient category must be added
                      </FormMessage>
                    )}
                  </>
                )}
              />
            </div>

            <Separator />

            <div className="flex justify-between items-center mt-4 mb-4">
              <h2 className="text-lg font-bold text-black">
                {translations.uploadImages}
              </h2>
            </div>

            {/* Image Uploader */}
            <div className="pb-8 w-full">
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
            <Button
              type="submit"
              disabled={isLoading || !hasShopPromotionDataUpdates}
            >
              {isLoading ? (
                <div className="flex gap-2 items-center">
                  <span className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  {translations.save}
                </div>
              ) : (
                translations.save
              )}
            </Button>{" "}
          </div>
        </form>
      </Form>
    </div>
  )
}
