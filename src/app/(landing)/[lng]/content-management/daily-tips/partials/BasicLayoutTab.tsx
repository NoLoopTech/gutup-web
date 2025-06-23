"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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

interface Option {
  value: string
  label: string
}

const concerns: Option[] = [
  { value: "Stress", label: "Stress" },
  { value: "Anxiety", label: "Anxiety" },
  { value: "Depression", label: "Depression" }
]

// Validation schema including inputs & textareas
const FormSchema = z.object({
  title: z
    .string()
    .nonempty("Required")
    .min(2, { message: "Title must be at least 2 characters" }),
  subTitleOne: z
    .string()
    .nonempty("Required")
    .min(2, { message: "Sub Title One must be at least 2 characters" }),
  subDescriptionOne: z
    .string()
    .nonempty("Required")
    .min(10, { message: "Sub Description One must be at least 10 characters" })
    .max(500, {
      message: "Sub Description One must not exceed 500 characters"
    }),
  subTitleTwo: z
    .string()
    .nonempty("Required")
    .min(2, { message: "Sub Title Two must be at least 2 characters" }),
  subDescriptionTwo: z
    .string()
    .nonempty("Required")
    .min(10, { message: "Sub Description Two must be at least 10 characters" })
    .max(500, {
      message: "Sub Description Two must not exceed 500 characters"
    }),
  concern: z
    .string({ required_error: "Please select a concern" })
    .nonempty("Please select a concern"),
  image: z.custom<File | null>(val => val instanceof File, {
    message: "Required"
  }),
  dateselect: z.date({
    required_error: "Required"
  })
})

export default function BasicLayoutTab(): JSX.Element {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      subTitleOne: "",
      subDescriptionOne: "",
      subTitleTwo: "",
      subDescriptionTwo: "",
      concern: "",
      image: null,
      dateselect: undefined
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 text-black">
          {/* Header */}
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
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4 text-gray-500" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 pb-2">
            <Label>Concerns</Label>
            <div className="w-full">
              <FormField
                control={form.control}
                name="concern"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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

          <Separator />

          <div className="pb-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1 mb-4">
                  <FormLabel className="block mb-1 text-black">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Give a tip title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subTitleOne"
              render={({ field }) => (
                <FormItem className="flex-1 mb-4">
                  <FormLabel className="block mb-1 text-black">
                    Sub Title One
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Give a tip title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Validated Textarea One */}
            <FormField
              control={form.control}
              name="subDescriptionOne"
              render={({ field }) => (
                <FormItem className="flex-1 mb-1 pb-4">
                  <FormLabel className="block mb-1 text-black">
                    Sub Description One
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe in detail." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subTitleTwo"
              render={({ field }) => (
                <FormItem className="flex-1 mb-4">
                  <FormLabel className="block mb-1 text-black">
                    Sub Title Two
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Give a tip title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Validated Textarea Two */}
            <FormField
              control={form.control}
              name="subDescriptionTwo"
              render={({ field }) => (
                <FormItem className="flex-1 mb-1">
                  <FormLabel className="block mb-1 text-black">
                    Sub Description Two
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe in detail." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between mt-4 mb-4">
            <h2 className="text-lg font-bold text-black">Upload Images</h2>
          </div>
          {/* Image Uploader */}
          <div className="pb-12">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      title="Select Images for your food item"
                      onChange={file => {
                        field.onChange(file)
                        form.clearErrors("image")
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Buttons */}
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
