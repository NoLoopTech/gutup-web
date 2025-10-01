"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRecipeStore } from "@/stores/useRecipeStore"
import { loadLanguage } from "@/../../src/i18n/locales"
import {
  defaultTranslations,
  type translationsTypes
} from "@/types/recipeTypes"
import EditRecipePopUpContent from "./EditRecipePopUpContent"
import { getRecipeById } from "@/app/api/recipe"
import { useUpdateRecipeStore } from "@/stores/useUpdateRecipeStore"

interface Props {
  open: boolean
  onClose: () => void
  token: string
  editRecipe: () => void
  isLoading: boolean
  recipeId: number
}

export default function EditRecipePopUp({
  open,
  onClose,
  token,
  editRecipe,
  isLoading,
  recipeId
}: Props): JSX.Element {
  const {
    allowMultiLang,
    setAllowMultiLang,
    activeLang,
    setActiveLang,
    setTranslationField
  } = useRecipeStore()

  const [translations, setTranslations] = useState<Partial<translationsTypes>>(
    {}
  )
  const { setUpdatedField, setUpdateAllowMultiLang } = useUpdateRecipeStore()

  const MAX_RETRIES = 5
  const RETRY_DELAY_MS = 100

  const setCategoryWithRetry = async (
    categoryEn: string,
    categoryFr: string
  ) => {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      await setTranslationField("en", "category", categoryEn)
      await setTranslationField("fr", "category", categoryFr)

      const currentCategory =
        useRecipeStore.getState().translations?.en?.category

      if (currentCategory === categoryEn) {
        return
      }

      await new Promise(res => setTimeout(res, RETRY_DELAY_MS))
    }

    console.error("❗ Failed to set category correctly after all retries.")
  }

  // handle get recipe data by recipe id
  const getRecipeDataById = async () => {
    try {
      const res = await getRecipeById(token, recipeId)

      if (res.status === 200 || res.status === 201) {
        const data = res.data
        setAllowMultiLang(data.allowMultiLang)

        setTranslationField("en", "name", data.name)
        setTranslationField("fr", "name", data.name)

        setTranslationField("en", "preparation", data.attribute.preparation)
        setTranslationField("fr", "preparation", data.attribute.preparationFR)

        setTranslationField("en", "rest", data.attribute.rest)
        setTranslationField("fr", "rest", data.attribute.restFR)

        setTranslationField("en", "persons", String(data.attribute.persons))
        setTranslationField("fr", "persons", String(data.attribute.persons))

        setTranslationField("en", "authorName", data.author.authorName)
        setTranslationField("fr", "authorName", data.author.authorName)

        setTranslationField("en", "authorCategory", data.author.authorCategory)
        setTranslationField(
          "fr",
          "authorCategory",
          data.author.authorCategoryFR
        )

        setTranslationField("en", "phone", data.author.authorPhone)
        setTranslationField("fr", "phone", data.author.authorPhone)

        setTranslationField("en", "email", data.author.authorEmail)
        setTranslationField("fr", "email", data.author.authorEmail)

        setTranslationField("en", "website", data.author.authorWebsite)
        setTranslationField("fr", "website", data.author.authorWebsite)

        const instagramLink = data.author.authorInstagramLink ?? ""
        setTranslationField("en", "instagram", instagramLink)
        setTranslationField("fr", "instagram", instagramLink)

        setTranslationField("en", "season", data.season)
        setTranslationField("fr", "season", data.seasonFR)

        setTranslationField("en", "recipe", data.describe.description)
        setTranslationField("fr", "recipe", data.describe.descriptionFR)

        setUpdatedField("en", "recipe", data.describe.description)
        setUpdatedField("fr", "recipe", data.describe.descriptionFR)

        setTranslationField("en", "authorimage", data.author.authorImage)
        setTranslationField("fr", "authorimage", data.author.authorImage)

        const recipeImage = data.images.map(
          (image: { imageUrl: string }) => image.imageUrl
        )

        setTranslationField("en", "recipeImage", recipeImage[0])
        setTranslationField("fr", "recipeImage", recipeImage[0])

        const benefits = data.healthBenefits.map(
          (benifits: { healthBenefit: string }) => benifits.healthBenefit
        )
        const benefitsFR = data.healthBenefits.map(
          (benifits: { healthBenefitFR: string }) => benifits.healthBenefitFR
        )

        setTranslationField("en", "benefits", benefits)
        setTranslationField("fr", "benefits", benefitsFR)

        const ingradientsEN = data.ingredients.map(
          (benifits: {
            available: boolean
            foodId: number
            ingredientName: string
            ingredientNameFR: string
            mainIngredient: boolean
            quantity: string
            quantityFR: string
          }) => {
            return {
              foodId: benifits.foodId,
              ingredientName: benifits.ingredientName,
              quantity: benifits.quantity,
              mainIngredient: benifits.mainIngredient,
              available: benifits.available
            }
          }
        )
        const ingradientsFR = data.ingredients.map(
          (benifits: {
            available: boolean
            foodId: number
            ingredientName: string
            ingredientNameFR: string
            mainIngredient: boolean
            quantity: string
            quantityFR: string
          }) => {
            return {
              foodId: benifits.foodId,
              ingredientName: benifits.ingredientNameFR,
              quantity: benifits.quantityFR,
              mainIngredient: benifits.mainIngredient,
              available: benifits.available
            }
          }
        )

        setTranslationField("en", "ingredientData", ingradientsEN)
        setTranslationField("fr", "ingredientData", ingradientsFR)

        await setCategoryWithRetry(data.category, data.categoryFR)
      }
    } catch (error) {
      console.log("error fetching recipe : ", error)
    }
  }

  useEffect(() => {
    if (token && recipeId) {
      getRecipeDataById()
    }
  }, [token, recipeId])

  // Load translations when activeLang changes
  useEffect(() => {
    const loadTranslationsAsync = async () => {
      const langData = await loadLanguage(activeLang, "recipe")
      setTranslations(langData)
    }
    loadTranslationsAsync()
  }, [activeLang])

  // Language toggle handler
  const handleLanguageToggle = (val: boolean) => {
    setAllowMultiLang(val)
    setUpdateAllowMultiLang(val)
    if (!val) setActiveLang("en")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="overflow-y-auto p-2 h-full"
          style={{ scrollbarWidth: "none" }}
        >
          <DialogTitle>{"Recipe"}</DialogTitle>

          <Tabs
            value={activeLang}
            onValueChange={val => setActiveLang(val as "en" | "fr")}
            className="w-full"
          >
            <div className="flex flex-col gap-4 justify-between items-start mt-4 mb-6 sm:flex-row sm:items-center">
              <TabsList>
                <TabsTrigger value="en">{translations.english}</TabsTrigger>
                {allowMultiLang && (
                  <TabsTrigger value="fr">{translations.french}</TabsTrigger>
                )}
              </TabsList>

              <div className="flex gap-2 items-center">
                <Switch
                  id="multi-lang"
                  checked={allowMultiLang}
                  onCheckedChange={handleLanguageToggle}
                />
                <Label htmlFor="multi-lang" className="text-Primary-300">
                  {translations.allowMultiLang}
                </Label>
              </div>
            </div>

            <TabsContent value={activeLang}>
              <EditRecipePopUpContent
                translations={{ ...defaultTranslations, ...translations }}
                token={token}
                onClose={onClose}
                editRecipe={editRecipe}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
