"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type Lang = "en" | "fr"

export interface Ingredient {
  foodId: number
  ingredientName: string
  quantity: string
  mainIngredient: boolean
  available: boolean
}

export interface RecipeFields {
  name: string
  category: string
  season: string
  preparation: string
  rest: string
  persons: string
  recipe: string
  benefits: string[]
  ingredientData: Ingredient[]
  authorName: string
  authorCategory: string
  phone: string
  email: string
  website: string
  instagram: string
  recipeImage: string
  authorimage: string
}

interface LangData<T> {
  en: Partial<T>
  fr: Partial<T>
}

interface RecipeStoreState {
  allowMultiLang: boolean
  setUpdateAllowMultiLang: (value: boolean) => void
  translationsData: LangData<RecipeFields>
  setUpdatedField: (lang: Lang, field: keyof RecipeFields, value: any) => void
  resetUpdatedStore: () => void
}

// Optional helper
function isLangDataEmpty<T>(data: LangData<T>): boolean {
  return Object.keys(data.en).length === 0 && Object.keys(data.fr).length === 0
}

export const useUpdateRecipeStore = create<RecipeStoreState>()(
  persist(
    (set, get) => ({
      allowMultiLang: false,
      setUpdateAllowMultiLang: value => set({ allowMultiLang: value }),

      translationsData: {
        en: {},
        fr: {}
      },

      setUpdatedField: (lang, field, value) => {
        set(state => ({
          translationsData: {
            ...state.translationsData,
            [lang]: {
              ...state.translationsData[lang],
              [field]: value
            }
          }
        }))
      },

      resetUpdatedStore: () => {
        set({
          translationsData: {
            en: {},
            fr: {}
          }
        })
      }
    }),
    {
      name: "update-recipe-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => {
        const { translationsData, allowMultiLang } = state
        return {
          allowMultiLang,
          translationsData: isLangDataEmpty(translationsData)
            ? {}
            : translationsData
        }
      }
    }
  )
)
