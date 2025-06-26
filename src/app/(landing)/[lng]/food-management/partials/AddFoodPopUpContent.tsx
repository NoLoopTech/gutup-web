"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import dynamic from "next/dynamic"
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
import { type translationsTypes } from "@/types/foodTypes"

const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)
interface Option {
  value: string
  label: string
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

export default function AddFoodPopUpContent({
  translations
}: {
  translations: translationsTypes
}): JSX.Element {
  const FoodSchema = z.object({
    name: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.mustbeatleast2characters }),
    category: z.string().nonempty(translations.pleaseselectacategory),
    season: z.string().nonempty(translations.pleaseselectaseason),
    country: z.string().nonempty(translations.pleaseselectacountry),
    benefits: z
      .array(z.string())
      .refine(arr => arr.some(item => item.trim().length > 0), {
        message: translations.pleaseenteratleastonebenefit
      }),
    image: z.custom<File | null>(val => val instanceof File, {
      message: translations.required
    }),
    selection: z.string().refine(
      val => {
        const plainText = val.replace(/<(.|\n)*?>/g, "").trim() // remove all tags
        const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val) // check for <img> tags
        return plainText !== "" || hasImage
      },
      {
        message: translations.required
      }
    ),

    preparation: z.string().refine(
      val => {
        const plainText = val.replace(/<(.|\n)*?>/g, "").trim()
        const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val)
        return plainText !== "" || hasImage
      },
      {
        message: translations.required
      }
    ),
    conservation: z.string().refine(
      val => {
        const plainText = val.replace(/<(.|\n)*?>/g, "").trim()
        const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val)
        return plainText !== "" || hasImage
      },
      {
        message: translations.required
      }
    )
  })
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
  const onSubmit = (data: z.infer<typeof FoodSchema>): void => {
    toast(translations.formSubmittedSuccessfully, {})
  }
  const handleCancel = (
    form: ReturnType<typeof useForm<z.infer<typeof FoodSchema>>>
  ): void => {
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* English Tab Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="block mb-1 text-black">
                    {translations.name}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={translations.enterFoodName}
                      {...field}
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
                    {translations.category}
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue
                          placeholder={translations.selectCategory}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((option: Option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {translations[
                              option.value.toLowerCase() as keyof translationsTypes
                            ] || option.label}{" "}
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
                    {translations.season}
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder={translations.selectSeason} />
                      </SelectTrigger>
                      <SelectContent>
                        {seasons.map((option: Option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {translations[
                              option.value.toLowerCase() as keyof translationsTypes
                            ] || option.label}{" "}
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
                    {translations.country}
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder={translations.selectCountry} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((option: Option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {translations[
                              option.value.toLowerCase() as keyof translationsTypes
                            ] || option.label}{" "}
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
          {translations.foodAttributes}
        </h3>
        <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <Label className="block mb-1 text-black">
              {translations.fiber}
            </Label>
            <Input placeholder={translations.provideDetailsIfApplicable} />
          </div>
          <div>
            <Label className="block mb-1 text-black">
              {translations.proteins}
            </Label>
            <Input placeholder={translations.provideDetailsIfApplicable} />
          </div>
          <div>
            <Label className="block mb-1 text-black">
              {translations.vitamins}
            </Label>
            <Input placeholder={translations.provideDetailsIfApplicable} />
          </div>
          <div>
            <Label className="block mb-1 text-black">
              {translations.minerals}
            </Label>
            <Input placeholder={translations.provideDetailsIfApplicable} />
          </div>
          <div>
            <Label className="block mb-1 text-black">{translations.fat}</Label>
            <Input placeholder={translations.provideDetailsIfApplicable} />
          </div>
          <div>
            <Label className="block mb-1 text-black">
              {translations.sugar}
            </Label>
            <Input placeholder={translations.provideDetailsIfApplicable} />
          </div>
        </div>
        <div className="w-[100%] ">
          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <LableInput
                title={translations.healthBenefits}
                placeholder={translations.addUpTo6FoodBenefitsOrFewer}
                benefits={field.value || []}
                name="benefits"
                width="w-[32%]"
              />
            )}
          />
        </div>

        <Separator className="my-2" />

        <h3 className="mb-4 text-lg font-semibold text-black">
          {translations.describeTheFood}
        </h3>
        <div className="flex flex-col gap-6">
          <div>
            <FormField
              control={form.control}
              name="selection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2 text-black">
                    {translations.selection}
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      initialContent={field.value}
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
                    {translations.preparation}
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      initialContent={field.value}
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
                    {translations.conservation}
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      initialContent={field.value}
                      onChange={handleConservationChange(field)}
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
            {translations.uploadImages}
          </h3>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    title={translations.selectImagesForYourFoodItem}
                    onChange={handleImageUpload(field)}
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
              handleCancel(form)
            }}
          >
            {translations.cancel}
          </Button>
          <Button type="submit">{translations.save}</Button>
        </div>
      </form>
    </Form>
  )
}
