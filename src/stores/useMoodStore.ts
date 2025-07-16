"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface QuoteFields {
  mood: string
  author: string
  quote: string
  share: boolean
}

interface FoodFields {
  mood: string
  foodName: string
  description: string
  shopCategory: string
  image: string
}

interface RecipeFields {
  mood: string
  recipe: string
  description: string
  image: string
}

interface LangData<T> {
  en: T
  fr: T
}

interface MoodStoreState {
  allowMultiLang: boolean
  status: boolean
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
    value: string | boolean
  ) => void
  resetTranslations: () => void
}

export const useMoodStore = create<MoodStoreState>()(
  persist(
    set => ({
      allowMultiLang: false,
      status: true,
      activeLang: "en",
      activeTab: "Quote",
      translationsData: {
        quoteData: {
          en: { mood: "", author: "", quote: "", share: false },
          fr: { mood: "", author: "", quote: "", share: false }
        },
        foodData: {
          en: {
            mood: "",
            foodName: "",
            description: "",
            shopCategory: "",
            image: ""
          },
          fr: {
            mood: "",
            foodName: "",
            description: "",
            shopCategory: "",
            image: ""
          }
        },
        recipeData: {
          en: { mood: "", recipe: "", description: "", image: "" },
          fr: { mood: "", recipe: "", description: "", image: "" }
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
              en: { mood: "", author: "", quote: "", share: false },
              fr: { mood: "", author: "", quote: "", share: false }
            },
            foodData: {
              en: {
                mood: "",
                foodName: "",
                description: "",
                shopCategory: "",
                image: ""
              },
              fr: {
                mood: "",
                foodName: "",
                description: "",
                shopCategory: "",
                image: ""
              }
            },
            recipeData: {
              en: { mood: "", recipe: "", description: "", image: "" },
              fr: { mood: "", recipe: "", description: "", image: "" }
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
