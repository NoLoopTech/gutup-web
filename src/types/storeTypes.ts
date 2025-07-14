export interface translationsTypes {
  [x: string]: string
  delete: string
  addNewStore: string
  viewStoreDetails: string
  allowMultiLang: string
  english: string
  french: string
  storeName: string
  enterStoreName: string
  category: string
  selectCategory: string
  storeLocation: string
  enterStoreLocation: string
  storeType: string
  selectStoreType: string
  storeMapLocation: string
  enterMapLocation: string
  subscription: string
  premium: string
  freemium: string
  time: string
  from: string
  to: string
  storeContact: string
  mobileNumber: string
  enterStoreNumber: string
  email: string
  enterStoreEmail: string
  mapsPin: string
  enterGoogleMapsLocation: string
  facebook: string
  enterFacebookUrl: string
  instagram: string
  enterInstagramUrl: string
  website: string
  enterWebsiteUrl: string
  availableProducts: string
  selectAvailableIngredients: string
  searchForIngredients: string
  selectAvailableCategories: string
  searchAvailableCategories: string
  add: string
  availableIngredientsAndCategories: string
  type: string
  availabilityStatus: string
  active: string
  inactive: string
  displayStatus: string
  aboutTheShop: string
  aboutUs: string
  uploadImages: string
  selectImagesForYourStore: string
  cancel: string
  save: string
  breakfast: string
  dinner: string
  dairy: string
  physical: string
  online: string
  ingredient: string

  required: string
  mustbeatleast2characters: string
  pleaseselectacategory: string
  pleaseselectaStoreType: string
  invalidmobilenumbereg0712345678or94712345678: string
  pleaseenteravalidemail: string
  invalidurlformat: string
  atleastoneingredientcategorymustbeadded: string
  formSubmittedSuccessfully: string
  phoneEmailAlreadyExists: string
  phoneAlreadyExists: string
  emailAlreadyExists: string
  storeCreationFailed: string
}

export const defaultTranslations: translationsTypes = {
  delete: "",
  addNewStore: "",
  viewStoreDetails: "",
  allowMultiLang: "",
  english: "",
  french: "",
  storeName: "",
  enterStoreName: "",
  category: "",
  selectCategory: "",
  storeLocation: "",
  enterStoreLocation: "",
  storeType: "",
  selectStoreType: "",
  storeMapLocation: "",
  enterMapLocation: "",
  subscription: "",
  premium: "",
  freemium: "",
  time: "",
  from: "",
  to: "",
  storeContact: "",
  mobileNumber: "",
  enterStoreNumber: "",
  email: "",
  enterStoreEmail: "",
  mapsPin: "",
  enterGoogleMapsLocation: "",
  facebook: "",
  enterFacebookUrl: "",
  instagram: "",
  enterInstagramUrl: "",
  website: "",
  enterWebsiteUrl: "",
  availableProducts: "",
  selectAvailableIngredients: "",
  searchForIngredients: "",
  selectAvailableCategories: "",
  searchAvailableCategories: "",
  add: "",
  availableIngredientsAndCategories: "",
  type: "",
  availabilityStatus: "",
  active: "",
  inactive: "",
  displayStatus: "",
  aboutTheShop: "",
  aboutUs: "",
  uploadImages: "",
  selectImagesForYourStore: "",
  cancel: "",
  save: "",
  breakfast: "",
  dinner: "",
  dairy: "",
  physical: "",
  online: "",
  ingredient: "",

  required: "",
  mustbeatleast2characters: "",
  pleaseselectacategory: "",
  pleaseselectaStoreType: "",
  invalidmobilenumbereg0712345678or94712345678: "",
  pleaseenteravalidemail: "",
  invalidurlformat: "",
  atleastoneingredientcategorymustbeadded: "",
  formSubmittedSuccessfully: "",

  // Add missing conflict error translations
  phoneEmailAlreadyExists: "",
  phoneAlreadyExists: "",
  emailAlreadyExists: "",
  storeCreationFailed: ""
}

// Define the structure for categories and ingredients
export interface CategoryIngredientItem {
  name: string
  nameFR: string
  type: string
  typeFR: string
  availability: boolean
  display: boolean
}

// Add interface for IngAndCatData
export interface IngAndCatDataType {
  id: number
  name: string
  nameFR: string
  type: string
  typeFR: string
  availability: boolean
  display: boolean
}

// Add interface for Store Management Data Type
export interface StoreManagementDataType {
  id?: number
  storeName: string
  storeLocation: string
  storeType: string
  phoneNumber: string
  email: string
  shopStatus: boolean
  ingredients: string
  subscriptionType: string
  ingAndCatData?: IngAndCatDataType[]
}

// Define the API request body interface according to swagger
export interface AddStoreRequestBody {
  storeName: string
  category: string
  categoryFR: string
  storeLocation: string
  shopStatus: boolean
  deliverible: boolean
  storeMapLocation: string
  startTime: string
  endTime: string
  storeType: string
  storeTypeFR: string
  subscriptionType: string
  subscriptionTypeFR: string
  phoneNumber: string
  email: string
  mapsPin: string
  facebook: string
  instagram: string
  website: string
  description: string
  descriptionFR: string
  storeImage: string
  categories: CategoryIngredientItem[]
  ingredients: CategoryIngredientItem[]
}

// Transform store data to API request format
export function transformStoreDataToApiRequest(
  storeData: any,
  activeLang: "en" | "fr",
  allowMultiLang: boolean
): AddStoreRequestBody {
  const enData = storeData.en || storeData
  const frData = storeData.fr || storeData.en || storeData

  // Transform availData to categories and ingredients
  const categories: CategoryIngredientItem[] = []
  const ingredients: CategoryIngredientItem[] = []

  // Handle availData from both English and French data
  const availDataToProcess = enData.availData || []
  const frAvailData = allowMultiLang ? frData.availData || [] : []

  if (Array.isArray(availDataToProcess)) {
    availDataToProcess.forEach((item: any, index: number) => {
      const frItem =
        allowMultiLang && frAvailData[index] ? frAvailData[index] : item

      const transformedItem: CategoryIngredientItem = {
        name: item.name || "",
        nameFR: allowMultiLang && frItem?.name ? frItem.name : item.name || "",
        type: item.type || "category",
        typeFR:
          allowMultiLang && frItem?.type
            ? frItem.type
            : item.type === "category"
            ? "catégorie"
            : item.type === "ingredient"
            ? "ingrédient"
            : item.type || "catégorie",
        availability:
          item.status === "Active" || item.availability === true || true,
        display: item.display !== false
      }

      if (item.type?.toLowerCase() === "category") {
        categories.push(transformedItem)
      } else if (item.type?.toLowerCase() === "ingredient") {
        ingredients.push(transformedItem)
      } else {
        categories.push(transformedItem)
      }
    })
  }

  // Helper function to get French translation for store type
  const getStoreTypeFR = (storeType: string): string => {
    switch (storeType?.toLowerCase()) {
      case "physical":
        return "physique"
      case "online":
        return "en ligne"
      default:
        return storeType || "physique"
    }
  }

  // Helper function to get subscription type translation
  const getSubscriptionTypeFR = (
    subscriptionType: string | boolean
  ): string => {
    if (typeof subscriptionType === "boolean") {
      return subscriptionType ? "premium" : "freemium"
    }
    return subscriptionType === "premium" ? "premium" : "freemium"
  }

  return {
    storeName: enData.storeName || "",
    category: enData.category || "",
    categoryFR:
      allowMultiLang && frData?.category
        ? frData.category
        : enData.category || "",
    storeLocation: enData.storeLocation || "",
    shopStatus: enData.shopStatus !== undefined ? enData.shopStatus : true,
    deliverible: enData.deliverible !== undefined ? enData.deliverible : false,
    storeMapLocation: enData.storeMapLocation || enData.storeLocation || "",
    startTime: enData.timeFrom || enData.startTime || "08:00",
    endTime: enData.timeTo || enData.endTime || "18:00",
    storeType: enData.storeType || "physical",
    storeTypeFR:
      allowMultiLang && frData?.storeType
        ? frData.storeType
        : getStoreTypeFR(enData.storeType),
    subscriptionType:
      typeof enData.subscriptionType === "boolean"
        ? enData.subscriptionType
          ? "premium"
          : "freemium"
        : enData.subscriptionType || "freemium",
    subscriptionTypeFR:
      allowMultiLang && frData?.subscriptionType !== undefined
        ? getSubscriptionTypeFR(frData.subscriptionType)
        : getSubscriptionTypeFR(enData.subscriptionType),
    phoneNumber: enData.phone || enData.phoneNumber || "",
    email: enData.email || "",
    mapsPin: enData.mapsPin || "",
    facebook: enData.facebook || "",
    instagram: enData.instagram || "",
    website: enData.website || "",
    description: enData.about || enData.description || "",
    descriptionFR:
      allowMultiLang && frData?.about
        ? frData.about
        : allowMultiLang && frData?.description
        ? frData.description
        : enData.about || enData.description || "",
    storeImage: enData.storeImage || "",
    categories,
    ingredients
  }
}
