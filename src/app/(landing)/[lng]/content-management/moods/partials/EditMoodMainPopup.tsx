"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { loadLanguage } from "@/../../src/i18n/locales"
import { defaultTranslations, type translationsTypes } from "@/types/moodsTypes"
import { useMoodStore } from "@/stores/useMoodStore"
import EditMoodPopUp from "./EditAddMoodPopUp"
import { getMoodById } from "@/app/api/mood"

interface Props {
  open: boolean
  onClose: () => void
  EditMood: () => void
  isLoading: boolean
  userName: string
  token: string
  moodId: number
}

export default function EditMoodMainPopUp({
  open,
  onClose,
  EditMood,
  isLoading,
  userName,
  token,
  moodId
}: Props): JSX.Element {
  const {
    allowMultiLang,
    setAllowMultiLang,
    activeLang,
    setActiveLang,
    setTranslationField
  } = useMoodStore()

  const [translations, setTranslations] = useState<Partial<translationsTypes>>(
    {}
  )

  // get mood by mood id
  const handleGetMoodById = async () => {
    try {
      const response = await getMoodById(token, moodId)
      if (response.status === 200) {
        const data = response.data
        console.log(response.data)

        setAllowMultiLang(data.allowMultiLang)

        if (data.layout === "Food") {
          setTranslationField("foodData", "en", "mood", data.mood)
          setTranslationField("foodData", "en", "foodName", data.foodName)
          setTranslationField("foodData", "en", "description", data.description)
          setTranslationField(
            "foodData",
            "en",
            "shopCategory",
            data.shopCategory
          )
          setTranslationField("foodData", "en", "image", data.image)
        } else if (data.layout === "Quote") {
          setTranslationField("quoteData", "en", "mood", data.mood)
          setTranslationField("quoteData", "fr", "mood", data.moodFR)

          setTranslationField(
            "quoteData",
            "en",
            "author",
            data.quote.quoteAuthor
          )
          setTranslationField(
            "quoteData",
            "fr",
            "author",
            data.quote.quoteAuthorFR
          )

          setTranslationField(
            "quoteData",
            "en",
            "quote",
            data.quote.quoteDetail
          )
          setTranslationField(
            "quoteData",
            "fr",
            "quote",
            data.quote.quoteDetailFR
          )

          setTranslationField("quoteData", "en", "share", data.data.quote.share)
          setTranslationField("quoteData", "fr", "share", data.data.quote.share)
        } else if (data.layout === "Recipe") {
          setTranslationField("recipeData", "en", "mood", data.mood)
          setTranslationField("recipeData", "en", "recipe", data.recipe)
          setTranslationField(
            "recipeData",
            "en",
            "description",
            data.description
          )
          setTranslationField("recipeData", "en", "image", data.image)
        }
      } else {
        console.log("Error:", response.data)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  useEffect(() => {
    if (moodId > 0) {
      handleGetMoodById()
    }
  }, [moodId])

  // Load translations when activeLang changes
  useEffect(() => {
    const loadTranslationsAsync = async () => {
      const langData = await loadLanguage(activeLang, "moods")
      setTranslations(langData)
    }

    loadTranslationsAsync()
  }, [activeLang])

  // Language toggle handler
  const handleLanguageToggle = (val: boolean) => {
    setAllowMultiLang(val)
    if (!val) setActiveLang("en")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="overflow-y-auto p-2 h-full"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          <DialogTitle>{translations.Mood || "Mood"}</DialogTitle>

          <Tabs
            value={activeLang}
            onValueChange={val => setActiveLang(val as "en" | "fr")}
            className="w-full"
          >
            <div className="flex flex-col gap-4 justify-between items-start mt-4 mb-6 sm:flex-row sm:items-center">
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
                  onCheckedChange={handleLanguageToggle}
                />
                <Label htmlFor="multi-lang" className="text-Primary-300">
                  {translations.allowMultiLang}
                </Label>
              </div>
            </div>

            <TabsContent value={activeLang}>
              <EditMoodPopUp
                translations={{ ...defaultTranslations, ...translations }}
                onClose={onClose}
                EditMood={EditMood}
                isLoading={isLoading}
                userName={userName}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
