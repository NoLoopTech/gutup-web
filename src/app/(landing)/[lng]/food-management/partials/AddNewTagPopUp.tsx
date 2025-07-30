"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AddNewTag } from "@/app/api/tags"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useTagStore } from "@/stores/useTagStore"
import { loadLanguage } from "@/i18n/locales"
import { type translationsTypes } from "@/types/tagTypes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/query/hooks/useTranslation"

interface Props {
  open: boolean
  onClose: () => void
  token: string
  getTags: () => void
  category: string
}

export default function AddNewTagPopUp({
  open,
  onClose,
  token,
  getTags,
  category
}: Props): JSX.Element {
  const {
    allowMultiLang,
    setAllowMultiLang,
    activeLang,
    tagData,
    setTranslationField,
    setActiveLang
  } = useTagStore()

  const { translateText } = useTranslation()
  const [isTranslating, setIsTranslating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [translations, setTranslations] = useState<Partial<translationsTypes>>(
    {}
  )

  // Schema (must be defined after translations)
  const TagSchema = z.object({
    category: z.string().nonempty(translations.pleaseSelectACategory),
    tagName: z
      .string()
      .nonempty(translations.required)
      .min(2, translations.tagNameMustBeAtLeast2Characters)
  })

  const form = useForm<z.infer<typeof TagSchema>>({
    resolver: zodResolver(TagSchema),
    defaultValues: {
      category: tagData[activeLang]?.category || category,
      tagName: tagData[activeLang]?.tagName || ""
    }
  })

  // Load translations based on the selected language
  useEffect(() => {
    const loadTranslations = async (): Promise<void> => {
      const langData = await loadLanguage(activeLang, "tag")
      setTranslations(langData)
    }
    void loadTranslations()
  }, [activeLang])

  // Clear tagData when popup opens for the first time
  useEffect(() => {
    if (open) {
      clearAllTagData()
      form.reset({
        category,
        tagName: ""
      })
    }
  }, [open, category, form])

  // Update form values when active language or tagData changes
  useEffect(() => {
    const currentLangData = tagData[activeLang]
    if (currentLangData) {
      form.setValue("tagName", currentLangData.tagName || "")
      form.setValue("category", currentLangData.category || category)
    } else {
      form.setValue("tagName", "")
      form.setValue("category", category)
    }
  }, [activeLang, tagData, category, form])

  // Language toggle handler
  const handleLanguageToggle = (val: boolean): void => {
    setAllowMultiLang(val)
    if (!val) setActiveLang("en")
  }

  // Helper function to clear all tag data
  const clearAllTagData = (): void => {
    setTranslationField("tagData", "en", "tagName", "")
    setTranslationField("tagData", "fr", "tagName", "")
    setTranslationField("tagData", "en", "category", "")
    setTranslationField("tagData", "fr", "category", "")
    setActiveLang("en")
    setAllowMultiLang(false)
    sessionStorage.removeItem("tag-store")
  }

  const onSubmit = async (data: z.infer<typeof TagSchema>): Promise<void> => {
    // Ensure French translation exists before submitting
    if (
      activeLang === "en" &&
      (!tagData.fr?.tagName || tagData.fr?.tagName === "")
    ) {
      try {
        setIsTranslating(true)
        const translated = await translateText(data.tagName)
        setTranslationField("tagData", "fr", "tagName", translated)
        setTranslationField("tagData", "fr", "category", category)
        setTranslationField("tagData", "en", "category", category)
      } finally {
        setIsTranslating(false)
      }
    }
    try {
      setIsLoading(true)
      const response = await AddNewTag(token, {
        ...data,
        tagNameFr: tagData.fr?.tagName || ""
      } as any)
      if (response?.status === 200 || response?.status === 201) {
        toast.success("Tag added successfully!", {
          description: response.data.message
        })
        // Clear all tag data and session storage
        clearAllTagData()
        form.reset({
          category,
          tagName: ""
        })
        onClose()
        getTags()
      } else {
        toast.error("Failed to add tag", {
          description: response.data.message || "Unexpected error occurred"
        })
      }
    } catch (error: any) {
      toast.error("Error adding tag", {
        description: error?.response?.data?.message || error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (fieldName: "tagName", value: string): void => {
    form.setValue(fieldName, value)
    setTranslationField("tagData", activeLang, fieldName, value)
  }

  const handleInputBlur = async (
    fieldName: "tagName",
    value: string
  ): Promise<void> => {
    if (activeLang === "en" && value.trim()) {
      try {
        setIsTranslating(true)
        const translated = await translateText(value)
        setTranslationField("tagData", "fr", fieldName, translated)
        setTranslationField("tagData", "fr", "category", category)
        setTranslationField("tagData", "en", "category", category)
      } finally {
        setIsTranslating(false)
      }
    }
  }

  const handleReset = async (): Promise<void> => {
    clearAllTagData()
    form.reset({
      category,
      tagName: ""
    })
    onClose()
  }

  const handleClosePopup = (isOpen: boolean): void => {
    if (!isOpen) {
      clearAllTagData()
      form.reset({
        category,
        tagName: ""
      })
      onClose()
    }
  }
  // Input blur handler for translation
  const renderForm = (): JSX.Element => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          {/* Tag Name Field */}
          <FormField
            control={form.control}
            name="tagName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">
                  {translations.tagName}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={translations.giveATagName}
                    {...field}
                    onChange={e => {
                      handleInputChange("tagName", e.target.value)
                    }}
                    onBlur={async () => {
                      await handleInputBlur("tagName", field.value)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <Button variant="outline" type="button" onClick={handleReset}>
              {translations.cancel}
            </Button>
            <Button type="submit" disabled={isLoading || isTranslating}>
              {isLoading || isTranslating ? (
                <div className="flex gap-2 items-center">
                  <span className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  {isTranslating ? "Translating.." : translations.save}
                </div>
              ) : (
                translations.save
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )

  return (
    <Dialog open={open} onOpenChange={handleClosePopup}>
      <DialogContent className="max-w-md p-6 rounded-xl">
        <DialogTitle>{translations.addNewTag ?? "Add New Tag"}</DialogTitle>
        <Tabs
          value={activeLang}
          onValueChange={val => {
            setActiveLang(val as "en" | "fr")
          }}
          className="w-full"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 justify-between items-start sm:flex-row sm:items-center">
              <TabsList>
                <TabsTrigger value="en">{translations.english}</TabsTrigger>
                {allowMultiLang && (
                  <TabsTrigger value="fr">{translations.french}</TabsTrigger>
                )}
              </TabsList>

              <div className="flex gap-2 items-center">
                <Switch
                  id="multi-lang"
                  checked={allowMultiLang}
                  onCheckedChange={val => {
                    handleLanguageToggle(val)
                  }}
                />
                <Label htmlFor="multi-lang" className="text-Primary-300">
                  {translations.allowMultiLang}
                </Label>
              </div>
            </div>
            {/* English content */}
            <TabsContent value="en">{renderForm()}</TabsContent>

            {/* French content */}
            {allowMultiLang && (
              <TabsContent value="fr">{renderForm()}</TabsContent>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
