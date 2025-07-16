import type {
  AddStoreRequestBody,
  IngAndCatDataType
} from "../types/storeTypes"

// Transform store data to API request format
export function transformStoreDataToApiRequest(
  storeData: any,
  activeLang: "en" | "fr",
  allowMultiLang: boolean
): AddStoreRequestBody {
  const enData = storeData.en || storeData
  const frData = storeData.fr || storeData.en || storeData

  // Transform availData to ingAndCatData format
  const ingAndCatData: IngAndCatDataType[] = []

  // Handle availData from both English and French data
  const availDataToProcess = enData.availData || []
  const frAvailData = allowMultiLang ? frData.availData || [] : []

  if (Array.isArray(availDataToProcess)) {
    availDataToProcess.forEach((item: any) => {
      // Find the corresponding French item by ID
      const frItem = allowMultiLang
        ? frAvailData.find((frItem: any) => frItem.id === item.id)
        : null

      const transformedItem: IngAndCatDataType = {
        id: item.id || Date.now(),
        name: item.name || "",
        nameFR: allowMultiLang && frItem ? frItem.name : item.name || "",
        type: item.type?.toLowerCase() || "category",
        typeFR:
          allowMultiLang && frItem
            ? frItem.type?.toLowerCase() === "ingredient"
              ? "ingrédient"
              : frItem.type?.toLowerCase() === "category"
              ? "catégorie"
              : frItem.type?.toLowerCase()
            : item.type?.toLowerCase() === "ingredient"
            ? "ingrédient"
            : "catégorie",
        availability:
          item.status === "Active" || item.availability === true || true,
        display: item.display !== false
      }

      ingAndCatData.push(transformedItem)
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
    categoryFR: frData?.category || enData.category || "",
    storeLocation: enData.storeLocation || "",
    shopStatus: enData.shopStatus !== undefined ? enData.shopStatus : true,
    deliverible: enData.deliverible !== undefined ? enData.deliverible : false,
    storeMapLocation: enData.storeMapLocation || enData.storeLocation || "",
    startTime: enData.timeFrom || enData.startTime || "08:00",
    endTime: enData.timeTo || enData.endTime || "18:00",
    storeType: enData.storeType || "physical",
    storeTypeFR: frData?.storeType || getStoreTypeFR(enData.storeType),
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
    descriptionFR: frData?.about || enData.about || enData.description || "",
    storeImage: enData.storeImage || "",
    ingAndCatData
  }
}
