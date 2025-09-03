"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type Lang = "en" | "fr"

interface QuoteFields {
  mood?: string
  author?: string
  quote?: string
  share?: boolean
}

interface FoodFields {
  mood?: string
  foodName?: string
  description?: string
  shopCategory?: string
  image?: string
}

interface RecipeFields {
  mood?: string
  recipe?: string
  description?: string
  image?: string
}

interface LangData<T> {
  en: Partial<T>
  fr: Partial<T>
}

interface UpdatedStoreState {
  allowMultiLang: boolean
  setUpdateAllowMultiLang: (value: boolean) => void

  translationsData: {
    quoteData: LangData<QuoteFields>
    foodData: LangData<FoodFields>
    recipeData: LangData<RecipeFields>
  }
  setUpdatedField: (
    section: keyof UpdatedStoreState["translationsData"],
    lang: Lang,
    field: string,
    value: string | boolean
  ) => void
  resetUpdatedStore: () => void
}

// ✅ Helper to check if all fields are empty in a LangData<T>
function isLangDataEmpty<T>(data: LangData<T>): boolean {
  return Object.keys(data.en).length === 0 && Object.keys(data.fr).length === 0
}

export const useUpdatedMoodTranslationStore = create<UpdatedStoreState>()(
  persist(
    (set, get) => ({
      allowMultiLang: false,
      setUpdateAllowMultiLang: (value: boolean) =>
        set({ allowMultiLang: value }),

      translationsData: {
        quoteData: { en: {}, fr: {} },
        foodData: { en: {}, fr: {} },
        recipeData: { en: {}, fr: {} }
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
          // allowMultiLang: opts?.resetAllowMultiLang
          //   ? false
          //   : get().allowMultiLang,

          translationsData: {
            quoteData: { en: {}, fr: {} },
            foodData: { en: {}, fr: {} },
            recipeData: { en: {}, fr: {} }
          }
        })
      }
    }),
    {
      name: "updated-mood-fields",
      storage: createJSONStorage(() => sessionStorage),

      // ✅ Only persist sections that have real values
      partialize: state => {
        const { quoteData, foodData, recipeData } = state.translationsData
        return {
          allowMultiLang: state.allowMultiLang,

          translationsData: {
            ...(isLangDataEmpty(quoteData) ? {} : { quoteData }),
            ...(isLangDataEmpty(foodData) ? {} : { foodData }),
            ...(isLangDataEmpty(recipeData) ? {} : { recipeData })
          }
        }
      }
    }
  )
)
