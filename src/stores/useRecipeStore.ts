"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type Lang = "en" | "fr"

export interface Ingredient {
  ingredientName: string
  quantity: string
  mainIngredient: string
  availableInIngredient: string
}

export interface RecipeFields {
  name: string
  category: string
  season: string
  preparation: string
  rest: string
  persons: string
  description: string
  recipe: string
  benefits: string[]
  ingredientData: Ingredient[]
  authorName: string
  authorCategory: string
  phone: string
  email: string
  website: string
  foodimage: string
  authorimage: string
}

export interface ValidationErrors {
  name?: string
  category?: string
  season?: string
  preparationTime?: string
  restTime?: string
  persons?: string
  healthBenefits?: string
  ingredients?: string
}

export interface LangData<T> {
  en: T
  fr: T
}

export interface RecipeStoreState {
  allowMultiLang: boolean
  activeLang: Lang
  translations: LangData<RecipeFields>
  errors: ValidationErrors
  setTranslationField: (
    lang: Lang,
    field: keyof RecipeFields,
    value: any
  ) => void
  setActiveLang: (lang: Lang) => void
  setAllowMultiLang: (val: boolean) => void
  setField: (lang: Lang, field: keyof RecipeFields, value: any) => void
  addTag: (lang: Lang, tag: string) => void
  removeTag: (lang: Lang, tag: string) => void
  addIngredient: (lang: Lang, ing: Ingredient) => void
  removeIngredient: (lang: Lang, name: string) => void
  setErrors: (errors: ValidationErrors) => void
  resetErrors: () => void
  resetRecipe: () => void
}

const emptyRecipe: RecipeFields = {
  name: "",
  category: "",
  season: "",
  preparation: "",
  rest: "",
  persons: "",
  description: "",
  recipe: "",
  benefits: [],
  ingredientData: [],
  authorName: "",
  authorCategory: "",
  phone: "",
  email: "",
  website: "",
  foodimage: "",
  authorimage: ""
}

export const useRecipeStore = create<RecipeStoreState>()(
  persist(
    set => ({
      allowMultiLang: false,
      activeLang: "en",
      translations: {
        en: { ...emptyRecipe },
        fr: { ...emptyRecipe }
      },
      errors: {},

      setAllowMultiLang: (val: boolean) =>
        set(state => ({
          allowMultiLang: val,
          activeLang: val ? state.activeLang : "en"
        })),

      setActiveLang: (lang: Lang) => set({ activeLang: lang }),

      setField: (lang: Lang, field: keyof RecipeFields, value: any) =>
        set(state => ({
          translations: {
            ...state.translations,
            [lang]: {
              ...state.translations[lang],
              [field]: value
            }
          }
        })),

      setTranslationField: (lang, field, value) =>
        set(state => ({
          translations: {
            ...state.translations,
            [lang]: {
              ...state.translations[lang],
              [field]: value
            }
          }
        })),

      addTag: (lang: Lang, tag: string) =>
        set(state => {
          const tags = state.translations[lang].benefits
          if (tags.includes(tag) || tags.length >= 6) return state
          return {
            translations: {
              ...state.translations,
              [lang]: {
                ...state.translations[lang],
                healthBenefits: [...tags, tag]
              }
            }
          }
        }),

      removeTag: (lang: Lang, tag: string) =>
        set(state => ({
          translations: {
            ...state.translations,
            [lang]: {
              ...state.translations[lang],
              healthBenefits: state.translations[lang].benefits.filter(
                t => t !== tag
              )
            }
          }
        })),

      addIngredient: (lang: Lang, ing: Ingredient) =>
        set(state => ({
          translations: {
            ...state.translations,
            [lang]: {
              ...state.translations[lang],
              ingredients: [...state.translations[lang].ingredientData, ing]
            }
          }
        })),

      removeIngredient: (lang: Lang, name: string) =>
        set(state => ({
          translations: {
            ...state.translations,
            [lang]: {
              ...state.translations[lang],
              ingredients: state.translations[lang].ingredientData.filter(
                i => i.ingredientName !== name
              )
            }
          }
        })),

      setErrors: (errors: ValidationErrors) => set({ errors }),

      resetErrors: () => set({ errors: {} }),

      resetRecipe: () =>
        set(() => ({
          translations: {
            en: { ...emptyRecipe },
            fr: { ...emptyRecipe }
          }
        }))
    }),
    {
      name: "recipe-storage",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
