export interface translationsTypes {
  addNewFoodItem: string
  allowMultiLang: string
  english: string
  french: string
  name: string
  enterFoodName: string
  category: string
  selectCategory: string
  month: string
  selectMonth: string
  country: string
  selectCountry: string
  foodAttributes: string
  fiber: string
  provideDetailsIfApplicable: string
  proteins: string
  vitamins: string
  minerals: string
  fat: string
  sugar: string
  healthBenefits: string
  addUpTo6FoodBenefitsOrFewer: string
  describeTheFood: string
  selection: string
  preparation: string
  conservation: string
  uploadImages: string
  selectImagesForYourFoodItem: string
  cancel: string
  save: string
  fruits: string
  vegetables: string
  dairy: string
  grains: string
  spring: string
  summer: string
  autumn: string
  winter: string
  switzerland: string
  france: string
  germany: string
  italy: string

  required: string
  mustbeatleast2characters: string
  pleaseselectacategory: string
  pleaseselectaseason: string
  pleaseselectacountry: string
  pleaseenteratleastonebenefit: string
  formSubmittedSuccessfully: string
}
export const defaultTranslations: translationsTypes = {
  addNewFoodItem: "",
  allowMultiLang: "Allow Multi-Language",
  english: "English",
  french: "French",
  name: "",
  enterFoodName: "",
  category: "",
  selectCategory: "",
  month: "",
  selectMonth: "",
  country: "",
  selectCountry: "",
  foodAttributes: "",
  fiber: "",
  provideDetailsIfApplicable: "",
  proteins: "",
  vitamins: "",
  minerals: "",
  fat: "",
  sugar: "",
  healthBenefits: "",
  addUpTo6FoodBenefitsOrFewer: "",
  describeTheFood: "",
  selection: "",
  preparation: "",
  conservation: "",
  uploadImages: "",
  selectImagesForYourFoodItem: "",
  cancel: "",
  save: "",
  fruits: "",
  vegetables: "",
  dairy: "",
  grains: "",
  spring: "",
  summer: "",
  autumn: "",
  winter: "",
  switzerland: "",
  france: "",
  germany: "",
  italy: "",

  required: "",
  mustbeatleast2characters: "",
  pleaseselectacategory: "",
  pleaseselectaseason: "",
  pleaseselectacountry: "",
  pleaseenteratleastonebenefit: "",
  formSubmittedSuccessfully: ""
}

export interface SeasonDto {
  foodId: number
  season: string
  seasonFR: string
}

export interface CreateFoodDto {
  name: string
  nameFR: string
  category: string
  categoryFR: string
  country: string
  seasons?: SeasonDto[]
  attributes: {
    fiber: number
    proteins: number
    vitamins: string
    vitaminsFR: string
    minerals: string
    mineralsFR: string
    fat: number
    sugar: number
  }
  allowMultiLang: boolean
  describe: {
    selection: string
    selectionFR: string
    preparation: string
    preparationFR: string
    conservation: string
    conservationFR: string
  }
  images: Array<{ image: string }>
  healthBenefits: Array<{ healthBenefit: string; healthBenefitFR: string }>
}
