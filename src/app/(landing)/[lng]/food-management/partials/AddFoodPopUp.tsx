"use client"

import { loadLanguage } from "@/../../src/i18n/locales"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFoodStore } from "@/stores/useFoodStore"
import { type translationsTypes } from "@/types/foodTypes"
import { useEffect, useState } from "react"
import AddFoodPopUpContent from "./AddFoodPopUpContent"

interface Props {
  open: boolean
  onClose: () => void
  getFoods: () => void // <-- add this prop
}

export default function AddFoodPopUp({ open, onClose, getFoods }: Props): JSX.Element {
  const { allowMultiLang, setAllowMultiLang, activeLang, setActiveLang } =
    useFoodStore()

  const [translations, setTranslations] = useState<Partial<translationsTypes>>(
    {}
  )
  // Load translations based on the selected language
  useEffect(() => {
    const loadTranslations = async () => {
      const langData = await loadLanguage(activeLang, "food")
      setTranslations(langData)
    }

    loadTranslations()
  }, [activeLang])

  // Language toggle handler
  const handleLanguageToggle = (val: boolean) => {
    setAllowMultiLang(val)
    if (!val) setActiveLang("en") // Default to English if multi-lang is disabled
  }

  // Wrap the onClose to clear session key
  const handleClose = () => {
    sessionStorage.removeItem("food-store")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="h-full p-2 overflow-y-auto"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none" // IE/Edge
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              width: 0px;
              background: transparent;
            }
          `}</style>

          <DialogTitle>
            {translations.addNewFoodItem ?? "Add New Food Item"}
          </DialogTitle>

          <Tabs
            value={activeLang}
            onValueChange={val => {
              setActiveLang(val as "en" | "fr")
            }}
            className="w-full"
          >
            <div className="flex flex-col items-start justify-between gap-4 mt-4 mb-6 sm:flex-row sm:items-center">
              <TabsList>
                <TabsTrigger value="en">{translations.english}</TabsTrigger>
                {allowMultiLang && (
                  <TabsTrigger value="fr">{translations.french}</TabsTrigger>
                )}
              </TabsList>

              <div className="flex items-center gap-2">
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

            {/* Render each tab’s content component */}
            <TabsContent value="en">
              <AddFoodPopUpContent
                translations={translations}
                onClose={handleClose}
                getFoods={getFoods}
              />
            </TabsContent>

            {allowMultiLang && (
              <TabsContent value="fr">
                <AddFoodPopUpContent
                  translations={translations}
                  onClose={handleClose}
                  getFoods={getFoods}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
