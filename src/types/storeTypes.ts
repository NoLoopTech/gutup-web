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
  deliverible: string
  yes: string
  no: string

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
  deliverible: "",
  yes: "",
  no: "",

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
  ingOrCatId: number
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
  ingredients?: IngAndCatDataType[]
  categories?: IngAndCatDataType[]
  subscriptionType: string
  ingAndCatData?: IngAndCatDataType[]
  deliverible?: boolean
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
  locationLat?: number
  locationLng?: number
  mapsPin: string
  facebook: string
  instagram: string
  website: string
  description: string
  descriptionFR: string
  storeImage: string
  ingAndCatData: IngAndCatDataType[]
}

// Add interface for Shop Status Data Type
export interface shopStatusDataType {
  id?: number
  shopStatus: boolean
}
