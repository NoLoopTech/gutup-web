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
  benefits: string[]
  image: File | null
  category: string
  season: string
  country: string
  selection: string
  preparation: string
  conservation: string
}

interface LangData<T> {
  en: T
  fr: T
}

interface FoodStoreState {
  allowMultiLang: boolean
  activeLang: "en" | "fr"
  foodData: LangData<FoodFields>
  setAllowMultiLang: (val: boolean) => void
  setActiveLang: (lang: "en" | "fr") => void

  // same signature you had:
  setTranslationField: (
    section: "foodData",
    lang: "en" | "fr",
    field: keyof FoodFields,
    value: string | string[]
  ) => void

  resetForm: () => void
}

const emptyFields: FoodFields = {
  name: "",
  fiber: "",
  proteins: "",
  vitamins: "",
  minerals: "",
  fat: "",
  sugar: "",
  benefits: [],
  image: null,
  category: "",
  season: "",
  country: "",
  selection: "",
  preparation: "",
  conservation: ""
}

export const useFoodStore = create<FoodStoreState>()(
  persist(
    (set, get) => ({
      allowMultiLang: false,
      activeLang: "en",
      foodData: {
        en: { ...emptyFields },
        fr: { ...emptyFields }
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
        set(state => ({
          [section]: {
            // take the existing two‐language object...
            ...state[section],
            [lang]: {
              // and overwrite only that one field:
              ...state[section][lang],
              [field]: value
            }
          }
        }))
      },

      resetForm: () => {
        set({
          foodData: {
            en: { ...emptyFields },
            fr: { ...emptyFields }
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
