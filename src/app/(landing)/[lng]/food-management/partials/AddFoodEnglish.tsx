"use client"

import React from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import dynamic from "next/dynamic"
import type { RichTextEditorHandle } from "@/components/Shared/TextEditor/RichTextEditor"
import LableInput from "@/components/Shared/LableInput/LableInput"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
} from "@/components/ui/form"
import { toast } from "sonner"

const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)
interface Option {
  value: string
  label: string
}
interface AddFoodEnglishProps {
  selectionRef: React.Ref<RichTextEditorHandle>
  preparationRef: React.Ref<RichTextEditorHandle>
  conservationRef: React.Ref<RichTextEditorHandle>
}
const categories: Option[] = [
  { value: "fruits", label: "Fruits" },
  { value: "vegetables", label: "Vegetables" },
  { value: "dairy", label: "Dairy" },
  { value: "grains", label: "Grains" }
]
const seasons: Option[] = [
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "autumn", label: "Autumn" },
  { value: "winter", label: "Winter" }
]
const countries: Option[] = [
  { value: "switzerland", label: "Switzerland" },
  { value: "france", label: "France" },
  { value: "germany", label: "Germany" },
  { value: "italy", label: "Italy" }
]

const FoodSchema = z.object({
  name: z
    .string()
    .nonempty("Required")
    .min(2, { message: "Must be at least 2 characters" }),
  category: z.string().nonempty("Please select a category"),
  season: z.string().nonempty("Please select a season"),
  country: z.string().nonempty("Please select a country"),
  benefits: z
    .array(z.string())
    .refine(arr => arr.some(item => item.trim().length > 0), {
      message: "Please enter at least one Benefit"
    }),
  image: z.custom<File | null>(val => val instanceof File, {
    message: "Required"
  }),
  selection: z.string().refine(
    val => {
      const plainText = val.replace(/<(.|\n)*?>/g, "").trim() // remove all tags
      const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val) // check for <img> tags
      return plainText !== "" || hasImage
    },
    {
      message: "Required"
    }
  ),

  preparation: z.string().refine(
    val => {
      const plainText = val.replace(/<(.|\n)*?>/g, "").trim()
      const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val)
      return plainText !== "" || hasImage
    },
    {
      message: "Required"
    }
  ),
  conservation: z.string().refine(
    val => {
      const plainText = val.replace(/<(.|\n)*?>/g, "").trim()
      const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val)
      return plainText !== "" || hasImage
    },
    {
      message: "Required"
    }
  )
})

const onSubmit = (data: z.infer<typeof FoodSchema>): void => {
  toast("Form submitted successfully!", {})
}

export default function AddFoodEnglish({
  selectionRef,
  preparationRef,
  conservationRef
}: AddFoodEnglishProps): JSX.Element {
  const form = useForm<z.infer<typeof FoodSchema>>({
    resolver: zodResolver(FoodSchema),
    defaultValues: {
      name: "",
      category: "",
      season: "",
      country: "",
      benefits: [],
      image: null,
      selection: "",
      preparation: "",
      conservation: ""
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <TabsContent value="english">
          {/* English Tab Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter food name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      Category
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((option: Option) => (
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
            <div>
              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      Season
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select Season" />
                        </SelectTrigger>
                        <SelectContent>
                          {seasons.map((option: Option) => (
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
            <div>
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((option: Option) => (
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

          <Separator className="my-2" />

          <h3 className="mb-4 text-lg font-semibold text-black">
            Food Attributes
          </h3>
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <Label className="block mb-1 text-black">Fiber</Label>
              <Input placeholder="Provide details if applicable" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Proteins</Label>
              <Input placeholder="Provide details if applicable" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Vitamins</Label>
              <Input placeholder="Provide details if applicable" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Minerals</Label>
              <Input placeholder="Provide details if applicable" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Fat</Label>
              <Input placeholder="Provide details if applicable" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Sugar</Label>
              <Input placeholder="Provide details if applicable" />
            </div>
          </div>
          <div className="w-[100%] ">
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <LableInput
                  title="Health Benefits"
                  placeholder="Add up to 6 food benefits or fewer"
                  benefits={field.value || []}
                  name="benefits"
                  width="w-[32%]"
                />
              )}
            />
          </div>

          <Separator className="my-2" />

          <h3 className="mb-4 text-lg font-semibold text-black">
            Describe the Food
          </h3>
          <div className="flex flex-col gap-6">
            <div>
              <FormField
                control={form.control}
                name="selection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-2 text-black">
                      Selection
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        ref={selectionRef}
                        value={field.value}
                        onChange={val => {
                          field.onChange(val)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="preparation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-2 text-black">
                      Preparation
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        ref={preparationRef}
                        value={field.value}
                        onChange={val => {
                          field.onChange(val)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="conservation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-2 text-black">
                      Conservation
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        ref={conservationRef}
                        value={field.value}
                        onChange={val => {
                          field.onChange(val)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-full mt-6 sm:w-2/5 pb-12">
            <h3 className="mb-4 text-lg font-semibold text-black">
              Upload Images
            </h3>
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

          {/* Save and Cancel buttons */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t py-4 px-4 flex justify-between gap-2 z-50">
            <Button
              variant="outline"
              onClick={() => {
                form.reset()
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </TabsContent>
      </form>
    </Form>
  )
}
