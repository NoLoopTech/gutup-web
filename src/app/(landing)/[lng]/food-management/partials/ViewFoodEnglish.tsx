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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
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
import { useTranslation } from "@/query/hooks/useTranslation"
import { zodResolver } from "@hookform/resolvers/zod"
import dynamic from "next/dynamic"
import React, { useState } from "react"
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
  seasons: Option[]
  countries: Option[]
  benefitTags: Array<{ tagName: string; tagNameFr: string }>
  updateEditedData: (field: string, value: any) => void
  updateNestedData: (
    parentField: string,
    childField: string,
    value: any
  ) => void
  handleSelectSync: (
    fieldName: "category" | "season" | "country",
    value: string,
    lang: "en" | "fr"
  ) => void
  handleImageSelect: (files: File[] | null) => Promise<void>
  imagePreviewUrls: string[]
  token: string
}

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

const seasonSyncMap = [
  { en: "January", fr: "Janvier" },
  { en: "February", fr: "Février" },
  { en: "March", fr: "Mars" },
  { en: "April", fr: "Avril" },
  { en: "May", fr: "Mai" },
  { en: "June", fr: "Juin" },
  { en: "July", fr: "Juillet" },
  { en: "August", fr: "Août" },
  { en: "September", fr: "Septembre" },
  { en: "October", fr: "Octobre" },
  { en: "November", fr: "Novembre" },
  { en: "December", fr: "Décembre" }
]

export default function ViewFoodEnglish({
  selectionRef,
  preparationRef,
  conservationRef,
  foodDetails,
  categories,
  seasons,
  countries,
  benefitTags,
  updateEditedData,
  updateNestedData,
  handleSelectSync,
  handleImageSelect,
  imagePreviewUrls,
  token
}: ViewFoodEnglishProps): JSX.Element {
  const { translateText } = useTranslation()
  const [pendingNewBenefits, setPendingNewBenefits] = useState<
    Array<{ tagName: string; tagNameFr: string }>
  >([])

  const handleAddNewBenefit = async (
    benefit: string
  ): Promise<{ tagName: string; tagNameFr: string }> => {
    try {
      const tagNameFr = await translateText(benefit)
      const newBenefit = { tagName: benefit, tagNameFr }

      setPendingNewBenefits(prev => [...prev, newBenefit])

      return newBenefit
    } catch (error) {
      console.error("Error translating new benefit:", error)
      const newBenefit = { tagName: benefit, tagNameFr: benefit }
      setPendingNewBenefits(prev => [...prev, newBenefit])
      return newBenefit
    }
  }

  // Expose function to parent component for saving pending benefits
  React.useEffect(() => {
    if (pendingNewBenefits.length > 0) {
      sessionStorage.setItem(
        "pendingNewBenefits",
        JSON.stringify(pendingNewBenefits)
      )
    }
  }, [pendingNewBenefits])

  // handle form submit
  const onSubmit = (data: z.infer<typeof FoodSchema>): void => {
    toast("Form submitted successfully!", {})
  }

  const handleSelectionChange = (field: any) => (val: string) => {
    field.onChange(val)
    updateNestedData("describe", "selection", val)
    if (val?.trim()) {
      translateText(val)
        .then(translated => {
          updateNestedData("describe", "selectionFR", translated)
        })
        .catch(() => {
          updateNestedData("describe", "selectionFR", val)
        })
    }
  }

  const handlePreparationChange = (field: any) => (val: string) => {
    field.onChange(val)
    updateNestedData("describe", "preparation", val)
    if (val?.trim()) {
      translateText(val)
        .then(translated => {
          updateNestedData("describe", "preparationFR", translated)
        })
        .catch(() => {
          updateNestedData("describe", "preparationFR", val)
        })
    }
  }

  const handleConservationChange = (field: any) => (val: string) => {
    field.onChange(val)
    updateNestedData("describe", "conservation", val)
    // Translate and update French version
    if (val?.trim()) {
      translateText(val)
        .then(translated => {
          updateNestedData("describe", "conservationFR", translated)
        })
        .catch(() => {
          updateNestedData("describe", "conservationFR", val)
        })
    }
  }
  // Update the image upload handler
  const handleImageUpload = (field: any) => async (files: File[] | null) => {
    await handleImageSelect(files)
    field.onChange(files && files.length > 0 ? files[0] : null)
  }

  const form = useForm<z.infer<typeof FoodSchema>>({
    resolver: zodResolver(FoodSchema),
    defaultValues: {
      name: foodDetails?.name ?? "",
      category: foodDetails?.category ?? "",
      season: foodDetails?.seasons?.[0]?.season ?? "",
      country: foodDetails?.country ?? "",
      fiber: foodDetails?.attributes?.fiber?.toString() ?? "",
      proteins: foodDetails?.attributes?.proteins?.toString() ?? "",
      vitamins: foodDetails?.attributes?.vitamins ?? "",
      minerals: foodDetails?.attributes?.minerals ?? "",
      fat: foodDetails?.attributes?.fat?.toString() ?? "",
      sugar: foodDetails?.attributes?.sugar?.toString() ?? "",
      benefits: foodDetails?.healthBenefits?.map(b => b.healthBenefit) ?? [],
      image: null,
      selection: foodDetails?.describe?.selection ?? "",
      preparation: foodDetails?.describe?.preparation ?? "",
      conservation: foodDetails?.describe?.conservation ?? ""
    }
  })

  // Watch for form changes and update session storage
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && value[name as keyof typeof value] !== undefined) {
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
            updateNestedData("attributes", name, value[name] as string)
            if (value[name] && (value[name] as string).trim()) {
              translateText(value[name] as string)
                .then(translated => {
                  updateNestedData("attributes", "vitaminsFR", translated)
                })
                .catch(() => {
                  updateNestedData(
                    "attributes",
                    "vitaminsFR",
                    value[name] as string
                  )
                })
            }
            break
          case "minerals":
            updateNestedData("attributes", name, value[name] as string)
            if (value[name] && (value[name] as string).trim()) {
              translateText(value[name] as string)
                .then(translated => {
                  updateNestedData("attributes", "mineralsFR", translated)
                })
                .catch(() => {
                  updateNestedData(
                    "attributes",
                    "mineralsFR",
                    value[name] as string
                  )
                })
            }
            break
          case "name":
            updateEditedData(name, value[name])
            if (value[name] && (value[name] as string).trim()) {
              translateText(value[name] as string)
                .then(translated => {
                  updateEditedData("nameFR", translated)
                })
                .catch(() => {
                  updateEditedData("nameFR", value[name] as string)
                })
            }
            break
          case "category":
          case "country":
            updateEditedData(name, value[name])
            break
          case "season":
            if (Array.isArray(value[name])) {
              const newSeasons = (value[name] as string[]).map(enMonth => {
                const found = seasonSyncMap.find(m => m.en === enMonth)
                return {
                  season: enMonth,
                  seasonFR: found ? found.fr : enMonth,
                  foodId: foodDetails?.seasons?.[0]?.foodId ?? 0
                }
              })
              updateEditedData("seasons", newSeasons)
            } else {
              const found = seasonSyncMap.find(m => m.en === value[name])
              updateEditedData("seasons", [
                {
                  season: value[name],
                  seasonFR: found ? found.fr : value[name],
                  foodId: foodDetails?.seasons?.[0]?.foodId ?? 0
                }
              ])
            }
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
  }, [form, updateEditedData, updateNestedData, foodDetails, translateText])

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
                        onValueChange={value => {
                          field.onChange(value)
                          handleSelectSync("category", value, "en")
                        }}
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
                render={({ field }) => {
                  // Get selected months as a flat array of strings
                  const selectedMonths =
                    foodDetails?.seasons?.map(s => s.season) ?? []
                  return (
                    <FormItem>
                      <FormLabel className="block text-black">Months</FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className={`overflow-x-auto overflow-y-hidden justify-between w-full mt-1 ${
                                selectedMonths.length === 0
                                  ? "text-gray-500 font-normal hover:text-gray-500"
                                  : ""
                              }`}
                              style={{ scrollbarWidth: "none" }}
                            >
                              {selectedMonths.length > 0
                                ? selectedMonths.join(", ")
                                : "Select Months"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-full overflow-auto max-h-64"
                            style={{ scrollbarWidth: "none" }}
                          >
                            <DropdownMenuItem
                              disabled
                              className="text-xs text-muted-foreground"
                            >
                              Filter by Months
                            </DropdownMenuItem>
                            {seasons.map(month => (
                              <DropdownMenuItem
                                key={month.value}
                                onClick={() => {
                                  let updated = [...selectedMonths]
                                  if (updated.includes(month.value)) {
                                    updated = updated.filter(
                                      m => m !== month.value
                                    )
                                  } else {
                                    updated = [...updated, month.value]
                                  }
                                  // Use seasonSyncMap from top-level
                                  const newSeasons = updated.map(enMonth => {
                                    const found = seasonSyncMap.find(
                                      m => m.en === enMonth
                                    )
                                    return {
                                      season: enMonth,
                                      seasonFR: found ? found.fr : enMonth,
                                      foodId:
                                        foodDetails?.seasons?.[0]?.foodId ?? 0
                                    }
                                  })
                                  updateEditedData("seasons", newSeasons)
                                  // Pass only the array of values to the form field (for validation, etc.)
                                  field.onChange(updated)
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedMonths.includes(month.value)}
                                  readOnly
                                  className="mr-2"
                                />
                                {month.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
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
                        onValueChange={value => {
                          field.onChange(value)
                          handleSelectSync("country", value, "en")
                        }}
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
                  onAddNewBenefit={handleAddNewBenefit}
                  onSelectSuggestion={benefit => {
                    console.log("English onSelectSuggestion:", benefit)
                    const currentData = foodDetails?.healthBenefits ?? []

                    const updatedHealthBenefits = [
                      ...currentData,
                      {
                        healthBenefit: benefit.tagName,
                        healthBenefitFR: benefit.tagNameFr
                      }
                    ]

                    updateEditedData("healthBenefits", updatedHealthBenefits)
                  }}
                  onRemoveBenefit={removed => {
                    console.log("English onRemoveBenefit:", removed)
                    const currentData = foodDetails?.healthBenefits ?? []

                    const updatedHealthBenefits = currentData.filter(
                      b => b.healthBenefit !== removed.tagName
                    )

                    updateEditedData("healthBenefits", updatedHealthBenefits)
                    // Also remove from pending benefits if it exists
                    setPendingNewBenefits(prev =>
                      prev.filter(p => p.tagName !== removed.tagName)
                    )
                  }}
                  onChange={(newBenefits: string[]) => {
                    console.log("English onChange:", newBenefits)
                    const healthBenefits = newBenefits.map(
                      (benefit, index) => ({
                        healthBenefit: benefit,
                        healthBenefitFR: ""
                      })
                    )

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
                          field.value || foodDetails?.describe?.selection
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
                          field.value || foodDetails?.describe?.preparation
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
                          field.value || foodDetails?.describe?.conservation
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
                      previewUrls={
                        imagePreviewUrls.length > 0
                          ? imagePreviewUrls
                          : foodDetails?.images && foodDetails.images.length > 0
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
