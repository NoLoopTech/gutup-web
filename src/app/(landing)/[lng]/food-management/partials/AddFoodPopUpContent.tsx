"use client"

import { getCatagoryFoodType, postNewFood } from "@/app/api/foods"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import LableInput from "@/components/Shared/LableInput/LableInput"
import { Button } from "@/components/ui/button"
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
import React, { useState } from "react"
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
}
// Define category options for each language
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
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" }
  ],
  fr: [
    { value: "january", label: "Janvier" },
    { value: "february", label: "Février" },
    { value: "march", label: "Mars" },
    { value: "april", label: "Avril" },
    { value: "may", label: "Mai" },
    { value: "june", label: "Juin" },
    { value: "july", label: "Juillet" },
    { value: "august", label: "Août" },
    { value: "september", label: "Septembre" },
    { value: "october", label: "Octobre" },
    { value: "november", label: "Novembre" },
    { value: "december", label: "Décembre" }
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
  getFoods // <-- add this prop
}: {
  translations: translationsTypes
  onClose: () => void
  getFoods: () => void // <-- add this prop type
}): JSX.Element {
  const { translateText } = useTranslation()
  const { activeLang, foodData, setTranslationField } = useFoodStore() as any
  const [isTranslating, setIsTranslating] = useState(false)
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const { data: session } = useSession()
  const [categoryOptionsApi, setCategoryOptionsApi] = useState<Option[]>([])

  // Define FoodSchema before using it in useForm
  const FoodSchema = z.object({
    name: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.mustbeatleast2characters }),
    category: z.string().nonempty(translations.pleaseselectacategory),
    season: z.string().nonempty(translations.pleaseselectaseason),
    country: z.string().nonempty(translations.pleaseselectacountry),
    benefits: z
      .array(z.string())
      .refine(arr => arr.some(item => item.trim().length > 0), {
        message: translations.pleaseenteratleastonebenefit
      }),
    image: z.string().optional(),
    selection: z.string().refine(
      val => {
        const plainText = val.replace(/<(.|\n)*?>/g, "").trim() // remove all tags
        const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val) // check for <img> tags
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
    fiber: z.string().optional(),
    proteins: z.string().optional(),
    vitamins: z.string().optional(),
    minerals: z.string().optional(),
    fat: z.string().optional(),
    sugar: z.string().optional()
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
  // Update form when lang changes
  React.useEffect(() => {
    form.reset(foodData[activeLang])
  }, [activeLang, form.reset, foodData])

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
  // Function to update select fields (category, season, country)
  const handleSelectChange = (
    fieldName: "category" | "season" | "country",
    value: string
  ): void => {
    form.setValue(fieldName, value)
    setTranslationField("foodData", activeLang, fieldName, value)

    if (fieldName === "category") {
      // Find the selected option
      const selected = categoryOptionsApi.find(opt =>
        (activeLang === "en" ? opt.valueEn : opt.valueFr) === value
      )
      if (selected) {
        setTranslationField("foodData", "en", "category", selected.valueEn)
        setTranslationField("foodData", "fr", "category", selected.valueFr)
      }
    }
    // ...existing code for season/country...
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
          // Use the Firebase URL directly for preview
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
      try {
        setIsTranslating(true)

        // Upload image to Firebase
        const imageUrl = await uploadImageToFirebase(file, "add-food")

        // Convert file to base64 for session storage
        const reader = new FileReader()
        reader.onload = () => {
          const base64String = reader.result as string

          // Update form with the Firebase URL
          form.setValue("image", imageUrl, {
            shouldValidate: true,
            shouldDirty: true
          })

          // Store in session storage for both languages with base64 for preview and Firebase URL for form
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
    try {
      const token = session?.apiToken
      // Map your form data to CreateFoodDto
      const foodDto: CreateFoodDto = {
        name: foodData.en.name,
        nameFR: foodData.fr?.name ?? "",
        category: foodData.en.category,
        categoryFR: foodData.fr?.category ?? "",
        season: foodData.en.season,
        seasonFR: foodData.fr?.season ?? "",
        country: foodData.en.country,
        seasons: [], // Fill if you have months
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
        healthBenefits: (foodData.en.benefits || []).map((b: string, i: number) => ({
          healthBenefit: b,
          healthBenefitFR: foodData.fr?.benefits?.[i] ?? ""
        }))
      }

      const response = await postNewFood(token, foodDto)
      if (response.status === 201 || response.status === 200) {
        toast.success(translations.formSubmittedSuccessfully)
        getFoods() // <-- refresh the food list
        onClose()  // <-- close popup after refresh
      } else {
        toast.error("Failed to add food")
      }
    } catch (error) {
      toast.error("Error adding food")
      console.error(error)
    }
  }

  React.useEffect(() => {
    const fetchCategoryFoodType = async () => {
      if (!session?.apiToken) return
      const response = await getCatagoryFoodType(session.apiToken, "Type")
      if (response?.status === 200 && Array.isArray(response.data)) {
        setCategoryOptionsApi(
          response.data.map((item: any) => ({
            valueEn: item.tagName,
            valueFr: item.tagNameFr,
            labelEn: item.tagName,
            labelFr: item.tagNameFr
          }))
        )
      }
    }
    fetchCategoryFoodType()
  }, [session?.apiToken])

  // Cancel handler
  const handleCancel = (
    form: ReturnType<typeof useForm<z.infer<typeof FoodSchema>>>
  ): void => {
    form.reset()
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              {isTranslating && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60">
                  <span className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin" />
                </div>
              )}
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
                          {categoryOptionsApi.map(option => (
                            <SelectItem
                              key={activeLang === "en" ? option.valueEn : option.valueFr}
                              value={activeLang === "en" ? option.valueEn : option.valueFr}
                            >
                              {activeLang === "en" ? option.labelEn : option.labelFr}
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
                    <FormLabel className="block mb-1 text-black">
                      {translations.month}
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={value => {
                          handleSelectChange("season", value)
                        }}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue
                            placeholder={translations.selectMonth}
                          />
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
                          {countriesOptions[activeLang].map(option => (
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
            {isTranslating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                <span className="w-10 h-10 border-t-4 border-blue-500 rounded-full animate-spin" />
              </div>
            )}
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <LableInput
                  title={translations.healthBenefits}
                  placeholder={translations.addUpTo6FoodBenefitsOrFewer}
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
                      {isTranslating && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                          <span className="loader" />
                        </div>
                      )}
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
                      {isTranslating && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                          <span className="loader" />
                        </div>
                      )}
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
                      {isTranslating && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                          <span className="loader" />
                        </div>
                      )}
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
