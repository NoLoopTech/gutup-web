"use client"

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
import { useUpdatedMoodTranslationStore } from "@/stores/useUpdatedMoodTranslationStore"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGetShopCategorys } from "@/query/hooks/useGetShopCategorys"
import { getAllFoodsList } from "@/app/api/foods"

interface Option {
  value: string
  label: string
}

interface StoreCatogeryTypes {
  id: number
  Tag: string
  TagName: string
  TagNameFr: string
}

interface ListOfFoods {
  en: string[]
  fr: string[]
}

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

export default function EditFoodTab({
  translations,
  onClose,
  EditFoodMood,
  isLoading,
  userName,
  token
}: {
  translations: translationsTypes
  onClose: () => void
  EditFoodMood: () => void
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
  const {
    allowMultiLang,
    translationsData: updatedTranslations,
    setUpdatedField,
    resetUpdatedStore
  } = useUpdatedMoodTranslationStore()

  const { translateText } = useTranslation()
  const [, setIsTranslating] = useState(false)
  const [shopcategory, setShopcategory] = useState<Record<string, Option[]>>({
    en: [],
    fr: []
  })
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [shopCategoryOpen, setShopCategoryOpen] = useState(false)

  const [filteredFoods, setFilteredFoods] = useState<string[]>([])
  const [listOfFoods, setListOfFoods] = useState<ListOfFoods | undefined>(
    undefined
  )

  const dropdownRef = useRef<HTMLUListElement>(null)

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setFilteredFoods([])
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const { shopCategorys } = useGetShopCategorys() as {
    shopCategorys: StoreCatogeryTypes[]
  }

  useEffect(() => {
    if (shopCategorys) {
      const tagsOptions = {
        en: shopCategorys.map((tag: StoreCatogeryTypes) => ({
          value: tag.TagName,
          label: tag.TagName
        })),
        fr: shopCategorys.map((tag: StoreCatogeryTypes) => ({
          value: tag.TagNameFr,
          label: tag.TagNameFr
        }))
      }
      setShopcategory(tagsOptions)

      // Ensure existing value is valid; if not, clear to show placeholder
      const currentVal = form.getValues("shopCategory")
      const existsInCurrentLang = tagsOptions[activeLang].some(
        o => o.value === currentVal
      )
      if (!existsInCurrentLang) {
        form.setValue("shopCategory", "")
      }
    }
  }, [shopCategorys, activeLang])

  // handle get foods
  const getFoods = async (): Promise<void> => {
    try {
      const response = await getAllFoodsList(token)
      if (response.status === 200) {
        const FoodsByLanguage = {
          en: response.data.map((food: any) => food.name),
          fr: response.data.map((food: any) => food.nameFR)
        }

        setListOfFoods(FoodsByLanguage)
      } else {
        console.log(response)
      }
    } catch (error) {
      console.error("Failed to fetch Foods:", error)
    }
  }

  useEffect(() => {
    void getFoods()
  }, [])

  const hasAllowMultiLangInStore = React.useMemo(() => {
    try {
      const raw = sessionStorage.getItem("updated-mood-fields")
      if (!raw) return false
      const parsed = JSON.parse(raw)
      const persistedState = parsed?.state ?? parsed
      return Object.prototype.hasOwnProperty.call(
        persistedState,
        "allowMultiLang"
      )
    } catch {
      return false
    }
  }, [allowMultiLang])

  const hasFoodUpdates =
    Object.keys(updatedTranslations.foodData.en).length > 0 ||
    Object.keys(updatedTranslations.foodData.fr).length > 0 ||
    hasAllowMultiLangInStore

  const FormSchema = z.object({
    mood: z.string().nonempty(translations.pleaseSelectAMood),
    foodName: z
      .string()
      .nonempty(translations.required)
      .min(2, translations.foodNameMustBeAtLeast2Characters),
    description: z
      .string()
      .nonempty(translations.required)
      .min(10, translations.descriptionMustBeAtLeast10Characters),
    shopCategory: z.string().nonempty(translations.pleaseSelectAShopCategory),
    image: z.string().nonempty(translations.required)
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: translationsData.foodData[activeLang]
  })

  useEffect(() => {
    form.reset(translationsData.foodData[activeLang])
  }, [activeLang, form.reset, translationsData.foodData])

  const handleMoodChange = (value: string) => {
    form.setValue("mood", value)
    setTranslationField("foodData", activeLang, "mood", value)
    setUpdatedField("foodData", activeLang, "mood", value)

    const current = moodOptions[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = moodOptions[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "foodData",
        oppositeLang,
        "mood",
        opposite[index].value
      )
      setUpdatedField("foodData", oppositeLang, "mood", opposite[index].value)
    }
  }

  const handleImageSelect = async (files: File[] | null) => {
    const file = files?.[0] ?? null
    if (file) {
      try {
        setIsTranslating(true)
        const imageUrl = await uploadImageToFirebase(
          file,
          "moods/temp-food-tab",
          `temp-food-mood-image-${userName}`
        )

        form.setValue("image", imageUrl, {
          shouldValidate: true,
          shouldDirty: true
        })
        setTranslationField("foodData", "en", "image", imageUrl)
        setTranslationField("foodData", "fr", "image", imageUrl)

        setUpdatedField("foodData", "en", "image", imageUrl)
        setUpdatedField("foodData", "fr", "image", imageUrl)

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
      setTranslationField("foodData", "en", "image", "")
      setTranslationField("foodData", "fr", "image", "")
      setPreviewUrls([])
    }
  }

  const handleShopCategoryChange = (value: string) => {
    form.setValue("shopCategory", value)
    setTranslationField("foodData", activeLang, "shopCategory", value)
    setUpdatedField("foodData", activeLang, "shopCategory", value)

    const current = shopcategory[activeLang]
    const oppositeLang = activeLang === "en" ? "fr" : "en"
    const opposite = shopcategory[oppositeLang]

    const index = current.findIndex(opt => opt.value === value)
    if (index !== -1) {
      setTranslationField(
        "foodData",
        oppositeLang,
        "shopCategory",
        opposite[index]?.value || value
      )
      setUpdatedField(
        "foodData",
        oppositeLang,
        "shopCategory",
        opposite[index]?.value || value
      )
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: "foodName" | "description"
  ) => {
    const value = e.target.value
    form.setValue(fieldName, value, { shouldValidate: true, shouldDirty: true })

    form.trigger(fieldName).then(isValid => {
      if (isValid) {
        form.clearErrors(fieldName)
      }
    })

    setTranslationField("foodData", activeLang, fieldName, value)
    setUpdatedField("foodData", activeLang, fieldName, value)

    if (fieldName === "foodName") {
      if (listOfFoods) {
        const filtered = listOfFoods[activeLang]?.filter((food: string) =>
          food.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredFoods(filtered || [])
      }
    }
  }

  const handleFoodSelect = async (food: string) => {
    form.setValue("foodName", food)
    setTranslationField("foodData", activeLang, "foodName", food)
    setUpdatedField("foodData", activeLang, "foodName", food)

    if (activeLang !== "fr") {
      try {
        const translatedFood = await translateText(food)
        setTranslationField("foodData", "fr", "foodName", translatedFood)
        setUpdatedField("foodData", "fr", "foodName", translatedFood)

        form.setValue("foodName", translatedFood)
      } catch (error) {
        console.log("Error Translating Food:", error)
      }
    }

    // Close the filtered recipes dropdown
    setFilteredFoods([])
  }

  const handleInputBlur = async (
    value: string,
    fieldName: "foodName" | "description"
  ) => {
    if (activeLang === "en" && value.trim()) {
      try {
        const translated = await translateText(value)
        setTranslationField("foodData", "fr", fieldName, translated)
        setUpdatedField("foodData", "fr", fieldName, translated)
      } catch (error) {
        console.log("Error Translating", error)
      }
    }
  }

  const handleReset = async () => {
    form.reset(translationsData.foodData[activeLang])
    // clear store and session
    await resetTranslations()
    await resetUpdatedStore()
    sessionStorage.removeItem("mood-storage")
    sessionStorage.removeItem("updated-mood-fields")

    onClose()
  }

  const onSubmit = (data: z.infer<typeof FormSchema>): void => {
    EditFoodMood()
  }

  return (
    <div className="relative">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="pb-20 space-y-4 text-black"
        >
          {/* Mood */}
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.selectMood}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={handleMoodChange}>
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

          <Separator />

          {/* Food Name */}
          <FormField
            control={form.control}
            name="foodName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.foodName}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={translations.searchForFood}
                    {...field}
                    onChange={e => handleInputChange(e, "foodName")}
                    onBlur={() => handleInputBlur(field.value, "foodName")}
                  />
                  {filteredFoods.length > 0 && (
                    <ul
                      ref={dropdownRef}
                      className={`absolute z-10 mt-2 w-full text-sm bg-white rounded-md border border-gray-300 shadow-md overflow-y-auto ${
                        filteredFoods.length === 1
                          ? "h-10"
                          : filteredFoods.length === 2
                          ? "h-20"
                          : filteredFoods.length === 3
                          ? "h-30"
                          : filteredFoods.length === 4
                          ? "h-40"
                          : filteredFoods.length === 5
                          ? "h-50"
                          : filteredFoods.length === 6
                          ? "h-60"
                          : filteredFoods.length === 7
                          ? "h-70"
                          : "h-80"
                      }`}
                    >
                      {filteredFoods.map((food, idx) => (
                        <li
                          key={idx}
                          className="px-3 py-2 h-10 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleFoodSelect(food)}
                        >
                          {food}
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

          <Separator />

          {/* Shop Category */}
          <FormField
            control={form.control}
            name="shopCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translations.shopcategory}</FormLabel>
                <FormControl>
                  <Popover
                    open={shopCategoryOpen}
                    onOpenChange={setShopCategoryOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={shopCategoryOpen}
                        className="justify-between w-full font-normal"
                      >
                        <span
                          className={cn(
                            !field.value && "text-muted-foreground",
                            "truncate text-left flex-1 font-normal"
                          )}
                        >
                          {field.value
                            ? shopcategory[activeLang].find(
                                option => option.value === field.value
                              )?.label
                            : translations.selectShopCategory}
                        </span>
                        <ChevronsUpDown className="ml-2 w-4 h-4 opacity-50 shrink-0" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full min-w-[var(--radix-popover-trigger-width)] p-0"
                      onWheel={e => {
                        e.stopPropagation()
                      }}
                    >
                      <Command>
                        <CommandInput
                          placeholder={translations.selectShopCategory}
                          className="h-9"
                        />
                        <CommandList className="overflow-y-auto max-h-60">
                          <CommandEmpty>No category found</CommandEmpty>
                          <CommandGroup>
                            {[...shopcategory[activeLang]]
                              .sort((a, b) => a.label.localeCompare(b.label))
                              .map(option => (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={currentValue => {
                                    handleShopCategoryChange(currentValue)
                                    setShopCategoryOpen(false)
                                  }}
                                >
                                  {option.label}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      field.value === option.value
                                        ? "opacity-90"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                      previewUrls={
                        previewUrls.length > 0
                          ? previewUrls
                          : [translationsData.foodData.en.image]
                      }
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
            <Button variant="outline" type="button" onClick={handleReset}>
              {translations.cancel}
            </Button>
            <Button type="submit" disabled={isLoading || !hasFoodUpdates}>
              {isLoading ? (
                <div className="flex gap-2 items-center">
                  <span className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  {translations.save}
                </div>
              ) : (
                translations.save
              )}
            </Button>{" "}
          </div>
        </form>
      </Form>
    </div>
  )
}
