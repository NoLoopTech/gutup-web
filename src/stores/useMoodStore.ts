"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface QuoteFields {
  mood: string
  author: string
  quote: string
}

interface FoodFields {
  mood: string
  foodName: string
  description: string
  shopCategory: string
}

interface RecipeFields {
  mood: string
  recipe: string
  description: string
}

interface LangData<T> {
  en: T
  fr: T
}

interface MoodStoreState {
  allowMultiLang: boolean
  activeLang: "en" | "fr"
  activeTab: "Quote" | "Food" | "Recipe"
  translationsData: {
    quoteData: LangData<QuoteFields>
    foodData: LangData<FoodFields>
    recipeData: LangData<RecipeFields>
  }
  setAllowMultiLang: (val: boolean) => void
  setActiveLang: (lang: "en" | "fr") => void
  setActiveTab: (tab: "Quote" | "Food" | "Recipe") => void
  setTranslationField: (
    section: keyof MoodStoreState["translationsData"],
    lang: "en" | "fr",
    field: string,
    value: string
  ) => void
  resetTranslations: () => void
}

export const useMoodStore = create<MoodStoreState>()(
  persist(
    set => ({
      allowMultiLang: false,
      activeLang: "en",
      activeTab: "Quote",
      translationsData: {
        quoteData: {
          en: { mood: "", author: "", quote: "" },
          fr: { mood: "", author: "", quote: "" }
        },
        foodData: {
          en: { mood: "", foodName: "", description: "", shopCategory: "" },
          fr: { mood: "", foodName: "", description: "", shopCategory: "" }
        },
        recipeData: {
          en: { mood: "", recipe: "", description: "" },
          fr: { mood: "", recipe: "", description: "" }
        }
      },

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
            quoteData: {
              en: { mood: "", author: "", quote: "" },
              fr: { mood: "", author: "", quote: "" }
            },
            foodData: {
              en: { mood: "", foodName: "", description: "", shopCategory: "" },
              fr: { mood: "", foodName: "", description: "", shopCategory: "" }
            },
            recipeData: {
              en: { mood: "", recipe: "", description: "" },
              fr: { mood: "", recipe: "", description: "" }
            }
          }
        })
      }
    }),
    {
      name: "mood-storage",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
