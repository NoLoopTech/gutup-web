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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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

const shopcategory: Option[] = [
  { value: "bakery", label: "Bakery" },
  { value: "dairy", label: "Dairy" },
  { value: "produce", label: "Produce" }
]

export default function FoodTab({
  translations
}: {
  translations: translationsTypes
}): JSX.Element {
  const { activeLang, translationsData, setTranslationField } = useMoodStore()

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
    shopCategory: z.string().nonempty(translations.pleaseSelectAShopCategory)
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: translationsData.foodData[activeLang]
  })

  // Sync RHF form with Zustand store
  useEffect(() => {
    form.reset(translationsData.foodData[activeLang])
  }, [activeLang, form.reset, translationsData.foodData])

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    toast("Form submitted", {
      description: JSON.stringify(data, null, 2)
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="pb-20 space-y-4 text-black"
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
                    onValueChange={value => {
                      field.onChange(value)
                      setTranslationField("foodData", activeLang, "mood", value)
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
                  onChange={e => {
                    field.onChange(e)
                    setTranslationField(
                      "foodData",
                      activeLang,
                      "foodName",
                      e.target.value
                    )
                  }}
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
                  onChange={e => {
                    field.onChange(e)
                    setTranslationField(
                      "foodData",
                      activeLang,
                      "description",
                      e.target.value
                    )
                  }}
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
                  onValueChange={value => {
                    field.onChange(value)
                    setTranslationField(
                      "foodData",
                      activeLang,
                      "shopCategory",
                      value
                    )
                  }}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue
                      placeholder={translations.selectShopCategory}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {shopcategory.map(option => (
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

        {/* Action Buttons */}
        <div className="flex fixed bottom-0 left-0 z-50 justify-between px-8 py-2 w-full bg-white border-t border-gray-200">
          <Button
            variant="outline"
            type="button"
            onClick={() => form.reset(translationsData.foodData[activeLang])}
          >
            {translations.cancel}
          </Button>
          <Button type="submit">{translations.save}</Button>
        </div>
      </form>
    </Form>
  )
}
