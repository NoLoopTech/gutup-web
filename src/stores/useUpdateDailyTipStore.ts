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
  concern?: string
  image?: string
  share?: boolean
}

interface ShopPromotionFields {
  reason?: string
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
  concern?: string
  title?: string
  subTitle?: string
  subDescription?: string
  videoLink?: string
}

interface LangData<T> {
  en: Partial<T>
  fr: Partial<T>
}

interface DailyTipStoreState {
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
function isLangDataEmpty<T>(data: LangData<T>): boolean {
  return Object.keys(data.en).length === 0 && Object.keys(data.fr).length === 0
}

export const useUpdateDailyTipStore = create<DailyTipStoreState>()(
  persist(
    (set, get) => ({
      translationsData: {
        basicLayoutData: { en: {}, fr: {} },
        shopPromotionData: { en: {}, fr: {} },
        videoTipData: { en: {}, fr: {} }
      },

      setUpdatedField: (section, lang, field, value) => {
        set(state => ({
          translationsData: {
            ...state.translationsData,
            [section]: {
              ...state.translationsData[section],
              [lang]: {
                ...state.translationsData[section][lang],
                [field]: value
              }
            }
          }
        }))
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
        const { basicLayoutData, shopPromotionData, videoTipData } =
          state.translationsData
        return {
          translationsData: {
            ...(isLangDataEmpty(basicLayoutData) ? {} : { basicLayoutData }),
            ...(isLangDataEmpty(shopPromotionData)
              ? {}
              : { shopPromotionData }),
            ...(isLangDataEmpty(videoTipData) ? {} : { videoTipData })
          }
        }
      }
    }
  )
)
