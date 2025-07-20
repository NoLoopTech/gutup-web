export interface translationsTypes {
  addNewRecipe: string
  allowMultiLang: string
  english: string
  french: string
  name: string
  enterFoodName: string
  category: string
  selectCategory: string
  season: string
  selectSeason: string
  preparation: string
  howLongDoesItTakeToMake: string
  rest: string
  howLongToKeepItResting: string
  persons: string
  numberOfPeopleTheMealServes: string
  healthBenefits: string
  addUpTo6FoodBenefitsOrLower: string
  recipeAttributes: string
  ingredientsSelection: string
  selectYourIngredients: string
  searchForIngredient: string
  add: string
  ingredientName: string
  quantity: string
  mainIngredient: string
  availableInIngredients: string
  availabilityStatus: string
  inTheSystem: string
  addToIngredients: string
  describeTheRecipe: string
  recipe: string
  addAuthor: string
  addAuthorName: string
  enterAuthorSpecialty: string
  phone: string
  enterAuthorNumber: string
  email: string
  enterAuthorEmail: string
  website: string
  enterAuthorWebSite: string
  uploadAuthorImage: string
  selectImagesForYourFoodItem: string
  uploadImages: string
  linkedFood: string
  recipeImage: string
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

  required: string
  mustbeatleast2characters: string
  pleaseselectacategory: string
  pleaseselectaseason: string
  pleaseenteratleastonebenefit: string
  atleastoneingredientcategorymustbeadded: string
  invalidmobilenumbereg0712345678or94712345678: string
  pleaseenteravalidemail: string
  invalidurlformat: string
  formSubmittedSuccessfully: string
}

export const defaultTranslations: translationsTypes = {
  addNewRecipe: "",
  allowMultiLang: "Allow Multi-Language",
  english: "English",
  french: "French",
  name: "",
  enterFoodName: "",
  category: "",
  selectCategory: "",
  season: "",
  selectSeason: "",
  preparation: "",
  howLongDoesItTakeToMake: "",
  rest: "",
  howLongToKeepItResting: "",
  persons: "",
  numberOfPeopleTheMealServes: "",
  healthBenefits: "",
  addUpTo6FoodBenefitsOrLower: "",
  recipeAttributes: "",
  ingredientsSelection: "",
  selectYourIngredients: "",
  searchForIngredient: "",
  add: "",
  ingredientName: "",
  quantity: "",
  mainIngredient: "",
  availableInIngredients: "",
  availabilityStatus: "",
  inTheSystem: "",
  addToIngredients: "",
  describeTheRecipe: "",
  recipe: "",
  addAuthor: "",
  addAuthorName: "",
  enterAuthorSpecialty: "",
  phone: "",
  enterAuthorNumber: "",
  email: "",
  enterAuthorEmail: "",
  website: "",
  enterAuthorWebSite: "",
  uploadAuthorImage: "",
  selectImagesForYourFoodItem: "",
  uploadImages: "",
  linkedFood: "",
  recipeImage: "",
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

  required: "",
  mustbeatleast2characters: "",
  pleaseselectacategory: "",
  pleaseselectaseason: "",
  pleaseenteratleastonebenefit: "",
  atleastoneingredientcategorymustbeadded: "",
  invalidmobilenumbereg0712345678or94712345678: "",
  pleaseenteravalidemail: "",
  invalidurlformat: "",
  formSubmittedSuccessfully: ""
}

// rercipe types
// Ingredient type
interface Ingredient {
  ingredientName: string
  ingredientNameFR: string
  quantity: string
  quantityFR: string
  mainIngredient: boolean
  foodId: number
  available: boolean
}

// Health Benefit type
interface HealthBenefit {
  healthBenefit: string
  healthBenefitFR: string
}

// Author type
interface Author {
  authorName: string
  authorCategory: string
  authorCategoryFR: string
  authorPhone: string
  authorEmail: string
  authorWebsite: string
  authorImage: string
}

// Attribute type
interface RecipeAttributes {
  preparation: string
  preparationFR: string
  rest: string
  restFR: string
  persons: number
}

// Description type
interface RecipeDescription {
  description: string
  descriptionFR: string
}

// Image type
interface RecipeImage {
  imageUrl: string
}

// Main Recipe type
export interface NewRecipeTypes {
  name: string
  nameFR: string
  category: string
  categoryFR: string
  season: string
  seasonFR: string
  isActive: boolean
  allowMultiLang: boolean
  attribute: RecipeAttributes
  describe: RecipeDescription
  images: RecipeImage[]
  healthBenefits: HealthBenefit[]
  author: Author
  ingredients: Ingredient[]
}
