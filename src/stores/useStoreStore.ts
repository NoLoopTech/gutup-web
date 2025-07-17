"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface StoreField {
  storeName: string
  category: string
  storeLocation: string
  storeType: string
  subscriptionType: boolean
  timeFrom: string
  timeTo: string
  phone: string
  email: string
  website: string
  facebook: string
  instagram: string
  about: string
  availData: any[] // Changed from string[] to any[] to match AvailableItem[]
  storeImage: string | null // Store as base64 string or Firebase URL
  storeImageName: string | null // Store the original file name
}

interface LangData<T> {
  en: T
  fr: T
}

interface StoreStoreState {
  allowMultiLang: boolean
  activeLang: "en" | "fr"
  storeData: LangData<StoreField>
  setAllowMultiLang: (val: boolean) => void
  setActiveLang: (lang: "en" | "fr") => void

  // same signature you had:
  setTranslationField: (
    section: "storeData",
    lang: "en" | "fr",
    field: keyof StoreField,
    value: string | string[] | null
  ) => void

  resetForm: () => void
}

const emptyFields: StoreField = {
  storeName: "",
  category: "",
  storeLocation: "",
  storeType: "",
  subscriptionType: false,
  timeFrom: "",
  timeTo: "",
  phone: "",
  email: "",
  website: "",
  facebook: "",
  instagram: "",
  about: "",
  availData: [],
  storeImage: null,
  storeImageName: null
}

export const useStoreStore = create<StoreStoreState>()(
  persist(
    (set, get) => ({
      allowMultiLang: false,
      activeLang: "en",
      storeData: {
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
          storeData: {
            en: { ...emptyFields },
            fr: { ...emptyFields }
          }
        })
      }
    }),
    {
      name: "store-store",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
