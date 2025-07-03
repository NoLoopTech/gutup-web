export interface translationsTypes {
  addNewTag: string
  allowMultiLang: string
  tagName: string
  english: string
  french: string
  giveATagName: string
  cancel: string
  save: string

  pleaseSelectACategory: string
  required: string
  tagNameMustBeAtLeast2Characters: string
}

export const defaultTranslations: translationsTypes = {
  addNewTag: "Add New Tag",
  allowMultiLang: "Allow Multi Lang",
  tagName: "Tag Name",
  english: "English",
  french: "Français",
  giveATagName: "Give a Tag Name",
  cancel: "Cancel",
  save: "Save",

  pleaseSelectACategory: "Please select a category",
  required: "Required",
  tagNameMustBeAtLeast2Characters: "Tag name must be at least 2 characters"
}
