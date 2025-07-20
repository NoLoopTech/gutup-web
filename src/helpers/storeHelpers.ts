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
  const enAvailData = enData.availData || []
  const frAvailData = frData.availData || []

  if (Array.isArray(enAvailData)) {
    enAvailData.forEach((enItem: any, index: number) => {
      let frItem: any = null

      const itemId = enItem.ingOrCatId || enItem.id || 0

      if (itemId === 0) {
        frItem = frAvailData[index]
      } else {
        frItem = frAvailData.find(
          (frItem: any) => (frItem.ingOrCatId || frItem.id) === itemId
        )
      }

      const transformedItem: IngAndCatDataType = {
        ingOrCatId: itemId,
        name: enItem.name || "",
        nameFR: frItem ? frItem.name : enItem.name || "",
        type: enItem.type?.toLowerCase() || "category",
        typeFR:
          enItem.type?.toLowerCase() === "ingredient"
            ? "ingrédient"
            : enItem.type?.toLowerCase() === "category"
            ? "catégorie"
            : enItem.type?.toLowerCase() || "catégorie",
        availability:
          enItem.status === "Active" || enItem.availability === true || true,
        display: enItem.display !== false
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
    locationLat:
      enData.storeLocationLatLng?.lat || enData.locationLat || undefined,
    locationLng:
      enData.storeLocationLatLng?.lng || enData.locationLng || undefined,
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
