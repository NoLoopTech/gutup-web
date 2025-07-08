"use client"

import React, { useState, useEffect } from "react"
import { DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import dynamic from "next/dynamic"
import SearchBar from "@/components/Shared/SearchBar/SearchBar"
import { Button } from "@/components/ui/button"
import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { type RecipeFields } from "@/stores/useRecipeStore"
import LabelInput from "@/components/Shared/LableInput/LableInput"
import { type Recipe } from "@/types/recipeTypes"
import { Trash, CircleFadingPlus, MoreVertical } from "lucide-react"
import { useTranslation } from "@/query/hooks/useTranslation"
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
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRecipeStore } from "@/stores/useRecipeStore"
import { type translationsTypes } from "@/types/storeTypes"
import { getAllTagsByCategory } from "@/app/api/foods"
import {
  deleteImageFromFirebase,
  uploadImageToFirebase
} from "@/lib/firebaseImageUtils"

interface Ingredient {
  id: number
  name: string
  type: string
  status: "Active" | "Inactive"
  display: boolean
  quantity: string
  isMain: boolean
  tags: string[]
}
interface Option {
  value: string
  label: string
}

const categoryOptions: Record<string, Option[]> = {
  en: [
    { value: "fruits", label: "Fruits" },
    { value: "vegetables", label: "Vegetables" },
    { value: "dairy", label: "Dairy" },
    { value: "grains", label: "Grains" }
  ],
  fr: [
    { value: "fruits", label: "Fruits" },
    { value: "vegetables", label: "Légumes" },
    { value: "dairy", label: "Produits laitiers" },
    { value: "grains", label: "Céréales" }
  ]
}
const seasonOptions: Record<string, Option[]> = {
  en: [
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "autmn", label: "Autmn" },
    { value: "winter", label: "Winter" }
  ],
  fr: [
    { value: "spring", label: "Printemps" },
    { value: "summer", label: "Eté" },
    { value: "autmn", label: "Automne" },
    { value: "winter", label: "Hiver" }
  ]
}

// Define function for handling RichTextEditor changes

// Define function for handling image upload changes
const handleImageUpload = (field: any) => (files: File[] | null) => {
  field.onChange(files && files.length > 0 ? files[0] : null)
}

// Dynamically load RichTextEditor with SSR disabled
const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)

const translateToFrench = async (
  text: string,
  options: Record<string, Option[]>
): Promise<string> => {
  const enOption = options.en.find(
    option =>
      option.label.toLowerCase() === text.toLowerCase() ||
      option.value.toLowerCase() === text.toLowerCase()
  )
  console.log(
    "translateToFrench called with text:",
    text,
    "enOption:",
    enOption
  )
  if (!enOption) return text
  const frOption = options.fr.find(option => option.value === enOption.value)
  return frOption ? frOption.label : text
}

export default function AddRecipePopUpContent({
  translations,
  token
}: {
  translations: translationsTypes
  token: string
}): JSX.Element {
  const { activeLang, setTranslationField, allowMultiLang } = useRecipeStore()
  const { translateText } = useTranslation()
  const [isTranslating, setIsTranslating] = useState(false)
  const [foods, setFoods] = useState<Food[]>([])
  const [ingredientData, setIngredientData] = useState<Ingredient[]>([])
  const [selected, setSelected] = useState<Food | null>(null)
  const [previewFoodUrls, setPreviewFoodUrls] = useState<string[]>([])
  const [previewAuthorUrls, setPreviewAuthorUrls] = useState<string[]>([])
  const [ingredientInput, setIngredientInput] = useState<string>("")
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(5)
  // const [allBenefits, setAllBenefits] = useState<string[]>([])

  const handleSelectSync =
    (field: any, key: keyof RecipeFields) => async (value: string) => {
      field.onChange(value)
      useRecipeStore.getState().setField("en", key, value)
      if ((key === "category" || key === "season") && allowMultiLang) {
        // const translatedValue = await translateToFrench(value)
        const options = key === "category" ? categoryOptions : seasonOptions
        const translatedValue = await translateToFrench(value, options)
        useRecipeStore.getState().setField("fr", key, translatedValue)
      } else {
        void autoTranslateDropdown(key, value)
      }
    }

  const RecipeSchema = z.object({
    name: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.mustbeatleast2characters }),
    category: z.string().min(1, translations.pleaseselectacategory),
    season: z.string().min(1, translations.pleaseselectaseason),
    preparation: z.string().nonempty(translations.required),
    rest: z.string().nonempty(translations.required),
    persons: z.string().nonempty(translations.required),
    benefits: z
      .array(z.string())
      .refine(arr => arr.some(item => item.trim().length > 0), {
        message: translations.pleaseenteratleastonebenefit
      }),
    ingredientData: z
      .array(z.unknown())
      .nonempty(translations.atleastoneingredientcategorymustbeadded),
    authorName: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.mustbeatleast2characters }),
    authorCategory: z.string().min(1, translations.pleaseselectacategory),
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
    recipe: z.string().refine(
      val => {
        const plainText = val.replace(/<(.|\n)*?>/g, "").trim()
        const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val)
        return plainText !== "" || hasImage
      },
      {
        message: translations.required
      }
    ),
    // authorimage: z.custom<File | null>(val => val instanceof File, {
    //   message: translations.required
    // }),
    // foodimage: z.custom<File | null>(val => val instanceof File, {
    //   message: translations.required
    // })
    foodimage: z.string().min(1, { message: translations.required }),
    authorimage: z.string().min(1, { message: translations.required })
  })

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

  const autoTranslateDropdown = async (
    field: keyof RecipeFields,
    value: string
  ): Promise<void> => {
    if (allowMultiLang) {
      // Determine which options to use based on the field
      const options = field === "category" ? categoryOptions : seasonOptions
      const translatedValue = await translateToFrench(value, options)
      console.log("translated value check", translatedValue)
      useRecipeStore.getState().setField("fr", field, translatedValue)
    }
  }

  const onSubmit = (data: z.infer<typeof RecipeSchema>): void => {
    toast(translations.formSubmittedSuccessfully, {})
  }
  const handleCancel = (
    form: ReturnType<typeof useForm<z.infer<typeof RecipeSchema>>>
  ): void => {
    form.reset()
  }
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName:
      | "name"
      | "preparation"
      | "rest"
      | "persons"
      | "benefits"
      | "authorName"
      | "authorCategory"
      | "phone"
      | "email"
      | "website"
  ): void => {
    const value = e.target.value
    form.setValue(fieldName, value)
    setTranslationField(activeLang, fieldName, value)
    console.log(
      "handleInputChange called with value:",
      value,
      "fieldName:",
      fieldName,
      "ActiveLang:",
      activeLang
    )
  }

  const handleInputBlur = async (
    value: string,
    fieldName: keyof RecipeFields
  ): Promise<void> => {
    if (activeLang === "en" && value.trim()) {
      try {
        setIsTranslating(true)
        const translated = await translateText(value)
        setTranslationField("fr", fieldName, translated)
        console.log("translate", translated)
      } finally {
        setIsTranslating(false)
      }
    }
  }
  const handleInputBlurWithoutTranslate = async (
    value: string,
    fieldName: keyof RecipeFields
  ): Promise<void> => {
    if (activeLang === "en" && value.trim()) {
      try {
        setIsTranslating(true)
        setTranslationField("fr", fieldName, value)
      } finally {
        setIsTranslating(false)
      }
    }
  }

  const richTextFieldOnBlur = async (fieldName: "recipe"): Promise<void> => {
    if (activeLang === "en") {
      const val = form.getValues(fieldName)
      if (typeof val === "string" && val.trim().length > 0) {
        setIsTranslating(true)
        try {
          const translated = await translateText(val)
          setTranslationField("fr", fieldName, translated)
        } finally {
          setIsTranslating(false)
        }
      } else if (Array.isArray(val) && val.length) {
        setIsTranslating(true)
        try {
          const trArr = await Promise.all(
            val.map(async v => await translateText(v))
          )
          setTranslationField("fr", fieldName, trArr)
        } finally {
          setIsTranslating(false)
        }
      }
    }
  }
  const makeRichHandlers = (
    fieldName: "recipe"
  ): { onChange: (val: string) => void } => {
    const onChange = (val: string): void => {
      form.setValue(fieldName, val)
      setTranslationField(activeLang, fieldName, val)
    }
    return { onChange }
  }
  // Dummy data
  // const ingredientData: Ingredient[] = []

  // // Table columns
  // const ingredientColumns = [
  //   {
  //     header: translations.ingredientName,
  //     accessor: "name" as const
  //   },
  //   {
  //     header: translations.quantity,
  //     accessor: "quantity" as const
  //   },
  //   {
  //     header: translations.mainIngredient,
  //     accessor: (row: Ingredient) => (
  //       <Switch
  //         checked={row.isMain}
  //         className="scale-75"
  //         style={{ minWidth: 28, minHeight: 16 }}
  //       />
  //     )
  //   },
  //   {
  //     header: translations.availableInIngredients,
  //     accessor: (row: Ingredient) =>
  //       row.tags.includes("InSystem") ? (
  //         <Badge className="bg-green-200 text-black text-xs px-2 py-1 rounded-md border border-green-500 hover:bg-green-100 transition-colors">
  //           In the System
  //         </Badge>
  //       ) : (
  //         <Button
  //           variant="ghost"
  //           className="text-secondary-blue text-xs px-2 py-1 flex items-center gap-1 hover:bg-transparent focus:bg-transparent active:bg-transparent"
  //           size="sm"
  //         >
  //           <CircleFadingPlus size={14} />
  //           Add to Ingredients
  //         </Button>
  //       )
  //   }
  // ]
  // Define functions to handle page changes
  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  const handleRecipeChange = (field: any) => (val: string) => {
    field.onChange(val)
  }
  const form = useForm<z.infer<typeof RecipeSchema>>({
    resolver: zodResolver(RecipeSchema),
    defaultValues: {
      name: "",
      category: "",
      season: "",
      preparation: "",
      rest: "",
      persons: "",
      benefits: [],
      authorName: "",
      ingredientData: [],
      authorCategory: "",
      phone: "",
      email: "",
      website: "",
      recipe: "",
      authorimage: null,
      foodimage: null
    }
  })

  // table columns for available ingredients and categories
  const ingredientColumns = [
    {
      header: translations.ingredientName,
      accessor: "name" as const
    },
    {
      header: translations.type,
      accessor: (row: Ingredient) => (
        <Badge className="bg-white text-black text-xs px-2 py-1 rounded-md border border-gray-100 hover:bg-white">
          {translations[row.type?.toLowerCase() as keyof typeof translations] ||
            row.type}
        </Badge>
      )
    },
    {
      header: translations.availabilityStatus,
      accessor: (row: Ingredient) => (
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
      accessor: (row: Ingredient) => (
        <Switch checked={row.display} className="scale-75" />
      )
    },
    {
      header: "", // No header for delete column
      accessor: (row: Ingredient) => (
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

  // Delete handler for ingredientData
  const handleDeleteAvailItem = (id: number): void => {
    const updated = ingredientData.filter(item => item.id !== id)
    setIngredientData(updated)
    form.setValue("ingredientData", updated, { shouldValidate: true })
    setTranslationField(activeLang, "ingredientData", updated)
    setTranslationField(
      // "storeData",
      activeLang === "en" ? "fr" : "en",
      "ingredientData",
      updated
    )
  }

  // Sync ingredientData with form value
  useEffect(() => {
    const formIngredientData = form.watch("ingredientData")
    if (
      Array.isArray(formIngredientData) &&
      formIngredientData !== ingredientData
    ) {
      setIngredientData(formIngredientData)
    }
  }, [form.watch("ingredientData")])

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

    const entry: Ingredient = {
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
    const updated = [...(form.getValues("ingredientData") || []), entry]
    setIngredientData(updated)
    form.setValue("ingredientData", updated, { shouldValidate: true })
    setTranslationField(activeLang, "ingredientData", updated)

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
    const translatedEntry: Ingredient = {
      ...entry,
      name: translatedName,
      type: translatedType,
      status: translatedStatus as "Active" | "Inactive"
    }
    // Only pass translated data to opposite lang
    const oppUpdated = [
      ...(([oppLang]?.ingredientData as Ingredient[]) || []),
      translatedEntry
    ]
    setTranslationField(oppLang, "ingredientData", oppUpdated)

    // clear for next
    setSelected(null)
    setIngredientInput("")
  }

  // adds/removes benefits:
  function handleBenefitsChange(vals: string[]): void {
    form.setValue("benefits", vals)
    setTranslationField(activeLang, "benefits", vals)
  }

  async function handleBenefitsBlur(): Promise<void> {
    if (activeLang === "en") {
      const vals = form.getValues("benefits")
      if (vals.length) {
        setIsTranslating(true)
        try {
          const trArr = await Promise.all(
            vals.map(async v => await translateText(v))
          )
          setTranslationField("fr", "benefits", trArr)
        } finally {
          setIsTranslating(false)
        }
      }
    }
  }

  const categories: Option[] = [
    { value: "fruits", label: "Fruits" },
    { value: "vegetables", label: "Vegetables" },
    { value: "dairy", label: "Dairy" },
    { value: "grains", label: "Grains" }
  ]
  const seasons: Option[] = [
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "autumn", label: "Autumn" },
    { value: "winter", label: "Winter" }
  ]

  //  // Form hook
  //   const form = useForm<z.infer<typeof RecipeSchema>>({
  //     resolver: zodResolver(RecipeSchema),
  //     defaultValues: {
  //       ...storeData[activeLang],
  //       category: storeData[activeLang]?.category || ""
  //     }
  //   })
  useEffect(() => {
    const fetchTags = async (): Promise<void> => {
      try {
        const token = localStorage.getItem("token") ?? ""
        await getAllTagsByCategory(token, "health-benefits")
        // const tags = res?.data?.map((item: any) => item.category) || []
        // setAllBenefits(tags)
      } catch (error) {
        console.error("Failed to fetch tags", error)
      }
    }

    void fetchTags()
  }, [])

  // Sync form values with store values for the current language
  useEffect(() => {
    const store = useRecipeStore.getState()
    const fields: (keyof RecipeFields)[] = [
      "name",
      "preparation",
      "rest",
      "persons",
      "benefits",
      "authorName",
      "phone",
      "email",
      "website",
      "recipe",
      "category",
      "season",
      "ingredientData",
      "authorCategory"
    ]
    fields.forEach(field => {
      // Safely cast store[activeLang] to Record<string, unknown> before indexing
      const langData = (
        store as unknown as Record<string, Partial<RecipeFields>>
      )[activeLang]
      const value = langData
        ? (langData as Record<string, unknown>)[field]
        : undefined
      console.log(
        "Syncing field:",
        field,
        "with value:",
        value,
        "for activeLang:",
        activeLang
      )
      if (typeof value !== "undefined") {
        form.setValue(field, value)
      }
    })
  }, [activeLang])

  const handleImageSelect = async (files: File[] | null) => {
    const file = files?.[0] ?? null
    if (file) {
      try {
        setIsTranslating(true)
        const imageUrl = await uploadImageToFirebase(file, "recipes")

        form.setValue("foodimage", imageUrl, {
          shouldValidate: true,
          shouldDirty: true
        })
        setTranslationField("en", "foodimage", imageUrl)
        setTranslationField("fr", "foodimage", imageUrl)

        setPreviewFoodUrls([imageUrl]) // For single image preview
      } catch (error) {
        toast.error("Image upload failed. Please try again.")
        console.error("Firebase upload error:", error)
      } finally {
        setIsTranslating(false)
      }
    }
  }
  const handleImageSelectAuthor = async (files: File[] | null) => {
    console.log("handleImageSelect called with files:", files)

    const file = files?.[0] ?? null
    if (file) {
      try {
        setIsTranslating(true)
        const imageUrl = await uploadImageToFirebase(file, "author")
        console.log("Uploaded food image URL:", imageUrl)

        form.setValue("authorimage", imageUrl, {
          shouldValidate: true,
          shouldDirty: true
        })

        setTranslationField("en", "authorimage", imageUrl)
        setTranslationField("fr", "authorimage", imageUrl)

        setPreviewAuthorUrls([imageUrl]) // For single image preview
      } catch (error) {
        toast.error("Image upload failed. Please try again.")
        console.error("Firebase upload error:", error)
      } finally {
        setIsTranslating(false)
        console.log("No file selected for food image")
      }
    }
  }

  // useEffect(() => {
  //   const langData = allowMultiLang[activeLang]
  //   if (langData) {
  //     const existingUrl = langData.foodimage
  //     const existingAuthorUrl = langData.authorimage
  //     const imageUrls = [existingUrl, existingAuthorUrl].filter(Boolean) // remove undefined/null

  //     if (imageUrls.length > 0) {
  //       setPreviewUrls([imageUrls])
  //     } else {
  //       setPreviewUrls([])
  //     }
  //     form.reset(langData)
  //   }
  // }, [activeLang, form.reset, allowMultiLang])
  useEffect(() => {
    const langData = allowMultiLang[activeLang]
    if (langData) {
      form.reset(langData)
      if (langData.foodimage) setPreviewFoodUrls([langData.foodimage])
      else setPreviewFoodUrls(imageUrls)

      if (langData.authorimage) setPreviewAuthorUrls([langData.authorimage])
      else setPreviewAuthorUrls(imageUrls)
    }
  }, [activeLang, form.reset, allowMultiLang])

  const handleCancelImage = async (): Promise<void> => {
    //  Combine all possible image URLs (preview + stored)
    const possibleImages = [
      allowMultiLang[activeLang]?.foodimage,
      allowMultiLang[activeLang]?.authorimage
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

    setTranslationField("en", "foodimage", "")
    setTranslationField("en", "authorimage", "")

    //  Remove session data
    sessionStorage.removeItem("recipe-storage")

    // Clear preview image state
    // setPreviewUrls([])
    setPreviewFoodUrls([])
    setPreviewAuthorUrls([])

    // Close the modal or section
    onClose()
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-6">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.name}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.name}
                        {...field}
                        onChange={e => {
                          handleInputChange(e, "name")
                        }}
                        onBlur={async () => {
                          await handleInputBlur(field.value, "name")
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
                        onValueChange={handleSelectSync(field, "category")}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder={"Select Category"} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((option: Option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {translations[
                                option.value.toLowerCase() as keyof translationsTypes
                              ] || option.label}{" "}
                            </SelectItem>
                          ))}
                          {/* <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem> */}
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
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      {translations.season}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={handleSelectSync(field, "season")}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue
                            placeholder={translations.selectSeason}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {seasons.map((option: Option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {translations[
                                option.value.toLowerCase() as keyof translationsTypes
                              ] || option.label}{" "}
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
          </div>

          <Separator />

          <DialogTitle className="pt-4">
            {translations.recipeAttributes}
          </DialogTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 mb-4">
            <div>
              <FormField
                control={form.control}
                name="preparation"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.preparation}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.howLongDoesItTakeToMake}
                        {...field}
                        onChange={e => {
                          handleInputChange(e, "preparation")
                        }}
                        onBlur={async () => {
                          await handleInputBlur(field.value, "preparation")
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
                name="rest"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.rest}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.howLongToKeepItResting}
                        {...field}
                        onChange={e => {
                          handleInputChange(e, "rest")
                        }}
                        onBlur={async () => {
                          await handleInputBlur(field.value, "rest")
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
                name="persons"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.persons}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.numberOfPeopleTheMealServes}
                        {...field}
                        onChange={e => {
                          handleInputChange(e, "persons")
                        }}
                        onBlur={async () => {
                          await handleInputBlur(field.value, "persons")
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Lable inputs for the health benefits */}
          <div className="w-[100%] ">
            {isTranslating && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="w-10 h-10 rounded-full border-t-4 border-blue-500 animate-spin" />
              </div>
            )}
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <LabelInput
                  title={translations.healthBenefits}
                  placeholder={translations.healthBenefits}
                  benefits={field.value || []}
                  name="benefits"
                  width="w-[32%]"
                  onChange={(newArr: string[]) => {
                    handleBenefitsChange(newArr)
                    field.onChange(newArr)
                  }}
                  onBlur={() => {
                    void handleBenefitsBlur()
                    field.onBlur()
                  }}
                />
              )}
            />
          </div>

          <Separator className="my-4" />

          <DialogTitle>{translations.ingredientsSelection}</DialogTitle>

          <div className="flex flex-row gap-2 items-center pt-4 mb-4">
            <div className="flex-1">
              <SearchBar
                title={translations.selectYourIngredients}
                placeholder={translations.searchForIngredient}
                dataList={foods.map(f => ({ id: f.id, name: f.name }))}
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
                    {translations.availableInIngredients}
                  </FormMessage>
                )}
              </>
            )}
          />

          <Separator className="my-4" />

          <DialogTitle>{translations.describeTheRecipe}</DialogTitle>
          <div className="flex flex-col gap-6 pt-4 pb-2">
            <div>
              <FormField
                control={form.control}
                name="recipe"
                render={({ field }) => {
                  const { onChange } = makeRichHandlers("recipe")
                  return (
                    <FormItem>
                      {isTranslating && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <span className="loader" />
                        </div>
                      )}
                      <FormLabel className="block mb-2 text-black">
                        {translations.recipe}
                      </FormLabel>
                      <FormControl>
                        <RichTextEditor
                          initialContent={field.value}
                          onChange={val => {
                            onChange(val)
                            field.onChange(val)
                          }}
                          onBlur={async () => {
                            await richTextFieldOnBlur("recipe")
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

          <Separator className="my-4" />

          <DialogTitle>{translations.addAuthor}</DialogTitle>

          <div className="flex flex-col sm:flex-row gap-8 mb-4 pt-4 items-start">
            {/* Left: Author Inputs */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="block mb-1 text-black">
                        {translations.name}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={translations.addAuthorName}
                          {...field}
                          onChange={e => handleInputChange(e, "authorName")}
                          onBlur={() =>
                            handleInputBlurWithoutTranslate(
                              field.value,
                              "authorName"
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="authorCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block mb-1 text-black">
                        {translations.category}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={translations.enterAuthorSpecialty}
                          {...field}
                          onChange={e => handleInputChange(e, "authorCategory")}
                          onBlur={() =>
                            handleInputBlur(field.value, "authorCategory")
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="block mb-1 text-black">
                        {translations.phone}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={translations.enterAuthorNumber}
                          {...field}
                          onChange={e => {
                            handleInputChange(e, "phone")
                          }}
                          onBlur={async () => {
                            await handleInputBlurWithoutTranslate(
                              field.value,
                              "phone"
                            )
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
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
                          placeholder={translations.enterAuthorEmail}
                          {...field}
                          onChange={e => {
                            handleInputChange(e, "email")
                          }}
                          onBlur={async () => {
                            await handleInputBlurWithoutTranslate(
                              field.value,
                              "email"
                            )
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
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
                          placeholder={translations.enterAuthorWebSite}
                          {...field}
                          onChange={e => {
                            handleInputChange(e, "website")
                          }}
                          onBlur={async () => {
                            await handleInputBlurWithoutTranslate(
                              field.value ?? "",
                              "website"
                            )
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Right: Image Uploader */}
            <div className="w-full sm:w-2/5 ">
              <FormField
                control={form.control}
                name="authorimage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader
                        title={translations.uploadAuthorImage}
                        previewUrls={previewAuthorUrls}
                        onChange={handleImageSelectAuthor}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <DialogTitle>{translations.uploadImages}</DialogTitle>

          <div className="mt-6 pb-2 w-full sm:w-2/5">
            <FormField
              control={form.control}
              name="foodimage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      title={translations.selectImagesForYourFoodItem}
                      previewUrls={previewFoodUrls}
                      onChange={handleImageSelect}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-4" />
          <DialogFooter>
            {/* Save and Cancel buttons */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t py-4 px-4 flex justify-between gap-2 z-50">
              <Button
                variant="outline"
                onClick={() => {
                  handleCancel(form)
                }}
              >
                {translations.cancel}
              </Button>
              <Button type="submit">{translations.save}</Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </div>
  )
}
