"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import dynamic from "next/dynamic"
import LableInput from "@/components/Shared/LableInput/LableInput"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
} from "@/components/ui/form"
import { toast } from "sonner"
import { type translationsTypes } from "@/types/foodTypes"
import { useFoodStore } from "@/stores/useFoodStore"
import { useTranslation } from "@/query/hooks/useTranslation"

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
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "autumn", label: "Autumn" },
    { value: "winter", label: "Winter" }
  ],
  fr: [
    { value: "spring", label: "Printemps" },
    { value: "summer", label: "Été" },
    { value: "autumn", label: "Automne" },
    { value: "winter", label: "Hiver" }
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

const handlePreparationChange = (field: any) => (val: string) => {
  field.onChange(val)
}

const handleConservationChange = (field: any) => (val: string) => {
  field.onChange(val)
}
// Separate function for handling image upload
const handleImageUpload = (field: any) => (files: File[] | null) => {
  field.onChange(files && files.length > 0 ? files[0] : null)
}

export default function AddFoodPopUpContent({
  translations
}: {
  translations: translationsTypes
}): JSX.Element {
  const { translateText } = useTranslation()
  // Remove setTranslationField if not in your store, or add it to your store if needed
  const { activeLang, foodData, setTranslationField } = useFoodStore() as any
  const [isTranslating, setIsTranslating] = useState(false)

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
    image: z.custom<File | null>(val => val instanceof File, {
      message: translations.required
    }),
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
    defaultValues: foodData[activeLang]
  })
  console.log("Form default values:", foodData[activeLang])
  // Update form when lang changes
  React.useEffect(() => {
    form.reset(foodData[activeLang])
  }, [activeLang, form.reset, foodData])

  // Helper to update both form & store

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
  // This function updates the category
  const handleCategoryChange = (value: string): void => {
    form.setValue("category", value)
    setTranslationField("foodData", activeLang, "category", value)

    const current = categoryOptions[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = categoryOptions[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "foodData",
        oppositeLang,
        "category",
        opposite[index].value
      )
    }
  }
  // This function updates the season
  const handleSeasonChange = (value: string): void => {
    form.setValue("season", value)
    setTranslationField("foodData", activeLang, "season", value)

    const current = seasonOptions[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = seasonOptions[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "foodData",
        oppositeLang,
        "season",
        opposite[index].value
      )
    }
  }
  // This function updates the country
  const handleCountryChange = (value: string): void => {
    form.setValue("country", value)
    setTranslationField("foodData", activeLang, "country", value)

    const current = countriesOptions[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = countriesOptions[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "foodData",
        oppositeLang,
        "country",
        opposite[index].value
      )
    }
  }

  const makeRichHandlers = (
    fieldName: "selection" | "preparation" | "conservation"
  ): { onChange: (val: string) => void; onBlur: () => Promise<void> } => {
    const onChange = (val: string): void => {
      form.setValue(fieldName, val)
      setTranslationField("foodData", activeLang, fieldName, val)
    }
    const onBlur = async (): Promise<void> => {
      const val = form.getValues(fieldName)
      if (activeLang === "en" && val.trim()) {
        setIsTranslating(true)
        try {
          const tr = await translateText(val)
          setTranslationField("foodData", "fr", fieldName, tr)
        } finally {
          setIsTranslating(false)
        }
      }
    }
    return { onChange, onBlur }
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
  // Submit handler
  const onSubmit = (): void => {
    toast(translations.formSubmittedSuccessfully, {})
  }

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
          {/* English Tab Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              {isTranslating && (
                <div className="flex absolute inset-0 z-50 justify-center items-center bg-white/60">
                  <span className="w-10 h-10 rounded-full border-t-4 border-blue-500 border-solid animate-spin" />
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
                        onValueChange={handleCategoryChange}
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
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      {translations.season}
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={handleSeasonChange}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue
                            placeholder={translations.selectSeason}
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
                        onValueChange={handleCountryChange}
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
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="w-10 h-10 rounded-full border-t-4 border-blue-500 animate-spin" />
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
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-2 text-black">
                      {translations.preparation}
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        initialContent={field.value}
                        onChange={handlePreparationChange(field)}
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
                name="conservation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-2 text-black">
                      {translations.conservation}
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        initialContent={field.value}
                        onChange={handleConservationChange(field)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-full mt-6 sm:w-2/5 pb-12">
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
                      onChange={handleImageUpload(field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
        </form>
      </Form>
    </div>
  )
}
