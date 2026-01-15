"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type Lang = "en" | "fr"

interface shopPromoteFoodsTypes {
  id?: number
  name?: string
  status?: boolean
  display?: boolean
}

interface BasicLayoutFields {
  title?: string
  subTitleOne?: string
  subDescriptionOne?: string
  subTitleTwo?: string
  subDescriptionTwo?: string
  concern?: string[] // updated to array
  image?: string
  share?: boolean
  publishDate?: string // Added for publish date support
  // CTA button fields
  buttonLabel?: string
  navigationType?: string | null
  navigationTarget?: string | null
  navigationTargetName?: string | null
}

interface ShopPromotionFields {
  reason?: string[]
  shopName?: string
  shopLocation?: string
  shopLocationLatLng?: {
    lat: number
    lng: number
  }
  subDescription?: string
  shopCategory?: string
  mobileNumber?: string
  email?: string
  mapsPin?: string
  facebook?: string
  instagram?: string
  website?: string
  image?: string
  shopPromoteFoods?: shopPromoteFoodsTypes[]
}

interface VideoTipFields {
  concern?: string[]
  title?: string
  subTitle?: string
  subDescription?: string
  videoLink?: string
  hideVideo?: boolean
  // CTA button fields
  buttonLabel?: string
  navigationType?: string | null
  navigationTarget?: string | null
  navigationTargetName?: string | null
}

interface LangData<T> {
  en: Partial<T>
  fr: Partial<T>
}

interface DailyTipStoreState {
  allowMultiLang: boolean
  setUpdateAllowMultiLang: (value: boolean) => void
  translationsData: {
    basicLayoutData: LangData<BasicLayoutFields>
    shopPromotionData: LangData<ShopPromotionFields>
    videoTipData: LangData<VideoTipFields>
  }
  setUpdatedField: (
    section: keyof DailyTipStoreState["translationsData"],
    lang: Lang,
    field: string,
    value: any
  ) => void
  resetUpdatedStore: () => void
}

// Helper
function isLangDataEmpty<T>(data: LangData<T> | undefined | null): boolean {
  if (!data || typeof data !== "object") return true
  const { en, fr } = data as any
  if (!en || !fr || typeof en !== "object" || typeof fr !== "object")
    return true
  try {
    return Object.keys(en).length === 0 && Object.keys(fr).length === 0
  } catch {
    return true
  }
}

export const useUpdateDailyTipStore = create<DailyTipStoreState>()(
  persist(
    (set, get) => ({
      allowMultiLang: false,
      setUpdateAllowMultiLang: value => set({ allowMultiLang: value }),

      translationsData: {
        basicLayoutData: { en: {}, fr: {} },
        shopPromotionData: { en: {}, fr: {} },
        videoTipData: { en: {}, fr: {} }
      },

      setUpdatedField: (section, lang, field, value) => {
        set(state => {
          const prevSection = state.translationsData[section]
          const prevLangObj = prevSection[lang]
          let newLangObj
          if (value === undefined) {
            // Remove the key if value is undefined
            const { [field]: _, ...rest } = prevLangObj as Record<string, any>
            newLangObj = rest
          } else if (field === "__replace__") {
            newLangObj = value
          } else {
            newLangObj = {
              ...prevLangObj,
              [field]: value
            }
          }
          return {
            translationsData: {
              ...state.translationsData,
              [section]: {
                ...prevSection,
                [lang]: newLangObj
              }
            }
          }
        })
      },

      resetUpdatedStore: () => {
        set({
          translationsData: {
            basicLayoutData: { en: {}, fr: {} },
            shopPromotionData: { en: {}, fr: {} },
            videoTipData: { en: {}, fr: {} }
          }
        })
      }
    }),
    {
      name: "update-daily-tip-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => {
        const { translationsData } = state
        const { basicLayoutData, shopPromotionData, videoTipData } =
          translationsData
        const filtered: Partial<DailyTipStoreState["translationsData"]> = {}

        if (!isLangDataEmpty(basicLayoutData)) {
          filtered.basicLayoutData = basicLayoutData
        }
        if (!isLangDataEmpty(shopPromotionData)) {
          filtered.shopPromotionData = shopPromotionData
        }
        if (!isLangDataEmpty(videoTipData)) {
          filtered.videoTipData = videoTipData
        }

        return {
          allowMultiLang: state.allowMultiLang,
          translationsData: filtered
        }
      }
    }
  )
)
