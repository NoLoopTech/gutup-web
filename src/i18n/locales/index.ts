// Utility to load the JSON language files dynamically based on the selected language
export const loadLanguage = async (
  lang: "en" | "de",
  contentType: "moods" | "dailyTip"
) => {
  try {
    const translations = await import(`./${lang}/${contentType}.json`)
    return translations
  } catch (err) {
    console.error(`Error loading language file for ${lang}: `, err)
    return {}
  }
}
