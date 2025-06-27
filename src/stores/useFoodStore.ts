"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface FoodFields {
  name: string
  fiber: string
  proteins: string
  vitamins: string
  minerals: string
  fat: string
  sugar: string
}

interface LangData<T> {
  en: T
  fr: T
}

interface FoodStoreState {
  allowMultiLang: boolean
  activeLang: "en" | "fr"
  // dynamic “name” input values
  foodData: LangData<FoodFields>
  setAllowMultiLang: (val: boolean) => void
  setActiveLang: (lang: "en" | "fr") => void
  setTranslationField: (
    section: "foodData",
    lang: "en" | "fr",
    field: keyof FoodFields,
    value: string
  ) => void
  resetForm: () => void
}

export const useFoodStore = create<FoodStoreState>()(
  persist(
    (set, get) => ({
      allowMultiLang: false,
      activeLang: "en",
      foodData: {
        en: {
          name: "",
          fiber: "",
          proteins: "",
          vitamins: "",
          minerals: "",
          fat: "",
          sugar: ""
        },
        fr: {
          name: "",
          fiber: "",
          proteins: "",
          vitamins: "",
          minerals: "",
          fat: "",
          sugar: ""
        }
      },

      setAllowMultiLang: val => {
        set(state => ({
          allowMultiLang: val,
          activeLang: val ? state.activeLang : "en"
        }))
      },

      setActiveLang: lang => {
        set({ activeLang: lang })
      },

      setTranslationField: (section, lang, field, value) => {
        const sectionData = get()[section]
        set({
          [section]: {
            ...sectionData,
            [lang]: {
              ...sectionData[lang],
              [field]: value
            }
          }
        } as any)
      },

      resetForm: () => {
        set({
          foodData: {
            en: {
              name: "",
              fiber: "",
              proteins: "",
              vitamins: "",
              minerals: "",
              fat: "",
              sugar: ""
            },
            fr: {
              name: "",
              fiber: "",
              proteins: "",
              vitamins: "",
              minerals: "",
              fat: "",
              sugar: ""
            }
          }
        })
      }
    }),
    {
      name: "food-store",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
