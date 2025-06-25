"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import AddDailyTipPopUp from "./AddDailyTipPopUp"
import { loadLanguage } from "@/../../src/i18n/locales"
import {
  defaultTranslations,
  type translationsTypes
} from "@/types/dailyTipTypes"

interface Props {
  open: boolean
  onClose: () => void
}

export default function AddDailyTipMainPopUp({
  open,
  onClose
}: Props): JSX.Element {
  const [allowMultiLang, setAllowMultiLang] = useState(false)
  const [activeTab, setActiveTab] = useState<"en" | "de">("en")
  const [translations, setTranslations] = useState<Partial<translationsTypes>>(
    {}
  )
  // Load translations based on the selected language
  useEffect(() => {
    const loadTranslations = async () => {
      const langData = await loadLanguage(activeTab, "dailyTip")
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
          <DialogTitle>
            {translations.addDailyTipTitle || "Add New Daily Tip"}
          </DialogTitle>

          <Tabs
            value={activeTab}
            onValueChange={val => {
              setActiveTab(val as "en" | "de") // Set active tab when switching
            }}
            className="w-full"
          >
            <div className="flex flex-col gap-4 justify-between items-start mt-4 mb-6 sm:flex-row sm:items-center">
              <TabsList>
                <TabsTrigger value="en">{translations.english}</TabsTrigger>
                {allowMultiLang && (
                  <TabsTrigger value="de">{translations.french}</TabsTrigger>
                )}
              </TabsList>

              <div className="flex gap-2 items-center">
                <Switch
                  id="multi-lang"
                  checked={allowMultiLang}
                  onCheckedChange={val => handleLanguageToggle(val)}
                />
                <Label htmlFor="multi-lang" className="text-Primary-300">
                  {translations.allowMultiLang}
                </Label>
              </div>
            </div>

            {/* English Tab Content */}
            <TabsContent value="en">
              <AddDailyTipPopUp
                translations={{ ...defaultTranslations, ...translations }}
              />
            </TabsContent>

            {/* French Tab Content (if multi-language is allowed) */}
            {allowMultiLang && (
              <TabsContent value="de">
                <AddDailyTipPopUp
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
