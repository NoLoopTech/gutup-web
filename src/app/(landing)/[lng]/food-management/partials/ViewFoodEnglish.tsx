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
import { FoodDetailsTypes } from "./ViewFoodPopUp"

const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)
interface Option {
  value: string
  label: string
}
interface ViewFoodEnglishProps {
  selectionRef: React.Ref<RichTextEditorHandle>
  preparationRef: React.Ref<RichTextEditorHandle>
  conservationRef: React.Ref<RichTextEditorHandle>
  foodDetails: FoodDetailsTypes | null
}

const categories: Option[] = [
  { value: "Fruit", label: "Fruit" },
  { value: "Meat", label: "Meat" },
  { value: "Fish", label: "Fish" },
  { value: "grains", label: "Grains" }
]

const seasons: Option[] = [
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "April", label: "April" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" }
]

const countries: Option[] = [
  { value: "Ecuador", label: "Ecuador" },
  { value: "USA", label: "USA" },
  { value: "Norway", label: "Norway" }
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

export default function ViewFoodEnglish({
  selectionRef,
  preparationRef,
  conservationRef,
  foodDetails
}: ViewFoodEnglishProps): JSX.Element {
  // handle form submit
  const onSubmit = (data: z.infer<typeof FoodSchema>): void => {
    toast("Form submitted successfully!", {})
  }
  const handleCancel = (
    form: ReturnType<typeof useForm<z.infer<typeof FoodSchema>>>
  ): void => {
    form.reset()
  }

  const handleSelectionChange = (field: any) => (val: string) => {
    field.onChange(val)
  }

  const handlePreparationChange = (field: any) => (val: string) => {
    field.onChange(val)
  }

  const handleConservationChange = (field: any) => (val: string) => {
    field.onChange(val)
  }
  // Separate function for handling image upload
  const handleImageUpload = (field: any) => (files: File[] | null) => {
    field.onChange(files && files.length > 0 ? files[0] : null)
  }

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
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
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
                      <Input
                        placeholder="Enter food name"
                        {...field}
                        value={foodDetails?.name}
                        disabled
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      Category
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || foodDetails?.category}
                        disabled
                      >
                        <SelectTrigger className="mt-1 w-full">
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
                      Months
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || foodDetails?.season}
                        disabled
                      >
                        <SelectTrigger className="mt-1 w-full">
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
                        value={field.value || foodDetails?.country}
                        disabled
                      >
                        <SelectTrigger className="mt-1 w-full">
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
              <Input
                placeholder="Provide details if applicable"
                value={foodDetails?.attributes.fiber}
                disabled
              />
            </div>
            <div>
              <Label className="block mb-1 text-black">Proteins</Label>
              <Input
                placeholder="Provide details if applicable"
                value={foodDetails?.attributes.proteins}
                disabled
              />
            </div>
            <div>
              <Label className="block mb-1 text-black">Vitamins</Label>
              <Input
                placeholder="Provide details if applicable"
                value={foodDetails?.attributes.vitamins}
                disabled
              />
            </div>
            <div>
              <Label className="block mb-1 text-black">Minerals</Label>
              <Input
                placeholder="Provide details if applicable"
                value={foodDetails?.attributes.minerals}
                disabled
              />
            </div>
            <div>
              <Label className="block mb-1 text-black">Fat</Label>
              <Input
                placeholder="Provide details if applicable"
                value={foodDetails?.attributes.fat}
                disabled
              />
            </div>
            <div>
              <Label className="block mb-1 text-black">Sugar</Label>
              <Input
                placeholder="Provide details if applicable"
                value={foodDetails?.attributes.sugar}
                disabled
              />
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
                  benefits={field.value || foodDetails?.healthBenefits || []}
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
                        initialContent={
                          field.value || foodDetails?.describe.selection
                        }
                        onChange={handleSelectionChange(field)}
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
                        initialContent={
                          field.value || foodDetails?.describe.preparation
                        }
                        onChange={handlePreparationChange(field)}
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
                        initialContent={
                          field.value || foodDetails?.describe.conservation
                        }
                        onChange={handleConservationChange(field)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="pb-12 mt-6 w-full sm:w-2/5">
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
                      onChange={handleImageUpload(field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Save and Cancel buttons */}
          <div className="flex fixed bottom-0 left-0 z-50 gap-2 justify-between px-4 py-4 w-full bg-white border-t">
            <Button
              variant="outline"
              onClick={() => {
                handleCancel(form)
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
