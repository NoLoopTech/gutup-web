"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface TagFields {
  category: string
  tagName: string
}

interface LangData<T> {
  en: T
  fr: T
}

interface TagStoreState {
  allowMultiLang: boolean
  activeLang: "en" | "fr"
  tagData: LangData<TagFields>
  setAllowMultiLang: (val: boolean) => void
  setActiveLang: (lang: "en" | "fr") => void
  setTranslationField: (
    section: "tagData",
    lang: "en" | "fr",
    field: keyof TagFields,
    value: string
  ) => void
  resetForm: () => void
}

const emptyTagFields: TagFields = {
  tagName: "",
  category: ""
}

export const useTagStore = create<TagStoreState>()(
  persist(
    (set, get) => ({
      allowMultiLang: false,
      activeLang: "en",
      tagData: {
        en: { ...emptyTagFields },
        fr: { ...emptyTagFields }
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
            ...state[section],
            [lang]: {
              ...state[section][lang],
              [field]: value
            }
          }
        }))
      },

      resetForm: () => {
        set({
          tagData: {
            en: { ...emptyTagFields },
            fr: { ...emptyTagFields }
          }
        })
      }
    }),
    {
      name: "tag-store",
      storage: createJSONStorage<TagStoreState>(() => sessionStorage)
    }
  )
)
