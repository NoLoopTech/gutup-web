"use client"

import React, { useRef } from "react"
import { DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import dynamic from "next/dynamic"
import type { RichTextEditorHandle } from "@/components/Shared/TextEditor/RichTextEditor"
import LableInput from "@/components/Shared/LableInput/LableInput"
import SearchBar from "@/components/Shared/SearchBar/SearchBar"
import { Button } from "@/components/ui/button"
import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CircleFadingPlus } from "lucide-react"
import CustomImage from "@/components/Shared/CustomImage/CustomImage"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
} from "@/components/ui/form"
import z from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const imageList = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
  "/images/6.jpg"
]

interface Ingredient {
  id: number
  name: string
  quantity: string
  isMain: boolean
  tags: string[]
}
interface Option {
  value: string
  label: string
}
interface Props {
  open: boolean
  onClose: () => void
}
const RecipeSchema = z.object({
  name: z
    .string()
    .nonempty("Obligatoire")
    .min(2, { message: "Doit comporter au moins 2 caractères" }),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  season: z.string().min(1, "Veuillez sélectionner une saison"),
  preparation: z.string().nonempty("Obligatoire"),
  rest: z.string().nonempty("Obligatoire"),
  persons: z.string().nonempty("Obligatoire"),
  benefits: z
    .array(z.string())
    .refine(arr => arr.some(item => item.trim().length > 0), {
      message: "Veuillez saisir au moins un bénéfice"
    }),
  ingredientData: z
    .array(z.unknown())
    .nonempty("Au moins un ingrédient/catégorie doit être ajouté."),
  authorName: z
    .string()
    .nonempty("Obligatoire")
    .min(2, { message: "Doit comporter au moins 2 caractères" }),
  authorCategory: z.string().min(1, "Veuillez sélectionner une catégorie"),
  phone: z
    .string()
    .nonempty("Obligatoire")
    .refine(val => /^\d{10}$/.test(val) || /^\+\d{11}$/.test(val), {
      message: "Numéro de téléphone invalide (ex : 0712345678 ou +33712345678)"
    }),
  email: z
    .string()
    .nonempty("Obligatoire")
    .email("Veuillez saisir un email valide."),
  website: z.string().url("Format d'URL invalide").optional().or(z.literal("")),
  recipe: z.string().refine(
    val => {
      const plainText = val.replace(/<(.|\n)*?>/g, "").trim()
      const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val)
      return plainText !== "" || hasImage
    },
    {
      message: "Obligatoire"
    }
  ),
  authorimage: z.custom<File | null>(val => val instanceof File, {
    message: "Obligatoire"
  }),
  foodimage: z.custom<File | null>(val => val instanceof File, {
    message: "Obligatoire"
  })
})

const onSubmit = (data: z.infer<typeof RecipeSchema>): void => {
  toast("Form submitted successfully!", {})
}
const handleCancel = (
  form: ReturnType<typeof useForm<z.infer<typeof RecipeSchema>>>
): void => {
  form.reset()
}
// Define function for handling RichTextEditor changes
const handleRichTextEditorChange = (field: any) => (val: string) => {
  field.onChange(val)
}

// Define function for handling image upload changes
const handleImageUpload = (field: any) => (files: File[] | null) => {
  field.onChange(files && files.length > 0 ? files[0] : null)
}

// Dummy data
const ingredientData: Ingredient[] = []

// Table columns
const ingredientColumns = [
  {
    header: "Ingredient Name",
    accessor: "name" as const
  },
  {
    header: "Quantity",
    accessor: "quantity" as const
  },
  {
    header: "Main Ingredient",
    accessor: (row: Ingredient) => (
      <Switch
        checked={row.isMain}
        className="scale-75"
        style={{ minWidth: 28, minHeight: 16 }}
      />
    )
  },
  {
    header: "Available in Ingredients",
    accessor: (row: Ingredient) =>
      row.tags.includes("InSystem") ? (
        <Badge className="bg-green-200 text-black text-xs px-2 py-1 rounded-md border border-green-500 hover:bg-green-100 transition-colors">
          In the System
        </Badge>
      ) : (
        <Button
          variant="ghost"
          className="text-secondary-blue text-xs px-2 py-1 flex items-center gap-1 hover:bg-transparent focus:bg-transparent active:bg-transparent"
          size="sm"
        >
          <CircleFadingPlus size={14} />
          Add to Ingredients
        </Button>
      )
  }
]

// Dynamically load RichTextEditor with SSR disabled
const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)

export default function AddRecipeFrench({ open, onClose }: Props): JSX.Element {
  const selectionRef = useRef<RichTextEditorHandle>(null)
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(5)

  // Define functions to handle page changes
  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  const categories: Option[] = [
    { value: "fruits", label: "Fruits" },
    { value: "vegetables", label: "Vegetables" },
    { value: "dairy", label: "Dairy" },
    { value: "grains", label: "Grains" }
  ]
  const seasons: Option[] = [
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "autumn", label: "Autumn" },
    { value: "winter", label: "Winter" }
  ]
  const authorSpeality: Option[] = [
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "autumn", label: "Autumn" }
  ]
  const form = useForm<z.infer<typeof RecipeSchema>>({
    resolver: zodResolver(RecipeSchema),
    defaultValues: {
      name: "",
      category: "",
      season: "",
      preparation: "",
      rest: "",
      persons: "",
      benefits: [],
      authorName: "",
      authorCategory: "",
      phone: "",
      email: "",
      website: "",
      recipe: "",
      authorimage: null,
      foodimage: null
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-6">
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="block mb-1 text-black">Nom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrez le nom de l'aliment"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-1 text-black">
                    Catégorie
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((option: Option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-1 text-black">
                    Saison
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Sélectionner une saison" />
                      </SelectTrigger>
                      <SelectContent>
                        {seasons.map((option: Option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <DialogTitle className="pt-4">Attributs de la recette</DialogTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 mb-4">
          <div>
            <FormField
              control={form.control}
              name="preparation"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="block mb-1 text-black">
                    Préparation
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Combien de temps faut-il pour préparer ?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="rest"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="block mb-1 text-black">Repos</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Combien de temps faut-il laisser reposer ?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="persons"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="block mb-1 text-black">
                    Personnes
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre de personnes servies par le plat"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Lable inputs for the health benefits */}
        <div className="w-[100%] ">
          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <LableInput
                title="Bénéfices pour la santé"
                placeholder="Ajoutez jusqu'à 6 bénéfices alimentaires ou moins"
                benefits={field.value || []}
                name="benefits"
                width="w-[32%]"
              />
            )}
          />
        </div>

        <Separator className="my-4" />

        <DialogTitle>Ingredients Selection</DialogTitle>

        <div className="flex flex-row gap-2 items-center pt-4 mb-4">
          <div className="flex-1">
            <SearchBar
              title="Sélectionnez vos ingrédients"
              placeholder="Rechercher un ingrédient"
            />
          </div>
          <div className="flex items-end h-full mt-7">
            <Button onClick={() => {}}>Ajouter</Button>
          </div>
        </div>
        <FormField
          control={form.control}
          name="ingredientData"
          render={({ field }) => (
            <>
              <CustomTable
                columns={ingredientColumns}
                data={ingredientData.slice(
                  (page - 1) * pageSize,
                  page * pageSize
                )}
                page={page}
                pageSize={pageSize}
                totalItems={ingredientData.length}
                pageSizeOptions={[1, 5, 10]}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
              {ingredientData.length === 0 && (
                <FormMessage className="text-red-500">
                  At least one ingredient/category must be added.
                </FormMessage>
              )}
            </>
          )}
        />

        <Separator className="my-4" />

        <DialogTitle>Décrire la recette</DialogTitle>
        <div className="flex flex-col gap-6 pt-4 pb-2">
          <div>
            <FormField
              control={form.control}
              name="recipe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2 text-black">
                    Recette
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      ref={selectionRef}
                      value={field.value}
                      onChange={handleRichTextEditorChange(field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator className="my-4" />

        <DialogTitle>Ajouter un auteur</DialogTitle>

        <div className="flex flex-col sm:flex-row gap-8 mb-4 pt-4 items-start">
          {/* Left: Author Inputs */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full">
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">Nom</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le nom de l'auteur"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="authorCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      Catégorie
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Sélectionner une spécialité de l'auteur" />
                        </SelectTrigger>
                        <SelectContent>
                          {authorSpeality.map((option: Option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      Téléphone
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le numéro de l'auteur"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez l'email de l'auteur"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      Site web
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le site web de l'auteur"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Right: Image Uploader */}
          <div className="w-full sm:w-2/5 ">
            <FormField
              control={form.control}
              name="authorimage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      title="Télécharger l'image de l'auteur"
                      onChange={handleImageUpload(field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogTitle>Télécharger des images</DialogTitle>

        <div className="mt-6 pb-2 w-full sm:w-2/5">
          <FormField
            control={form.control}
            name="foodimage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    title="Télécharger l'image de l'aliment"
                    onChange={handleImageUpload(field)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-4" />
        <DialogTitle>Aliment lié</DialogTitle>
        <div className="pb-6">
          <CustomImage
            srcList={imageList}
            count={5}
            maxCount={6}
            text="Image de la recette"
            width={80}
            height={80}
          />
        </div>
        <DialogFooter>
          {/* Save and Cancel buttons */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t py-4 px-4 flex justify-between gap-2 z-50">
            <Button
              variant="outline"
              onClick={() => {
                handleCancel(form)
              }}
            >
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  )
}
