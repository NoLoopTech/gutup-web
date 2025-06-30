"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface StoreField {
  storeName: string
  category: string
  storeLocation: string
  storeType: string
  shoplocation: string
  timeFrom: string
  timeTo: string
  phone: string
  email: string
  mapsPin: string
  website: string
  facebook: string
  instagram: string
  about: string
  availData: string[]
  storeImage: File | null
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
    value: string | string[]
  ) => void

  resetForm: () => void
}

const emptyFields: StoreField = {
  storeName: "",
  category: "",
  storeLocation: "",
  storeType: "",
  shoplocation: "",
  timeFrom: "",
  timeTo: "",
  phone: "",
  email: "",
  mapsPin: "",
  website: "",
  facebook: "",
  instagram: "",
  about: "",
  availData: [],
  storeImage: null
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
