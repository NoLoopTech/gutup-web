"use client"

import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import LableInput from "@/components/Shared/LableInput/LableInput"
import type { RichTextEditorHandle } from "@/components/Shared/TextEditor/RichTextEditor"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { TabsContent } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import dynamic from "next/dynamic"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { type FoodDetailsTypes } from "./ViewFoodPopUp"

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
  categories: Option[]
  benefitTags: Array<{ tagName: string; tagNameFr: string }>
  updateEditedData: (field: string, value: any) => void
  updateNestedData: (
    parentField: string,
    childField: string,
    value: any
  ) => void
}

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
  fiber: z.string().optional(),
  proteins: z.string().optional(),
  vitamins: z.string().optional(),
  minerals: z.string().optional(),
  fat: z.string().optional(),
  sugar: z.string().optional(),
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
  foodDetails,
  categories,
  benefitTags,
  updateEditedData,
  updateNestedData
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
    updateNestedData("describe", "selection", val)
  }

  const handlePreparationChange = (field: any) => (val: string) => {
    field.onChange(val)
    updateNestedData("describe", "preparation", val)
  }

  const handleConservationChange = (field: any) => (val: string) => {
    field.onChange(val)
    updateNestedData("describe", "conservation", val)
  }
  // Separate function for handling image upload
  const handleImageUpload = (field: any) => (files: File[] | null) => {
    field.onChange(files && files.length > 0 ? files[0] : null)
  }

  const form = useForm<z.infer<typeof FoodSchema>>({
    resolver: zodResolver(FoodSchema),
    defaultValues: {
      name: foodDetails?.name || "",
      category: foodDetails?.category || "",
      season: foodDetails?.seasons?.[0]?.season || "",
      country: foodDetails?.country || "",
      fiber: foodDetails?.attributes?.fiber?.toString() || "",
      proteins: foodDetails?.attributes?.proteins?.toString() || "",
      vitamins: foodDetails?.attributes?.vitamins || "",
      minerals: foodDetails?.attributes?.minerals || "",
      fat: foodDetails?.attributes?.fat?.toString() || "",
      sugar: foodDetails?.attributes?.sugar?.toString() || "",
      benefits: foodDetails?.healthBenefits?.map(b => b.healthBenefit) || [],
      image: null,
      selection: foodDetails?.describe?.selection || "",
      preparation: foodDetails?.describe?.preparation || "",
      conservation: foodDetails?.describe?.conservation || ""
    }
  })

  // Watch for form changes and update session storage
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && value[name] !== undefined) {
        switch (name) {
          case "fiber":
          case "proteins":
          case "fat":
          case "sugar":
            updateNestedData(
              "attributes",
              name,
              parseFloat(value[name] as string) || 0
            )
            break
          case "vitamins":
          case "minerals":
            updateNestedData("attributes", name, value[name] as string)
            break
          case "name":
          case "category":
          case "country":
            updateEditedData(name, value[name])
            break
          case "season":
            updateEditedData("seasons", [
              {
                season: value[name],
                seasonFR: "",
                foodId: foodDetails?.seasons?.[0]?.foodId || 0
              }
            ])
            break
          case "benefits":
            updateEditedData(
              "healthBenefits",
              (value[name] as string[]).map(benefit => ({
                healthBenefit: benefit,
                healthBenefitFR: ""
              }))
            )
            break
        }
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [form, updateEditedData, updateNestedData, foodDetails])

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
                        value={foodDetails?.category ?? field.value}
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
                      Months
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={
                          foodDetails?.seasons && foodDetails.seasons.length > 0
                            ? foodDetails.seasons[0].season
                            : field.value
                        }
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
                        value={foodDetails?.country ?? field.value}
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
              <FormField
                control={form.control}
                name="fiber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      Fiber
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Provide details if applicable"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="proteins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      Proteins
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Provide details if applicable"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="vitamins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      Vitamins
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Provide details if applicable"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="minerals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      Minerals
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Provide details if applicable"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="fat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">Fat</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Provide details if applicable"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="sugar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      Sugar
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Provide details if applicable"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-[100%]">
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <LableInput
                  title="Health Benefits"
                  placeholder="Add up to 6 food benefits or fewer"
                  benefits={
                    foodDetails?.healthBenefits?.map(b => b.healthBenefit) ?? []
                  }
                  name="benefits"
                  width="w-[32%]"
                  disable={false}
                  suggestions={benefitTags}
                  activeLang="en"
                  onSelectSuggestion={benefit => {
                    console.log("English onSelectSuggestion:", benefit)
                    // Get current benefits from foodDetails
                    const currentData = foodDetails?.healthBenefits || []
                    
                    // Add both EN and FR at the same index
                    const updatedHealthBenefits = [
                      ...currentData,
                      {
                        healthBenefit: benefit.tagName,
                        healthBenefitFR: benefit.tagNameFr
                      }
                    ]
                    
                    console.log("Updated health benefits:", updatedHealthBenefits)
                    
                    // Update session storage
                    updateEditedData("healthBenefits", updatedHealthBenefits)
                    
                    // Don't update form field here - let the benefits prop handle display
                  }}
                  onRemoveBenefit={removed => {
                    console.log("English onRemoveBenefit:", removed)
                    const currentData = foodDetails?.healthBenefits || []
                    
                    // Find and remove by matching either English or French name
                    const updatedHealthBenefits = currentData.filter(b => 
                      b.healthBenefit !== removed.tagName && 
                      b.healthBenefitFR !== removed.tagNameFr
                    )
                    
                    console.log("After removal:", updatedHealthBenefits)
                    
                    // Update session storage
                    updateEditedData("healthBenefits", updatedHealthBenefits)
                  }}
                  onChange={(newBenefits: string[]) => {
                    console.log("English onChange:", newBenefits)
                    // This is for manual typing - preserve structure
                    const currentData = foodDetails?.healthBenefits || []
                    const healthBenefits = newBenefits.map((benefit, index) => ({
                      healthBenefit: benefit,
                      healthBenefitFR: currentData[index]?.healthBenefitFR || ""
                    }))
                    
                    updateEditedData("healthBenefits", healthBenefits)
                    field.onChange(newBenefits)
                  }}
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

          <div className="w-full pb-12 mt-6 sm:w-2/5">
            <h3 className="mb-4 text-lg font-semibold text-black">Images</h3>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      title="Select Images for your food item"
                      onChange={handleImageUpload(field)}
                      // Show preview if foodDetails has images
                      previewUrls={
                        foodDetails?.images && foodDetails.images.length > 0
                          ? foodDetails.images.map(img => img.image)
                          : []
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
      </form>
    </Form>
  )
}
         