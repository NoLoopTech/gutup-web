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

interface Option {
  value: string
  label: string
}

const moods: Option[] = [
  { value: "happy", label: "Happy" },
  { value: "angry", label: "Angry" },
  { value: "sad", label: "Sad" }
]

// Validation schema
const FormSchema = z.object({
  mood: z.string().nonempty("Please select a mood"),
  recipe: z
    .string()
    .nonempty("Required")
    .min(2, "Recipe name must be at least 2 characters"),
  description: z
    .string()
    .nonempty("Required")
    .min(10, "Description must be at least 10 characters")
})

export default function RecipeTab(): JSX.Element {
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
        className="space-y-4 text-black pb-20"
      >
        {/* Mood */}
        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Mood</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select Mood" />
                  </SelectTrigger>
                  <SelectContent>
                    {moods.map(option => (
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

        {/* Recipe Name */}
        <FormField
          control={form.control}
          name="recipe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe</FormLabel>
              <FormControl>
                <Input placeholder="Search for recipe" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Add details in here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 z-50 flex justify-between w-full px-8 py-2 bg-white border-t border-gray-200">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              form.reset()
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  )
}
