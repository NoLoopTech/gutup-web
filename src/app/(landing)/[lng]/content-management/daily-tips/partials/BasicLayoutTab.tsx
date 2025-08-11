"use client"

import React, { useEffect, useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Resolver, useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Check } from "lucide-react"

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
    { value: "fatigue", label: "Fatigue" },
    { value: "sleep", label: "Sleep" },
    { value: "mood", label: "Mood" },
    { value: "focus", label: "Focus" },
    { value: "digestion", label: "Digestion" },
    { value: "weight", label: "Weight" },
    { value: "immunity", label: "Immunity" },
    { value: "skin", label: "Skin" },
    { value: "bones", label: "Bones" },
    { value: "performance", label: "Performance" },
    { value: "aging", label: "Aging" }
  ],
  fr: [
    { value: "stresser", label: "Stresser" },
    { value: "fatigue", label: "Fatigue" },
    { value: "sommeil", label: "Sommeil" },
    { value: "humeur", label: "Humeur" },
    { value: "concentration", label: "Concentration" },
    { value: "digestion", label: "Digestion" },
    { value: "poids", label: "Poids" },
    { value: "immunité", label: "Immunité" },
    { value: "peau", label: "Peau" },
    { value: "os", label: "Os" },
    { value: "performance", label: "Performance" },
    { value: "vieillissement", label: "Vieillissement" }
  ]
}

export default function BasicLayoutTab({
  translations,
  onClose,
  addDailyTip,
  userName,
  isLoading
}: {
  translations: translationsTypes
  onClose: () => void
  addDailyTip: () => void
  userName: string
  isLoading: boolean
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
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined)

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
      .array(z.string())
      .min(1, { message: translations.pleaseSelectAConcern }),
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

    form.trigger(fieldName).then(isValid => {
      if (isValid) {
        form.clearErrors(fieldName)
      }
    })

    setTranslationField("basicLayoutData", activeLang, fieldName, value)
  }

  const handleInputBlur = async (fieldName: FieldNames, value: string) => {
    if (activeLang === "en" && value.trim()) {
      try {
        const translated = await translateText(value)
        setTranslationField("basicLayoutData", "fr", fieldName, translated)
      } catch (error) {
        console.log("Error Translating", error)
      }
    }
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema) as Resolver<
      z.infer<typeof FormSchema>,
      any
    >,
    defaultValues: {
      ...(translationsData.basicLayoutData[activeLang] as any),
      concern: translationsData.basicLayoutData[activeLang].concern || []
    }
  })

  // Update form when lang changes
  useEffect(() => {
    form.reset(translationsData.basicLayoutData[activeLang])
  }, [form.reset, translationsData.basicLayoutData])

  // handle change concerns function (multi-select)
  const handleConcernsToggle = (value: string) => {
    const current = (form.getValues("concern") as string[]) || []
    let next: string[]
    if (current.includes(value)) {
      next = current.filter(v => v !== value)
    } else {
      next = [...current, value]
    }
    form.setValue("concern", next, { shouldValidate: true })
    setTranslationField("basicLayoutData", activeLang, "concern", next)
    // mirror indices to other lang maintaining order
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const currentList = concerns[activeLang]
    const oppositeList = concerns[oppositeLang]
    const mapped = next.map(v => {
      const idx = currentList.findIndex(c => c.value === v)
      return idx > -1 ? oppositeList[idx].value : v
    })
    setTranslationField("basicLayoutData", oppositeLang, "concern", mapped)
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

  useEffect(() => {
    const existingUrl = translationsData.basicLayoutData[activeLang].image
    if (existingUrl) {
      setPreviewUrls([existingUrl])
    } else {
      setPreviewUrls([])
    }

    form.reset(translationsData.basicLayoutData[activeLang])
  }, [activeLang, form.reset, translationsData.basicLayoutData])

  const handleReset = async () => {
    form.reset(translationsData.basicLayoutData[activeLang])
    // clear store and session
    await resetTranslations()
    sessionStorage.removeItem("daily-tip-storage")

    // Clear preview image state
    setPreviewUrls([])

    onClose()
  }

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    addDailyTip()
  }

  useEffect(() => {
    if (triggerRef.current) setMenuWidth(triggerRef.current.offsetWidth)
  }, [activeLang, form.watch("concern")])

  return (
    <div className="relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 text-black">
            {/* concern */}
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              ref={triggerRef}
                              type="button"
                              variant="outline"
                              className="w-full justify-between truncate"
                            >
                              {field.value && field.value.length > 0 ? (
                                <span className="text-left flex-1">
                                  {field.value
                                    .map(v => {
                                      const opt = concerns[activeLang].find(
                                        o => o.value === v
                                      )
                                      return opt ? opt.label : v
                                    })
                                    .join(", ")}
                                </span>
                              ) : (
                                <span className="text-muted-foreground font-normal">
                                  {translations.selectConcern}
                                </span>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            style={{ width: menuWidth }}
                            className="max-h-80 overflow-y-auto"
                          >
                            <DropdownMenuSeparator />
                            {[...concerns[activeLang]]
                              .sort((a, b) => a.label.localeCompare(b.label))
                              .map(item => {
                                const isSelected = (field.value ).includes(
                                  item.value
                                )
                                return (
                                  <DropdownMenuItem
                                    key={item.value}
                                    onSelect={e => {
                                      e.preventDefault()
                                      handleConcernsToggle(item.value)
                                    }}
                                    className="cursor-pointer flex items-center gap-2"
                                  >
                                    <span className="flex items-center justify-center w-4 h-4">
                                      {isSelected && (
                                        <Check className="w-4 h-4 text-primary" />
                                      )}
                                    </span>
                                    <span>{item.label}</span>
                                  </DropdownMenuItem>
                                )
                              })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
            <div className="pb-8 w-full">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader
                        title={translations.selectImagesForYourFoodItem}
                        previewUrls={previewUrls ? previewUrls : []}
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
          </div>

          {/* Buttons */}
          <div className="flex fixed bottom-0 left-0 z-50 justify-between px-8 py-2 w-full bg-white border-t border-gray-200">
            <Button variant="outline" onClick={handleReset}>
              {translations.cancel}
            </Button>
            <Button type="submit" disabled={isLoading || isTranslating}>
              {isTranslating ? (
                <div className="flex gap-2 items-center">
                  <span className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  Translating...
                </div>
              ) : isLoading ? (
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
      </Form>{" "}
    </div>
  )
}
