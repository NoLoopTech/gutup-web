"use client"

import { getAllRecipes } from "@/app/api/recipe"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { uploadImageToFirebase } from "@/lib/firebaseImageUtils"
import { useTranslation } from "@/query/hooks/useTranslation"
import { useMoodStore } from "@/stores/useMoodStore"
import { type translationsTypes } from "@/types/moodsTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface Option {
  value: string
  label: string
}

interface ListOfRecipes {
  en: string[]
  fr: string[]
}

// Mood options per language
const moodOptions: Record<string, Option[]> = {
  en: [
    { value: "very happy", label: "Very Happy" },
    { value: "happy", label: "Happy" },
    { value: "neutral", label: "Neutral" },
    { value: "sad", label: "Sad" },
    { value: "very sad", label: "Very Sad" }
  ],
  fr: [
    { value: "very happy", label: "Très heureux" },
    { value: "happy", label: "Heureuse" },
    { value: "neutral", label: "Neutre" },
    { value: "sad", label: "Triste" },
    { value: "very sad", label: "Très triste" }
  ]
}

export default function RecipeTab({
  translations,
  onClose,
  addRecipeMood,
  isLoading,
  userName,
  token
}: {
  translations: translationsTypes
  onClose: () => void
  addRecipeMood: () => void
  isLoading: boolean
  userName: string
  token: string
}): JSX.Element {
  const {
    activeLang,
    translationsData,
    setTranslationField,
    resetTranslations
  } = useMoodStore()
  const { translateText } = useTranslation()
  const [isTranslating, setIsTranslating] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<string[]>([])
  const [listOfRecipes, setListOfRecipes] = useState<ListOfRecipes | undefined>(
    undefined
  )
  const dropdownRef = useRef<HTMLUListElement>(null)

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setFilteredRecipes([])
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // handle get recipes
  const getRecipes = async (): Promise<void> => {
    try {
      const response = await getAllRecipes(token)
      if (response.status === 200) {
        const recipesByLanguage = {
          en: response.data.map((recipe: any) => recipe.name),
          fr: response.data.map((recipe: any) => recipe.nameFR)
        }

        setListOfRecipes(recipesByLanguage)
      } else {
        console.log(response)
      }
    } catch (error) {
      console.error("Failed to fetch recipe:", error)
    }
  }

  useEffect(() => {
    void getRecipes()
  }, [])

  const FormSchema = z.object({
    mood: z.string().nonempty(translations.pleaseSelectAMood),
    recipe: z
      .string()
      .nonempty(translations.required)
      .min(2, translations.recipeNameMustBeAtLeast2Characters),
    description: z
      .string()
      .nonempty(translations.required)
      .min(10, translations.descriptionMustBeAtLeast10Characters),
    image: z.string().nonempty(translations.required)
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: translationsData.recipeData[activeLang]
  })

  useEffect(() => {
    form.reset(translationsData.recipeData[activeLang])
  }, [activeLang, form.reset, translationsData.recipeData])

  const handleMoodChange = (value: string) => {
    form.setValue("mood", value)
    setTranslationField("recipeData", activeLang, "mood", value)

    const current = moodOptions[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = moodOptions[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "recipeData",
        oppositeLang,
        "mood",
        opposite[index].value
      )
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: "recipe" | "description"
  ) => {
    const value = e.target.value
    form.setValue(fieldName, value, { shouldValidate: true, shouldDirty: true })

    form.trigger(fieldName).then(isValid => {
      if (isValid) {
        form.clearErrors(fieldName)
      }
    })

    setTranslationField("recipeData", activeLang, fieldName, value)

    if (fieldName === "recipe") {
      // Check if listOfRecipes is defined before filtering
      if (listOfRecipes) {
        const filtered = listOfRecipes[activeLang]?.filter((recipe: string) =>
          recipe.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredRecipes(filtered || [])
      }
    }
  }

  const handleRecipeSelect = async (recipe: string) => {
    // Set the recipe in the current language (activeLang)
    form.setValue("recipe", recipe)
    setTranslationField("recipeData", activeLang, "recipe", recipe)

    // Translate the recipe to French (fr) if the active language is not French
    if (activeLang !== "fr") {
      try {
        const translatedRecipe = await translateText(recipe)
        setTranslationField("recipeData", "fr", "recipe", translatedRecipe)
        form.setValue("recipe", translatedRecipe) // Set the translated value in the form
      } catch (error) {
        console.log("Error Translating Recipe:", error)
      }
    }

    // Close the filtered recipes dropdown
    setFilteredRecipes([])
  }

  const handleInputBlur = async (
    value: string,
    fieldName: "recipe" | "description"
  ) => {
    if (activeLang === "en" && value.trim()) {
      try {
        const translated = await translateText(value)
        setTranslationField("recipeData", "fr", fieldName, translated)
      } catch (error) {
        console.log("Error Translating", error)
      }
    }
  }

  const handleImageSelect = async (files: File[] | null) => {
    const file = files?.[0] ?? null
    if (file) {
      try {
        setIsTranslating(true)
        const imageUrl = await uploadImageToFirebase(
          file,
          "moods/temp-recipe-tab",
          `temp-recipe-mood-image-${userName}`
        )
        form.setValue("image", imageUrl, {
          shouldValidate: true,
          shouldDirty: true
        })
        setTranslationField("recipeData", "en", "image", imageUrl)
        setTranslationField("recipeData", "fr", "image", imageUrl)

        setPreviewUrls([imageUrl])
      } catch (error) {
        toast.error("Image upload failed. Please try again.")
        console.error("Firebase upload error:", error)
      } finally {
        setIsTranslating(false)
      }
    } else {
      form.setValue("image", "", {
        shouldValidate: true,
        shouldDirty: true
      })
      setTranslationField("recipeData", "en", "image", "")
      setTranslationField("recipeData", "fr", "image", "")
      setPreviewUrls([])
    }
  }

  const handleResetForm = async () => {
    form.reset(translationsData.recipeData[activeLang])
    // clear store and session
    await resetTranslations()
    sessionStorage.removeItem("mood-storage")

    onClose()
  }

  const onSubmit = (data: z.infer<typeof FormSchema>): void => {
    addRecipeMood()
  }

  return (
    <div className="relative">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="pb-20 space-y-4 text-black"
        >
          {/* Mood */}
          <div className="pt-4 pb-3">
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.selectMood}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={handleMoodChange}
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder={translations.selectMood} />
                      </SelectTrigger>
                      <SelectContent>
                        {moodOptions[activeLang].map(option => (
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

          <Separator />

          {/* Recipe */}
          <FormField
            control={form.control}
            name="recipe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.recipe}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={translations.searchForRecipe}
                    {...field}
                    onChange={e => handleInputChange(e, "recipe")}
                    onBlur={() => handleInputBlur(field.value, "recipe")}
                  />
                  {filteredRecipes.length > 0 && (
                    <ul
                      ref={dropdownRef}
                      className={`overflow-y-auto absolute z-10 mt-2 w-full text-sm bg-white rounded-md border border-gray-300 shadow-md ${
                        filteredRecipes.length === 1
                          ? "h-10"
                          : filteredRecipes.length === 2
                          ? "h-20"
                          : filteredRecipes.length === 3
                          ? "h-30"
                          : filteredRecipes.length === 4
                          ? "h-40"
                          : filteredRecipes.length === 5
                          ? "h-50"
                          : filteredRecipes.length === 6
                          ? "h-60"
                          : filteredRecipes.length === 7
                          ? "h-70"
                          : "h-80"
                      }`}
                    >
                      {filteredRecipes.map((recipe, idx) => (
                        <li
                          key={idx}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 h-10"
                          onClick={() => handleRecipeSelect(recipe)}
                        >
                          {recipe}
                        </li>
                      ))}
                    </ul>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.description}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={translations.addDetailsInHere}
                    {...field}
                    onChange={e => handleInputChange(e, "description")}
                    onBlur={() => handleInputBlur(field.value, "description")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Uploader */}
          <div className="pb-8 w-full">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      title={translations.selectImagesForYourFoodItem}
                      previewUrls={previewUrls ? previewUrls : []}
                      onChange={handleImageSelect}
                      uploadText={translations.imagesContentText}
                      uploadSubText={translations.imagesSubContentText}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex fixed bottom-0 left-0 z-50 justify-between px-8 py-2 w-full bg-white border-t border-gray-200">
            <Button variant="outline" type="button" onClick={handleResetForm}>
              {translations.cancel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex gap-2 items-center">
                  <span className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  {translations.save}
                </div>
              ) : (
                translations.save
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
