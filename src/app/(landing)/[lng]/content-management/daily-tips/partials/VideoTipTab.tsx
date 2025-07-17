"use client"

import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
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
import { toast } from "sonner"
import { type translationsTypes } from "@/types/dailyTipTypes"
import { useTranslation } from "@/query/hooks/useTranslation"
import { useDailyTipStore } from "@/stores/useDailyTipStore"
import { Textarea } from "@/components/ui/textarea"
import { deleteImageFromFirebase } from "@/lib/firebaseImageUtils"

interface Option {
  value: string
  label: string
}

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

export default function VideoTipTab({
  translations,
  onClose,
  addDailyTip,
  isLoading
}: {
  translations: translationsTypes
  onClose: () => void
  addDailyTip: () => void
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

  // Validation schema for this page
  const FormSchema = z.object({
    concern: z.string().nonempty(translations.pleaseSelectAConcern),
    title: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.titleMustBeAtLeast2Characters }),
    subTitle: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.subTitlMustBeAtLeast2Characters }),
    subDescription: z.string().nonempty(translations.required).min(10, {
      message: translations.subDescriptioMustBeAtLeast10Characters
    }),
    videoLink: z
      .string()
      .nonempty(translations.required)
      .url({ message: translations.invalidURLFormat })
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: translationsData.videoTipData[activeLang]
  })

  // Update form when lang changes
  useEffect(() => {
    form.reset(translationsData.videoTipData[activeLang])
  }, [activeLang, form.reset, translationsData.videoTipData])

  const handleCancel = async (): Promise<void> => {
    // Collect unique image URLs
    const imageUrls = [
      translationsData.basicLayoutData[activeLang]?.image,
      translationsData.shopPromotionData?.[activeLang]?.image
    ].filter(
      (url, index, arr): url is string => !!url && arr.indexOf(url) === index
    )

    //  Delete all images from Firebase
    await Promise.all(
      imageUrls.map(async url => {
        try {
          await deleteImageFromFirebase(url)
        } catch (error) {
          console.error(`Failed to delete image: ${url}`, error)
        }
      })
    )

    setTranslationField("basicLayoutData", "en", "image", "")
    setTranslationField("basicLayoutData", "fr", "image", "")
    setTranslationField("shopPromotionData", "en", "image", "")
    setTranslationField("shopPromotionData", "fr", "image", "")

    // clear store and session
    await resetTranslations()
    //  Remove session storage
    sessionStorage.removeItem("daily-tip-storage")

    // Close the form/modal
    onClose()
  }

  const handleInputChange = (
    fieldName: "title" | "subTitle" | "subDescription" | "videoLink",
    value: string
  ) => {
    form.setValue(fieldName, value, { shouldValidate: true, shouldDirty: true })
    setTranslationField("videoTipData", activeLang, fieldName, value)
  }

  const handleInputBlur = async (
    fieldName: "title" | "subTitle" | "subDescription" | "videoLink",
    value: string
  ) => {
    if (activeLang === "en" && value.trim()) {
      try {
        setIsTranslating(true)
        if (fieldName !== "videoLink") {
          const translated = await translateText(value)
          setTranslationField("videoTipData", "fr", fieldName, translated)
        } else {
          setTranslationField("videoTipData", "fr", "videoLink", value)
        }
      } finally {
        setIsTranslating(false)
      }
    }
  }

  // handle change concerns function
  const handleConcernsChange = (value: string) => {
    form.setValue("concern", value)
    setTranslationField("videoTipData", activeLang, "concern", value)

    const current = concerns[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = concerns[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "videoTipData",
        oppositeLang,
        "concern",
        opposite[index].value
      )
    }
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
          </div>

          <div className="pt-4 pb-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1 mb-4">
                  <FormLabel>{translations.title}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={translations.enterTitle}
                      {...field}
                      onChange={e => handleInputChange("title", e.target.value)}
                      onBlur={() => handleInputBlur("title", field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subTitle"
              render={({ field }) => (
                <FormItem className="flex-1 mb-4">
                  <FormLabel>{translations.subTitle}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={translations.enterSubTitle}
                      {...field}
                      onChange={e =>
                        handleInputChange("subTitle", e.target.value)
                      }
                      onBlur={() => handleInputBlur("subTitle", field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subDescription"
              render={({ field }) => (
                <FormItem className="flex-1 mb-6">
                  <FormLabel>{translations.subDescription}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={translations.describeInDetail}
                      className="h-14"
                      {...field}
                      onChange={e =>
                        handleInputChange("subDescription", e.target.value)
                      }
                      onBlur={() =>
                        handleInputBlur("subDescription", field.value)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="flex-1 mt-4 mb-8">
            <FormField
              control={form.control}
              name="videoLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.videoLink}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={translations.enterTheVideoLink}
                      {...field}
                      onChange={e =>
                        handleInputChange("videoLink", e.target.value)
                      }
                      onBlur={() => handleInputBlur("videoLink", field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex fixed bottom-0 left-0 z-50 justify-between px-8 py-2 w-full bg-white border-t border-gray-200">
            <Button
              variant="outline"
              onClick={async () => {
                await handleCancel()
              }}
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
            </Button>{" "}
          </div>
        </form>
      </Form>
    </div>
  )
}
