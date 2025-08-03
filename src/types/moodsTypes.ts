export interface translationsTypes {
  addMoodTitle: string
  allowMultiLang: string
  english: string
  french: string
  selectLayout: string
  selectLayoutType: string
  quote: string
  share: string
  Mood: string
  food: string
  recipe: string
  selectMood: string
  quoteAuthor: string
  enterQuoteQuthor: string
  addTheQuoteHereInDetails: string
  save: string
  cancel: string
  foodName: string
  description: string
  shopcategory: string
  searchForFood: string
  addDetailsInHere: string
  selectShopCategory: string
  searchForRecipe: string
  sad: string
  happy: string
  angry: string
  bakery: string
  dairy: string
  produce: string
  selectImagesForYourFoodItem: string
  imagesContentText: string
  imagesSubContentText: string

  required: string
  pleaseSelectAMood: string
  authorNameMustBeAtLeast2Characters: string
  quoteMustBeAtLeast10Characters: string
  recipeNameMustBeAtLeast2Characters: string
  descriptionMustBeAtLeast10Characters: string
  foodNameMustBeAtLeast2Characters: string
  pleaseSelectAShopCategory: string
}

export const defaultTranslations: translationsTypes = {
  addMoodTitle: "",
  allowMultiLang: "",
  english: "",
  french: "",
  selectLayout: "",
  selectLayoutType: "",
  quote: "",
  share: "",
  food: "",
  recipe: "",
  selectMood: "",
  quoteAuthor: "",
  enterQuoteQuthor: "",
  addTheQuoteHereInDetails: "",
  selectImagesForYourFoodItem: "",
  save: "",
  cancel: "",
  foodName: "",
  description: "",
  shopcategory: "",
  searchForFood: "",
  addDetailsInHere: "",
  selectShopCategory: "",
  searchForRecipe: "",
  sad: "",
  happy: "",
  angry: "",
  bakery: "",
  dairy: "",
  produce: "",
  Mood: "",
  imagesContentText: "",
  imagesSubContentText: "",

  required: "",
  pleaseSelectAMood: "",
  authorNameMustBeAtLeast2Characters: "",
  quoteMustBeAtLeast10Characters: "",
  recipeNameMustBeAtLeast2Characters: "",
  descriptionMustBeAtLeast10Characters: "",
  foodNameMustBeAtLeast2Characters: "",
  pleaseSelectAShopCategory: ""
}

export type LanguageCode = "en" | "fr"

interface QuoteData {
  mood?: string
  author?: string
  quote?: string
  share?: boolean
}

interface FoodData {
  mood?: string
  foodName?: string
  description?: string
  shopCategory?: string
  image?: string
}

interface RecipeData {
  mood?: string
  recipe?: string
  description?: string
  image?: string
}

export interface TranslationsData {
  quoteData?: Record<LanguageCode, QuoteData>
  foodData?: Record<LanguageCode, FoodData>
  recipeData?: Record<LanguageCode, RecipeData>
}

export interface AddMoodRequestBody {
  allowMultiLang?: boolean
  status?: boolean
  activeLang?: LanguageCode
  activeTab?: "Quote" | "Food" | "Recipe"
  translationsData?: TranslationsData
}
