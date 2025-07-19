"use client"

import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
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
import { Textarea } from "@/components/ui/textarea"
import { uploadImageToFirebase } from "@/lib/firebaseImageUtils"
import { useTranslation } from "@/query/hooks/useTranslation"
import { useMoodStore } from "@/stores/useMoodStore"
import { useUpdatedTranslationStore } from "@/stores/useUpdatedTranslationStore"
import { type translationsTypes } from "@/types/moodsTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface Option {
  value: string
  label: string
}

const moodOptions: Record<string, Option[]> = {
  en: [
    { value: "very happy", label: "Very Happy" },
    { value: "happy", label: "Happy" },
    { value: "angry", label: "Angry" },
    { value: "sad", label: "Sad" }
  ],
  fr: [
    { value: "very happy", label: "Très heureux" },
    { value: "happy", label: "Heureuse" },
    { value: "angry", label: "En colère" },
    { value: "sad", label: "Triste" }
  ]
}

const shopcategory: Record<string, Option[]> = {
  en: [
    { value: "bakery", label: "Bakery" },
    { value: "dairy", label: "Dairy" },
    { value: "produce", label: "Produce" }
  ],
  fr: [
    { value: "boulangerie", label: "Boulangerie" },
    { value: "laitière", label: "Laitière" },
    { value: "produire", label: "Produire" }
  ]
}

export default function EditFoodTab({
  translations,
  onClose,
  EditFoodMood,
  isLoading,
  userName
}: {
  translations: translationsTypes
  onClose: () => void
  EditFoodMood: () => void
  isLoading: boolean
  userName: string
}): JSX.Element {
  const {
    activeLang,
    translationsData,
    setTranslationField,
    resetTranslations
  } = useMoodStore()
  const {
    translationsData: updatedTranslations,
    setUpdatedField,
    resetUpdatedStore
  } = useUpdatedTranslationStore()

  const { translateText } = useTranslation()
  const [isTranslating, setIsTranslating] = useState(false)

  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const hasFoodUpdates =
    Object.keys(updatedTranslations.foodData.en).length > 0 ||
    Object.keys(updatedTranslations.foodData.fr).length > 0

  const FormSchema = z.object({
    mood: z.string().nonempty(translations.pleaseSelectAMood),
    foodName: z
      .string()
      .nonempty(translations.required)
      .min(2, translations.foodNameMustBeAtLeast2Characters),
    description: z
      .string()
      .nonempty(translations.required)
      .min(10, translations.descriptionMustBeAtLeast10Characters),
    shopCategory: z.string().nonempty(translations.pleaseSelectAShopCategory),
    image: z.string().nonempty(translations.required)
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: translationsData.foodData[activeLang]
  })

  useEffect(() => {
    form.reset(translationsData.foodData[activeLang])
  }, [activeLang, form.reset, translationsData.foodData])

  const handleMoodChange = (value: string) => {
    form.setValue("mood", value)
    setTranslationField("foodData", activeLang, "mood", value)
    setUpdatedField("foodData", activeLang, "mood", value)

    const current = moodOptions[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = moodOptions[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "foodData",
        oppositeLang,
        "mood",
        opposite[index].value
      )
      setUpdatedField("foodData", oppositeLang, "mood", opposite[index].value)
    }
  }

  const handleImageSelect = async (files: File[] | null) => {
    const file = files?.[0] ?? null
    if (file) {
      try {
        setIsTranslating(true)
        const imageUrl = await uploadImageToFirebase(
          file,
          "moods/temp-food-tab",
          `temp-food-mood-image-${userName}`
        )

        form.setValue("image", imageUrl, {
          shouldValidate: true,
          shouldDirty: true
        })
        setTranslationField("foodData", "en", "image", imageUrl)
        setTranslationField("foodData", "fr", "image", imageUrl)

        setUpdatedField("foodData", "en", "image", imageUrl)
        setUpdatedField("foodData", "fr", "image", imageUrl)

        setPreviewUrls([imageUrl])
      } catch (error) {
        toast.error("Image upload failed. Please try again.")
        console.error("Firebase upload error:", error)
      } finally {
        setIsTranslating(false)
      }
    }
  }

  const handleShopCategoryChange = (value: string) => {
    form.setValue("shopCategory", value)
    setTranslationField("foodData", activeLang, "shopCategory", value)
    setUpdatedField("foodData", activeLang, "shopCategory", value)

    const current = shopcategory[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = shopcategory[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "foodData",
        oppositeLang,
        "shopCategory",
        opposite[index].value
      )
      setUpdatedField(
        "foodData",
        oppositeLang,
        "shopCategory",
        opposite[index].value
      )
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: "foodName" | "description"
  ) => {
    const value = e.target.value
    form.setValue(fieldName, value, { shouldValidate: true, shouldDirty: true })
    setTranslationField("foodData", activeLang, fieldName, value)
    setUpdatedField("foodData", activeLang, fieldName, value)
  }

  const handleInputBlur = async (
    value: string,
    fieldName: "foodName" | "description"
  ) => {
    if (activeLang === "en" && value.trim()) {
      try {
        setIsTranslating(true)
        const translated = await translateText(value)
        setTranslationField("foodData", "fr", fieldName, translated)
        setUpdatedField("foodData", "fr", fieldName, translated)
      } finally {
        setIsTranslating(false)
      }
    }
  }

  const handleReset = async () => {
    form.reset(translationsData.foodData[activeLang])
    // clear store and session
    await resetTranslations()
    await resetUpdatedStore()
    sessionStorage.removeItem("mood-storage")
    sessionStorage.removeItem("updated-mood-fields")

    onClose()
  }

  const onSubmit = (data: z.infer<typeof FormSchema>): void => {
    EditFoodMood()
  }

  return (
    <div className="relative">
      {isTranslating && (
        <div className="flex absolute inset-0 z-50 justify-center items-center bg-white/60">
          <span className="w-10 h-10 rounded-full border-t-4 border-blue-500 border-solid animate-spin" />
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="pb-20 space-y-4 text-black"
        >
          {/* Mood */}
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.selectMood}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={handleMoodChange}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder={translations.selectMood} />
                    </SelectTrigger>
                    <SelectContent>
                      {moodOptions[activeLang].map(option => (
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

          <Separator />

          {/* Food Name */}
          <FormField
            control={form.control}
            name="foodName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.foodName}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={translations.searchForFood}
                    {...field}
                    onChange={e => handleInputChange(e, "foodName")}
                    onBlur={() => handleInputBlur(field.value, "foodName")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.description}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={translations.addDetailsInHere}
                    {...field}
                    onChange={e => handleInputChange(e, "description")}
                    onBlur={() => handleInputBlur(field.value, "description")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {/* Shop Category */}
          <FormField
            control={form.control}
            name="shopCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.shopcategory}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={handleShopCategoryChange}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue
                        placeholder={translations.selectShopCategory}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {shopcategory[activeLang].map(option => (
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
                      previewUrls={
                        previewUrls.length > 0
                          ? previewUrls
                          : [translationsData.foodData.en.image]
                      }
                      onChange={handleImageSelect}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex fixed bottom-0 left-0 z-50 justify-between px-8 py-2 w-full bg-white border-t border-gray-200">
            <Button variant="outline" type="button" onClick={handleReset}>
              {translations.cancel}
            </Button>
            <Button type="submit" disabled={isLoading || !hasFoodUpdates}>
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
