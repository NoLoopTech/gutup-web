"use client"

import React, { useEffect, useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Resolver, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { toast } from "sonner"
import { type translationsTypes } from "@/types/moodsTypes"
import { useMoodStore } from "@/stores/useMoodStore"
import { useTranslation } from "@/query/hooks/useTranslation"
import { Checkbox } from "@/components/ui/checkbox"

interface Option {
  value: string
  label: string
}

// Mood options per language
const moodOptions: Record<string, Option[]> = {
  en: [
    { value: "happy", label: "Happy" },
    { value: "angry", label: "Angry" },
    { value: "sad", label: "Sad" }
  ],
  fr: [
    { value: "heureuse", label: "Heureuse" },
    { value: "en colère", label: "En colère" },
    { value: "triste", label: "Triste" }
  ]
}

export default function QuoteTab({
  translations
}: {
  translations: translationsTypes
}): JSX.Element {
  const { translateText } = useTranslation()
  const { activeLang, translationsData, setTranslationField } = useMoodStore()
  const [isTranslating, setIsTranslating] = useState(false)

  // Schema
  const FormSchema = z.object({
    mood: z.string().nonempty(translations.pleaseSelectAMood),
    author: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.authorNameMustBeAtLeast2Characters }),
    quote: z
      .string()
      .nonempty(translations.required)
      .min(10, { message: translations.quoteMustBeAtLeast10Characters }),
    share: z
      .boolean({ required_error: translations.required })
      .default(false)
      .refine(val => typeof val === "boolean", {
        message: translations.required
      })
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema) as Resolver<
      z.infer<typeof FormSchema>,
      any
    >,
    defaultValues: translationsData.quoteData[activeLang] as z.infer<
      typeof FormSchema
    >
  })

  // Update form when lang changes
  useEffect(() => {
    form.reset(translationsData.quoteData[activeLang])
  }, [activeLang, form.reset, translationsData.quoteData])

  const handleInputChange = (fieldName: "author" | "quote", value: string) => {
    form.setValue(fieldName, value)
    setTranslationField("quoteData", activeLang, fieldName, value)
  }

  const handleInputBlur = async (
    fieldName: "author" | "quote",
    value: string
  ) => {
    if (activeLang === "en" && value.trim()) {
      try {
        setIsTranslating(true)
        const translated = await translateText(value)
        setTranslationField("quoteData", "fr", fieldName, translated)
      } finally {
        setIsTranslating(false)
      }
    }
  }

  const handleMoodChange = (value: string) => {
    form.setValue("mood", value)
    setTranslationField("quoteData", activeLang, "mood", value)

    const current = moodOptions[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = moodOptions[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "quoteData",
        oppositeLang,
        "mood",
        opposite[index].value
      )
    }
  }

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    toast("Form submitted", {
      description: JSON.stringify(data, null, 2)
    })
  }

  const handleResetForm = () => {
    form.reset(translationsData.quoteData[activeLang])
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
          className="space-y-4 text-black"
        >
          {/* Mood */}
          <div className="pt-4 pb-3">
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.selectMood}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={handleMoodChange}
                    >
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
          </div>

          <Separator />

          {/* Author Field */}
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{translations.quoteAuthor}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={translations.enterQuoteQuthor}
                    {...field}
                    onChange={e => handleInputChange("author", e.target.value)}
                    onBlur={() => handleInputBlur("author", field.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quote Field */}
          <FormField
            control={form.control}
            name="quote"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{translations.quote}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={translations.addTheQuoteHereInDetails}
                    {...field}
                    onChange={e => handleInputChange("quote", e.target.value)}
                    onBlur={() => handleInputBlur("quote", field.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="share"
            render={({ field }) => (
              <FormItem>
                <FormControl className="flex gap-2 items-center">
                  <Checkbox
                    id="share-checkbox"
                    checked={field.value}
                    onCheckedChange={(checked: boolean) => {
                      field.onChange(checked)
                      setTranslationField("quoteData", "en", "share", checked)
                      setTranslationField("quoteData", "fr", "share", checked)
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

          {/* Action Buttons */}
          <div className="flex fixed bottom-0 left-0 z-50 justify-between px-8 py-2 w-full bg-white border-t border-gray-200">
            <Button variant="outline" type="button" onClick={handleResetForm}>
              {translations.cancel}
            </Button>
            <Button type="submit">{translations.save}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
