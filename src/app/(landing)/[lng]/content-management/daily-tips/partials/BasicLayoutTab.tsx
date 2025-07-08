"use client"

import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Resolver, useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
import { type translationsTypes } from "@/types/dailyTipTypes"
import { useTranslation } from "@/query/hooks/useTranslation"
import { useDailyTipStore } from "@/stores/useDailyTipStore"
import { Checkbox } from "@/components/ui/checkbox"
import { uploadImageToFirebase } from "@/lib/firebaseImageUtils"
import { toast } from "sonner"

interface Option {
  value: string
  label: string
}

type FieldNames =
  | "title"
  | "subTitleOne"
  | "subDescriptionOne"
  | "subTitleTwo"
  | "subDescriptionTwo"

const concerns: Record<string, Option[]> = {
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

export default function BasicLayoutTab({
  translations,
  onClose,
  addDailyTip,
  userName
}: {
  translations: translationsTypes
  onClose: () => void
  addDailyTip: () => void
  userName: string
}): JSX.Element {
  const { translateText } = useTranslation()
  const {
    activeLang,
    translationsData,
    setTranslationField,
    resetTranslations
  } = useDailyTipStore()
  const [isTranslating, setIsTranslating] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  // Validation schema including inputs & textareas
  const FormSchema = z.object({
    title: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.titleMustBeAtLeast2Characters }),
    subTitleOne: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.subTitleOneMustBeAtLeast2Characters }),
    subDescriptionOne: z
      .string()
      .nonempty(translations.required)
      .min(10, {
        message: translations.subDescriptionOneMustBeAtLeast10Characters
      })
      .max(500, {
        message: translations.subDescriptionOneMustNotExceed500Characters
      }),
    subTitleTwo: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.subTitleTwoMustBeAtLeast2Characters }),
    subDescriptionTwo: z
      .string()
      .nonempty(translations.required)
      .min(10, {
        message: translations.subDescriptionTwoMustBeAtLeast10Characters
      })
      .max(500, {
        message: translations.subDescriptionTwoMustNotExceed500Characters
      }),
    concern: z
      .string({ required_error: translations.pleaseSelectAConcern })
      .nonempty(translations.pleaseSelectAConcern),
    image: z.string().nonempty(translations.required),
    share: z
      .boolean({ required_error: translations.required })
      .default(false)
      .refine(val => typeof val === "boolean", {
        message: translations.required
      })
  })

  const handleInputChange = (fieldName: FieldNames, value: string) => {
    form.setValue(fieldName, value)
    setTranslationField("basicLayoutData", activeLang, fieldName, value)
  }

  const handleInputBlur = async (fieldName: FieldNames, value: string) => {
    if (activeLang === "en" && value.trim()) {
      try {
        setIsTranslating(true)
        const translated = await translateText(value)
        setTranslationField("basicLayoutData", "fr", fieldName, translated)
      } finally {
        setIsTranslating(false)
      }
    }
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema) as Resolver<
      z.infer<typeof FormSchema>,
      any
    >,
    defaultValues: translationsData.basicLayoutData[activeLang] as z.infer<
      typeof FormSchema
    >
  })

  // Update form when lang changes
  useEffect(() => {
    form.reset(translationsData.basicLayoutData[activeLang])
  }, [form.reset, translationsData.basicLayoutData])

  // handle change concerns function
  const handleConcernsChange = (value: string) => {
    form.setValue("concern", value)
    setTranslationField("basicLayoutData", activeLang, "concern", value)

    const current = concerns[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = concerns[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "basicLayoutData",
        oppositeLang,
        "concern",
        opposite[index].value
      )
    }
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
        setTranslationField("basicLayoutData", "en", "image", imageUrl)
        setTranslationField("basicLayoutData", "fr", "image", imageUrl)

        setPreviewUrls([imageUrl]) // For single image preview
      } catch (error) {
        toast.error("Image upload failed. Please try again.")
        console.error("Firebase upload error:", error)
      } finally {
        setIsTranslating(false)
      }
    }
  }

  const handleReset = async () => {
    form.reset(translationsData.basicLayoutData[activeLang])
    // clear store and session
    await resetTranslations()
    sessionStorage.removeItem("daily-tip-storage")

    onClose()
  }

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    addDailyTip()
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
          <div className="space-y-4 text-black">
            {/* concern */}
            <div className="pt-4 pb-3">
              <FormField
                control={form.control}
                name="concern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.concern}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={handleConcernsChange}
                      >
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue
                            placeholder={translations.selectConcern}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {concerns[activeLang].map(option => (
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

            <div className="pb-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-4">
                    <FormLabel className="block mb-1 text-black">
                      {translations.title}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.giveATipTitle}
                        {...field}
                        onChange={e =>
                          handleInputChange("title", e.target.value)
                        }
                        onBlur={() => handleInputBlur("title", field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subTitleOne"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-4">
                    <FormLabel className="block mb-1 text-black">
                      {translations.subTitleOne}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.giveATipTitle}
                        {...field}
                        onChange={e =>
                          handleInputChange("subTitleOne", e.target.value)
                        }
                        onBlur={() =>
                          handleInputBlur("subTitleOne", field.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Validated Textarea One */}
              <FormField
                control={form.control}
                name="subDescriptionOne"
                render={({ field }) => (
                  <FormItem className="flex-1 pb-4 mb-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.subDescriptionOne}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={translations.describeInDetail}
                        {...field}
                        onChange={e =>
                          handleInputChange("subDescriptionOne", e.target.value)
                        }
                        onBlur={() =>
                          handleInputBlur("subDescriptionOne", field.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subTitleTwo"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-4">
                    <FormLabel className="block mb-1 text-black">
                      {translations.subTitleTwo}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.giveATipTitle}
                        {...field}
                        onChange={e =>
                          handleInputChange("subTitleTwo", e.target.value)
                        }
                        onBlur={() =>
                          handleInputBlur("subTitleTwo", field.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Validated Textarea Two */}
              <FormField
                control={form.control}
                name="subDescriptionTwo"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.subDescriptionTwo}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={translations.describeInDetail}
                        {...field}
                        onChange={e =>
                          handleInputChange("subDescriptionTwo", e.target.value)
                        }
                        onBlur={() =>
                          handleInputBlur("subDescriptionTwo", field.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="share"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="flex gap-2 items-center">
                    <Checkbox
                      id="share-checkbox"
                      checked={Boolean(field.value)}
                      onCheckedChange={(checked: boolean) => {
                        field.onChange(checked)
                        setTranslationField(
                          "basicLayoutData",
                          "en",
                          "share",
                          checked
                        )
                        setTranslationField(
                          "basicLayoutData",
                          "fr",
                          "share",
                          checked
                        )
                      }}
                    />{" "}
                    <FormLabel
                      htmlFor="share-checkbox"
                      className="m-0 cursor-pointer"
                    >
                      {translations.share}
                    </FormLabel>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="flex justify-between items-center mt-4 mb-4">
              <h2 className="text-lg font-bold text-black">
                {translations.uploadImages}
              </h2>
            </div>
            {/* Image Uploader */}
            <div className="pb-12">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader
                        title={translations.selectImagesForYourFoodItem}
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
            <Button variant="outline" onClick={handleReset}>
              {translations.cancel}
            </Button>
            <Button type="submit">{translations.save}</Button>
          </div>
        </form>
      </Form>{" "}
    </div>
  )
}
