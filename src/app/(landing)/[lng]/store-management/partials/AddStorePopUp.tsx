"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import AddStorePopUpContent from "./AddStorePopUpContent"
import { loadLanguage } from "@/../../src/i18n/locales"
import { defaultTranslations, type translationsTypes } from "@/types/storeTypes"
import { useStoreStore } from "@/stores/useStoreStore"

interface Props {
  open: boolean
  onClose: () => void
  onAddStore?: () => Promise<void>
  isLoading?: boolean
}

export default function AddStorePopUp({
  open,
  onClose,
  onAddStore,
  isLoading
}: Props): JSX.Element {
  const { allowMultiLang, setAllowMultiLang, activeLang, setActiveLang } =
    useStoreStore()

  const [translations, setTranslations] = useState<Partial<translationsTypes>>(
    {}
  )
  // Load translations based on the selected language
  useEffect(() => {
    const loadTranslations = async (): Promise<void> => {
      const langData = await loadLanguage(activeLang, "store")
      setTranslations(langData)
    }

    void loadTranslations()
  }, [activeLang])

  // Language toggle handler
  const handleLanguageToggle = (val: boolean): void => {
    setAllowMultiLang(val)
    if (!val) setActiveLang("en")
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
            {translations.addNewStore ?? "Add New Store"}
          </DialogTitle>

          <Tabs
            value={activeLang}
            onValueChange={val => {
              setActiveLang(val as "en" | "fr") // Set active tab when switching
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

            {/* English Tab Content */}
            <TabsContent value="en">
              <AddStorePopUpContent
                translations={{
                  ...defaultTranslations,
                  ...Object.fromEntries(
                    Object.entries(translations).map(([k, v]) => [k, v ?? ""])
                  )
                }}
                onAddStore={onAddStore}
                isLoading={isLoading}
                onClose={onClose}
              />
            </TabsContent>

            {/* French Tab Content (if multi-language is allowed) */}
            {allowMultiLang && (
              <TabsContent value="fr">
                <AddStorePopUpContent
                  translations={{
                    ...defaultTranslations,
                    ...Object.fromEntries(
                      Object.entries(translations).map(([k, v]) => [k, v ?? ""])
                    )
                  }}
                  onAddStore={onAddStore}
                  isLoading={isLoading}
                  onClose={onClose}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
