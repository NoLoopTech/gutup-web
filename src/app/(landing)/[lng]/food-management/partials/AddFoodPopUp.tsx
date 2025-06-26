"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddFoodPopUpContent from "./AddFoodPopUpContent"
import { loadLanguage } from "@/../../src/i18n/locales"
import { defaultTranslations, type translationsTypes } from "@/types/foodTypes"

interface Props {
  open: boolean
  onClose: () => void
}

export default function AddFoodPopUp({ open, onClose }: Props): JSX.Element {
  const [allowMultiLang, setAllowMultiLang] = useState(false)
  const [activeTab, setActiveTab] = useState<"en" | "fr">("en")
  const [translations, setTranslations] = useState<Partial<translationsTypes>>(
    {}
  )
  // Load translations based on the selected language
  useEffect(() => {
    const loadTranslations = async () => {
      const langData = await loadLanguage(activeTab, "food")
      setTranslations(langData)
    }

    loadTranslations()
  }, [activeTab])

  // Language toggle handler
  const handleLanguageToggle = (val: boolean) => {
    setAllowMultiLang(val)
    if (!val) setActiveTab("en") // Default to English if multi-lang is disabled
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="overflow-y-auto p-2 h-full"
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
            value={activeTab}
            onValueChange={val => {
              setActiveTab(val as "en" | "fr")
            }}
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
                translations={{ ...defaultTranslations, ...translations }}
              />
            </TabsContent>

            {allowMultiLang && (
              <TabsContent value="fr">
                <AddFoodPopUpContent
                  translations={{ ...defaultTranslations, ...translations }}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
