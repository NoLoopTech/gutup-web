"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import EditStorePopUpContent from "./EditStorePopUpContent"
import { loadLanguage } from "@/../../src/i18n/locales"
import { defaultTranslations, type translationsTypes } from "@/types/storeTypes"

interface EditStorePopUpProps {
  open: boolean
  onClose: () => void
  onUpdateStore: () => Promise<void>
  isLoading: boolean
  storeId: number | null
  token: string
}

export default function EditStorePopUp({
  open,
  onClose,
  onUpdateStore,
  isLoading,
  storeId,
  token
}: EditStorePopUpProps): JSX.Element {
  const [allowMultiLang, setAllowMultiLang] = useState(true)
  const [activeLang, setActiveLang] = useState<"en" | "fr">("en")
  const [translations, setTranslations] = useState<Partial<translationsTypes>>({})

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
            {translations.editStore ?? "Edit Store"}
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
              <EditStorePopUpContent
                translations={{
                  ...defaultTranslations,
                  ...Object.fromEntries(
                    Object.entries(translations).map(([k, v]) => [k, v ?? ""])
                  )
                }}
                onUpdateStore={onUpdateStore}
                isLoading={isLoading}
                onClose={onClose}
                storeId={storeId}
                token={token}
                activeLang="en"
              />
            </TabsContent>

            {/* French Tab Content (if multi-language is allowed) */}
            {allowMultiLang && (
              <TabsContent value="fr">
                <EditStorePopUpContent
                  translations={{
                    ...defaultTranslations,
                    ...Object.fromEntries(
                      Object.entries(translations).map(([k, v]) => [k, v ?? ""])
                    )
                  }}
                  onUpdateStore={onUpdateStore}
                  isLoading={isLoading}
                  onClose={onClose}
                  storeId={storeId}
                  token={token}
                  activeLang="fr"
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}