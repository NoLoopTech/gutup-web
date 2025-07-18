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
import { getStoreById, getStoreCategories } from "@/app/api/store"

const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)

interface Food {
  id: number | string
  name?: string
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
  id: number
  name: string
  type: string
  status: "Active" | "Inactive"
  display: boolean
  tags: string[]
  quantity: string
  isMain: boolean
}

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
  ingAndCatData: any[]
}

export default function EditStorePopUpContent({
  translations,
  onUpdateStore,
  isLoading,
  onClose,
  storeId,
  token,
  activeLang
}: {
  translations: translationsTypes
  onUpdateStore?: () => Promise<void>
  isLoading?: boolean
  onClose?: () => void
  storeId: number | null
  token: string
  activeLang: "en" | "fr"
}): JSX.Element {
  const { translateText } = useTranslation()
  const { storeData, setTranslationField, resetForm } = useStoreStore() as any
  const [isTranslating, setIsTranslating] = useState(false)
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(5)
  const [, setIsPremium] = React.useState(false)
  const [foods, setFoods] = useState<Food[]>([])
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
  const [, setCurrentStoreData] = useState<StoreData | null>(null)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Validation schema using Zod
  const EditStoreSchema = z.object({
    storeName: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.mustbeatleast2characters }),
    category: z.string().min(1, translations.pleaseselectacategory),
    storeLocation: z.string().min(1, translations.required),
    storeType: z.string().min(1, translations.pleaseselectaStoreType),
    subscriptionType: z.boolean().optional(),
    timeFrom: z.string().min(1, translations.required),
    timeTo: z.string().min(1, translations.required),
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
      .url(translations.invalidurlformat)
      .optional()
      .or(z.literal("")),
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
    availData: z
      .array(z.any())
      .min(1, translations.atleastoneingredientcategorymustbeadded),
    storeImage: z.string().min(1, translations.required)
  })

  // Form hook
  const form = useForm<z.infer<typeof EditStoreSchema>>({
    resolver: zodResolver(EditStoreSchema),
    defaultValues: {
      ...storeData[activeLang],
      category: storeData[activeLang]?.category || "",
      storeImage: storeData[activeLang]?.storeImage || ""
    }
  })

  // fetch store data for editing
  useEffect(() => {
    const fetchStoreData = async (): Promise<void> => {
      if (!storeId || !token) return

      try {
        setIsTranslating(true)
        const response = await getStoreById(token, storeId)

        if (response?.data) {
          const data = response.data
          setCurrentStoreData(data)

          // Transform ingAndCatData to availData format for both languages
          const transformedAvailDataEn =
            data.ingAndCatData?.map((item: any, index: number) => ({
              id: item.id || index + 1,
              name: item.name,
              type: item.type === "ingredient" ? "Ingredient" : "Category",
              status: item.availability
                ? "Active"
                : ("Inactive" as "Active" | "Inactive"),
              display: item.display,
              tags: ["InSystem"],
              quantity: "",
              isMain: false
            })) || []

          const transformedAvailDataFr =
            data.ingAndCatData?.map((item: any, index: number) => ({
              id: item.id || index + 1,
              name: item.nameFR || item.name,
              type: item.typeFR === "ingrédient" ? "Ingrédient" : "Catégorie",
              status: item.availability
                ? "Actif"
                : ("Inactif" as "Active" | "Inactive"),
              display: item.display,
              tags: ["InSystem"],
              quantity: "",
              isMain: false
            })) || []

          // Set availData for current language
          if (activeLang === "en") {
            setAvailData(transformedAvailDataEn)
          } else {
            setAvailData(transformedAvailDataFr)
          }

          setTranslationField("storeData", "en", "storeName", data.storeName)
          setTranslationField("storeData", "en", "category", data.category)
          setTranslationField(
            "storeData",
            "en",
            "storeLocation",
            data.storeLocation
          )
          setTranslationField("storeData", "en", "storeType", data.storeType)
          setTranslationField(
            "storeData",
            "en",
            "subscriptionType",
            data.subscriptionType === "premium"
          )
          setTranslationField("storeData", "en", "timeFrom", data.startTime)
          setTranslationField("storeData", "en", "timeTo", data.endTime)
          setTranslationField("storeData", "en", "phone", data.phoneNumber)
          setTranslationField("storeData", "en", "email", data.email)
          setTranslationField("storeData", "en", "website", data.website || "")
          setTranslationField(
            "storeData",
            "en",
            "facebook",
            data.facebook || ""
          )
          setTranslationField(
            "storeData",
            "en",
            "instagram",
            data.instagram || ""
          )
          setTranslationField("storeData", "en", "about", data.description)
          setTranslationField(
            "storeData",
            "en",
            "availData",
            transformedAvailDataEn
          )
          setTranslationField("storeData", "en", "storeImage", data.storeImage)

          // French data
          setTranslationField("storeData", "fr", "storeName", data.storeName)
          setTranslationField(
            "storeData",
            "fr",
            "category",
            data.categoryFR || data.category
          )
          setTranslationField(
            "storeData",
            "fr",
            "storeLocation",
            data.storeLocation
          )
          setTranslationField(
            "storeData",
            "fr",
            "storeType",
            data.storeTypeFR || data.storeType
          )
          setTranslationField(
            "storeData",
            "fr",
            "subscriptionType",
            data.subscriptionType === "premium"
          )
          setTranslationField("storeData", "fr", "timeFrom", data.startTime)
          setTranslationField("storeData", "fr", "timeTo", data.endTime)
          setTranslationField("storeData", "fr", "phone", data.phoneNumber)
          setTranslationField("storeData", "fr", "email", data.email)
          setTranslationField("storeData", "fr", "website", data.website || "")
          setTranslationField(
            "storeData",
            "fr",
            "facebook",
            data.facebook || ""
          )
          setTranslationField(
            "storeData",
            "fr",
            "instagram",
            data.instagram || ""
          )
          setTranslationField(
            "storeData",
            "fr",
            "about",
            data.descriptionFR || data.description
          )
          setTranslationField(
            "storeData",
            "fr",
            "availData",
            transformedAvailDataFr
          )
          setTranslationField("storeData", "fr", "storeImage", data.storeImage)

          setIsPremium(data.subscriptionType === "premium")

          // Set image preview
          if (data.storeImage) {
            setImagePreviewUrls([data.storeImage])
          }

          setIsDataLoaded(true)
          setHasChanges(false)
        } else {
          toast.error("Failed to load store data")
        }
      } catch (error) {
        console.error("Error fetching store data:", error)
        toast.error("Failed to load store data")
      } finally {
        setIsTranslating(false)
      }
    }

    void fetchStoreData()
  }, [storeId, token, activeLang, setTranslationField])

  // fetch foods
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

  // fetch tags
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

  // fetch store categories and types
  useEffect(() => {
    const fetchStoreData = async (): Promise<void> => {
      try {
        const res = await getStoreCategories()
        if (res && res.status === 200 && Array.isArray(res.data)) {
          // Filter data based on Tag field
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

  // Update form when lang changes or when session data changes
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

    // Convert stored TagName/TagNameFr back to IDs for form
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
      storeType: storeTypeId
    }

    if (isDataLoaded && Object.keys(formData).length > 0) {
      form.reset(formData, { keepDirty: false })
      // Reset hasChanges after form reset
      setHasChanges(false)
    }

    void recreatePreview()
  }, [activeLang, form, storeData, storeCategories, storeTypes, isDataLoaded])

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

  // Watch for form changes to set hasChanges
  useEffect(() => {
    if (!isDataLoaded) return

    const subscription = form.watch(() => {
      setHasChanges(true)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [form, isDataLoaded])

  // Reset hasChanges to false after initial data load completes
  useEffect(() => {
    if (isDataLoaded) {
      const timer = setTimeout(() => {
        setHasChanges(false)
      }, 100)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [isDataLoaded])

  // Convert store categories to dropdown options
  const getCategoryOptions = (): Option[] => {
    if (!Array.isArray(storeCategories) || storeCategories.length === 0) {
      return []
    }
    return storeCategories.map(category => ({
      value: category.id.toString(),
      label: activeLang === "en" ? category.TagName : category.TagNameFr
    }))
  }

  // Convert store types to dropdown options
  const getStoreTypeOptions = (): Option[] => {
    if (!Array.isArray(storeTypes) || storeTypes.length === 0) {
      return []
    }
    return storeTypes.map(type => ({
      value: type.id.toString(),
      label: activeLang === "en" ? type.TagName : type.TagNameFr
    }))
  }

  // Clean up session storage
  useEffect(() => {
    return () => {
      form.reset()
      resetForm()
      sessionStorage.removeItem("store-store")
    }
  }, [form, resetForm])

  // Input change handler
  const handleInputChange = (
    fieldName:
      | "storeName"
      | "storeLocation"
      | "phone"
      | "email"
      | "website"
      | "facebook"
      | "instagram",
    value: string
  ): void => {
    form.setValue(fieldName, value)
    setTranslationField("storeData", activeLang, fieldName, value)
    setHasChanges(true)
  }

  // Input blur handler for translation
  const handleInputBlur = async (
    fieldName:
      | "storeName"
      | "storeLocation"
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
    setHasChanges(true)
  }

  const handleTimeChange =
    (field: any, name: "timeFrom" | "timeTo") => (value: string) => {
      field.onChange(value)
      setTranslationField("storeData", activeLang, name, value)

      const opp = activeLang === "en" ? "fr" : "en"
      setTranslationField("storeData", opp, name, value)
      form.setValue(name, value)
      setHasChanges(true)
    }

  // Function to update select fields (category, storeType)
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

    setHasChanges(true)
  }

  const makeRichHandlers = (
    fieldName: "about"
  ): { onChange: (val: string) => void } => {
    const onChange = (val: string): void => {
      form.setValue(fieldName, val)
      setTranslationField("storeData", activeLang, fieldName, val)
      setHasChanges(true)
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
          if (translated) {
            setTranslationField("storeData", "fr", fieldName, translated)
          }
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
          {getTranslatedType(row.type, activeLang)}
        </Badge>
      )
    },
    {
      header: translations.availabilityStatus,
      accessor: (row: AvailableItem) => (
        <Badge
          className={
            row.tags.includes("InSystem")
              ? "bg-green-200 text-black text-xs px-2 py-1 rounded-md border border-green-500 hover:bg-green-100 transition-colors"
              : "bg-gray-200 text-black text-xs px-2 py-1 rounded-md border border-gray-500 hover:bg-gray-100 transition-colors"
          }
        >
          {getTranslatedStatus(row.status, activeLang)}
        </Badge>
      )
    },
    {
      header: translations.displayStatus,
      accessor: (row: AvailableItem) => (
        <Switch checked={row.display} className="scale-75" />
      )
    },
    {
      header: "",
      accessor: (row: AvailableItem) => (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 border border-gray-300 hover:bg-gray-100"
          onClick={() => {
            handleDeleteAvailItem(row.id)
          }}
          title={translations.delete}
        >
          <Trash className="h-4 w-4 text-gray-500" />
        </Button>
      ),
      id: "delete"
    }
  ]

  // Delete handler for availData
  const handleDeleteAvailItem = (id: number): void => {
    const updated = availData.filter(item => item.id !== id)
    setAvailData(updated)
    form.setValue("availData", updated, { shouldValidate: true })
    setTranslationField("storeData", activeLang, "availData", updated)

    // Also remove from opposite language by matching ID
    const oppLang = activeLang === "en" ? "fr" : "en"
    const oppCurrentData =
      (storeData[oppLang]?.availData as AvailableItem[]) || []
    const oppUpdated = oppCurrentData.filter(item => item.id !== id)
    setTranslationField("storeData", oppLang, "availData", oppUpdated)

    setHasChanges(true)
  }

  // Define functions to handle page changes
  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  // translated type/status using translations object
  const getTranslatedType = (type: string, lang: string): string => {
    const key = type.toLowerCase()
    return translations[key as keyof typeof translations] || type
  }
  const getTranslatedStatus = (status: string, lang: string): string => {
    const key = status.toLowerCase()
    return translations[key as keyof typeof translations] || status
  }

  // handler for "Add Ingredient"
  const handleAddIngredient = async (): Promise<void> => {
    const name = selected?.name ?? ingredientInput.trim()
    if (!name) return

    const entry: AvailableItem = {
      id: selected ? Number(selected.id) : 0,
      name,
      type: "Ingredient",
      tags: ["InSystem"],
      display: true,
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

    // clear for next
    setSelected(null)
    setIngredientInput("")
    setHasChanges(true)
  }

  // handler for "Add Category"
  const handleAddCategory = async (): Promise<void> => {
    const name = selectedCategory
      ? (activeLang === "en"
          ? selectedCategory.tagName
          : selectedCategory.tagNameFr) ?? ""
      : categoryInput.trim()
    if (!name) return

    const entry: AvailableItem = {
      id: selectedCategory ? Number(selectedCategory.id) : 0,
      name,
      type: "Category",
      tags: ["InSystem"],
      display: true,
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

    setSelectedCategory(null)
    setCategoryInput("")
    setHasChanges(true)
  }

  const handleImageSelect = async (files: File[] | null): Promise<void> => {
    const file = files?.[0] ?? null
    if (file) {
      try {
        setIsTranslating(true)

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
        setHasChanges(true)
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
      setHasChanges(true)
    }
  }

  const handleCancel = (): void => {
    form.reset()
    // clear store and session
    resetForm()
    sessionStorage.removeItem("store-store")
    setHasChanges(false)
    if (onClose) {
      onClose()
    }
  }

  const onSubmit = async (
    data: z.infer<typeof EditStoreSchema>
  ): Promise<void> => {
    try {
      const currentStoreData = storeData[activeLang]
      const updatedStoreData = {
        ...currentStoreData,
        ...data,
        availData
      }

      // Update the store data
      Object.entries(updatedStoreData).forEach(([key, value]) => {
        setTranslationField("storeData", activeLang, key, value)
      })

      const oppLang = activeLang === "en" ? "fr" : "en"
      const oppCurrentData = storeData[oppLang] || {}
      const oppAvailData = oppCurrentData.availData || []

      if (Array.isArray(oppAvailData) && oppAvailData.length > 0) {
        setTranslationField("storeData", oppLang, "availData", oppAvailData)
      }

      if (onUpdateStore) {
        await onUpdateStore()
      } else {
        toast(translations.formSubmittedSuccessfully, {})
        sessionStorage.removeItem("store-store")
      }
      setHasChanges(false)
    } catch (error) {
      console.error("Error in form submission:", error)
      toast.error("Failed to update store. Please try again.")
    }
  }

  if (isTranslating && !isDataLoaded) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="w-10 h-10 rounded-full border-t-4 border-blue-500 border-solid animate-spin" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="pb-6">
          {isTranslating && (
            <div className="flex absolute inset-0 z-50 justify-center items-center bg-white/60">
              <span className="w-10 h-10 rounded-full border-t-4 border-blue-500 border-solid animate-spin" />
            </div>
          )}
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
                      <Input
                        placeholder={translations.enterStoreLocation}
                        {...field}
                        onChange={e => {
                          handleInputChange("storeLocation", e.target.value)
                        }}
                        onBlur={async () => {
                          await handleInputBlur("storeLocation", field.value)
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

            <div className="flex flex-col gap-1">
              <Label>{translations.time}</Label>
              <div className="flex gap-7 items-center">
                <div className="flex flex-col">
                  <Label htmlFor="time-from" className="text-xs text-gray-400">
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
                            className="h-6 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="time-to" className="text-xs text-gray-400">
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
                              handleTimeChange(field, "timeTo")(e.target.value)
                            }}
                            className=" h-6 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
                    dataList={foods.map(f => ({
                      id: f.id,
                      name: f.name ?? ""
                    }))}
                    value={ingredientInput}
                    onInputChange={setIngredientInput}
                    onSelect={item => {
                      setSelected(item)
                      setIngredientInput(item.name)
                    }}
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
                      setSelectedCategory(item)
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
                  {availData.length === 0 && (
                    <FormMessage className="text-red-500">
                      {translations.atleastoneingredientcategorymustbeadded}
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
                      {isTranslating && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <span className="loader" />
                        </div>
                      )}
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
            <Button type="button" variant="outline" onClick={handleCancel}>
              {translations.cancel}
            </Button>
            <Button
              type="submit"
              disabled={(isLoading ?? false) || !hasChanges}
            >
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
