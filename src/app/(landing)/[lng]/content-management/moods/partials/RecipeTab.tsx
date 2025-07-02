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
import { type translationsTypes } from "@/types/moodsTypes"
import { useMoodStore } from "@/stores/useMoodStore"
import { useTranslation } from "@/query/hooks/useTranslation"

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

export default function RecipeTab({
  translations,
  onClose,
  addRecipeMood,
  isLoading
}: {
  translations: translationsTypes
  onClose: () => void
  addRecipeMood: () => void
  isLoading: boolean
}): JSX.Element {
  const { activeLang, translationsData, setTranslationField } = useMoodStore()
  const { translateText } = useTranslation()
  const [isTranslating, setIsTranslating] = useState(false)

  const FormSchema = z.object({
    mood: z.string().nonempty(translations.pleaseSelectAMood),
    recipe: z
      .string()
      .nonempty(translations.required)
      .min(2, translations.recipeNameMustBeAtLeast2Characters),
    description: z
      .string()
      .nonempty(translations.required)
      .min(10, translations.descriptionMustBeAtLeast10Characters)
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: translationsData.recipeData[activeLang]
  })

  useEffect(() => {
    form.reset(translationsData.recipeData[activeLang])
  }, [activeLang, form.reset, translationsData.recipeData])

  const handleMoodChange = (value: string) => {
    form.setValue("mood", value)
    setTranslationField("recipeData", activeLang, "mood", value)

    const current = moodOptions[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = moodOptions[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "recipeData",
        oppositeLang,
        "mood",
        opposite[index].value
      )
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: "recipe" | "description"
  ) => {
    const value = e.target.value
    form.setValue(fieldName, value, { shouldValidate: true, shouldDirty: true })
    setTranslationField("recipeData", activeLang, fieldName, value)
  }

  const handleInputBlur = async (
    value: string,
    fieldName: "recipe" | "description"
  ) => {
    if (activeLang === "en" && value.trim()) {
      try {
        setIsTranslating(true)
        const translated = await translateText(value)
        setTranslationField("recipeData", "fr", fieldName, translated)
      } finally {
        setIsTranslating(false)
      }
    }
  }

  const handleResetForm = () => {
    form.reset(translationsData.recipeData[activeLang])
    onClose()
  }

  const onSubmit = (data: z.infer<typeof FormSchema>): void => {
    addRecipeMood()
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

          {/* Recipe */}
          <FormField
            control={form.control}
            name="recipe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.recipe}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={translations.searchForRecipe}
                    {...field}
                    onChange={e => handleInputChange(e, "recipe")}
                    onBlur={() => handleInputBlur(field.value, "recipe")}
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

          {/* Actions */}
          <div className="flex fixed bottom-0 left-0 z-50 justify-between px-8 py-2 w-full bg-white border-t border-gray-200">
            <Button variant="outline" type="button" onClick={handleResetForm}>
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
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
