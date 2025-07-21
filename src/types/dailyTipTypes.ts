export interface translationsTypes {
  addDailyTipTitle: string
  allowMultiLang: string
  english: string
  french: string
  selectLayoutType: string
  basicForm: string
  shopPromote: string
  videoForm: string
  layoutSelection: string
  whenTobeDisplayed: string
  pickADate: string
  concern: string
  selectConcern: string
  share: string
  title: string
  giveATipTitle: string
  subTitleOne: string
  subDescriptionOne: string
  describeInDetail: string
  subTitleTwo: string
  subDescriptionTwo: string
  uploadImages: string
  selectImagesForYourFoodItem: string
  save: string
  cancel: string
  shopName: string
  enterShopName: string
  reasonToDisplay: string
  selectReason: string
  shopLocation: string
  enterShopLocation: string
  shopCategory: string
  enterShopCategory: string
  subDescription: string
  mobileNumber: string
  email: string
  mapsPin: string
  enterGoogleMapsLocation: string
  facebook: string
  enterFacebookURL: string
  instagram: string
  enterInstagramURL: string
  website: string
  enterWebsiteURL: string
  selectFeaturedIngredients: string
  searchForIngredients: string
  add: string
  cantFindtheIngredientDescription: string
  enterTitle: string
  subTitle: string
  enterSubTitle: string
  videoLink: string
  enterTheVideoLink: string
  depression: string
  anxiety: string
  stress: string

  required: string
  titleMustBeAtLeast2Characters: string
  subTitleOneMustBeAtLeast2Characters: string
  subDescriptionOneMustBeAtLeast10Characters: string
  subDescriptionOneMustNotExceed500Characters: string
  subTitleTwoMustBeAtLeast2Characters: string
  subDescriptionTwoMustBeAtLeast10Characters: string
  subDescriptionTwoMustNotExceed500Characters: string
  pleaseSelectAConcern: string
  pleaseSelectAReasonToDisplay: string
  subDescriptionMustBeAtLeast10CharactersLong: string
  invalidMobileNumberFormat: string
  invalidEmailAddress: string
  invalidFacebookURL: string
  invalidInstagramURL: string
  invalidWebsiteURL: string
  invalidURLFormat: string
  atLeastOneIngredientCategoryMustBeAdded: string
  subDescriptioMustBeAtLeast10Characters: string
  subTitlMustBeAtLeast2Characters: string
}

export const defaultTranslations: translationsTypes = {
  addDailyTipTitle: "",
  allowMultiLang: "",
  english: "",
  french: "",
  selectLayoutType: "",
  basicForm: "",
  shopPromote: "",
  videoForm: "",
  layoutSelection: "",
  whenTobeDisplayed: "",
  pickADate: "",
  concern: "",
  selectConcern: "",
  title: "",
  giveATipTitle: "",
  subTitleOne: "",
  subDescriptionOne: "",
  describeInDetail: "",
  subTitleTwo: "",
  subDescriptionTwo: "",
  share: "",
  uploadImages: "",
  selectImagesForYourFoodItem: "",
  save: "",
  cancel: "",
  shopName: "",
  enterShopName: "",
  reasonToDisplay: "",
  selectReason: "",
  shopLocation: "",
  enterShopLocation: "",
  shopCategory: "",
  enterShopCategory: "",
  subDescription: "",
  mobileNumber: "",
  email: "",
  mapsPin: "",
  enterGoogleMapsLocation: "",
  facebook: "",
  enterFacebookURL: "",
  instagram: "",
  enterInstagramURL: "",
  website: "",
  enterWebsiteURL: "",
  selectFeaturedIngredients: "",
  searchForIngredients: "",
  add: "",
  cantFindtheIngredientDescription: "",
  enterTitle: "",
  subTitle: "",
  enterSubTitle: "",
  videoLink: "",
  enterTheVideoLink: "",
  depression: "",
  anxiety: "",
  stress: "",

  required: "",
  titleMustBeAtLeast2Characters: "",
  subTitleOneMustBeAtLeast2Characters: "",
  subDescriptionOneMustBeAtLeast10Characters: "",
  subDescriptionOneMustNotExceed500Characters: "",
  subTitleTwoMustBeAtLeast2Characters: "",
  subDescriptionTwoMustBeAtLeast10Characters: "",
  subDescriptionTwoMustNotExceed500Characters: "",
  pleaseSelectAConcern: "",
  pleaseSelectAReasonToDisplay: "",
  subDescriptionMustBeAtLeast10CharactersLong: "",
  invalidMobileNumberFormat: "",
  invalidEmailAddress: "",
  invalidFacebookURL: "",
  invalidInstagramURL: "",
  invalidWebsiteURL: "",
  invalidURLFormat: "",
  atLeastOneIngredientCategoryMustBeAdded: "",
  subDescriptioMustBeAtLeast10Characters: "",
  subTitlMustBeAtLeast2Characters: ""
}

export interface BasicForm {
  id?: number
  subTitleOne?: string
  subTitleOneFR?: string
  subDescOne?: string
  subDescOneFR?: string
  subTitleTwo?: string
  subTitleTwoFR?: string
  subDescTwo?: string
  subDescTwoFR?: string
  share?: boolean
  image?: string
}

export interface ShopPromoteFood {
  id?: number
  name?: string
  nameFR?: string
  status?: boolean
  display?: boolean
}

export interface ShopPromote {
  id?: number
  reason?: string
  reasonFR?: string
  name?: string
  location?: string
  locationLat?: number
  locationLng?: number
  category?: string
  categoryFR?: string
  desc?: string
  descFR?: string
  phoneNumber?: string
  email?: string
  mapsPin?: string
  facebook?: string
  instagram?: string
  website?: string
  image?: string
  shopPromoteFoods?: ShopPromoteFood[]
}

export interface VideoForm {
  id?: number
  subTitle?: string
  subTitleFR?: string
  subDesc?: string
  subDescFR?: string
  videoUrl?: string
}

export interface AddDailyTipTypes {
  id?: number
  allowMultiLang: boolean
  concern: string
  title: string
  titleFR: string
  type: string
  typeFR: string
  status: boolean
  basicForm: BasicForm | null
  shopPromote: ShopPromote | null
  videoForm: VideoForm | null
}

export interface EditDailyTipTypes {
  id?: number
  allowMultiLang?: boolean
  concern?: string
  concernFR?: string
  title?: string
  titleFR?: string
  type?: string
  typeFR?: string
  status?: boolean
  basicForm?: BasicForm | null
  shopPromote?: ShopPromote | null
  videoForm?: VideoForm | null
}
