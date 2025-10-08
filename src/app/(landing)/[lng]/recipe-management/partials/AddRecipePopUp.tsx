"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import AddRecipePopUpContent from "./AddRecipePopUpContent"
import { useRecipeStore } from "@/stores/useRecipeStore"
import { loadLanguage } from "@/../../src/i18n/locales"
import {
  defaultTranslations,
  type translationsTypes
} from "@/types/recipeTypes"

interface Props {
  open: boolean
  onClose: () => void
  token: string
  addRecipe: () => void
  isLoading: boolean
}

export default function AddRecipePopUp({
  open,
  onClose,
  token,
  addRecipe,
  isLoading
}: Props): JSX.Element {
  const { allowMultiLang, setAllowMultiLang, activeLang, setActiveLang } =
    useRecipeStore()

  const [translations, setTranslations] = useState<Partial<translationsTypes>>(
    {}
  )

  // Load translations when activeLang changes
  useEffect(() => {
    const loadTranslationsAsync = async () => {
      const langData = await loadLanguage(activeLang, "recipe")
      setTranslations(langData)
    }
    loadTranslationsAsync()
  }, [activeLang])

  // Language toggle handler
  const handleLanguageToggle = (val: boolean) => {
    setAllowMultiLang(val)
    if (!val) setActiveLang("en")
  }

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="overflow-y-auto p-2 h-full"
          style={{ scrollbarWidth: "none" }}
        >
          <DialogTitle>
            {translations.addNewRecipe || "Add New Recipe"}
          </DialogTitle>

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
              <AddRecipePopUpContent
                translations={{ ...defaultTranslations, ...translations }}
                token={token}
                onClose={onClose}
                addRecipe={addRecipe}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
