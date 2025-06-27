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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { type translationsTypes } from "@/types/dailyTipTypes"
import { useTranslation } from "@/query/hooks/useTranslation"
import { useDailyTipStore } from "@/stores/useDailyTipStore"
import { Textarea } from "@/components/ui/textarea"

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
  translations
}: {
  translations: translationsTypes
}): JSX.Element {
  const { translateText } = useTranslation()
  const { activeLang, translationsData, setTranslationField } =
    useDailyTipStore()
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
      .url({ message: translations.invalidURLFormat }),
    dateselect: z.string().nonempty(translations.required)
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: translationsData.videoTipData[activeLang]
  })

  // Update form when lang changes
  useEffect(() => {
    form.reset(translationsData.videoTipData[activeLang])
  }, [activeLang, form.reset, translationsData.videoTipData])

  const handleCancel = (
    form: ReturnType<typeof useForm<z.infer<typeof FormSchema>>>
  ): void => {
    form.reset()
  }

  const handleInputChange = (
    fieldName: "title" | "subTitle" | "subDescription" | "videoLink",
    value: string
  ) => {
    form.setValue(fieldName, value)
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

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const dateString = date.toISOString()
    form.setValue("dateselect", dateString)
    setTranslationField("videoTipData", "en", "dateselect", dateString)
    setTranslationField("videoTipData", "fr", "dateselect", dateString)
  }

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    toast("Form submitted", {
      description: JSON.stringify(data, null, 2)
    })
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
            <div className="flex items-start lg:justify-end lg:-mt-[4.4rem]">
              <div className="w-[25.5rem]">
                <FormField
                  control={form.control}
                  name="dateselect"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{translations.whenTobeDisplayed}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            data-empty={!field}
                            className="data-[empty=true]:text-muted-foreground w-[25.5rem] justify-between text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{translations.pickADate}</span>
                            )}
                            <CalendarIcon className="ml-2 w-4 h-4 text-gray-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={handleDateSelect}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
