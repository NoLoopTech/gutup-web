"use client"

import React, { useRef } from "react"
import { DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import SearchBar from "@/components/Shared/SearchBar/SearchBar"
import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Badge } from "@/components/ui/badge"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)

interface Option {
  value: string
  label: string
}
interface Props {
  open: boolean
  onClose: () => void
}
interface AvailableItem {
  id: number
  name: string
  type: string
  status: "Active" | "Inactive"
  display: boolean
  tags: string[]
  quantity: string
  isMain: boolean
}

const categories: Option[] = [
  { value: "Breakfast", label: "Breakfast" },
  { value: "Dinner", label: "Dinner" },
  { value: "dairy", label: "Dairy" }
]

const shopStatus: Option[] = [
  { value: "physical", label: "physical" },
  { value: "Online", label: "Online" }
]

// Validation schema using Zod
const AddStoreSchema = z.object({
  storeName: z
    .string()
    .nonempty("Requis")
    .min(2, { message: "Doit comporter au moins 2 caractères" }),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  storeLocation: z.string().min(1, "Requis"),
  shopStatus: z.string().min(1, "Veuillez sélectionner un statut de boutique"),
  shoplocation: z.string().min(1, "Requis"),
  timeFrom: z.string().min(1, "Requis"),
  timeTo: z.string().min(1, "Requis"),
  phone: z
    .string()
    .nonempty("Requis")
    .refine(val => /^\d{10}$/.test(val) || /^\+\d{11}$/.test(val), {
      message: "Numéro de mobile invalide (ex : 0712345678 ou +94712345678)"
    }),
  email: z
    .string()
    .nonempty("Requis")
    .email("Veuillez saisir un email valide."),
  mapsPin: z.string().nonempty("Requis"),
  website: z.string().url("Format d'URL invalide").optional().or(z.literal("")),
  facebook: z
    .string()
    .url("Format d'URL invalide")
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .url("Format d'URL invalide")
    .optional()
    .or(z.literal("")),
  about: z.string().refine(
    val => {
      const plainText = val.replace(/<(.|\n)*?>/g, "").trim()
      const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val)
      return plainText !== "" || hasImage
    },
    {
      message: "Requis"
    }
  ),
  availData: z
    .array(z.unknown())
    .nonempty("Au moins un ingrédient/catégorie doit être ajouté."),
  storeImage: z.custom<File | null>(val => val instanceof File, {
    message: "Requis"
  })
})

const onSubmit = (data: z.infer<typeof AddStoreSchema>): void => {
  toast("Form submitted successfully!", {})
}
const handleCancel = (
  form: ReturnType<typeof useForm<z.infer<typeof AddStoreSchema>>>
): void => {
  form.reset()
}
// Define function for handling image upload changes
const handleImageUpload = (field: any) => (files: File[] | null) => {
  field.onChange(files && files.length > 0 ? files[0] : null)
}
// Define function for handling RichTextEditor changes
const handleRichTextEditorChange = (field: any) => (val: string) => {
  field.onChange(val)
}
export default function AddStoreFrench({ open, onClose }: Props): JSX.Element {
  const aboutRef = useRef<any>(null)
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

  const form = useForm<z.infer<typeof AddStoreSchema>>({
    resolver: zodResolver(AddStoreSchema),
    defaultValues: {
      storeName: "",
      category: "",
      storeLocation: "",
      shopStatus: "",
      shoplocation: "",
      timeFrom: "",
      timeTo: "",
      phone: "",
      email: "",
      mapsPin: "",
      website: "",
      facebook: "",
      instagram: "",
      about: "",
      availData: [],
      storeImage: null
    }
  })
  //  table data for available ingredients and categories
  const availData: AvailableItem[] = []

  const availColumns = [
    {
      header: "Available Ingredients & Categories",
      accessor: "name" as const
    },
    {
      header: "Type",
      accessor: (row: { type: string }) => (
        <Badge className="bg-white text-black text-xs px-2 py-1 rounded-md border border-gray-100 hover:bg-white">
          {row.type}
        </Badge>
      )
    },
    {
      header: "Availability Status",
      accessor: (row: AvailableItem) => (
        <Badge
          className={
            row.tags.includes("InSystem")
              ? "bg-green-200 text-black text-xs px-2 py-1 rounded-md border border-green-500 hover:bg-green-100 transition-colors"
              : "bg-gray-200 text-black text-xs px-2 py-1 rounded-md border border-gray-500 hover:bg-gray-100 transition-colors"
          }
        >
          {row.tags.includes("InSystem") ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      header: "Display Status",
      accessor: (row: AvailableItem) => (
        <Switch checked={row.display} className="scale-75" />
      )
    }
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="pb-6">
          {/* Store info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div>
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      Nom du magasin
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le nom du magasin"
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                name="storeLocation"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      Emplacement du magasin
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez l'emplacement du magasin"
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
                name="shopStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">
                      Statut de la boutique
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Sélectionner un statut de boutique" />
                        </SelectTrigger>
                        <SelectContent>
                          {shopStatus.map((option: Option) => (
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
                name="shoplocation"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      Emplacement sur la carte
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez l'emplacement sur la carte"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <Label className="text-black mb-1 block">Type de magasin</Label>
              <div className="flex items-center gap-4 mt-2">
                <Switch />
                <Label className="text-Primary-300">Magasin Premium</Label>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Heure</Label>
              <div className="flex gap-7 items-center">
                <div className="flex flex-col">
                  <Label htmlFor="time-from" className="text-xs text-gray-400">
                    De
                  </Label>
                  <FormField
                    control={form.control}
                    name="timeFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="time-to" className="text-xs text-gray-400">
                    À
                  </Label>
                  <FormField
                    control={form.control}
                    name="timeTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact info */}
          <DialogTitle className="pt-4">Contact du magasin</DialogTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 mb-6">
            <div>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      Numéro de mobile
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le numéro du magasin"
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
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez l'email du magasin"
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
                name="mapsPin"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      Épingle Google Maps
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez l'emplacement Google Maps"
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
                name="facebook"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      Facebook
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez l'URL Facebook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      Instagram
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez l'URL Instagram" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">
                      Site Web
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez l'URL du site Web"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Available Products */}
          <DialogTitle className="pt-4">Produits disponibles</DialogTitle>
          <div className="flex flex-col gap-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
              <div className="flex flex-row gap-2 items-center mb-2 flex-1">
                <div className="flex-1">
                  <SearchBar
                    title="Sélectionner les ingrédients disponibles"
                    placeholder="Rechercher des ingrédients"
                  />
                </div>
                <div className="flex items-end h-full mt-7">
                  <Button onClick={() => {}}>Add</Button>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center mb-2 flex-1">
                <div className="flex-1">
                  <SearchBar
                    title="Sélectionner les catégories disponibles"
                    placeholder="Rechercher des catégories disponibles"
                  />
                </div>
                <div className="flex items-end h-full mt-7">
                  <Button onClick={() => {}}>Add</Button>
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="availData"
              render={({ field }) => (
                <>
                  <CustomTable
                    columns={availColumns}
                    data={availData.slice(
                      (page - 1) * pageSize,
                      page * pageSize
                    )}
                    page={page}
                    pageSize={pageSize}
                    totalItems={availData.length}
                    pageSizeOptions={[1, 5, 10]}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                  {availData.length === 0 && (
                    <FormMessage className="text-red-500">
                      At least one ingredient/category must be added.
                    </FormMessage>
                  )}
                </>
              )}
            />
          </div>

          <Separator />

          {/* About The Shop */}
          <DialogTitle className="pt-4">À propos du magasin</DialogTitle>
          <div className="flex flex-col gap-6 pt-4 pb-6">
            <div>
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-2 text-black">
                      À propos de nous
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        ref={aboutRef}
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

          <Separator />

          {/* Upload Images */}
          <DialogTitle className="pt-4">Télécharger des images</DialogTitle>
          <div className="pt-4 w-full sm:w-2/5 pb-8">
            <FormField
              control={form.control}
              name="storeImage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      title="Sélectionnez des images pour votre magasin"
                      onChange={handleImageUpload(field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
