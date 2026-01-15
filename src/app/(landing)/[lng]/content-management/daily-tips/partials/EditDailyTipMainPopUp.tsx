"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { loadLanguage } from "@/../../src/i18n/locales"
import {
  defaultTranslations,
  type translationsTypes
} from "@/types/dailyTipTypes"
import { useDailyTipStore } from "@/stores/useDailyTipStore"
import { useUpdateDailyTipStore } from "@/stores/useUpdateDailyTipStore"
import EditDailyTipPopUp from "./EditDailyTipPopUp"
import { getDailyTipById } from "@/app/api/daily-tip"
import { asDate, toUtcMidnightIso } from "@/lib/dateUtils"

interface Props {
  open: boolean
  onClose: () => void
  token: string
  userName: string
  editDailyTip: () => void
  isLoading: boolean
  tipId: number
}

export default function EditDailyTipMainPopUp({
  open,
  onClose,
  token,
  userName,
  editDailyTip,
  isLoading,
  tipId
}: Props): JSX.Element {
  const {
    allowMultiLang,
    setAllowMultiLang,
    activeLang,
    setActiveLang,
    setActiveTab,
    setTranslationField,
    setPublishDate
  } = useDailyTipStore()
  const { setUpdatedField, setUpdateAllowMultiLang } = useUpdateDailyTipStore()
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

  // handle get daily tip by id
  const handleDailyTipById = async () => {
    try {
      const res = await getDailyTipById(token, tipId)
      if (res.status === 200) {
        const data = res.data
        const normalizedPublishDate = toUtcMidnightIso(data.publishDate)

        // Concerns data for both languages
        const englishConcerns = data.concerns.map(
          (item: { concern: string }) => item.concern
        )
        const frenchConcerns = data.concerns.map(
          (item: { concernFR: string }) => item.concernFR
        )

        setAllowMultiLang(data.allowMultiLang)
        setPublishDate(asDate(data.publishDate))
        setActiveTab(
          data.type === "basic"
            ? "basicForm"
            : data.type === "video"
            ? "videoForm"
            : "shopPromote"
        )

        if (data.type === "basic") {
          setTranslationField(
            "basicLayoutData",
            "en",
            "concern",
            englishConcerns
          )
          setTranslationField(
            "basicLayoutData",
            "fr",
            "concern",
            frenchConcerns
          )

          setTranslationField("basicLayoutData", "en", "title", data.title)
          setTranslationField("basicLayoutData", "fr", "title", data.typeFR)

          setTranslationField(
            "basicLayoutData",
            "en",
            "subTitleOne",
            data.basicForm.subTitleOne
          )
          setTranslationField(
            "basicLayoutData",
            "fr",
            "subTitleOne",
            data.basicForm.subTitleOneFR
          )

          setTranslationField(
            "basicLayoutData",
            "en",
            "subDescriptionOne",
            data.basicForm.subDescOne
          )
          setTranslationField(
            "basicLayoutData",
            "fr",
            "subDescriptionOne",
            data.basicForm.subDescOneFR
          )

          setTranslationField(
            "basicLayoutData",
            "en",
            "subTitleTwo",
            data.basicForm.subTitleTwo
          )
          setTranslationField(
            "basicLayoutData",
            "fr",
            "subTitleTwo",
            data.basicForm.subTitleTwoFR
          )

          setTranslationField(
            "basicLayoutData",
            "en",
            "subDescriptionTwo",
            data.basicForm.subDescTwo
          )
          setTranslationField(
            "basicLayoutData",
            "fr",
            "subDescriptionTwo",
            data.basicForm.subDescTwoFR
          )

          setTranslationField(
            "basicLayoutData",
            "en",
            "share",
            data.basicForm.share
          )
          setTranslationField(
            "basicLayoutData",
            "fr",
            "share",
            data.basicForm.share
          )

          setTranslationField(
            "basicLayoutData",
            "en",
            "image",
            data.basicForm.image
          )
          setTranslationField(
            "basicLayoutData",
            "fr",
            "image",
            data.basicForm.image
          )

          // Populate CTA button data if it exists
          if (data.basicForm.ctaButton) {
            setTranslationField(
              "basicLayoutData",
              "en",
              "buttonLabel",
              data.basicForm.ctaButton.buttonLabel
            )
            setTranslationField(
              "basicLayoutData",
              "fr",
              "buttonLabel",
              data.basicForm.ctaButton.buttonLabelFR
            )
            setTranslationField(
              "basicLayoutData",
              "en",
              "navigationType",
              data.basicForm.ctaButton.navigationType
            )
            setTranslationField(
              "basicLayoutData",
              "fr",
              "navigationType",
              data.basicForm.ctaButton.navigationType
            )
            setTranslationField(
              "basicLayoutData",
              "en",
              "navigationTarget",
              data.basicForm.ctaButton.navigationTarget
            )
            setTranslationField(
              "basicLayoutData",
              "fr",
              "navigationTarget",
              data.basicForm.ctaButton.navigationTarget
            )
          }

          setTranslationField(
            "basicLayoutData",
            "en",
            "publishDate",
            data.publishDate
          )
          setTranslationField(
            "basicLayoutData",
            "fr",
            "publishDate",
            data.publishDate
          )
          setUpdatedField(
            "basicLayoutData",
            "en",
            "publishDate",
            normalizedPublishDate ?? undefined
          )
          setUpdatedField(
            "basicLayoutData",
            "fr",
            "publishDate",
            normalizedPublishDate ?? undefined
          )
          // Clear publishDate from other sections
          setUpdatedField("videoTipData", "en", "publishDate", undefined)
          setUpdatedField("videoTipData", "fr", "publishDate", undefined)
          setUpdatedField("shopPromotionData", "en", "publishDate", undefined)
          setUpdatedField("shopPromotionData", "fr", "publishDate", undefined)
        } else if (data.type === "video") {
          setTranslationField("videoTipData", "en", "concern", englishConcerns)
          setTranslationField("videoTipData", "fr", "concern", frenchConcerns)

          setTranslationField("videoTipData", "en", "title", data.title)
          setTranslationField("videoTipData", "fr", "title", data.titleFR)

          setTranslationField(
            "videoTipData",
            "en",
            "subTitle",
            data.videoForm.subTitle
          )
          setTranslationField(
            "videoTipData",
            "fr",
            "subTitle",
            data.videoForm.subTitleFR
          )

          setTranslationField(
            "videoTipData",
            "en",
            "subDescription",
            data.videoForm.subDesc
          )
          setTranslationField(
            "videoTipData",
            "fr",
            "subDescription",
            data.videoForm.subDescFR
          )

          setTranslationField(
            "videoTipData",
            "en",
            "videoLink",
            data.videoForm.videoUrl
          )
          setTranslationField(
            "videoTipData",
            "fr",
            "videoLink",
            data.videoForm.videoUrl
          )

          // Populate hideVideo if it exists
          if (data.videoForm.hideVideo !== undefined) {
            setTranslationField(
              "videoTipData",
              "en",
              "hideVideo",
              data.videoForm.hideVideo
            )
            setTranslationField(
              "videoTipData",
              "fr",
              "hideVideo",
              data.videoForm.hideVideo
            )
          }

          // Populate CTA button data if it exists
          if (data.videoForm.ctaButton) {
            setTranslationField(
              "videoTipData",
              "en",
              "buttonLabel",
              data.videoForm.ctaButton.buttonLabel
            )
            setTranslationField(
              "videoTipData",
              "fr",
              "buttonLabel",
              data.videoForm.ctaButton.buttonLabelFR
            )
            setTranslationField(
              "videoTipData",
              "en",
              "navigationType",
              data.videoForm.ctaButton.navigationType
            )
            setTranslationField(
              "videoTipData",
              "fr",
              "navigationType",
              data.videoForm.ctaButton.navigationType
            )
            setTranslationField(
              "videoTipData",
              "en",
              "navigationTarget",
              data.videoForm.ctaButton.navigationTarget
            )
            setTranslationField(
              "videoTipData",
              "fr",
              "navigationTarget",
              data.videoForm.ctaButton.navigationTarget
            )
          }

          setTranslationField(
            "videoTipData",
            "en",
            "publishDate",
            data.publishDate
          )
          setTranslationField(
            "videoTipData",
            "fr",
            "publishDate",
            data.publishDate
          )
          setUpdatedField(
            "videoTipData",
            "en",
            "publishDate",
            normalizedPublishDate ?? undefined
          )
          setUpdatedField(
            "videoTipData",
            "fr",
            "publishDate",
            normalizedPublishDate ?? undefined
          )
          // Clear publishDate from other sections
          setUpdatedField("basicLayoutData", "en", "publishDate", undefined)
          setUpdatedField("basicLayoutData", "fr", "publishDate", undefined)
          setUpdatedField("shopPromotionData", "en", "publishDate", undefined)
          setUpdatedField("shopPromotionData", "fr", "publishDate", undefined)
        } else {
          setTranslationField(
            "shopPromotionData",
            "en",
            "reason",
            englishConcerns
          )
          setTranslationField(
            "shopPromotionData",
            "fr",
            "reason",
            frenchConcerns
          )

          setTranslationField(
            "shopPromotionData",
            "en",
            "shopName",
            data.shopPromote.name
          )
          setTranslationField(
            "shopPromotionData",
            "fr",
            "shopName",
            data.shopPromote.name
          )

          setTranslationField(
            "shopPromotionData",
            "en",
            "email",
            data.shopPromote.email
          )
          setTranslationField(
            "shopPromotionData",
            "fr",
            "email",
            data.shopPromote.email
          )

          setTranslationField(
            "shopPromotionData",
            "en",
            "facebook",
            data.shopPromote.facebook
          )
          setTranslationField(
            "shopPromotionData",
            "fr",
            "facebook",
            data.shopPromote.facebook
          )

          setTranslationField(
            "shopPromotionData",
            "en",
            "image",
            data.shopPromote.image
          )
          setTranslationField(
            "shopPromotionData",
            "fr",
            "image",
            data.shopPromote.image
          )

          setTranslationField(
            "shopPromotionData",
            "en",
            "instagram",
            data.shopPromote.instagram
          )
          setTranslationField(
            "shopPromotionData",
            "fr",
            "instagram",
            data.shopPromote.instagram
          )

          setTranslationField(
            "shopPromotionData",
            "en",
            "mobileNumber",
            data.shopPromote.phoneNumber
          )
          setTranslationField(
            "shopPromotionData",
            "fr",
            "mobileNumber",
            data.shopPromote.phoneNumber
          )

          setTranslationField(
            "shopPromotionData",
            "en",
            "shopCategory",
            data.shopPromote.category
          )
          setTranslationField(
            "shopPromotionData",
            "fr",
            "shopCategory",
            data.shopPromote.categoryFR
          )

          setTranslationField(
            "shopPromotionData",
            "en",
            "shopLocation",
            data.shopPromote.location
          )
          setTranslationField(
            "shopPromotionData",
            "fr",
            "shopLocation",
            data.shopPromote.location
          )

          const locationLatLng = {
            lat: data.shopPromote.locationLat,
            lng: data.shopPromote.locationLng
          }

          setTranslationField(
            "shopPromotionData",
            "en",
            "shopLocationLatLng",
            locationLatLng
          )
          setTranslationField(
            "shopPromotionData",
            "fr",
            "shopLocationLatLng",
            locationLatLng
          )

          // Handling Shop Promotion Data (set English and French shopPromoteFoods)
          if ("shopPromoteFoods" in data.shopPromote) {
            // Set English shopPromoteFoods
            setTranslationField(
              "shopPromotionData",
              "en",
              "shopPromoteFoods",
              data.shopPromote.shopPromoteFoods
            )

            // Set French shopPromoteFoods with nameFR for each item
            type ShopPromoteFood = { nameFR: string; [key: string]: any }
            const updatedShopPromoteFoods =
              data.shopPromote.shopPromoteFoods.map(
                (item: ShopPromoteFood) => ({
                  ...item,
                  name: item.nameFR
                })
              )

            // Set French shopPromoteFoods
            setTranslationField(
              "shopPromotionData",
              "fr",
              "shopPromoteFoods",
              updatedShopPromoteFoods
            )
          }

          setTranslationField(
            "shopPromotionData",
            "en",
            "subDescription",
            data.shopPromote.desc
          )
          setTranslationField(
            "shopPromotionData",
            "fr",
            "subDescription",
            data.shopPromote.descFR
          )

          setTranslationField(
            "shopPromotionData",
            "en",
            "website",
            data.shopPromote.website
          )
          setTranslationField(
            "shopPromotionData",
            "fr",
            "website",
            data.shopPromote.website
          )

          setTranslationField(
            "shopPromotionData",
            "en",
            "publishDate",
            data.publishDate
          )
          setTranslationField(
            "shopPromotionData",
            "fr",
            "publishDate",
            data.publishDate
          )
          setUpdatedField(
            "shopPromotionData",
            "en",
            "publishDate",
            normalizedPublishDate ?? undefined
          )
          setUpdatedField(
            "shopPromotionData",
            "fr",
            "publishDate",
            normalizedPublishDate ?? undefined
          )
          // Clear publishDate from other sections
          setUpdatedField("basicLayoutData", "en", "publishDate", undefined)
          setUpdatedField("basicLayoutData", "fr", "publishDate", undefined)
          setUpdatedField("videoTipData", "en", "publishDate", undefined)
          setUpdatedField("videoTipData", "fr", "publishDate", undefined)
        }
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  useEffect(() => {
    if (tipId > 0) {
      handleDailyTipById()
    }
  }, [tipId])

  // Language toggle handler
  const handleLanguageToggle = (val: boolean) => {
    setAllowMultiLang(val)
    setUpdateAllowMultiLang(val)
    if (!val) setActiveLang("en")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] p-6 rounded-xl overflow-hidden">
        <div
          className="overflow-y-auto p-2 h-full"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          <DialogTitle>Daily Tip</DialogTitle>

          <Tabs
            value={activeLang}
            onValueChange={val => {
              setActiveLang(val as "en" | "fr")
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
                  onCheckedChange={handleLanguageToggle}
                />
                <Label htmlFor="multi-lang" className="text-Primary-300">
                  {translations.allowMultiLang}
                </Label>
              </div>
            </div>

            {/* English Tab Content */}
            <TabsContent value={activeLang}>
              <EditDailyTipPopUp
                onClose={onClose}
                translations={{ ...defaultTranslations, ...translations }}
                token={token}
                userName={userName}
                editDailyTip={editDailyTip}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
