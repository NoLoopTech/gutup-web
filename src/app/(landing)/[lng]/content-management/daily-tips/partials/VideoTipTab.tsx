"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"

interface Option {
  value: string
  label: string
}

const concerns: Option[] = [
  { value: "Stress", label: "Stress" },
  { value: "Anxiety", label: "Anxiety" },
  { value: "Depression", label: "Depression" },
]

// Validation schema for this page
const FormSchema = z.object({
  concern: z.string().nonempty("Please select a concern."),
  title: z
    .string()
    .nonempty("Title is required.")
    .min(2, { message: "Title must be at least 2 characters." }),
  subTitle: z
    .string()
    .nonempty("Sub Title is required.")
    .min(2, { message: "Sub Title must be at least 2 characters." }),
  subDescription: z
    .string()
    .nonempty("Sub Description is required.")
    .min(10, { message: "Sub Description must be at least 10 characters." }),
  videoLink: z
    .string()
    .nonempty("Video Link is required.")
    .url({ message: "Invalid URL format." }),
})

export default function VideoTipTab(): JSX.Element {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      concern: "",
      title: "",
      subTitle: "",
      subDescription: "",
      videoLink: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    toast("Form submitted", {
      description: JSON.stringify(data, null, 2),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 text-black">
          <div className="flex items-start lg:justify-end lg:-mt-[4.4rem]">
            <div className="w-[25.5rem]">
              <FormField
                control={form.control}
                name="concern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concerns</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select Concern" />
                        </SelectTrigger>
                        <SelectContent>
                          {concerns.map(option => (
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

          <div className="flex flex-col gap-1">
            <Label>When to be Displayed</Label>
            <div className="flex gap-7 items-center">
              <div className="flex flex-col">
                <Label htmlFor="time-from" className="text-xs text-gray-400">From</Label>
                <Input
                  type="time"
                  id="time-from"
                  step="1"
                  defaultValue="10:30:00"
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="time-to" className="text-xs text-gray-400">To</Label>
                <Input
                  type="time"
                  id="time-to"
                  step="1"
                  defaultValue="18:30:00"
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1 mb-4">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
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
                <FormLabel>Sub Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter sub title" {...field} />
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
                <FormLabel>Sub Description</FormLabel>
                <FormControl>
                  <Input placeholder="Describe in detail" className="h-14" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="flex-1 mt-6 mb-6">
          <FormField
            control={form.control}
            name="videoLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video Link</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the video link eg: YouTube & Vimeo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="fixed bottom-0 left-0 z-50 flex justify-between w-full px-8 py-2 bg-white border-t border-gray-200">
          <Button variant="outline" type="button" onClick={() => { form.reset(); }}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  )
}
