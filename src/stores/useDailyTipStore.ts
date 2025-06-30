"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface shopPromoteFoodsTypes {
  foodId: number
  name: string
  dispalyStatus: boolean
}

interface BasicLayoutFields {
  title: string
  subTitleOne: string
  subDescriptionOne: string
  subTitleTwo: string
  subDescriptionTwo: string
  concern: string
  image: string
  dateselect: string
}

interface ShopPromotionFields {
  reason: string
  shopName: string
  shopLocation: string
  subDescription: string
  shopCategory: string
  mobileNumber: string
  email: string
  mapsPin: string
  facebook: string
  instagram: string
  website: string
  image: string
  dateselect: string
  shopPromoteFoods: shopPromoteFoodsTypes[]
}

interface VideoTipFields {
  concern: string
  title: string
  subTitle: string
  subDescription: string
  videoLink: string
  dateselect: string
}

interface LangData<T> {
  en: T
  fr: T
}

interface DailyTipStoreState {
  allowMultiLang: boolean
  activeLang: "en" | "fr"
  activeTab: "basicForm" | "shopPromote" | "videoForm"
  translationsData: {
    basicLayoutData: LangData<BasicLayoutFields>
    shopPromotionData: LangData<ShopPromotionFields>
    videoTipData: LangData<VideoTipFields>
  }
  setAllowMultiLang: (val: boolean) => void
  setActiveLang: (lang: "en" | "fr") => void
  setActiveTab: (tab: "basicForm" | "shopPromote" | "videoForm") => void
  setTranslationField: (
    section: keyof DailyTipStoreState["translationsData"],
    lang: "en" | "fr",
    field: string,
    value: any
  ) => void
  resetTranslations: () => void
}

export const useDailyTipStore = create<DailyTipStoreState>()(
  persist(
    set => ({
      allowMultiLang: false,
      activeLang: "en",
      activeTab: "basicForm",
      translationsData: {
        basicLayoutData: {
          en: {
            title: "",
            subTitleOne: "",
            subDescriptionOne: "",
            subTitleTwo: "",
            subDescriptionTwo: "",
            concern: "",
            image: "",
            dateselect: ""
          },
          fr: {
            title: "",
            subTitleOne: "",
            subDescriptionOne: "",
            subTitleTwo: "",
            subDescriptionTwo: "",
            concern: "",
            image: "",
            dateselect: ""
          }
        },
        shopPromotionData: {
          en: {
            reason: "",
            shopName: "",
            shopLocation: "",
            subDescription: "",
            shopCategory: "",
            mobileNumber: "",
            email: "",
            mapsPin: "",
            facebook: "",
            instagram: "",
            website: "",
            image: "",
            dateselect: "",
            shopPromoteFoods: [
              {
                foodId: 0,
                name: "",
                dispalyStatus: false
              }
            ]
          },
          fr: {
            reason: "",
            shopName: "",
            shopLocation: "",
            subDescription: "",
            shopCategory: "",
            mobileNumber: "",
            email: "",
            mapsPin: "",
            facebook: "",
            instagram: "",
            website: "",
            image: "",
            dateselect: "",
            shopPromoteFoods: [
              {
                foodId: 0,
                name: "",
                dispalyStatus: false
              }
            ]
          }
        },
        videoTipData: {
          en: {
            concern: "",
            title: "",
            subTitle: "",
            subDescription: "",
            videoLink: "",
            dateselect: ""
          },
          fr: {
            concern: "",
            title: "",
            subTitle: "",
            subDescription: "",
            videoLink: "",
            dateselect: ""
          }
        }
      },

      // Optional setters if not already added
      setAllowMultiLang: val => {
        set(state => ({
          allowMultiLang: val,
          activeLang: val ? state.activeLang : "en"
        }))
      },

      setActiveLang: lang => set({ activeLang: lang }),

      setActiveTab: tab => set({ activeTab: tab }),

      setTranslationField: (section, lang, field, value) => {
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

      resetTranslations: () => {
        set({
          translationsData: {
            basicLayoutData: {
              en: {
                title: "",
                subTitleOne: "",
                subDescriptionOne: "",
                subTitleTwo: "",
                subDescriptionTwo: "",
                concern: "",
                image: "",
                dateselect: ""
              },
              fr: {
                title: "",
                subTitleOne: "",
                subDescriptionOne: "",
                subTitleTwo: "",
                subDescriptionTwo: "",
                concern: "",
                image: "",
                dateselect: ""
              }
            },
            shopPromotionData: {
              en: {
                reason: "",
                shopName: "",
                shopLocation: "",
                subDescription: "",
                shopCategory: "",
                mobileNumber: "",
                email: "",
                mapsPin: "",
                facebook: "",
                instagram: "",
                website: "",
                image: "",
                dateselect: "",
                shopPromoteFoods: [
                  {
                    foodId: 0,
                    name: "",
                    dispalyStatus: false
                  }
                ]
              },
              fr: {
                reason: "",
                shopName: "",
                shopLocation: "",
                subDescription: "",
                shopCategory: "",
                mobileNumber: "",
                email: "",
                mapsPin: "",
                facebook: "",
                instagram: "",
                website: "",
                image: "",
                dateselect: "",
                shopPromoteFoods: [
                  {
                    foodId: 0,
                    name: "",
                    dispalyStatus: false
                  }
                ]
              }
            },
            videoTipData: {
              en: {
                concern: "",
                title: "",
                subTitle: "",
                subDescription: "",
                videoLink: "",
                dateselect: ""
              },
              fr: {
                concern: "",
                title: "",
                subTitle: "",
                subDescription: "",
                videoLink: "",
                dateselect: ""
              }
            }
          }
        })
      }
    }),
    {
      name: "daily-tip-storage",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
