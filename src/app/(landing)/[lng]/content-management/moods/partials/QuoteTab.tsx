"use client"

import React, { useEffect } from "react"
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
import { useForm } from "react-hook-form"
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

interface Option {
  value: string
  label: string
}

const moods: Option[] = [
  { value: "happy", label: "Happy" },
  { value: "angry", label: "Angry" },
  { value: "sad", label: "Sad" }
]

export default function QuoteTab({
  translations
}: {
  translations: translationsTypes
}): JSX.Element {
  const { activeLang, translationsData, setTranslationField } = useMoodStore()

  // Validation schema
  const FormSchema = z.object({
    mood: z.string().nonempty(translations.pleaseSelectAMood),
    author: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.authorNameMustBeAtLeast2Characters }),
    quote: z
      .string()
      .nonempty(translations.required)
      .min(10, { message: translations.quoteMustBeAtLeast10Characters })
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: translationsData.quoteData[activeLang]
  })

  // Sync form when language changes
  useEffect(() => {
    form.reset(translationsData.quoteData[activeLang])
  }, [activeLang, form.reset, translationsData.quoteData])

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    toast("Form submitted", {
      description: JSON.stringify(data, null, 2)
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 text-black"
      >
        {/* Mood Field */}
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
                    onValueChange={value => {
                      field.onChange(value)
                      setTranslationField(
                        "quoteData",
                        activeLang,
                        "mood",
                        value
                      )
                    }}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder={translations.selectMood} />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {translations[
                            option.value.toLowerCase() as keyof translationsTypes
                          ] || option.label}
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
                  onChange={e => {
                    field.onChange(e)
                    setTranslationField(
                      "quoteData",
                      activeLang,
                      "author",
                      e.target.value
                    )
                  }}
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
                  onChange={e => {
                    field.onChange(e)
                    setTranslationField(
                      "quoteData",
                      activeLang,
                      "quote",
                      e.target.value
                    )
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex fixed bottom-0 left-0 z-50 justify-between px-8 py-2 w-full bg-white border-t border-gray-200">
          <Button
            variant="outline"
            type="button"
            onClick={() => form.reset(translationsData.quoteData[activeLang])}
          >
            {translations.cancel}
          </Button>
          <Button type="submit">{translations.save}</Button>
        </div>
      </form>
    </Form>
  )
}
