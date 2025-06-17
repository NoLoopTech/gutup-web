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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

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
  concern: z.string().nonempty("Please select a concern"),
  title: z
    .string()
    .nonempty("Required")
    .min(2, { message: "Title must be at least 2 characters" }),
  subTitle: z
    .string()
    .nonempty("Required")
    .min(2, { message: "Sub Title must be at least 2 characters" }),
  subDescription: z
    .string()
    .nonempty("Required")
    .min(10, { message: "Sub Description must be at least 10 characters" }),
  videoLink: z
    .string()
    .nonempty("Required")
    .url({ message: "Invalid URL format" }),
  dateselect: z.date({
    required_error: "Required",
  }),
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
      dateselect: undefined,
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
                name="dateselect"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>When to be Displayed</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!field}
                          className="data-[empty=true]:text-muted-foreground w-[25.5rem] justify-between text-left font-normal"
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : <span>Pick a date</span>
                          }
                          <CalendarIcon className="ml-2 h-4 w-4 text-gray-500" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <Label>Concerns</Label>
            <div className="w-full">
              <FormField
                control={form.control}
                name="concern"
                render={({ field }) => (
                  <FormItem>
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

        <div className="flex-1 mt-6 mb-8">
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
