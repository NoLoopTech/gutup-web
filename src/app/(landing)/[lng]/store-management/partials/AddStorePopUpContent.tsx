"use client"

import React, { useEffect, useState } from "react"
import { DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import SearchBar from "@/components/Shared/SearchBar/SearchBar"
import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
} from "@/components/ui/form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type translationsTypes } from "@/types/storeTypes"
import { useStoreStore } from "@/stores/useStoreStore"
import { useTranslation } from "@/query/hooks/useTranslation"
import { getAllFoods } from "@/app/api/foods"
import { Trash } from "lucide-react"
import { uploadImageToFirebase } from "@/lib/firebaseImageUtils"
import { getAllTags } from "@/app/api/tags"
import { getStoreCategories } from "@/app/api/store"
import { getLocationDetails } from "@/app/api/location"

import LocationDropdown from "@/components/Shared/dropdown/LocationDropdown"
import { useSession } from "next-auth/react"

const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)

interface Food {
  id: number | string
  name?: string
  nameFR?: string
  tagName?: string
}

interface CategoryTag {
  id: number | string
  tagName?: string
  tagNameFr?: string
  category?: string
}

interface Option {
  value: string
  label: string
}

interface StoreCategory {
  id: number
  Tag: string
  TagName: string
  TagNameFr: string
}

interface StoreType {
  id: number
  Tag: string
  TagName: string
  TagNameFr: string
}

interface AvailableItem {
  ingOrCatId: number
  name: string
  type: string
  status: "Active" | "Inactive"
  display: boolean
  tags: string[]
  quantity: string
  isMain: boolean
}

export interface OptionType {
  value: string
  label: string
  lat?: number
  lng?: number
}

export default function AddStorePopUpContent({
  translations,
  onAddStore,
  isLoading,
  onClose
}: {
  translations: translationsTypes
  onAddStore?: () => Promise<void>
  isLoading?: boolean
  onClose?: () => void
}): JSX.Element {
  const { translateText } = useTranslation()
  const { activeLang, storeData, setTranslationField, resetForm } =
    useStoreStore() as any
  const [, setIsTranslating] = useState(false)
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(5)
  const [, setIsPremium] = React.useState(false)
  const [foods, setFoods] = useState<Food[]>([])
  const [foodSuggestions, setFoodSuggestions] = useState<Food[]>([])
  const [isFoodSearchLoading, setIsFoodSearchLoading] = useState(false)
  const [foodSearchDropdownTrigger, setFoodSearchDropdownTrigger] = useState(0)
  const [categoryTags, setCategoryTags] = useState<CategoryTag[]>([])
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([])
  const [storeTypes, setStoreTypes] = useState<StoreType[]>([])
  const [availData, setAvailData] = useState<AvailableItem[]>([])
  const [selected, setSelected] = useState<Food | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryTag | null>(
    null
  )
  const [ingredientInput, setIngredientInput] = useState<string>("")
  const [categoryInput, setCategoryInput] = useState<string>("")
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [selectedLocationName, setSelectedLocationName] =
    useState<OptionType | null>(null)

  const { data: session } = useSession()

  const isNutritionistType = (storeTypeValue?: string): boolean => {
    if (!storeTypeValue) return false
    const matchedType = storeTypes.find(
      type => type.id.toString() === storeTypeValue
    )
    if (!matchedType) return false
    const englishName = (matchedType.TagName || "").toLowerCase()
    const frenchName = (matchedType.TagNameFr || "").toLowerCase()
    return englishName === "nutritionist" || frenchName === "nutritionniste"
  }

  const normalizeFood = (food: any): Food => ({
    ...food,
    name: typeof food?.name === "string" ? food.name : food?.tagName ?? "",
    nameFR:
      (typeof food?.nameFR === "string" && food.nameFR) ||
      (typeof food?.nameFr === "string" && food.nameFr) ||
      (typeof food?.name_fr === "string" && food.name_fr) ||
      (typeof food?.frName === "string" && food.frName) ||
      (typeof food?.name === "string" && food.name) ||
      ""
  })

  const getLocalizedFoodName = (
    food: Food | null | undefined,
    lang: string
  ): string => {
    if (!food) return ""
    return lang === "fr" ? food.nameFR ?? food.name ?? "" : food.name ?? ""
  }

  // Validation schema using Zod
  const AddStoreSchema = z.object({
    storeName: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.mustbeatleast2characters }),
    category: z.string().min(1, translations.pleaseselectacategory),
    storeLocation: z.string().min(1, translations.required),
    storeType: z.string().min(1, translations.pleaseselectaStoreType),
    subscriptionType: z.boolean().optional(),
    deliverible: z.boolean().optional(),
    timeFrom: z.string().optional().or(z.literal("")),
    timeTo: z.string().optional().or(z.literal("")),
    phone: z
      .string()
      .nonempty(translations.required)
      .refine(val => /^\d{10}$/.test(val) || /^\+\d{11}$/.test(val), {
        message: translations.invalidmobilenumbereg0712345678or94712345678
      }),
    email: z
      .string()
      .nonempty(translations.required)
      .email(translations.pleaseenteravalidemail),
    website: z
      .string()
      .optional()
      .refine(val => !val || /^(https?:\/\/|www\.)[^\s]+$/.test(val), {
        message: translations.invalidWebsiteURL
      }),
    facebook: z
      .string()
      .url(translations.invalidurlformat)
      .optional()
      .or(z.literal("")),
    instagram: z
      .string()
      .url(translations.invalidurlformat)
      .optional()
      .or(z.literal("")),
    about: z.string().refine(
      val => {
        const plainText = val.replace(/<(.|\n)*?>/g, "").trim()
        const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val)
        return plainText !== "" || hasImage
      },
      {
        message: translations.required
      }
    ),
    availData: z.array(z.any()),
    storeImage: z.string().min(1, translations.required)
  })

  // Retrieve token
  const token = session?.apiToken ?? session?.user?.apiToken ?? ""

  // Initialize selected location from stored data
  useEffect(() => {
    const currentStoreData = storeData[activeLang]
    if (currentStoreData?.storeLocationLatLng) {
      setSelectedLocationName(currentStoreData.storeLocationLatLng)
    }
  }, [activeLang, storeData])

  // fetch once on mount
  // useEffect(() => {
  //   const fetchFoods = async (): Promise<void> => {
  //     try {
  //       const res = await getAllFoods(token, undefined, undefined, undefined, true)
  //       if (res && res.status === 200) {
  //         const resData: Food[] = Array.isArray(res.data.foods)
  //           ? res.data.foods.map(normalizeFood)
  //           : []
  //         setFoods(resData)
  //         setFoodSuggestions(resData)
  //       } else {
  //         console.error("Failed to fetch foods:", res)
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch foods:", error)
  //     }
  //   }
  //   void fetchFoods()
  // }, [token])

  const handleFoodSearch = async (): Promise<void> => {
    const searchTerm = ingredientInput.trim()

    try {
      setIsFoodSearchLoading(true)
      const res = await getAllFoods(
        token,
        undefined,
        undefined,
        searchTerm ? { search: searchTerm } : undefined,
        true
      )

      if (res && res.status === 200) {
        const resData: Food[] = Array.isArray(res.data.foods)
          ? res.data.foods.map(normalizeFood)
          : []

        setFoods(prev => {
          const merged = new Map<string | number, Food>()
          prev.forEach(item => {
            merged.set(item.id, item)
          })
          resData.forEach(item => {
            merged.set(item.id, item)
          })
          return Array.from(merged.values())
        })

        setFoodSuggestions(resData)
        setSelected(null)
        setFoodSearchDropdownTrigger(prev => prev + 1)
      } else {
        toast.error("Failed to fetch foods. Please try again.")
      }
    } catch (error) {
      console.error("Failed to fetch foods:", error)
      toast.error("Failed to fetch foods. Please try again.")
    } finally {
      setIsFoodSearchLoading(false)
    }
  }

  useEffect(() => {
    const fetchTags = async (): Promise<void> => {
      try {
        const res = await getAllTags(token, "Type")
        if (res && res.status === 200 && Array.isArray(res.data)) {
          setCategoryTags(res.data)
        } else {
          setCategoryTags([])
          console.error("Failed to fetch tags or tags not an array:", res)
        }
      } catch (err) {
        setCategoryTags([])
        console.error("Error fetching tags:", err)
      }
    }
    void fetchTags()
  }, [token])

  useEffect(() => {
    const fetchStoreData = async (): Promise<void> => {
      try {
        const res = await getStoreCategories()
        if (res && res.status === 200 && Array.isArray(res.data)) {
          const categories = res.data.filter(
            (item: any) => item.Tag === "Category"
          )
          const types = res.data.filter((item: any) => item.Tag === "Type")

          setStoreCategories(categories)
          setStoreTypes(types)
        } else {
          setStoreCategories([])
          setStoreTypes([])
          console.error("Failed to fetch store data:", res)
        }
      } catch (err) {
        setStoreCategories([])
        setStoreTypes([])
        console.error("Error fetching store data:", err)
      }
    }
    void fetchStoreData()
  }, [])

  // Form hook
  const form = useForm<z.infer<typeof AddStoreSchema>>({
    resolver: zodResolver(AddStoreSchema),
    defaultValues: {
      ...storeData[activeLang],
      category: storeData[activeLang]?.category || "",
      storeImage: storeData[activeLang]?.storeImage || "",
      storeLocation: storeData[activeLang]?.storeLocation || ""
    }
  })

  const selectedStoreTypeValue = form.watch("storeType")
  const isNutritionistSelected = React.useMemo(
    () => isNutritionistType(selectedStoreTypeValue),
    [selectedStoreTypeValue, storeTypes]
  )

  // Update form when lang changes
  useEffect(() => {
    const currentStoreData = storeData[activeLang]
    if (currentStoreData?.storeLocationLatLng) {
      setSelectedLocationName(currentStoreData.storeLocationLatLng)
    } else {
      setSelectedLocationName(null)
    }

    form.reset({
      ...currentStoreData,
      category: currentStoreData?.category || "",
      storeImage: currentStoreData?.storeImage || "",
      storeLocation: currentStoreData?.storeLocation || ""
    })
  }, [activeLang, form, storeData])

  // Convert store categories to dropdown options
  const getCategoryOptions = (): Option[] => {
    if (!Array.isArray(storeCategories) || storeCategories.length === 0) {
      return []
    }
    return storeCategories
      .map(category => ({
        value: category.id.toString(),
        label: activeLang === "en" ? category.TagName : category.TagNameFr
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }

  // Convert store types to dropdown options
  const getStoreTypeOptions = (): Option[] => {
    if (!Array.isArray(storeTypes) || storeTypes.length === 0) {
      return []
    }
    return storeTypes.map(type => ({
      value: type.id.toString(),
      label:
        activeLang === "en"
          ? type.TagName.charAt(0).toUpperCase() + type.TagName.slice(1)
          : type.TagNameFr.charAt(0).toUpperCase() + type.TagNameFr.slice(1)
    }))
  }

  // Update form when lang changes
  React.useEffect(() => {
    const currentStoreData = storeData[activeLang]
    const recreatePreview = async (): Promise<void> => {
      if (currentStoreData?.storeImage) {
        try {
          if (currentStoreData.storeImage.startsWith("data:")) {
            const response = await fetch(currentStoreData.storeImage)
            const blob = await response.blob()
            const previewUrl = URL.createObjectURL(blob)
            setImagePreviewUrls([previewUrl])
          } else {
            setImagePreviewUrls([currentStoreData.storeImage])
          }
        } catch (error) {
          console.error("Error creating preview from base64:", error)
          setImagePreviewUrls([])
        }
      } else {
        setImagePreviewUrls([])
      }
    }

    // Convert stored TagName/TagNameFr
    let categoryId = ""
    let storeTypeId = ""

    if (currentStoreData?.category) {
      const categoryMatch = storeCategories.find(
        cat =>
          (activeLang === "en" ? cat.TagName : cat.TagNameFr) ===
          currentStoreData.category
      )
      categoryId = categoryMatch ? categoryMatch.id.toString() : ""
    }

    if (currentStoreData?.storeType) {
      const typeMatch = storeTypes.find(
        type =>
          (activeLang === "en" ? type.TagName : type.TagNameFr) ===
          currentStoreData.storeType
      )
      storeTypeId = typeMatch ? typeMatch.id.toString() : ""
    }

    const formData = {
      ...currentStoreData,
      storeImage: currentStoreData?.storeImage || "",
      category: categoryId,
      storeType: storeTypeId,
      storeLocation: currentStoreData?.storeLocation || ""
    }

    form.reset(formData)

    void recreatePreview()
  }, [activeLang, form, storeData, storeCategories, storeTypes])

  const handleLocationName = (value: OptionType | null): void => {
    setSelectedLocationName(value)
  }

  const handleLocationSelect = async (value: string[]): Promise<void> => {
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

    form.setValue("storeLocation", selectedLocation.label)

    setTranslationField(
      "storeData",
      activeLang,
      "storeLocation",
      selectedLocation.label
    )
    setTranslationField(
      "storeData",
      activeLang === "en" ? "fr" : "en",
      "storeLocation",
      selectedLocation.label
    )

    setTranslationField(
      "storeData",
      activeLang,
      "storeLocationLatLng",
      selectedLocation
    )
    setTranslationField(
      "storeData",
      activeLang === "en" ? "fr" : "en",
      "storeLocationLatLng",
      selectedLocation
    )
  }

  // Input change handler for fields that need translation
  const handleInputChange = (
    fieldName:
      | "storeName"
      | "phone"
      | "email"
      | "website"
      | "facebook"
      | "instagram",
    value: string
  ): void => {
    form.setValue(fieldName, value)
    setTranslationField("storeData", activeLang, fieldName, value)
  }

  // Input blur handler for translation
  const handleInputBlur = async (
    fieldName:
      | "storeName"
      | "phone"
      | "email"
      | "website"
      | "facebook"
      | "instagram",
    value: string
  ): Promise<void> => {
    if (activeLang === "en" && value.trim()) {
      setTranslationField("storeData", "fr", fieldName, value)
    }
  }

  const handleSubscriptionToggle = (value: boolean): void => {
    setIsPremium(value)
    setTranslationField("storeData", activeLang, "subscriptionType", value)

    const opp = activeLang === "en" ? "fr" : "en"
    setTranslationField("storeData", opp, "subscriptionType", value)
    form.setValue("subscriptionType", value)
  }

  const handleTimeChange =
    (field: any, name: "timeFrom" | "timeTo") => (value: string) => {
      field.onChange(value)
      setTranslationField("storeData", activeLang, name, value)

      const opp = activeLang === "en" ? "fr" : "en"
      setTranslationField("storeData", opp, name, value)
      form.setValue(name, value)
    }

  // Function to update select fields
  const handleSelectChange = (
    fieldName: "category" | "storeType",
    value: string
  ): void => {
    form.setValue(fieldName, value)

    if (fieldName === "category") {
      // Find the selected category and store TagName/TagNameFr
      const selectedCategory = storeCategories.find(
        cat => cat.id.toString() === value
      )
      if (selectedCategory) {
        setTranslationField(
          "storeData",
          "en",
          fieldName,
          selectedCategory.TagName
        )
        setTranslationField(
          "storeData",
          "fr",
          fieldName,
          selectedCategory.TagNameFr
        )
      }
    } else if (fieldName === "storeType") {
      // Find the selected store type and store TagName/TagNameFr
      const selectedType = storeTypes.find(type => type.id.toString() === value)
      if (selectedType) {
        setTranslationField("storeData", "en", fieldName, selectedType.TagName)
        setTranslationField(
          "storeData",
          "fr",
          fieldName,
          selectedType.TagNameFr
        )
      }
    }
  }

  const makeRichHandlers = (
    fieldName: "about"
  ): { onChange: (val: string) => void } => {
    const onChange = (val: string): void => {
      form.setValue(fieldName, val)
      setTranslationField("storeData", activeLang, fieldName, val)
    }
    return { onChange }
  }
  const richTextFieldOnBlur = async (fieldName: "about"): Promise<void> => {
    if (activeLang === "en") {
      const val = form.getValues(fieldName)
      if (typeof val === "string" && val.trim().length > 0) {
        setIsTranslating(true)
        try {
          const translated = await translateText(val)
          setTranslationField("storeData", "fr", fieldName, translated)
        } finally {
          setIsTranslating(false)
        }
      }
    }
  }
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
      accessor: (row: AvailableItem) => {
        const index = availData.findIndex(
          item =>
            item.ingOrCatId === row.ingOrCatId &&
            item.type === row.type &&
            item.name === row.name
        )
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={row.status === "Active"}
              className="scale-75"
              onCheckedChange={checked => {
                handleToggleAvailability(index, checked)
              }}
            />
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
          </div>
        )
      }
    },
    {
      header: translations.displayStatus,
      accessor: (row: AvailableItem) => {
        const index = availData.findIndex(
          item =>
            item.ingOrCatId === row.ingOrCatId &&
            item.type === row.type &&
            item.name === row.name
        )
        function handleToggleDisplay(index: number, checked: boolean): void {
          const currentOnCount = availData.filter(item => item.display).length
          if (checked && currentOnCount >= 3) {
            toast.error(`Maximum display status items are 3 in total.`)
            return
          }
          const updated = availData.map((item, i) =>
            i === index ? { ...item, display: checked } : item
          )
          setAvailData(updated)
          form.setValue("availData", updated, { shouldValidate: true })
          setTranslationField("storeData", activeLang, "availData", updated)

          // Update opposite language data
          const oppLang = activeLang === "en" ? "fr" : "en"
          const oppLangData =
            (storeData[oppLang]?.availData as AvailableItem[]) || []
          let oppUpdated: AvailableItem[]
          const itemToUpdate = availData[index]
          if (itemToUpdate.ingOrCatId === 0) {
            oppUpdated = oppLangData.map((item, i) =>
              i === index ? { ...item, display: checked } : item
            )
          } else {
            oppUpdated = oppLangData.map(item =>
              item.ingOrCatId === itemToUpdate.ingOrCatId &&
              item.type === itemToUpdate.type
                ? { ...item, display: checked }
                : item
            )
          }
          setTranslationField("storeData", oppLang, "availData", oppUpdated)
        }

        return (
          <Switch
            checked={row.display}
            className="scale-75"
            onCheckedChange={checked => {
              handleToggleDisplay(index, checked)
            }}
          />
        )
      }
    },
    {
      header: "", // No header for delete column
      accessor: (row: AvailableItem) => {
        const index = availData.findIndex(
          item =>
            item.ingOrCatId === row.ingOrCatId &&
            item.type === row.type &&
            item.name === row.name
        )
        return (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 border border-gray-300 hover:bg-gray-100"
            onClick={() => {
              handleDeleteAvailItem(index)
            }}
            title={translations.delete}
          >
            <Trash className="h-4 w-4 text-gray-500" />
          </Button>
        )
      },
      id: "delete"
    }
  ]

  // Add this function before availColumns
  const handleToggleAvailability = (index: number, checked: boolean): void => {
    const updated = availData.map((item, i) =>
      i === index
        ? {
            ...item,
            status: checked
              ? ("Active" as "Active")
              : ("Inactive" as "Inactive")
          }
        : item
    )
    setAvailData(updated)
    form.setValue("availData", updated, { shouldValidate: true })
    setTranslationField("storeData", activeLang, "availData", updated)

    // Update opposite language data
    const oppLang = activeLang === "en" ? "fr" : "en"
    const oppLangData = (storeData[oppLang]?.availData as AvailableItem[]) || []
    let oppUpdated: AvailableItem[]
    const itemToUpdate = availData[index]
    if (itemToUpdate.ingOrCatId === 0) {
      oppUpdated = oppLangData.map((item, i) =>
        i === index
          ? { ...item, status: checked ? "Active" : "Inactive" }
          : item
      )
    } else {
      oppUpdated = oppLangData.map(item =>
        item.ingOrCatId === itemToUpdate.ingOrCatId &&
        item.type === itemToUpdate.type
          ? { ...item, status: checked ? "Active" : "Inactive" }
          : item
      )
    }
    setTranslationField("storeData", oppLang, "availData", oppUpdated)
  }

  // Delete handler for availData
  const handleDeleteAvailItem = (index: number): void => {
    if (index < 0 || index >= availData.length) {
      toast.error("Invalid item selection")
      return
    }

    const itemToDelete = availData[index]

    const updated = availData.filter((_, i) => i !== index)
    setAvailData(updated)
    form.setValue("availData", updated, { shouldValidate: true })
    setTranslationField("storeData", activeLang, "availData", updated)

    // Update opposite language data
    const oppLang = activeLang === "en" ? "fr" : "en"
    const oppLangData = (storeData[oppLang]?.availData as AvailableItem[]) || []

    let oppUpdated: AvailableItem[]

    if (itemToDelete.ingOrCatId === 0) {
      oppUpdated = oppLangData.filter((_, i) => i !== index)
    } else {
      oppUpdated = oppLangData.filter(
        item =>
          !(
            item.ingOrCatId === itemToDelete.ingOrCatId &&
            item.type === itemToDelete.type
          )
      )
    }

    setTranslationField("storeData", oppLang, "availData", oppUpdated)
  }

  // Define functions to handle page changes
  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  // Sync availData with form value and filter by active language
  useEffect(() => {
    const currentStoreData = storeData[activeLang]
    if (
      currentStoreData?.availData &&
      Array.isArray(currentStoreData.availData)
    ) {
      setAvailData(currentStoreData.availData)
      form.setValue("availData", currentStoreData.availData)
    }
  }, [activeLang, storeData, form])

  useEffect(() => {
    if (isNutritionistSelected) {
      form.clearErrors(["availData", "timeFrom", "timeTo"])
      return
    }

    if (availData.length === 0) {
      form.setError("availData", {
        type: "manual",
        message: translations.atleastoneingredientcategorymustbeadded
      })
    } else {
      form.clearErrors("availData")
    }
  }, [
    availData.length,
    form,
    isNutritionistSelected,
    translations.atleastoneingredientcategorymustbeadded
  ])

  // translated type/status using translations object
  const getTranslatedType = (type: string, lang: string): string => {
    const key = type.toLowerCase()
    return translations[key] || type
  }
  const getTranslatedStatus = (status: string, lang: string): string => {
    const key = status.toLowerCase()
    return translations[key] || status
  }

  // handler for “Add Ingredient”
  const handleAddIngredient = async (): Promise<void> => {
    const typedName = ingredientInput.trim()
    const referenceName = selected?.name ?? typedName
    if (!referenceName) return

    const lowerReference = referenceName.toLowerCase()
    const matchingFood =
      selected ??
      foods.find(food => {
        const enName = getLocalizedFoodName(food, "en").toLowerCase()
        const frName = getLocalizedFoodName(food, "fr").toLowerCase()
        return enName === lowerReference || frName === lowerReference
      })

    const displayName =
      getLocalizedFoodName(matchingFood, activeLang) || referenceName

    const isAlreadyAdded = availData.some(item => {
      if (item.type !== "Ingredient") {
        return false
      }

      if (matchingFood) {
        return item.ingOrCatId === Number(matchingFood.id)
      }

      return item.name.toLowerCase() === displayName.toLowerCase()
    })

    if (isAlreadyAdded) {
      toast.error(translations.itemAlreadyAdded || "Item already added")
      return
    }

    // Enforce max 3 display ON for ingredients
    const totalDisplayCount = availData.filter(item => item.display).length
    const entry: AvailableItem = {
      ingOrCatId: matchingFood ? Number(matchingFood.id) : 0,
      name: displayName,
      type: "Ingredient",
      tags: ["InSystem"],
      display: totalDisplayCount < 3, // Only ON if less than 3 are ON
      quantity: "",
      isMain: false,
      status: "Active"
    }

    // Update current lang
    const updated = [...(form.getValues("availData") || []), entry]
    setAvailData(updated)
    form.setValue("availData", updated, { shouldValidate: true })
    setTranslationField("storeData", activeLang, "availData", updated)

    // Prepare translated entry for opposite lang
    const oppLang = activeLang === "en" ? "fr" : "en"
    let translatedName = getLocalizedFoodName(matchingFood, oppLang)

    if (!translatedName) {
      if (oppLang === "fr" && activeLang === "en") {
        try {
          translatedName = await translateText(displayName)
        } catch {
          translatedName = displayName
        }
      } else {
        translatedName =
          getLocalizedFoodName(matchingFood, activeLang) || displayName
      }
    }

    const translatedType = getTranslatedType(entry.type, oppLang)
    const translatedStatus = getTranslatedStatus(entry.status, oppLang)
    const translatedEntry: AvailableItem = {
      ...entry,
      name: translatedName,
      type: translatedType,
      status: translatedStatus as "Active" | "Inactive"
    }
    // Only pass translated data to opposite lang
    const oppUpdated = [
      ...((storeData[oppLang]?.availData as AvailableItem[]) || []),
      translatedEntry
    ]
    setTranslationField("storeData", oppLang, "availData", oppUpdated)
    toast.success(
      translations.itemAddedSuccessfully || "Item added successfully"
    )
    setSelected(null)
    setIngredientInput("")
  }

  // handler for “Add Category”
  const handleAddCategory = async (): Promise<void> => {
    const name = selectedCategory
      ? (activeLang === "en"
          ? selectedCategory.tagName
          : selectedCategory.tagNameFr) ?? ""
      : categoryInput.trim()
    if (!name) return

    const matchingCategory =
      selectedCategory ??
      categoryTags.find(tag => {
        const tagDisplayName =
          activeLang === "en" ? tag.tagName ?? "" : tag.tagNameFr ?? ""
        return tagDisplayName.toLowerCase() === name.toLowerCase()
      })

    const isAlreadyAdded = availData.some(item => {
      if (item.type !== "Category") {
        return false
      }

      if (matchingCategory) {
        return item.ingOrCatId === Number(matchingCategory.id)
      } else {
        return item.name.toLowerCase() === name.toLowerCase()
      }
    })

    if (isAlreadyAdded) {
      toast.error(translations.itemAlreadyAdded || "Item already added")
      return
    }

    // Enforce max 3 display ON for categories
    const totalDisplayCount = availData.filter(item => item.display).length
    const entry: AvailableItem = {
      ingOrCatId: matchingCategory ? Number(matchingCategory.id) : 0,
      name: matchingCategory
        ? activeLang === "en"
          ? matchingCategory.tagName ?? name
          : matchingCategory.tagNameFr ?? name
        : name,
      type: "Category",
      tags: ["InSystem"],
      display: totalDisplayCount < 3, // Only ON if less than 3 total items are ON
      quantity: "",
      isMain: false,
      status: "Active"
    }

    // Update current lang
    const updated = [...(form.getValues("availData") || []), entry]
    setAvailData(updated)
    form.setValue("availData", updated, { shouldValidate: true })
    setTranslationField("storeData", activeLang, "availData", updated)

    // Prepare translated entry for opposite lang
    const oppLang = activeLang === "en" ? "fr" : "en"
    let translatedName = name
    try {
      translatedName = await translateText(name)
    } catch {
      translatedName = name
    }
    const translatedType = getTranslatedType(entry.type, oppLang)
    const translatedStatus = getTranslatedStatus(entry.status, oppLang)
    const translatedEntry: AvailableItem = {
      ...entry,
      name: translatedName,
      type: translatedType,
      status: translatedStatus as "Active" | "Inactive"
    }
    // Only pass translated data to opposite lang
    const oppUpdated = [
      ...((storeData[oppLang]?.availData as AvailableItem[]) || []),
      translatedEntry
    ]
    setTranslationField("storeData", oppLang, "availData", oppUpdated)

    // Show success message and clear for next
    toast.success(
      translations.itemAddedSuccessfully || "Item added successfully"
    )
    setSelectedCategory(null)
    setCategoryInput("")
  }

  const handleImageSelect = async (files: File[] | null): Promise<void> => {
    const file = files?.[0] ?? null
    if (file) {
      try {
        setIsTranslating(true)

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") ?? ""
            : ""
        const userName = token ? "user" : "anonymous"

        const tempImageUrl = await uploadImageToFirebase(
          file,
          "stores/temp-store-images",
          `temp-store-image-${userName}-${Date.now()}`
        )

        form.setValue("storeImage", tempImageUrl, {
          shouldValidate: true,
          shouldDirty: true
        })

        setTranslationField("storeData", "en", "storeImage", tempImageUrl)
        setTranslationField("storeData", "fr", "storeImage", tempImageUrl)
        setTranslationField("storeData", "en", "storeImageName", file.name)
        setTranslationField("storeData", "fr", "storeImageName", file.name)

        setImagePreviewUrls([tempImageUrl])
      } catch (error) {
        toast.error("Image upload failed. Please try again.")
        console.error("Firebase upload error:", error)
      } finally {
        setIsTranslating(false)
      }
    } else {
      form.setValue("storeImage", "")
      setTranslationField("storeData", "en", "storeImage", "")
      setTranslationField("storeData", "fr", "storeImage", "")
      setTranslationField("storeData", "en", "storeImageName", "")
      setTranslationField("storeData", "fr", "storeImageName", "")
      setImagePreviewUrls([])
    }
  }

  const handleCancel = (
    form: ReturnType<typeof useForm<z.infer<typeof AddStoreSchema>>>
  ): void => {
    form.reset()
    // clear store and session
    resetForm()
    sessionStorage.removeItem("store-store")

    if (onClose) {
      onClose()
    }
  }

  const onSubmit = async (
    data: z.infer<typeof AddStoreSchema>
  ): Promise<void> => {
    const nutritionist = isNutritionistType(data.storeType)
    let hasError = false

    if (nutritionist) {
      form.clearErrors(["timeFrom", "timeTo", "availData"])
    } else {
      if (!data.timeFrom) {
        form.setError("timeFrom", {
          type: "manual",
          message: translations.required
        })
        hasError = true
      } else {
        form.clearErrors("timeFrom")
      }

      if (!data.timeTo) {
        form.setError("timeTo", {
          type: "manual",
          message: translations.required
        })
        hasError = true
      } else {
        form.clearErrors("timeTo")
      }

      if (!data.availData || data.availData.length === 0) {
        form.setError("availData", {
          type: "manual",
          message: translations.atleastoneingredientcategorymustbeadded
        })
        hasError = true
      } else {
        form.clearErrors("availData")
      }
    }

    if (hasError) {
      return
    }

    try {
      if (onAddStore) {
        await onAddStore()
      } else {
        toast(translations.formSubmittedSuccessfully, {})
      }
    } catch (error) {
      toast.error(
        translations.formSubmissionFailed || "Form submission failed."
      )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="pb-6">
          {/* Store info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div>
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.storeName}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterStoreName}
                        {...field}
                        onChange={e => {
                          handleInputChange("storeName", e.target.value)
                        }}
                        onBlur={async () => {
                          await handleInputBlur("storeName", field.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      {translations.category}
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={value => {
                          handleSelectChange("category", value)
                        }}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue
                            placeholder={translations.selectCategory}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {getCategoryOptions().map(option => (
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
            <div>
              <FormField
                control={form.control}
                name="storeLocation"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.storeLocation}
                    </FormLabel>
                    <FormControl>
                      <LocationDropdown
                        key={selectedLocationName?.value ?? activeLang}
                        selectedOption={selectedLocationName}
                        onSelect={handleLocationSelect}
                        onSelectLocation={handleLocationName}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="storeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      {translations.storeType}
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={value => {
                          handleSelectChange("storeType", value)
                        }}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue
                            placeholder={translations.selectStoreType}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {getStoreTypeOptions().map(option => (
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

            {!isNutritionistSelected && (
              <>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex gap-7 items-center">
                    <div className="flex flex-col">
                      <Label htmlFor="time-from" className="mb-[6px]">
                        {translations.from}
                      </Label>
                      <FormField
                        control={form.control}
                        name="timeFrom"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="time"
                                value={field.value}
                                onChange={e => {
                                  handleTimeChange(
                                    field,
                                    "timeFrom"
                                  )(e.target.value)
                                }}
                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="time-to" className="mb-[6px]">
                        {translations.to}
                      </Label>
                      <FormField
                        control={form.control}
                        name="timeTo"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="time"
                                value={field.value}
                                onChange={e => {
                                  handleTimeChange(
                                    field,
                                    "timeTo"
                                  )(e.target.value)
                                }}
                                className=" bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div></div>
              </>
            )}
            <div>
              <Label className="text-black mb-1 block">
                {translations.subscription}
              </Label>
              <FormField
                control={form.control}
                name="subscriptionType"
                render={({ field }) => (
                  <div className="flex items-center gap-4 mt-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={value => {
                        field.onChange(value)
                        handleSubscriptionToggle(value)
                      }}
                    />
                    <Label className="text-Primary-300">
                      {field.value
                        ? translations.premium
                        : translations.freemium}
                    </Label>
                  </div>
                )}
              />
            </div>
            <div>
              <Label className="text-black mb-1 block">
                {translations.deliverible}
              </Label>
              <FormField
                control={form.control}
                name="deliverible"
                render={({ field }) => (
                  <div className="flex items-center gap-4 mt-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={value => {
                        field.onChange(value)
                        setTranslationField(
                          "storeData",
                          activeLang,
                          "deliverible",
                          value
                        )
                        setTranslationField(
                          "storeData",
                          activeLang === "en" ? "fr" : "en",
                          "deliverible",
                          value
                        )
                        form.setValue("deliverible", value)
                      }}
                    />
                    <Label className="text-Primary-300">
                      {field.value ? translations.yes : translations.no}
                    </Label>
                  </div>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Contact info */}
          <DialogTitle className="pt-4">
            {translations.storeContact}
          </DialogTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 mb-6">
            <div>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.mobileNumber}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterStoreNumber}
                        {...field}
                        onChange={e => {
                          handleInputChange("phone", e.target.value)
                        }}
                        onBlur={async () => {
                          await handleInputBlur("phone", field.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="text-xs text-gray-500 mt-1">
                      {translations.required}
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.email}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterStoreEmail}
                        {...field}
                        onChange={e => {
                          handleInputChange("email", e.target.value)
                        }}
                        onBlur={async () => {
                          await handleInputBlur("email", field.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="text-xs text-gray-500 mt-1">
                      {translations.required}
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.facebook}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterFacebookUrl}
                        {...field}
                        onChange={e => {
                          handleInputChange("facebook", e.target.value)
                        }}
                        onBlur={async () => {
                          await handleInputBlur("facebook", field.value ?? "")
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.instagram}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterInstagramUrl}
                        {...field}
                        onChange={e => {
                          handleInputChange("instagram", e.target.value)
                        }}
                        onBlur={async () => {
                          await handleInputBlur("instagram", field.value ?? "")
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.website}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterWebsiteUrl}
                        {...field}
                        onChange={e => {
                          handleInputChange("website", e.target.value)
                        }}
                        onBlur={async () => {
                          await handleInputBlur("website", field.value ?? "")
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Available Products */}
          <DialogTitle className="pt-4">
            {translations.availableProducts}
          </DialogTitle>
          <div className="flex flex-col gap-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
              <div className="flex flex-row gap-2 items-center mb-2 flex-1">
                <div className="flex-1">
                  <SearchBar
                    title={translations.selectAvailableIngredients}
                    placeholder={translations.searchForIngredients}
                    dataList={foodSuggestions.map(f => ({
                      id: f.id,
                      name:
                        activeLang === "fr"
                          ? f.nameFR ?? f.name ?? ""
                          : f.name ?? ""
                    }))}
                    value={ingredientInput}
                    onInputChange={value => {
                      setIngredientInput(value)
                      setSelected(null)
                    }}
                    onSelect={item => {
                      const matched = foods.find(
                        food => String(food.id) === String(item.id)
                      )
                      setSelected(
                        matched ?? {
                          id: item.id,
                          name: item.name,
                          nameFR: item.name
                        }
                      )
                      setIngredientInput(item.name)
                    }}
                    onSearch={handleFoodSearch}
                    searchLoading={isFoodSearchLoading}
                    searchButtonLabel={translations.searchForIngredients}
                    dropdownOpenTrigger={foodSearchDropdownTrigger}
                  />
                </div>
                <div className="flex items-end h-full mt-7">
                  <Button type="button" onClick={handleAddIngredient}>
                    {translations.add}
                  </Button>
                </div>
              </div>

              <div className="flex flex-row gap-2 items-center mb-2 flex-1">
                <div className="flex-1">
                  <SearchBar
                    title={translations.selectAvailableCategories}
                    placeholder={translations.searchAvailableCategories}
                    dataList={categoryTags.map(tag => ({
                      id: tag.id,
                      name:
                        activeLang === "en"
                          ? tag.tagName ?? ""
                          : tag.tagNameFr ?? ""
                    }))}
                    value={categoryInput}
                    onInputChange={setCategoryInput}
                    onSelect={item => {
                      const selectedTag = categoryTags.find(
                        tag => tag.id === item.id
                      )
                      setSelectedCategory(selectedTag ?? null)
                      setCategoryInput(item.name)
                    }}
                  />
                </div>
                <div className="flex items-end h-full mt-7">
                  <Button type="button" onClick={handleAddCategory}>
                    {translations.add}
                  </Button>
                </div>
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
                  {!isNutritionistSelected &&
                    form.formState.errors.availData && (
                      <FormMessage className="text-red-500">
                        {form.formState.errors.availData.message?.toString() ??
                          translations.atleastoneingredientcategorymustbeadded}
                      </FormMessage>
                    )}
                </>
              )}
            />
          </div>

          <Separator />

          {/* About The Shop */}
          <DialogTitle className="pt-4">
            {translations.aboutTheShop}
          </DialogTitle>
          <div className="flex flex-col gap-6 pt-4 pb-6">
            <div>
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => {
                  const { onChange } = makeRichHandlers("about")
                  return (
                    <FormItem className="relative">
                      {/* Removed isTranslating overlay animation here */}
                      <FormLabel>{translations.aboutUs}</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          initialContent={field.value}
                          onChange={val => {
                            onChange(val)
                            field.onChange(val)
                          }}
                          onBlur={async () => {
                            await richTextFieldOnBlur("about")
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Upload Images */}
          <DialogTitle className="pt-4">
            {translations.uploadImages}
          </DialogTitle>
          <div className="pt-4 w-full sm:w-2/5 pb-8">
            <FormField
              control={form.control}
              name="storeImage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      title={translations.selectImagesForYourStore}
                      onChange={handleImageSelect}
                      previewUrls={imagePreviewUrls}
                      uploadText={translations.imagesContentText}
                      uploadSubText={translations.imagesSubContentText}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <DialogFooter>
          {/* Save and Cancel buttons */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t py-4 px-4 flex justify-between gap-2 z-50">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleCancel(form)
              }}
            >
              {translations.cancel}
            </Button>
            {/* save button */}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex gap-2 items-center">
                  <span className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  {translations.save}
                </div>
              ) : (
                translations.save
              )}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  )
}
