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
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"

interface Option {
  value: string
  label: string
}

// Validation schema for this page
const FormSchema = z.object({
  mood: z.string()
    .nonempty("Please select a mood"),
  author: z.string()
    .nonempty("Required")
    .min(2, { message: "Author name must be at least 2 characters" }),
  quote: z.string()
    .nonempty("Required")
    .min(10, { message: "Quote must be at least 10 characters" }),
})

const moods: Option[] = [
  { value: "happy", label: "Happy" },
  { value: "angry", label: "Angry" },
  { value: "sad", label: "Sad" }
]

export default function QuoteTab(): JSX.Element {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mood: "",
      author: "",
      quote: ""
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    toast("Form submitted", {
      description: JSON.stringify(data, null, 2),
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-black">
          {/* Mood Field */}
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

          {/* Author Field */}
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem className="flex-1 mb-4">
                <FormLabel>Quote Author</FormLabel>
                <FormControl>
                  <Input placeholder="Enter quote author" {...field} />
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
              <FormItem className="flex-1 mb-6">
                <FormLabel>Quote</FormLabel>
                <FormControl>
                  <Textarea placeholder="Add the quote here in detail." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="fixed bottom-0 left-0 z-50 flex justify-between w-full px-8 py-2 bg-white border-t border-gray-200">
            <Button variant="outline" type="button" onClick={() => { form.reset(); }}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </>
  )
}
