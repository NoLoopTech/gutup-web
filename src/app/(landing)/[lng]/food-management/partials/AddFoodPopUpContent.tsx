"use client"

import { getCatagoryFoodType, postFoodTag, postNewFood } from "@/app/api/foods"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import LableInput from "@/components/Shared/LableInput/LableInput"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { uploadImageToFirebase } from "@/lib/firebaseImageUtils"
import { useTranslation } from "@/query/hooks/useTranslation"
import { useFoodStore } from "@/stores/useFoodStore"
import { type CreateFoodDto, type translationsTypes } from "@/types/foodTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)
interface Option {
  value: string
  label: string
  valueEn?: string
  valueFr?: string
  labelEn?: string
  labelFr?: string
}
// Define category options for each language
const seasonOptions: Record<string, Option[]> = {
  en: [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" }
  ],
  fr: [
    { value: "Janvier", label: "Janvier" },
    { value: "Février", label: "Février" },
    { value: "Mars", label: "Mars" },
    { value: "Avril", label: "Avril" },
    { value: "Mai", label: "Mai" },
    { value: "Juin", label: "Juin" },
    { value: "Juillet", label: "Juillet" },
    { value: "Août", label: "Août" },
    { value: "Septembre", label: "Septembre" },
    { value: "Octobre", label: "Octobre" },
    { value: "Novembre", label: "Novembre" },
    { value: "Décembre", label: "Décembre" }
  ]
}
const countriesOptions: Record<string, Option[]> = {
  en: [
    { value: "switzerland", label: "Switzerland" },
    { value: "france", label: "France" },
    { value: "germany", label: "Germany" },
    { value: "italy", label: "Italy" }
  ],
  fr: [
    { value: "switzerland", label: "Suisse" },
    { value: "france", label: "France" },
    { value: "germany", label: "Allemagne" },
    { value: "italy", label: "Italie" }
  ]
}

export default function AddFoodPopUpContent({
  translations,
  onClose,
  getFoods,
  onRegisterCleanup
}: {
  translations: Partial<translationsTypes>
  onClose: () => void
  getFoods: () => void
  onRegisterCleanup?: (fn: () => void) => void
}): JSX.Element {
  const { translateText } = useTranslation()
  const { activeLang, foodData, setTranslationField, allowMultiLang } =
    useFoodStore() as any
  const [isTranslating, setIsTranslating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const { data: session } = useSession()
  const [categoryOptionsApi, setCategoryOptionsApi] = useState<Option[]>([])
  const [benefitTags, setBenefitTags] = useState<
    Array<{ tagName: string; tagNameFr: string }>
  >([])
  const [selectedMonths, setSelectedMonths] = useState<string[]>(
    Array.isArray(foodData[activeLang]?.season)
      ? foodData[activeLang].season
      : []
  )

  // Cleanup function to clear all data and reset form
  const cleanupData = (): void => {
    setTranslationField("foodData", "en", "name", "")
    setTranslationField("foodData", "fr", "name", "")
    setTranslationField("foodData", "en", "category", "")
    setTranslationField("foodData", "fr", "category", "")
    setTranslationField("foodData", "en", "season", "")
    setTranslationField("foodData", "fr", "season", "")
    setTranslationField("foodData", "en", "country", "")
    setTranslationField("foodData", "fr", "country", "")
    setTranslationField("foodData", "en", "benefits", [])
    setTranslationField("foodData", "fr", "benefits", [])
    setTranslationField("foodData", "en", "image", "")
    setTranslationField("foodData", "fr", "image", "")
    setTranslationField("foodData", "en", "storeImage", "")
    setTranslationField("foodData", "fr", "storeImage", "")
    setTranslationField("foodData", "en", "selection", "")
    setTranslationField("foodData", "fr", "selection", "")
    setTranslationField("foodData", "en", "preparation", "")
    setTranslationField("foodData", "fr", "preparation", "")
    setTranslationField("foodData", "en", "conservation", "")
    setTranslationField("foodData", "fr", "conservation", "")
    setTranslationField("foodData", "en", "fiber", "")
    setTranslationField("foodData", "fr", "fiber", "")
    setTranslationField("foodData", "en", "proteins", "")
    setTranslationField("foodData", "fr", "proteins", "")
    setTranslationField("foodData", "en", "vitamins", "")
    setTranslationField("foodData", "fr", "vitamins", "")
    setTranslationField("foodData", "en", "minerals", "")
    setTranslationField("foodData", "fr", "minerals", "")
    setTranslationField("foodData", "en", "fat", "")
    setTranslationField("foodData", "fr", "fat", "")
    setTranslationField("foodData", "en", "sugar", "")
    setTranslationField("foodData", "fr", "sugar", "")
    setImagePreviewUrls([])
    form.reset()
    sessionStorage.removeItem("food-store")
  }

  useEffect(() => {
    if (onRegisterCleanup) {
      onRegisterCleanup(cleanupData)
    }
  }, [onRegisterCleanup])

  // Define FoodSchema before using it in useForm
  const FoodSchema = z.object({
    name: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.mustbeatleast2characters }),
    category: z.string().nonempty(translations.pleaseselectacategory),
    season: z.array(z.string()).min(1, translations.pleaseselectaseason),
    country: z.string().nonempty(translations.pleaseselectacountry),
    benefits: z
      .array(z.string())
      .min(1, { message: translations.pleaseenteratleastonebenefit })
      .refine(arr => arr.some(item => item.trim().length > 0), {
        message: translations.pleaseenteratleastonebenefit
      }),
    image: z.string().nonempty(translations.required),
    selection: z.string().refine(
      val => {
        const plainText = val.replace(/<(.|\n)*?>/g, "").trim()
        const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val)
        return plainText !== "" || hasImage
      },
      {
        message: translations.required
      }
    ),
    preparation: z.string().refine(
      val => {
        const plainText = val.replace(/<(.|\n)*?>/g, "").trim()
        const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val)
        return plainText !== "" || hasImage
      },
      {
        message: translations.required
      }
    ),
    conservation: z.string().refine(
      val => {
        const plainText = val.replace(/<(.|\n)*?>/g, "").trim()
        const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val)
        return plainText !== "" || hasImage
      },
      {
        message: translations.required
      }
    ),
    fiber: z
      .string()
      .refine(val => !val || /^\d+(\.\d+)?$/.test(val), {
        message: translations.pleaseenternumbersonly
      })
      .optional(),
    proteins: z
      .string()
      .refine(val => !val || /^\d+(\.\d+)?$/.test(val), {
        message: translations.pleaseenternumbersonly
      })
      .optional(),
    vitamins: z.string().optional(),
    minerals: z.string().optional(),
    fat: z
      .string()
      .refine(val => !val || /^\d+(\.\d+)?$/.test(val), {
        message: translations.pleaseenternumbersonly
      })
      .optional(),
    sugar: z
      .string()
      .refine(val => !val || /^\d+(\.\d+)?$/.test(val), {
        message: translations.pleaseenternumbersonly
      })
      .optional()
  })

  // Form hook
  const form = useForm<z.infer<typeof FoodSchema>>({
    resolver: zodResolver(FoodSchema),
    defaultValues: {
      ...foodData[activeLang],
      category: foodData[activeLang]?.category || "",
      image: foodData[activeLang]?.storeImage || ""
    }
  })
  // Update form and selectedMonths when lang changes
  React.useEffect(() => {
    const currentStoreData = foodData[activeLang] || {}
    const validCategory = categoryOptionsApi.some(
      opt => opt.value === currentStoreData.category
    )
      ? currentStoreData.category
      : undefined
    const validCountry = countriesOptions[activeLang].some(
      opt => opt.value === currentStoreData.country
    )
      ? currentStoreData.country
      : undefined
    form.reset({
      ...currentStoreData,
      category: validCategory,
      country: validCountry,
      image: currentStoreData?.storeImage || ""
    })
    setSelectedMonths(
      Array.isArray(currentStoreData?.season) ? currentStoreData.season : []
    )
  }, [activeLang, form.reset, foodData, categoryOptionsApi])

  // Helper function to check for duplicate benefits
  const isDuplicateBenefit = (
    benefit: string,
    lang: "en" | "fr" = "en"
  ): boolean => {
    const currentEnBenefits = foodData.en.benefits || []
    const currentFrBenefits = foodData.fr.benefits || []

    if (lang === "en") {
      return currentEnBenefits.some(
        (b: string) => b.toLowerCase() === benefit.toLowerCase()
      )
    } else {
      return currentFrBenefits.some(
        (b: string) => b.toLowerCase() === benefit.toLowerCase()
      )
    }
  }

  // Handle selecting suggestion benefits
  const handleSelectBenefit = (benefit: {
    tagName: string
    tagNameFr: string
  }): void => {
    if (
      isDuplicateBenefit(benefit.tagName, "en") ||
      isDuplicateBenefit(benefit.tagNameFr, "fr")
    ) {
      toast.error("Already in the list")
      return
    }

    // Add both EN and FR at the same index
    const currentEnBenefits = foodData.en.benefits || []
    const currentFrBenefits = foodData.fr.benefits || []

    const enBenefits = [...currentEnBenefits, benefit.tagName]
    const frBenefits = [...currentFrBenefits, benefit.tagNameFr]

    setTranslationField("foodData", "en", "benefits", enBenefits)
    setTranslationField("foodData", "fr", "benefits", frBenefits)
    form.setValue("benefits", activeLang === "en" ? enBenefits : frBenefits)
    void form.trigger("benefits")
  }

  // Input change handler for fields that need translation
  const handleInputChange = (
    fieldName:
      | "name"
      | "fiber"
      | "proteins"
      | "vitamins"
      | "minerals"
      | "fat"
      | "sugar",
    value: string
  ): void => {
    form.setValue(fieldName, value)
    setTranslationField("foodData", activeLang, fieldName, value)
  }

  // Input blur handler for translation
  const handleInputBlur = async (
    fieldName:
      | "name"
      | "fiber"
      | "proteins"
      | "vitamins"
      | "minerals"
      | "fat"
      | "sugar",
    value: string
  ): Promise<void> => {
    if (activeLang === "en" && value.trim()) {
      try {
        setIsTranslating(true)
        const translated = await translateText(value)
        setTranslationField("foodData", "fr", fieldName, translated)
      } finally {
        setIsTranslating(false)
      }
    }
  }
  const seasonSyncMap = [
    { en: "January", fr: "Janvier", frLabel: "Janvier" },
    { en: "February", fr: "Février", frLabel: "Février" },
    { en: "March", fr: "Mars", frLabel: "Mars" },
    { en: "April", fr: "Avril", frLabel: "Avril" },
    { en: "May", fr: "Mai", frLabel: "Mai" },
    { en: "June", fr: "Juin", frLabel: "Juin" },
    { en: "July", fr: "Juillet", frLabel: "Juillet" },
    { en: "August", fr: "Août", frLabel: "Août" },
    { en: "September", fr: "Septembre", frLabel: "Septembre" },
    { en: "October", fr: "Octobre", frLabel: "Octobre" },
    { en: "November", fr: "Novembre", frLabel: "Novembre" },
    { en: "December", fr: "Décembre", frLabel: "Décembre" }
  ]

  // Function to update select fields (category, season, country)
  const handleSelectChange = (
    fieldName: "category" | "season" | "country",
    value: string
  ): void => {
    form.setValue(fieldName, value)
    setTranslationField("foodData", activeLang, fieldName, value)

    if (fieldName === "category") {
      const selected = categoryOptionsApi.find(
        opt => (activeLang === "en" ? opt.valueEn : opt.valueFr) === value
      )
      if (selected) {
        setTranslationField("foodData", "en", "category", selected.valueEn)
        setTranslationField("foodData", "fr", "category", selected.valueFr)
      }
    }

    if (fieldName === "season") {
      if (activeLang === "en") {
        const found = seasonSyncMap.find(m => m.en === value)
        if (found) {
          setTranslationField("foodData", "en", "season", found.en)
          setTranslationField("foodData", "fr", "season", found.fr)
        }
      } else if (activeLang === "fr") {
        const found = seasonSyncMap.find(m => m.fr === value)
        if (found) {
          setTranslationField("foodData", "en", "season", found.en)
          setTranslationField("foodData", "fr", "season", found.fr)
        }
      }
    }

    if (fieldName === "country") {
      if (activeLang === "en") {
        const found = countriesOptions.fr.find(
          opt => opt.value === value.toLowerCase()
        )
        if (found) {
          setTranslationField("foodData", "en", "country", value)
          setTranslationField("foodData", "fr", "country", found.value)
        }
      } else if (activeLang === "fr") {
        const found = countriesOptions.en.find(
          opt => opt.value.toLowerCase() === value
        )
        if (found) {
          setTranslationField("foodData", "en", "country", found.value)
          setTranslationField("foodData", "fr", "country", value)
        }
      }
    }
  }

  const makeRichHandlers = (
    fieldName: "selection" | "preparation" | "conservation"
  ): { onChange: (val: string) => void } => {
    const onChange = (val: string): void => {
      form.setValue(fieldName, val)
      setTranslationField("foodData", activeLang, fieldName, val)
    }
    return { onChange }
  }
  const richTextFieldOnBlur = async (
    fieldName: "selection" | "preparation" | "conservation"
  ): Promise<void> => {
    if (activeLang === "en") {
      const vals = form.getValues(fieldName)
      if (typeof vals === "string" && vals.trim().length > 0) {
        setIsTranslating(true)
        try {
          const translated = await translateText(vals)
          setTranslationField("foodData", "fr", fieldName, translated)
        } finally {
          setIsTranslating(false)
        }
      } else if (Array.isArray(vals) && vals.length) {
        setIsTranslating(true)
        try {
          const trArr = await Promise.all(
            vals.map(async v => await translateText(v))
          )
          setTranslationField("foodData", "fr", fieldName, trArr)
        } finally {
          setIsTranslating(false)
        }
      }
    }
  }
  // adds/removes benefits:
  function handleBenefitsChange(vals: string[]): void {
    form.setValue("benefits", vals)
    setTranslationField("foodData", activeLang, "benefits", vals)
    void form.trigger("benefits")
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
          setTranslationField("foodData", "fr", "benefits", trArr)
        } finally {
          setIsTranslating(false)
        }
      }
    }
  }

  // Update form when lang changes
  React.useEffect(() => {
    const currentStoreData = foodData[activeLang]
    const recreatePreview = async (): Promise<void> => {
      if (currentStoreData?.storeImage) {
        try {
          setImagePreviewUrls([currentStoreData.storeImage])
        } catch (error) {
          console.error("Error setting preview:", error)
          setImagePreviewUrls([])
        }
      } else {
        setImagePreviewUrls([])
      }
    }

    form.reset({
      ...currentStoreData,
      image: currentStoreData?.storeImage || ""
    })

    void recreatePreview()
  }, [activeLang, form, foodData])

  const handleImageSelect = async (files: File[] | null): Promise<void> => {
    const file = files?.[0] ?? null
    if (file) {
      setIsLoading(true)
      try {
        setIsTranslating(true)
        // Upload image to Firebase
        const imageUrl = await uploadImageToFirebase(
          file,
          "add-food",
          file.name
        )
        // Convert file to base64 for session storage
        const reader = new FileReader()
        reader.onload = () => {
          const base64String = reader.result as string
          // Update form with the Firebase URL
          form.setValue("image", imageUrl, {
            shouldValidate: true,
            shouldDirty: true
          })
          // Store in session storage for both languages
          setTranslationField("foodData", "en", "image", base64String)
          setTranslationField("foodData", "fr", "image", base64String)
          setTranslationField("foodData", "en", "storeImage", imageUrl)
          setTranslationField("foodData", "fr", "storeImage", imageUrl)
          setTranslationField("foodData", "en", "imageName", file.name)
          setTranslationField("foodData", "fr", "imageName", file.name)
          setImagePreviewUrls([imageUrl])
        }
        reader.readAsDataURL(file)
      } catch (error) {
        toast.error("Image upload failed. Please try again.")
        console.error("Firebase upload error:", error)
      } finally {
        setIsTranslating(false)
        setIsLoading(false)
      }
    } else {
      // Handle file removal
      form.setValue("image", "")
      setTranslationField("foodData", "en", "image", null)
      setTranslationField("foodData", "fr", "image", null)
      setTranslationField("foodData", "en", "storeImage", null)
      setTranslationField("foodData", "fr", "storeImage", null)
      setTranslationField("foodData", "en", "imageName", null)
      setTranslationField("foodData", "fr", "imageName", null)
      setImagePreviewUrls([])
    }
  }

  // Submit handler
  const onSubmit = async (
    formData: z.infer<typeof FoodSchema>
  ): Promise<void> => {
    setIsLoading(true)
    try {
      const token = session?.apiToken

      // Save food first
      const foodDto: CreateFoodDto = {
        name: foodData.en.name,
        nameFR: foodData.fr?.name ?? "",
        category: foodData.en.category,
        categoryFR: foodData.fr?.category ?? "",
        country: foodData.en.country,
        seasons:
          Array.isArray(foodData.en.season) &&
          Array.isArray(foodData.fr?.season)
            ? foodData.en.season.map((enMonth: string, idx: number) => ({
                foodId: idx,
                season: enMonth,
                seasonFR: foodData.fr.season[idx] ?? enMonth
              }))
            : [],
        attributes: {
          fiber: Number(foodData.en.fiber) || 0,
          proteins: Number(foodData.en.proteins) || 0,
          vitamins: foodData.en.vitamins || "",
          vitaminsFR: foodData.fr?.vitamins ?? "",
          minerals: foodData.en.minerals || "",
          mineralsFR: foodData.fr?.minerals ?? "",
          fat: Number(foodData.en.fat) || 0,
          sugar: Number(foodData.en.sugar) || 0
        },
        describe: {
          selection: foodData.en.selection,
          selectionFR: foodData.fr?.selection ?? "",
          preparation: foodData.en.preparation,
          preparationFR: foodData.fr?.preparation ?? "",
          conservation: foodData.en.conservation,
          conservationFR: foodData.fr?.conservation ?? ""
        },
        images: foodData.en.storeImage
          ? [{ image: foodData.en.storeImage }]
          : [],
        healthBenefits: (foodData.en.benefits || []).map(
          (b: string, i: number) => ({
            healthBenefit: b,
            healthBenefitFR: foodData.fr?.benefits?.[i] ?? ""
          })
        ),
        allowMultiLang
      }
      const response = await postNewFood(token ?? "", foodDto)
      if (response.status === 201 || response.status === 200) {
        toast.success(translations.formSubmittedSuccessfully)
        getFoods()
        sessionStorage.removeItem("food-store")
        cleanupData()
        onClose()
      } else {
        toast.error("Failed to add food")
      }

      // Now, post new benefits to /food-tag if not exist
      if (!token) {
        toast.error("Session expired. Please log in again.")
        return
      }
      const benefitResponse = await getCatagoryFoodType(token, "Benefit")
      const existingTags = Array.isArray(benefitResponse?.data)
        ? benefitResponse.data.map((b: any) => b.tagName)
        : []

      for (const [i, benefit] of (foodData.en.benefits || []).entries()) {
        if (!existingTags.includes(benefit)) {
          await postFoodTag(token, {
            tagName: benefit,
            tagNameFr: foodData.fr?.benefits?.[i] ?? ""
          })
        }
      }
    } catch (error) {
      toast.error("Error adding food")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    const fetchCategoryAndBenefit = async (): Promise<void> => {
      if (!session?.apiToken) return

      // Fetch Type
      const typeResponse = await getCatagoryFoodType(session.apiToken, "Type")
      if (typeResponse?.status === 200 && Array.isArray(typeResponse.data)) {
        setCategoryOptionsApi(
          typeResponse.data.map((item: any) => ({
            value: activeLang === "en" ? item.tagName : item.tagNameFr,
            label: activeLang === "en" ? item.tagName : item.tagNameFr,
            valueEn: item.tagName,
            valueFr: item.tagNameFr,
            labelEn: item.tagName,
            labelFr: item.tagNameFr
          }))
        )
      }
    }

    void fetchCategoryAndBenefit()
  }, [session?.apiToken])

  React.useEffect(() => {
    const fetchBenefitTags = async (): Promise<void> => {
      if (!session?.apiToken) return
      const benefitResponse = await getCatagoryFoodType(
        session.apiToken,
        "Benefit"
      )
      if (
        benefitResponse?.status === 200 &&
        Array.isArray(benefitResponse.data)
      ) {
        setBenefitTags(
          benefitResponse.data.map((item: any) => ({
            tagName: item.tagName,
            tagNameFr: item.tagNameFr
          }))
        )
      }
    }
    void fetchBenefitTags()
  }, [session?.apiToken])

  // Cancel handler
  const handleCancel = (
    form: ReturnType<typeof useForm<z.infer<typeof FoodSchema>>>
  ): void => {
    form.reset()
    sessionStorage.removeItem("food-store")
    cleanupData()
  }

  const handleAddNewBenefit = async (
    benefit: string
  ): Promise<{ tagName: string; tagNameFr: string }> => {
    if (isDuplicateBenefit(benefit)) {
      toast.error("Already in the list")
      throw new Error("Duplicate benefit")
    }

    // Translate to French
    const tagNameFr = await translateText(benefit)

    if (isDuplicateBenefit(tagNameFr, "fr")) {
      toast.error("Already in the list")
      throw new Error("Duplicate benefit")
    }

    return { tagName: benefit, tagNameFr }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
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
                        placeholder={translations.enterFoodName}
                        {...field}
                        onChange={e => {
                          handleInputChange("name", e.target.value)
                        }}
                        onBlur={async () => {
                          await handleInputBlur("name", field.value)
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
                          {categoryOptionsApi
                            .filter(option => option.value)
                            .map(option => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
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
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-black">
                      {translations.month}
                    </FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className={`overflow-x-auto overflow-y-hidden justify-between w-full mt-1 ${
                              selectedMonths.length === 0
                                ? "text-gray-500 font-normal hover:text-gray-500"
                                : ""
                            }`}
                            style={{ scrollbarWidth: "none" }}
                          >
                            {selectedMonths.length > 0
                              ? selectedMonths.join(", ")
                              : translations.selectMonth ?? "Select Months"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-full overflow-auto max-h-64"
                          style={{ scrollbarWidth: "none" }}
                        >
                          <DropdownMenuItem
                            disabled
                            className="text-xs text-muted-foreground"
                          >
                            Filter by Months
                          </DropdownMenuItem>
                          {seasonOptions[activeLang].map(month => (
                            <DropdownMenuItem
                              key={month.value}
                              onClick={() => {
                                let updated
                                if (selectedMonths.includes(month.value)) {
                                  updated = selectedMonths.filter(
                                    m => m !== month.value
                                  )
                                } else {
                                  updated = [...selectedMonths, month.value]
                                }
                                setSelectedMonths(updated)
                                setTranslationField(
                                  "foodData",
                                  "en",
                                  "season",
                                  updated
                                )
                                // Map to French
                                const frMonths = updated.map(enMonth => {
                                  const found = seasonSyncMap.find(
                                    m => m.en === enMonth
                                  )
                                  return found ? found.fr : enMonth
                                })
                                setTranslationField(
                                  "foodData",
                                  "fr",
                                  "season",
                                  frMonths
                                )
                                // Update form field
                                field.onChange(updated)
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedMonths.includes(month.value)}
                                readOnly
                                className="mr-2"
                              />
                              {month.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      {translations.country}
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={value => {
                          handleSelectChange("country", value)
                        }}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue
                            placeholder={translations.selectCountry}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {countriesOptions[activeLang]
                            .filter(option => option.value)
                            .map(option => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
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
          </div>

          <Separator className="my-2" />

          <h3 className="mb-4 text-lg font-semibold text-black">
            {translations.foodAttributes}
          </h3>
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <FormField
                control={form.control}
                name="fiber"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.fiber}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.provideDetailsIfApplicable}
                        {...field}
                        onChange={e => {
                          handleInputChange("fiber", e.target.value)
                          field.onChange(e)
                        }}
                        onBlur={async e => {
                          await handleInputBlur("fiber", e.target.value)
                          field.onBlur()
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
                name="proteins"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.proteins}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.provideDetailsIfApplicable}
                        {...field}
                        onChange={e => {
                          handleInputChange("proteins", e.target.value)
                          field.onChange(e)
                        }}
                        onBlur={async e => {
                          await handleInputBlur("proteins", e.target.value)
                          field.onBlur()
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
                name="vitamins"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.vitamins}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.provideDetailsIfApplicable}
                        {...field}
                        onChange={e => {
                          handleInputChange("vitamins", e.target.value)
                          field.onChange(e)
                        }}
                        onBlur={async e => {
                          await handleInputBlur("vitamins", e.target.value)
                          field.onBlur()
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
                name="minerals"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.minerals}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.provideDetailsIfApplicable}
                        {...field}
                        onChange={e => {
                          handleInputChange("minerals", e.target.value)
                          field.onChange(e)
                        }}
                        onBlur={async e => {
                          await handleInputBlur("minerals", e.target.value)
                          field.onBlur()
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
                name="fat"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.fat}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.provideDetailsIfApplicable}
                        {...field}
                        onChange={e => {
                          handleInputChange("fat", e.target.value)
                          field.onChange(e)
                        }}
                        onBlur={async e => {
                          await handleInputBlur("fat", e.target.value)
                          field.onBlur()
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
                name="sugar"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.sugar}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.provideDetailsIfApplicable}
                        {...field}
                        onChange={e => {
                          handleInputChange("sugar", e.target.value)
                          field.onChange(e)
                        }}
                        onBlur={async e => {
                          await handleInputBlur("sugar", e.target.value)
                          field.onBlur()
                        }}
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
                  <FormControl>
                    <LableInput
                      title={translations.healthBenefits}
                      placeholder={translations.addUpTo6FoodBenefitsOrFewer}
                      benefits={field.value || []}
                      name="benefits"
                      width="w-[32%]"
                      suggestions={benefitTags}
                      activeLang={activeLang}
                      onAddNewBenefit={handleAddNewBenefit}
                      onSelectSuggestion={benefit => {
                        handleSelectBenefit(benefit)
                      }}
                      onRemoveBenefit={removed => {
                        const idxEn = (foodData.en.benefits || []).indexOf(
                          removed.tagName
                        )
                        const idxFr = (foodData.fr.benefits || []).indexOf(
                          removed.tagNameFr
                        )
                        const enBenefits = [...(foodData.en.benefits || [])]
                        const frBenefits = [...(foodData.fr.benefits || [])]
                        if (idxEn > -1) {
                          enBenefits.splice(idxEn, 1)
                          frBenefits.splice(idxEn, 1)
                        } else if (idxFr > -1) {
                          enBenefits.splice(idxFr, 1)
                          frBenefits.splice(idxFr, 1)
                        }
                        setTranslationField(
                          "foodData",
                          "en",
                          "benefits",
                          enBenefits
                        )
                        setTranslationField(
                          "foodData",
                          "fr",
                          "benefits",
                          frBenefits
                        )
                        form.setValue(
                          "benefits",
                          activeLang === "en" ? enBenefits : frBenefits
                        )
                        void form.trigger("benefits")
                      }}
                      onChange={(newArr: string[]) => {
                        handleBenefitsChange(newArr)
                        field.onChange(newArr)
                        void form.trigger("benefits")
                      }}
                      onBlur={() => {
                        void handleBenefitsBlur()
                        field.onBlur()
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-2" />

          <h3 className="mb-4 text-lg font-semibold text-black">
            {translations.describeTheFood}
          </h3>
          <div className="flex flex-col gap-6">
            <div>
              <FormField
                control={form.control}
                name="selection"
                render={({ field }) => {
                  const { onChange } = makeRichHandlers("selection")
                  return (
                    <FormItem className="relative">
                      <FormLabel>{translations.selection}</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          initialContent={field.value}
                          onChange={val => {
                            onChange(val)
                            field.onChange(val)
                          }}
                          onBlur={async () => {
                            await richTextFieldOnBlur("selection")
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="preparation"
                render={({ field }) => {
                  const { onChange } = makeRichHandlers("preparation")
                  return (
                    <FormItem className="relative">
                      <FormLabel>{translations.preparation}</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          initialContent={field.value}
                          onChange={val => {
                            onChange(val)
                            field.onChange(val)
                          }}
                          onBlur={async () => {
                            await richTextFieldOnBlur("preparation")
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="conservation"
                render={({ field }) => {
                  const { onChange } = makeRichHandlers("conservation")
                  return (
                    <FormItem className="relative">
                      <FormLabel>{translations.conservation}</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          initialContent={field.value}
                          onChange={val => {
                            onChange(val)
                            field.onChange(val)
                          }}
                          onBlur={async () => {
                            await richTextFieldOnBlur("conservation")
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

          <div className="w-full pb-12 mt-6 sm:w-2/5">
            <h3 className="mb-4 text-lg font-semibold text-black">
              {translations.uploadImages}
            </h3>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      title={translations.selectImagesForYourFoodItem}
                      onChange={handleImageSelect}
                      previewUrls={imagePreviewUrls}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Save and Cancel buttons */}
          <div className="fixed bottom-0 left-0 z-50 flex justify-between w-full gap-2 px-4 py-4 bg-white border-t">
            <Button
              variant="outline"
              onClick={() => {
                handleCancel(form)
                sessionStorage.removeItem("food-store")
                cleanupData()
                onClose()
              }}
            >
              {translations.cancel}
            </Button>
            <Button type="submit" disabled={isLoading || isTranslating}>
              {isLoading ? (
                <div className="flex gap-2 items-center">
                  <span className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  Saving..
                </div>
              ) : isTranslating ? (
                <div className="flex gap-2 items-center">
                  <span className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  Translating..
                </div>
              ) : (
                translations.save
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
