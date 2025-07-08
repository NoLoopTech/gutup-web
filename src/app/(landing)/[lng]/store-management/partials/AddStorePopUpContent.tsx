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

const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)

interface Food {
  id: number | string
  name?: string
  tagName?: string
}

interface Option {
  value: string
  label: string
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

const categoryOptions: Record<string, Option[]> = {
  en: [
    { value: "breakfast", label: "Breakfast" },
    { value: "dinner", label: "Dinner" },
    { value: "dairy", label: "Dairy" }
  ],
  fr: [
    { value: "breakfast", label: "Petit déjeuner" },
    { value: "dinner", label: "Dîner" },
    { value: "dairy", label: "Produits laitiers" }
  ]
}

const storeTypeOptions: Record<string, Option[]> = {
  en: [
    { value: "physical", label: "Physical" },
    { value: "online", label: "Online" }
  ],
  fr: [
    { value: "physical", label: "Physique" },
    { value: "online", label: "En ligne" }
  ]
}

export default function AddStorePopUpContent({
  translations,
  onAddStore,
  isLoading
}: {
  translations: translationsTypes
  onAddStore?: () => Promise<void>
  isLoading?: boolean
}): JSX.Element {
  const { translateText } = useTranslation()
  const { activeLang, storeData, setTranslationField } = useStoreStore() as any
  const [isTranslating, setIsTranslating] = useState(false)
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(5)
  const [, setIsPremium] = React.useState(false)
  const [foods, setFoods] = useState<Food[]>([])
  const [categoryTags, setCategoryTags] = useState<Food[]>([])
  const [availData, setAvailData] = useState<AvailableItem[]>([])
  const [selected, setSelected] = useState<Food | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [ingredientInput, setIngredientInput] = useState<string>("")
  const [categoryInput, setCategoryInput] = useState<string>("")
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

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

  // Retrieve token
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : ""

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

  // Form hook
  const form = useForm<z.infer<typeof AddStoreSchema>>({
    resolver: zodResolver(AddStoreSchema),
    defaultValues: {
      ...storeData[activeLang],
      category: storeData[activeLang]?.category || "",
      storeImage: storeData[activeLang]?.storeImage || ""
    }
  })

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

    form.reset({
      ...currentStoreData,
      storeImage: currentStoreData?.storeImage || ""
    })

    void recreatePreview()
  }, [activeLang, form, storeData])

  // Input change handler for fields that need translation
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
      try {
        setIsTranslating(true)
        const translated = await translateText(value)
        setTranslationField("storeData", "fr", fieldName, translated)
      } finally {
        setIsTranslating(false)
      }
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

  // Function to update select fields (category, season, country)
  const handleSelectChange = (
    fieldName: "category" | "storeType",
    value: string
  ): void => {
    form.setValue(fieldName, value)

    // Get the correct options set
    let optionsMap: Record<string, Option[]>
    if (fieldName === "category") optionsMap = categoryOptions
    else optionsMap = storeTypeOptions

    const current = optionsMap[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = optionsMap[oppositeLang]

    // Find the selected option in current language
    const index = current.findIndex(opt => opt.value === value)

    if (index !== -1 && opposite[index]) {
      // Store the value for current language
      setTranslationField("storeData", activeLang, fieldName, value)

      // Store the same value for opposite language (since value is same across languages)
      setTranslationField("storeData", oppositeLang, fieldName, value)
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
      accessor: (row: AvailableItem) => (
        <Badge
          className={
            row.tags.includes("InSystem")
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
        <Switch checked={row.display} className="scale-75" />
      )
    },
    {
      header: "", // No header for delete column
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
    setTranslationField(
      "storeData",
      activeLang === "en" ? "fr" : "en",
      "availData",
      updated
    )
  }

  // Define functions to handle page changes
  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  // Sync availData with form value
  useEffect(() => {
    const formAvailData = form.watch("availData")
    if (Array.isArray(formAvailData) && formAvailData !== availData) {
      setAvailData(formAvailData)
    }
  }, [form.watch("availData")])

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
    const name = selected?.name ?? ingredientInput.trim()
    if (!name) return

    const entry: AvailableItem = {
      id: selected ? Number(selected.id) : Date.now(),
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
  }

  // handler for “Add Category”
  const handleAddCategory = async (): Promise<void> => {
    const name = selectedCategory ?? categoryInput.trim()
    if (!name) return

    const entry: AvailableItem = {
      id: Date.now(),
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
  }

  const handleImageSelect = async (files: File[] | null): Promise<void> => {
    const file = files?.[0] ?? null
    if (file) {
      try {
        setIsTranslating(true)

        // Upload image to Firebase
        const imageUrl = await uploadImageToFirebase(
          file,
          "add-store",
          file.name
        )

        // Convert file to base64 for session storage
        const reader = new FileReader()
        reader.onload = () => {
          const base64String = reader.result as string

          // Update form with the Firebase URL
          form.setValue("storeImage", imageUrl, {
            shouldValidate: true,
            shouldDirty: true
          })

          // Store in session storage for both languages with base64 and filename
          setTranslationField("storeData", "en", "storeImage", base64String)
          setTranslationField("storeData", "fr", "storeImage", base64String)
          setTranslationField("storeData", "en", "storeImageName", file.name)
          setTranslationField("storeData", "fr", "storeImageName", file.name)

          setImagePreviewUrls([imageUrl])
        }
        reader.readAsDataURL(file)
      } catch (error) {
        toast.error("Image upload failed. Please try again.")
        console.error("Firebase upload error:", error)
      } finally {
        setIsTranslating(false)
      }
    } else {
      // Handle file removal
      form.setValue("storeImage", "")
      setTranslationField("storeData", "en", "storeImage", null)
      setTranslationField("storeData", "fr", "storeImage", null)
      setTranslationField("storeData", "en", "storeImageName", null)
      setTranslationField("storeData", "fr", "storeImageName", null)
      setImagePreviewUrls([])
    }
  }

  const handleCancel = (
    form: ReturnType<typeof useForm<z.infer<typeof AddStoreSchema>>>
  ): void => {
    form.reset()
  }
  const onSubmit = async (
    data: z.infer<typeof AddStoreSchema>
  ): Promise<void> => {
    if (onAddStore) {
      await onAddStore()
    } else {
      toast(translations.formSubmittedSuccessfully, {})
    }
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
                          {categoryOptions[activeLang].map(option => (
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
                          {storeTypeOptions[activeLang].map(option => (
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
                    {/* Add a small informational note */}
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
                    {/* Add a small informational note */}
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
                      name: tag.tagName ?? ""
                    }))}
                    value={categoryInput}
                    onInputChange={setCategoryInput}
                    onSelect={item => {
                      setSelectedCategory(item.name)
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
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleCancel(form)
              }}
            >
              {translations.cancel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : translations.save}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  )
}
