"use client"

import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import { Button } from "@/components/ui/button"
import { CustomTable } from "@/components/Shared/Table/CustomTable"
import SearchBar from "@/components/Shared/SearchBar/SearchBar"
import { Switch } from "@/components/ui/switch"
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
import { type translationsTypes } from "@/types/dailyTipTypes"
import { useTranslation } from "@/query/hooks/useTranslation"
import { useDailyTipStore } from "@/stores/useDailyTipStore"
import { Textarea } from "@/components/ui/textarea"

interface Option {
  value: string
  label: string
}

interface Ingredient {
  id: number
  name: string
  quantity: string
  isMain: boolean
  tags: string[]
}

interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
}

type FieldNames =
  | "reason"
  | "shopName"
  | "shopLocation"
  | "subDescription"
  | "shopCategory"
  | "mobileNumber"
  | "email"
  | "mapsPin"
  | "facebook"
  | "instagram"
  | "website"

const reason: Record<string, Option[]> = {
  en: [
    { value: "stress", label: "Stress" },
    { value: "anxiety", label: "Anxiety" },
    { value: "depression", label: "Depression" }
  ],
  fr: [
    { value: "stresser", label: "Stresser" },
    { value: "anxiété", label: "Anxiété" },
    { value: "dépression", label: "Dépression" }
  ]
}

const ingredientColumns: Array<Column<Ingredient>> = [
  { header: "Ingredient Name", accessor: "name" },
  {
    header: "Main Ingredient",
    accessor: row => (
      <Switch
        checked={row.isMain}
        className="scale-75"
        style={{ minWidth: 28, minHeight: 16 }}
      />
    )
  }
]

export default function ShopPromotionTab({
  translations
}: {
  translations: translationsTypes
}): JSX.Element {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(2)
  const [ingredientData] = React.useState<Ingredient[]>([])
  const { translateText } = useTranslation()
  const { activeLang, translationsData, setTranslationField } =
    useDailyTipStore()
  const [isTranslating, setIsTranslating] = useState(false)

  // Validate only inputs and select
  const FormSchema = z.object({
    shopName: z.string().min(1, { message: translations.required }),
    reason: z.string().nonempty(translations.pleaseSelectAReasonToDisplay),
    shopLocation: z.string().min(2, { message: translations.required }),
    shopCategory: z.string().min(2, { message: translations.required }),
    subDescription: z.string().nonempty(translations.required).min(10, {
      message: translations.subDescriptionMustBeAtLeast10CharactersLong
    }),
    mobileNumber: z
      .string()
      .nonempty(translations.required)
      .regex(/^(\+\d{11}|\d{10})$/, translations.invalidMobileNumberFormat),
    email: z
      .string()
      .nonempty(translations.required)
      .email({ message: translations.invalidEmailAddress }),
    mapsPin: z.string().min(1, { message: translations.required }),
    facebook: z
      .string()
      .optional()
      .refine(val => !val || /^https?:\/\/.+$/.test(val), {
        message: translations.invalidFacebookURL
      }),
    instagram: z
      .string()
      .optional()
      .refine(val => !val || /^https?:\/\/.+$/.test(val), {
        message: translations.invalidInstagramURL
      }),
    website: z
      .string()
      .optional()
      .refine(val => !val || /^https?:\/\/.+$/.test(val), {
        message: translations.invalidWebsiteURL
      }),
    ingredientData: z
      .array(z.unknown())
      .nonempty(translations.atLeastOneIngredientCategoryMustBeAdded),
    image: z.string().nonempty(translations.required),
    dateselect: z.string().nonempty(translations.required)
  })

  const handleInputChange = (fieldName: FieldNames, value: string) => {
    form.setValue(fieldName, value)
    setTranslationField("shopPromotionData", activeLang, fieldName, value)
    if (fieldName !== "subDescription" || "shopCategory") {
      setTranslationField("shopPromotionData", "fr", fieldName, value)
    }
  }

  const handleInputBlur = async (fieldName: FieldNames, value: string) => {
    if (activeLang === "en" && value.trim()) {
      try {
        setIsTranslating(true)
        const translated = await translateText(value)
        setTranslationField("shopPromotionData", "fr", fieldName, translated)
      } finally {
        setIsTranslating(false)
      }
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const dateString = date.toISOString()
    form.setValue("dateselect", dateString)
    setTranslationField("shopPromotionData", "en", "dateselect", dateString)
    setTranslationField("shopPromotionData", "fr", "dateselect", dateString)
  }

  const handleImageSelect = (files: File[] | null) => {
    const file = files?.[0] ?? null
    if (file) {
      const fileName = file.name

      form.setValue("image", fileName)
      setTranslationField("shopPromotionData", "en", "image", fileName)
      setTranslationField("shopPromotionData", "fr", "image", fileName)
    }
  }

  // handle change reason function
  const handleReasonsChange = (value: string) => {
    form.setValue("reason", value)
    setTranslationField("shopPromotionData", activeLang, "reason", value)

    const current = reason[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = reason[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "shopPromotionData",
        oppositeLang,
        "reason",
        opposite[index].value
      )
    }
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: translationsData.shopPromotionData[activeLang]
  })

  // Update form when lang changes
  useEffect(() => {
    form.reset(translationsData.shopPromotionData[activeLang])
  }, [activeLang, form.reset, translationsData.shopPromotionData])

  // Define functions to handle page changes
  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  const handleCancel = (
    form: ReturnType<typeof useForm<z.infer<typeof FormSchema>>>
  ): void => {
    form.reset()
  }
  function onSubmit(data: z.infer<typeof FormSchema>): void {
    toast("Form submitted", {
      description: JSON.stringify(data, null, 2)
    })
  }

  return (
    <div className="relative">
      {isTranslating && (
        <div className="flex absolute inset-0 z-50 justify-center items-center bg-white/60">
          <span className="w-10 h-10 rounded-full border-t-4 border-blue-500 border-solid animate-spin" />
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3 text-black">
            {/* Shop Name */}
            <div className="flex items-start lg:justify-end lg:-mt-[4.8rem]">
              <div className="w-[25.5rem]">
                <FormField
                  control={form.control}
                  name="shopName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.shopName}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={translations.enterShopName}
                          {...field}
                          onChange={e =>
                            handleInputChange("shopName", e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2 md:flex-row">
              <div className="w-full md:w-[25.5rem]">
                <FormField
                  control={form.control}
                  name="dateselect"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{translations.whenTobeDisplayed}</FormLabel>
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
                              <span>{translations.pickADate}</span>
                            )}
                            <CalendarIcon className="ml-2 w-4 h-4 text-gray-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={handleDateSelect}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Reason */}
              <div className="w-full md:w-[25.5rem] mt-[-0.3rem]">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{translations.reasonToDisplay}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={handleReasonsChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={translations.selectReason}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {reason[activeLang].map(option => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
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

            <div className="flex gap-4">
              {/* Location */}
              <FormField
                control={form.control}
                name="shopLocation"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.shopLocation}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterShopLocation}
                        {...field}
                        onChange={e =>
                          handleInputChange("shopLocation", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category */}
              <FormField
                control={form.control}
                name="shopCategory"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.shopCategory}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterShopCategory}
                        {...field}
                        onChange={e =>
                          handleInputChange("shopCategory", e.target.value)
                        }
                        onBlur={() =>
                          handleInputBlur("shopCategory", field.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sub Description */}
            <div className="pb-1">
              <FormField
                control={form.control}
                name="subDescription"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-2">
                    <FormLabel>{translations.subDescription}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={translations.describeInDetail}
                        className="h-14"
                        {...field}
                        onChange={e =>
                          handleInputChange("subDescription", e.target.value)
                        }
                        onBlur={() =>
                          handleInputBlur("subDescription", field.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Store Contact */}
            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.mobileNumber}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+123456789"
                        {...field}
                        onChange={e =>
                          handleInputChange("mobileNumber", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.email}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@example.com"
                        {...field}
                        onChange={e =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mapsPin"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.mapsPin}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterGoogleMapsLocation}
                        {...field}
                        onChange={e =>
                          handleInputChange("mapsPin", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-6 pb-1">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.facebook}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterFacebookURL}
                        {...field}
                        onChange={e =>
                          handleInputChange("facebook", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.instagram}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterInstagramURL}
                        {...field}
                        onChange={e =>
                          handleInputChange("instagram", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormLabel>{translations.website}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterWebsiteURL}
                        {...field}
                        onChange={e =>
                          handleInputChange("website", e.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Star Products */}
            <div className="flex flex-row gap-2 items-center mb-4">
              <SearchBar
                title={translations.selectFeaturedIngredients}
                placeholder={translations.searchForIngredients}
              />
              <Button className="mt-7" onClick={() => {}}>
                {translations.add}
              </Button>
            </div>
            <Label className="block text-gray-500">
              {translations.cantFindtheIngredientDescription}
            </Label>
            <FormField
              control={form.control}
              name="ingredientData"
              render={({ field }) => (
                <>
                  <CustomTable
                    columns={ingredientColumns}
                    data={ingredientData.slice(
                      (page - 1) * pageSize,
                      page * pageSize
                    )}
                    page={page}
                    pageSize={pageSize}
                    totalItems={ingredientData.length}
                    pageSizeOptions={[1, 5, 10]}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                  {ingredientData.length === 0 && (
                    <FormMessage className="text-red-500">
                      At least one ingredient/category must be added.
                    </FormMessage>
                  )}
                </>
              )}
            />

            <Separator />

            <div className="flex justify-between items-center mt-4 mb-4">
              <h2 className="text-lg font-bold text-black">
                {translations.uploadImages}
              </h2>
            </div>

            {/* Image Uploader */}
            <div className="pb-8 w-full sm:w-2/5">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader
                        title={translations.selectImagesForYourFoodItem}
                        onChange={handleImageSelect}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex fixed bottom-0 left-0 z-50 justify-between px-8 py-2 w-full bg-white border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                handleCancel(form)
              }}
            >
              {translations.cancel}
            </Button>
            <Button type="submit">{translations.save}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
