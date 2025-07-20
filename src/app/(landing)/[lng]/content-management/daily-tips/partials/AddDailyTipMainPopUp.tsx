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
import { useDailyTipStore } from "@/stores/useDailyTipStore"

interface Props {
  open: boolean
  onClose: () => void
  token: string
  userName: string
  addDailyTip: () => void
  isLoading: boolean
}

export default function AddDailyTipMainPopUp({
  open,
  onClose,
  token,
  userName,
  addDailyTip,
  isLoading
}: Props): JSX.Element {
  const { allowMultiLang, setAllowMultiLang, activeLang, setActiveLang } =
    useDailyTipStore()
  const [translations, setTranslations] = useState<Partial<translationsTypes>>(
    {}
  )
  // Load translations based on the selected language
  useEffect(() => {
    const loadTranslations = async () => {
      const langData = await loadLanguage(activeLang, "dailyTip")
      setTranslations(langData)
    }

    loadTranslations()
  }, [activeLang])

  // Language toggle handler
  const handleLanguageToggle = (val: boolean) => {
    setAllowMultiLang(val)
    if (!val) setActiveLang("en")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="overflow-y-auto p-2 h-full"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          <DialogTitle>
            {translations.addDailyTipTitle || "Add New Daily Tip"}
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

            {/* English Tab Content */}
            <TabsContent value={activeLang}>
              <AddDailyTipPopUp
                onClose={onClose}
                translations={{ ...defaultTranslations, ...translations }}
                token={token}
                userName={userName}
                addDailyTip={addDailyTip}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
