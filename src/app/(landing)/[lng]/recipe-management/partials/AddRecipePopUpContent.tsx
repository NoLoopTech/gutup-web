"use client"

import React, { useRef } from "react"
import { DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import dynamic from "next/dynamic"
import type { RichTextEditorHandle } from "@/components/Shared/TextEditor/RichTextEditor"
import LableInput from "@/components/Shared/LableInput/LableInput"
import SearchBar from "@/components/Shared/SearchBar/SearchBar"
import { Button } from "@/components/ui/button"
import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CircleFadingPlus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
} from "@/components/ui/form"
import z from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type translationsTypes } from "@/types/recipeTypes"

interface Ingredient {
  id: number
  name: string
  quantity: string
  isMain: boolean
  tags: string[]
}
interface Option {
  value: string
  label: string
}

// Define function for handling RichTextEditor changes
const handleRichTextEditorChange = (field: any) => (val: string) => {
  field.onChange(val)
}

// Define function for handling image upload changes
const handleImageUpload = (field: any) => (files: File[] | null) => {
  field.onChange(files && files.length > 0 ? files[0] : null)
}

// Dynamically load RichTextEditor with SSR disabled
const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)

export default function AddRecipePopUpContent({
  translations
}: {
  translations: translationsTypes
}): JSX.Element {
  const selectionRef = useRef<RichTextEditorHandle>(null)
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(5)

  const RecipeSchema = z.object({
    name: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.mustbeatleast2characters }),
    category: z.string().min(1, translations.pleaseselectacategory),
    season: z.string().min(1, translations.pleaseselectaseason),
    preparation: z.string().nonempty(translations.required),
    rest: z.string().nonempty(translations.required),
    persons: z.string().nonempty(translations.required),
    benefits: z
      .array(z.string())
      .refine(arr => arr.some(item => item.trim().length > 0), {
        message: translations.pleaseenteratleastonebenefit
      }),
    ingredientData: z
      .array(z.unknown())
      .nonempty(translations.atleastoneingredientcategorymustbeadded),
    authorName: z
      .string()
      .nonempty(translations.required)
      .min(2, { message: translations.mustbeatleast2characters }),
    authorCategory: z.string().min(1, translations.pleaseselectacategory),
    phone: z
      .string()
      .nonempty(translations.required)
      .refine(val => /^\d{10}$/.test(val) || /^\+\d{11}$/.test(val), {
        message: translations.invalidmobilenumbereg0712345678or94712345678
      }),
    email: z
      .string()
      .nonempty(translations.required)
      .email(translations.pleaseenteravalidemail),
    website: z
      .string()
      .url(translations.invalidurlformat)
      .optional()
      .or(z.literal("")),
    recipe: z.string().refine(
      val => {
        const plainText = val.replace(/<(.|\n)*?>/g, "").trim()
        const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val)
        return plainText !== "" || hasImage
      },
      {
        message: translations.required
      }
    ),
    authorimage: z.custom<File | null>(val => val instanceof File, {
      message: translations.required
    }),
    foodimage: z.custom<File | null>(val => val instanceof File, {
      message: translations.required
    })
  })

  const onSubmit = (data: z.infer<typeof RecipeSchema>): void => {
    toast(translations.formSubmittedSuccessfully, {})
  }
  const handleCancel = (
    form: ReturnType<typeof useForm<z.infer<typeof RecipeSchema>>>
  ): void => {
    form.reset()
  }

  // Dummy data
  const ingredientData: Ingredient[] = []

  // Table columns
  const ingredientColumns = [
    {
      header: translations.ingredientName,
      accessor: "name" as const
    },
    {
      header: translations.quantity,
      accessor: "quantity" as const
    },
    {
      header: translations.mainIngredient,
      accessor: (row: Ingredient) => (
        <Switch
          checked={row.isMain}
          className="scale-75"
          style={{ minWidth: 28, minHeight: 16 }}
        />
      )
    },
    {
      header: translations.availableInIngredients,
      accessor: (row: Ingredient) =>
        row.tags.includes("InSystem") ? (
          <Badge className="bg-green-200 text-black text-xs px-2 py-1 rounded-md border border-green-500 hover:bg-green-100 transition-colors">
            In the System
          </Badge>
        ) : (
          <Button
            variant="ghost"
            className="text-secondary-blue text-xs px-2 py-1 flex items-center gap-1 hover:bg-transparent focus:bg-transparent active:bg-transparent"
            size="sm"
          >
            <CircleFadingPlus size={14} />
            Add to Ingredients
          </Button>
        )
    }
  ]
  // Define functions to handle page changes
  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
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
  const authorSpeality: Option[] = [
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "autumn", label: "Autumn" }
  ]
  const form = useForm<z.infer<typeof RecipeSchema>>({
    resolver: zodResolver(RecipeSchema),
    defaultValues: {
      name: "",
      category: "",
      season: "",
      preparation: "",
      rest: "",
      persons: "",
      benefits: [],
      authorName: "",
      ingredientData: [],
      authorCategory: "",
      phone: "",
      email: "",
      website: "",
      recipe: "",
      authorimage: null,
      foodimage: null
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-6">
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
        </div>

        <Separator />

        <DialogTitle className="pt-4">
          {translations.recipeAttributes}
        </DialogTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 mb-4">
          <div>
            <FormField
              control={form.control}
              name="preparation"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="block mb-1 text-black">
                    {translations.preparation}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={translations.howLongDoesItTakeToMake}
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
              name="rest"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="block mb-1 text-black">
                    {translations.rest}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={translations.howLongToKeepItResting}
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
              name="persons"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="block mb-1 text-black">
                    {translations.persons}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={translations.numberOfPeopleTheMealServes}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Lable inputs for the health benefits */}
        <div className="w-[100%] ">
          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <LableInput
                title={translations.healthBenefits}
                placeholder={translations.addUpTo6FoodBenefitsOrLower}
                benefits={field.value || []}
                name="benefits"
                width="w-[32%]"
              />
            )}
          />
        </div>

        <Separator className="my-4" />

        <DialogTitle>{translations.ingredientsSelection}</DialogTitle>

        <div className="flex flex-row gap-2 items-center pt-4 mb-4">
          <div className="flex-1">
            <SearchBar
              title={translations.selectYourIngredients}
              placeholder={translations.searchForIngredient}
            />
          </div>
          <div className="flex items-end h-full mt-7">
            <Button onClick={() => {}}>{translations.add}</Button>
          </div>
        </div>
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

        <Separator className="my-4" />

        <DialogTitle>{translations.describeTheRecipe}</DialogTitle>
        <div className="flex flex-col gap-6 pt-4 pb-2">
          <div>
            <FormField
              control={form.control}
              name="recipe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2 text-black">
                    {translations.recipe}
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      ref={selectionRef}
                      value={field.value}
                      onChange={handleRichTextEditorChange(field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator className="my-4" />

        <DialogTitle>{translations.addAuthor}</DialogTitle>

        <div className="flex flex-col sm:flex-row gap-8 mb-4 pt-4 items-start">
          {/* Left: Author Inputs */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full">
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.name}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.addAuthorName}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="authorCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      {translations.category}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue
                            placeholder={translations.enterAuthorSpecialty}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {authorSpeality.map((option: Option) => (
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
            <div className="w-full">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.phone}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterAuthorNumber}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.email}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterAuthorEmail}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      {translations.website}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.enterAuthorWebSite}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Right: Image Uploader */}
          <div className="w-full sm:w-2/5 ">
            <FormField
              control={form.control}
              name="authorimage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      title={translations.uploadAuthorImage}
                      onChange={handleImageUpload(field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogTitle>{translations.uploadImages}</DialogTitle>

        <div className="mt-6 pb-2 w-full sm:w-2/5">
          <FormField
            control={form.control}
            name="foodimage"
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
        <Separator className="my-4" />
        <DialogFooter>
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
        </DialogFooter>
      </form>
    </Form>
  )
}
