"use client"

import React from "react"
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

interface Option {
  value: string
  label: string
}

const moods: Option[] = [
  { value: "happy", label: "Happy" },
  { value: "angry", label: "Angry" },
  { value: "sad", label: "Sad" }
]

export default function RecipeTab({
  translations
}: {
  translations: any
}): JSX.Element {
  // Validation schema
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
    defaultValues: {
      mood: "",
      recipe: "",
      description: ""
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    toast("Recipe Submitted", {
      description: JSON.stringify(data, null, 2)
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="pb-20 space-y-4 text-black"
      >
        <div className="pt-4 pb-3">
          {/* Mood */}
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.selectMood}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder={translations.selectMood} />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {translations[
                            option.value.toLowerCase() as keyof translationsTypes
                          ] || option.label}{" "}
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

        {/* Recipe Name */}
        <FormField
          control={form.control}
          name="recipe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations.recipe}</FormLabel>
              <FormControl>
                <Input placeholder={translations.searchForRecipe} {...field} />
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
            onClick={() => {
              form.reset()
            }}
          >
            {translations.cancel}
          </Button>
          <Button type="submit">{translations.save}</Button>
        </div>
      </form>
    </Form>
  )
}
