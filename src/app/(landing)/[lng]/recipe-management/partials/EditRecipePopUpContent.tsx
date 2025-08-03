"use client"

import React, { useState, useEffect, useRef } from "react"
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
import { Trash } from "lucide-react"
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
import { type translationsTypes } from "@/types/recipeTypes"
import { getAllFoods } from "@/app/api/foods"
import LableInput from "@/components/Shared/LableInput/LableInput"
import { uploadImageToFirebase } from "@/lib/firebaseImageUtils"
import { useUpdateRecipeStore } from "@/stores/useUpdateRecipeStore"
import { useGetAllTags } from "@/query/hooks/useGetAllTags"
import { TagTypes } from "./AddRecipePopUpContent"

interface Food {
  id: number
  name: string
  status: boolean
}

interface Ingredient {
  foodId: number
  ingredientName: string
  quantity: string
  mainIngredient: boolean
  available: boolean
}
interface Option {
  value: string
  label: string
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

// Dynamically load RichTextEditor with SSR disabled
const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)

export default function EditRecipePopUpContent({
  translations,
  token,
  onClose,
  editRecipe,
  isLoading
}: {
  translations: translationsTypes
  token: string
  onClose: () => void
  editRecipe: () => void
  isLoading: boolean
}): JSX.Element {
  const {
    activeLang,
    setTranslationField,
    translations: translationData
  } = useRecipeStore()
  const { translateText } = useTranslation()
  const [isLoadingTrigger, setIsLoadingTrigger] = useState(false)
  const [foods, setFoods] = useState<Food[]>([])
  const [ingredientData, setIngredientData] = useState<Ingredient[]>([])
  const [selected, setSelected] = useState<Food | null>(null)
  const [previewFoodUrls, setPreviewFoodUrls] = useState<string[]>([])
  const [previewAuthorUrls, setPreviewAuthorUrls] = useState<string[]>([])
  const [ingredientInput, setIngredientInput] = useState<string>("")
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(5)
  const [availData, setAvailData] = useState<Ingredient[]>([])
  const [benefits, setBenefits] = useState<string[]>([])
  const { setUpdatedField } = useUpdateRecipeStore()
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [benefitsOptions, setBenefitsOptions] = useState<
    { tagName: string; tagNameFr: string }[]
  >([])
  const [categoryOptions, setCategoryOptions] = useState<
    Record<string, Option[]>
  >({
    en: [],
    fr: []
  })

  const { tags } = useGetAllTags(token, "Type") as { tags: TagTypes[] }
  const { tags: benefitsTags } = useGetAllTags(token, "Benefit") as {
    tags: TagTypes[]
  }

  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  useEffect(() => {
    if (benefitsTags?.length) {
      const suggestions = benefitsTags
        .filter(tag => tag?.category && tag?.category)
        .map(tag => ({
          tagName: tag.category,
          tagNameFr: tag.category
        }))
      setBenefitsOptions(suggestions)
    }
  }, [benefitsTags])

  useEffect(() => {
    if (tags) {
      const tagsOptions = {
        en: tags.map((tag: TagTypes) => ({
          value: tag.category,
          label: tag.category
        })),
        fr: tags.map((tag: TagTypes) => ({
          value: tag.category,
          label: tag.category
        }))
      }

      setCategoryOptions(tagsOptions)
    }
  }, [tags])

  useEffect(() => {
    // Initialize the benefits state with data from translationData store
    if (translationData[activeLang]?.benefits) {
      setBenefits(translationData[activeLang].benefits)
    }
  }, [activeLang, translationData])

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
    recipeImage: z.string().min(1, { message: translations.required }),
    authorimage: z.string().min(1, { message: translations.required })
  })

  type RecipeSchemaType = z.infer<typeof RecipeSchema>

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

  const handleCancel = async (): Promise<void> => {
    // Clear preview image state
    setPreviewFoodUrls([])
    setPreviewAuthorUrls([])

    // Close the modal or section
    onClose()
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
    setUpdatedField(activeLang, fieldName, value)
  }

  const handleInputBlur = async (
    value: string,
    fieldName: keyof RecipeFields
  ): Promise<void> => {
    if (activeLang === "en" && value.trim()) {
      try {
        const translated = await translateText(value)
        setTranslationField("fr", fieldName, translated)
        setUpdatedField("fr", fieldName, translated)
      } catch (error) {
        console.log("Error Translating", error)
      }
    }
  }

  const handleInputBlurWithoutTranslate = async (
    value: string,
    fieldName: keyof RecipeFields
  ): Promise<void> => {
    if (activeLang === "en" && value.trim()) {
      try {
        setTranslationField("fr", fieldName, value)
        setUpdatedField("fr", fieldName, value)
      } catch (error) {
        console.log("Error Translating", error)
      }
    }
  }

  const richTextFieldOnBlur = async (fieldName: "recipe"): Promise<void> => {
    if (activeLang === "en") {
      const val = form.getValues(fieldName)
      if (typeof val === "string" && val.trim().length > 0) {
        try {
          const translated = await translateText(val)

          setTranslationField("fr", fieldName, translated)
          setUpdatedField("fr", fieldName, translated)
        } catch (error) {
          console.log("Error Translating", error)
        }
      } else if (Array.isArray(val) && val.length) {
        try {
          const trArr = await Promise.all(
            val.map(async v => await translateText(v))
          )

          setTranslationField("fr", fieldName, trArr)
          setUpdatedField("fr", fieldName, trArr)
        } catch (error) {
          console.log("Error Translating", error)
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
      setUpdatedField(activeLang, fieldName, val)
    }

    return { onChange }
  }

  // Define functions to handle page changes
  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  const form = useForm<z.infer<typeof RecipeSchema>>({
    resolver: zodResolver(RecipeSchema),
    defaultValues: {
      ...translationData[activeLang],
      ingredientData: ingredientData,
      recipeImage: previewFoodUrls[0] || ""
    }
  })

  const handleToggleDisplayStatus = (name: string) => {
    // Create a new updatedAvailData array by mapping over the existing availData
    const updatedAvailData = availData.map(item => {
      if (item.ingredientName === name) {
        return { ...item, mainIngredient: !item.mainIngredient }
      }
      return item
    })

    // Update the state with the new updatedAvailData
    setAvailData(updatedAvailData)

    // Optionally, update translations/store or any other global state
    setTranslationField("en", "ingredientData", updatedAvailData)
    setTranslationField("fr", "ingredientData", updatedAvailData)

    setUpdatedField("en", "ingredientData", updatedAvailData)
    setUpdatedField("fr", "ingredientData", updatedAvailData)
  }

  // Update the ingredient's quantity
  const handleQuantityChange = (
    ingredientName: string,
    value: string
  ): void => {
    const updatedAvailData = availData.map(item => {
      if (item.ingredientName.toLowerCase() === ingredientName.toLowerCase()) {
        return { ...item, quantity: value }
      }
      return item
    })
    setAvailData(updatedAvailData)
    setTranslationField("en", "ingredientData", updatedAvailData)
    setTranslationField("fr", "ingredientData", updatedAvailData)

    setUpdatedField("en", "ingredientData", updatedAvailData)
    setUpdatedField("fr", "ingredientData", updatedAvailData)
  }

  // table columns for available ingredients and categories
  const availColumns = [
    {
      header: "Item",
      accessor: "ingredientName" as const
    },
    {
      header: "Quantity",
      accessor: (row: Ingredient) => (
        <Input
          type="text"
          value={row.quantity}
          onChange={e =>
            handleQuantityChange(row.ingredientName, e.target.value)
          }
          placeholder="Enter quantity"
          className="w-[80%]"
        />
      )
    },
    {
      header: "Main Ingredient",
      accessor: (row: Ingredient) => (
        <Switch
          checked={row.mainIngredient}
          onCheckedChange={() => handleToggleDisplayStatus(row.ingredientName)}
          className="scale-75"
        />
      )
    },
    {
      header: "Available In Ingredient",
      accessor: (row: Ingredient) => (
        <Badge
          className={
            row.available
              ? "bg-green-200 text-black text-xs px-2 py-1 rounded-md border border-green-500 hover:bg-green-100 transition-colors"
              : "bg-gray-200 text-black text-xs px-2 py-1 rounded-md border border-gray-500 hover:bg-gray-100 transition-colors"
          }
        >
          {row.available ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      header: "", // No header for delete column
      accessor: (row: Ingredient) => (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="w-8 h-8 border border-gray-300 hover:bg-gray-100"
          onClick={() => {
            handleDeleteAvailItem(row.ingredientName)
          }}
          title={"Delete"}
        >
          <Trash className="w-4 h-4 text-gray-500" />
        </Button>
      ),
      id: "delete"
    }
  ]

  // Delete handler for ingredientData
  const handleDeleteAvailItem = (foodName: string): void => {
    // Filter out the ingredient with the given foodName
    const updated = availData.filter(item => item.ingredientName !== foodName)
    setAvailData(updated)
    form.setValue("ingredientData", updated as any, { shouldValidate: true })

    setTranslationField("en", "ingredientData", updated as any)
    setTranslationField("fr", "ingredientData", updated as any)

    setUpdatedField("en", "ingredientData", updated as any)
    setUpdatedField("fr", "ingredientData", updated as any)

    // Optionally, show a success message
    toast.success("Ingredient deleted successfully!")
  }

  // Sync ingredientData with form value
  useEffect(() => {
    const formIngredientData = form.watch("ingredientData")
    if (
      Array.isArray(formIngredientData) &&
      formIngredientData !== ingredientData
    ) {
      setIngredientData(formIngredientData as Ingredient[])
    }
  }, [form, ingredientData])

  const handleAddIngredient = async (): Promise<void> => {
    let updatedAvailData: Ingredient

    // Check if the item is already in the availData list by item name
    if (selected) {
      const isItemExists = availData.some(
        item => item.ingredientName === selected.name
      )

      if (isItemExists) {
        toast.error("This food item is already in the list!")
        setSelected(null)
        setIngredientInput("")
        return
      }

      updatedAvailData = {
        foodId: selected.id,
        ingredientName: selected.name ?? "",
        available: false,
        quantity: "",
        mainIngredient: true
      }
    } else if (ingredientInput.trim()) {
      // Check if the entered ingredient exists in the foods list
      const isItemExists = availData.some(
        item => item.ingredientName === ingredientInput
      )

      if (isItemExists) {
        // Show an error and return early if the item already exists in the table
        toast.error("This food item is already in the list!")
        setSelected(null)
        setIngredientInput("")
        return
      }
      // Check if the entered ingredient exists in the foods list
      const matchedFood = foods.find(
        food => food.name?.toLowerCase() === ingredientInput.toLowerCase()
      )

      if (matchedFood) {
        updatedAvailData = {
          foodId: matchedFood.id,
          ingredientName: matchedFood.name,
          available: matchedFood.status,
          quantity: "",
          mainIngredient: true
        }
      } else {
        const isCustomItemExists = availData.some(
          item =>
            item.ingredientName.toLowerCase() === ingredientInput.toLowerCase()
        )

        if (isCustomItemExists) {
          toast.error("This custom food item is already in the list!")
          setIngredientInput("")
          return
        }

        updatedAvailData = {
          foodId: 0,
          ingredientName: ingredientInput ?? "",
          available: false,
          quantity: "",
          mainIngredient: true
        }
      }
    } else {
      toast.error("Please select or enter a food item first!")
      return
    }

    setAvailData([...availData, updatedAvailData])

    try {
      const translatedName =
        activeLang === "en"
          ? await translateText(updatedAvailData.ingredientName)
          : updatedAvailData.ingredientName

      const enList = [...availData, updatedAvailData]
      const frList = [
        ...availData,
        {
          ...updatedAvailData,
          ingredientName: translatedName
        }
      ]

      setTranslationField("en", "ingredientData", enList)
      setTranslationField("fr", "ingredientData", frList)

      setUpdatedField("en", "ingredientData", [...availData, enList])
      setUpdatedField("fr", "ingredientData", [...availData, frList])
    } catch (err) {
      console.error("Translation failed:", err)
      toast.error("Failed to translate food name.")
    }

    toast.success("Food item added successfully!")

    setSelected(null)
    setIngredientInput("")
  }

  // adds/removes benefits:
  function handleBenefitsChange(vals: string[]): void {
    form.setValue("benefits", vals)
    setTranslationField(activeLang, "benefits", vals as any)
    setUpdatedField(activeLang, "benefits", vals as any)
  }

  async function handleBenefitsBlur(): Promise<void> {
    if (activeLang === "en") {
      const vals = form.getValues("benefits")
      if (vals.length) {
        try {
          const trArr = await Promise.all(
            vals.map(async v => await translateText(v))
          )
          setTranslationField("fr", "benefits", trArr as any)
          setUpdatedField("fr", "benefits", trArr as any)
        } catch (error) {
          console.log("Error Translating", error)
        }
      }
    }
  }

  const handleShopCategoryChange = (value: string) => {
    if (isFirstRender) return

    form.setValue("category", value)
    setTranslationField(activeLang, "category", value)
    setUpdatedField(activeLang, "category", value)

    const current = categoryOptions[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = categoryOptions[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(oppositeLang, "category", opposite[index].value)
      setUpdatedField(oppositeLang, "category", opposite[index].value)
    }
  }

  const handleseasonCategoryChange = (value: string) => {
    form.setValue("season", value)
    setTranslationField(activeLang, "season", value)
    setUpdatedField(activeLang, "season", value)

    const current = seasonOptions[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = seasonOptions[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(oppositeLang, "season", opposite[index].value)
      setUpdatedField(oppositeLang, "season", opposite[index].value)
    }
  }

  const handleAddNewBenefit = async (
    benefit: string
  ): Promise<{ tagName: string; tagNameFr: string }> => {
    // Translate to French
    const tagNameFr = await translateText(benefit)
    return { tagName: benefit, tagNameFr }
  }

  const handleImageSelect = async (files: File[] | null): Promise<void> => {
    const file = files?.[0] ?? null
    if (file) {
      try {
        setIsLoadingTrigger(true)
        const imageUrl = await uploadImageToFirebase(
          file,
          "recipes/temp-recipe",
          `temp-recipe-image`
        )

        form.setValue("recipeImage", imageUrl, {
          shouldValidate: true,
          shouldDirty: true
        })
        setTranslationField("en", "recipeImage", imageUrl)
        setTranslationField("fr", "recipeImage", imageUrl)

        setUpdatedField("en", "recipeImage", imageUrl)
        setUpdatedField("fr", "recipeImage", imageUrl)

        setPreviewFoodUrls([imageUrl]) // For single image preview
      } catch (error) {
        toast.error("Image upload failed. Please try again.")
        console.error("Firebase upload error:", error)
      } finally {
        setIsLoadingTrigger(false)
      }
    }
  }
  const handleImageSelectAuthor = async (
    files: File[] | null
  ): Promise<void> => {
    const file = files?.[0] ?? null
    if (file) {
      try {
        setIsLoadingTrigger(true)
        const imageUrl = await uploadImageToFirebase(
          file,
          "recipes/temp-recipe",
          `temp-recipe-author-image`
        )

        form.setValue("authorimage", imageUrl, {
          shouldValidate: true,
          shouldDirty: true
        })

        setTranslationField("en", "authorimage", imageUrl)
        setTranslationField("fr", "authorimage", imageUrl)

        setUpdatedField("en", "authorimage", imageUrl)
        setUpdatedField("fr", "authorimage", imageUrl)

        setPreviewAuthorUrls([imageUrl]) // For single image preview
      } catch (error) {
        toast.error("Image upload failed. Please try again.")
        console.error("Firebase upload error:", error)
      } finally {
        setIsLoadingTrigger(false)
        console.log("No file selected for food image")
      }
    }
  }

  useEffect(() => {
    form.reset(translationData[activeLang])
  }, [activeLang, translationData, form])

  useEffect(() => {
    setPreviewAuthorUrls(
      translationData.en.authorimage ? [translationData.en.authorimage] : []
    )
    setPreviewFoodUrls(
      translationData.en.recipeImage ? [translationData.en.recipeImage] : []
    )

    const rawIngredients = translationData[activeLang]?.ingredientData ?? []

    const mappedIngredients = rawIngredients.map((item: any) => ({
      foodId: item.foodId,
      ingredientName: item.ingredientName,
      quantity: item.quantity,
      mainIngredient: item.mainIngredient,
      available: item.available ?? false,
      display: item.display ?? true
    }))

    setAvailData(mappedIngredients)
  }, [activeLang, form.reset, translationData])

  const onSubmit = (data: RecipeSchemaType): void => {
    const invalidIngredients = data.ingredientData.filter(item => {
      const ing = item as Ingredient
      return ing.ingredientName && !ing.quantity?.trim()
    })

    if (invalidIngredients.length > 0) {
      toast.error("Please fill in quantity for all ingredients")
      return
    }

    editRecipe()
  }

  return (
    <div className="relative">
      {isLoadingTrigger && (
        <div className="flex absolute inset-0 z-50 justify-center items-center bg-white/30">
          <span className="w-10 h-10 rounded-full border-t-4 border-blue-500 border-solid animate-spin" />
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 md:grid-cols-3">
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

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.category}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={handleShopCategoryChange}
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder={"Select Category"} />
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

            {/* Category */}
            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.season}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={handleseasonCategoryChange}
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder={translations.selectSeason} />
                      </SelectTrigger>
                      <SelectContent>
                        {seasonOptions[activeLang].map(option => (
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

          <Separator />

          <DialogTitle className="pt-4">
            {translations.recipeAttributes}
          </DialogTitle>
          <div className="grid grid-cols-1 gap-4 pt-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
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
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-[100%]">
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <LableInput
                    title={translations.healthBenefits}
                    placeholder={translations.healthBenefits}
                    benefits={benefits || []}
                    name="benefits"
                    width="w-[32%]"
                    activeLang={activeLang}
                    suggestions={benefitsOptions}
                    onAddNewBenefit={handleAddNewBenefit}
                    onSelectSuggestion={benefit => {
                      const enBenefits = [
                        ...(translationData.en.benefits || []),
                        benefit.tagName
                      ]
                      const frBenefits = [
                        ...(translationData.fr.benefits || []),
                        benefit.tagNameFr
                      ]
                      setTranslationField("en", "benefits", enBenefits)
                      setTranslationField("fr", "benefits", frBenefits)

                      setUpdatedField("en", "benefits", enBenefits)
                      setUpdatedField("fr", "benefits", frBenefits)
                      form.setValue(
                        "benefits",
                        activeLang === "en" ? enBenefits : frBenefits
                      )
                    }}
                    onRemoveBenefit={removed => {
                      // Remove both at the same index
                      const idxEn = (translationData.en.benefits || []).indexOf(
                        removed.tagName
                      )
                      const idxFr = (translationData.fr.benefits || []).indexOf(
                        removed.tagNameFr
                      )
                      const enBenefits = [
                        ...(translationData.en.benefits || [])
                      ]
                      const frBenefits = [
                        ...(translationData.fr.benefits || [])
                      ]
                      if (idxEn > -1) {
                        enBenefits.splice(idxEn, 1)
                        frBenefits.splice(idxEn, 1)
                      } else if (idxFr > -1) {
                        enBenefits.splice(idxFr, 1)
                        frBenefits.splice(idxFr, 1)
                      }
                      setTranslationField("en", "benefits", enBenefits)
                      setTranslationField("fr", "benefits", frBenefits)

                      setUpdatedField("en", "benefits", enBenefits)
                      setUpdatedField("fr", "benefits", frBenefits)
                      form.setValue(
                        "benefits",
                        activeLang === "en" ? enBenefits : frBenefits
                      )
                    }}
                    onChange={(newArr: string[]) => {
                      handleBenefitsChange(newArr)
                      field.onChange(newArr)
                    }}
                    onBlur={() => {
                      void handleBenefitsBlur()
                      field.onBlur()
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-4" />

          <DialogTitle>{translations.ingredientsSelection}</DialogTitle>

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
                    setSelected({
                      id: Number(item.id),
                      name: item.name,
                      status: true
                    })
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
              name="ingredientData"
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

          <div className="flex flex-col gap-8 items-start pt-4 mb-4 sm:flex-row">
            {/* Left: Author Inputs */}
            <div className="grid flex-1 grid-cols-1 gap-4 w-full sm:grid-cols-2">
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
                          onBlur={async () => {
                            await handleInputBlurWithoutTranslate(
                              field.value,
                              "authorName"
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
                          onBlur={async () => {
                            await handleInputBlur(field.value, "authorCategory")
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
            <div className="w-full sm:w-2/5">
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

          <DialogTitle>{translations.uploadImages}</DialogTitle>

          <div className="pb-2 mt-6 w-full sm:w-2/5">
            <FormField
              control={form.control}
              name="recipeImage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      title={translations.selectImagesForYourFoodItem}
                      previewUrls={previewFoodUrls}
                      onChange={handleImageSelect}
                      uploadText={translations.imagesContentText}
                      uploadSubText={translations.imagesSubContentText}
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
            <div className="flex fixed bottom-0 left-0 z-50 gap-2 justify-between px-4 py-4 w-full bg-white border-t">
              <Button
                variant="outline"
                type="button"
                onClick={async () => {
                  await handleCancel()
                }}
                disabled={isLoading}
              >
                {translations.cancel}
              </Button>
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
    </div>
  )
}
