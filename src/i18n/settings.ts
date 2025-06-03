export const fallbackLng = 'en'
export const languages = [fallbackLng, 'de']
export const defaultNS = 'translation'

export function getOptions (lng = fallbackLng, ns = defaultNS): {
  supportedLngs: typeof languages
  fallbackLng: string
  lng: string
  fallbackNS: typeof defaultNS
  defaultNS: typeof defaultNS
  ns: string
} {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}
