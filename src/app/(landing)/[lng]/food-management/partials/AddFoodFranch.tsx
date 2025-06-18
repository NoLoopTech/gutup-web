'use client';

import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import ImageUploader from '@/components/Shared/ImageUploder/ImageUploader';
import dynamic from 'next/dynamic';
import type { RichTextEditorHandle } from '@/components/Shared/TextEditor/RichTextEditor';
import LableInput from '@/components/Shared/LableInput/LableInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { toast } from 'sonner';

const RichTextEditor = dynamic(
  async () => await import('@/components/Shared/TextEditor/RichTextEditor'),
  { ssr: false }
);

interface Option {
  value: string
  label: string
}

interface AddFoodFrenchProps {
  selectionRef: React.Ref<RichTextEditorHandle>;
  preparationRef: React.Ref<RichTextEditorHandle>;
  conservationRef: React.Ref<RichTextEditorHandle>;
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
const countries: Option[] = [
  { value: "switzerland", label: "Switzerland" },
  { value: "france", label: "France" },
  { value: "germany", label: "Germany" },
  { value: "italy", label: "Italy" }
]
const FoodSchema = z.object({
  name: z.string()
    .nonempty("Nom requis")
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  category: z.string().nonempty("Veuillez sélectionner une catégorie"),
  season: z.string().nonempty("Veuillez sélectionner une saison"),
  country: z.string().nonempty("Veuillez sélectionner un pays"),
  fiber: z.string().optional(),
  proteins: z.string().optional(),
  vitamins: z.string().optional(),
  minerals: z.string().optional(),
  fat: z.string().optional(),
  sugar: z.string().optional(),
  image: z.custom<File | null>((val) => val instanceof File, {
    message: "Image requise"
  }),
  selection: z.string()
    .refine((val) => {
      const plainText = val.replace(/<(.|\n)*?>/g, '').trim(); // remove all tags
      const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val); // check for <img> tags
      return plainText !== '' || hasImage;
    }, {
      message: "Sélection requise",
    }),
  preparation: z.string()
    .refine((val) => {
      const plainText = val.replace(/<(.|\n)*?>/g, '').trim();
      const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val);
      return plainText !== '' || hasImage;
    }, {
      message: "Préparation requise",
    }),
  conservation: z.string()
    .refine((val) => {
      const plainText = val.replace(/<(.|\n)*?>/g, '').trim();
      const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val);
      return plainText !== '' || hasImage;
    }, {
      message: "Conservation requise",
    }),
});

const onSubmit = (data: z.infer<typeof FoodSchema>): void => {
  toast("Formulaire soumis avec succès!", {})
};

export default function AddFoodFrench({
  selectionRef,
  preparationRef,
  conservationRef,

}: AddFoodFrenchProps): JSX.Element {

  const form = useForm<z.infer<typeof FoodSchema>>({
    resolver: zodResolver(FoodSchema),
    defaultValues: {
      name: '',
      category: '',
      season: '',
      country: '',
      fiber: '',
      proteins: '',
      vitamins: '',
      minerals: '',
      fat: '',
      sugar: '',
      image: null,
      selection: '',
      preparation: '',
      conservation: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <TabsContent value="french">
          {/* French Tab Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block mb-1 text-black">Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom de l'aliment" {...field} />
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
                    <FormLabel className="block mb-1 text-black">Catégorie</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((option) => (
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
                    <FormLabel className="block mb-1 text-black">Saison</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Sélectionner une saison" />
                        </SelectTrigger>
                        <SelectContent>
                          {seasons.map((option) => (
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-1 text-black">Pays</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Sélectionner un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((option) => (
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

          <Separator className="my-2" />

          <h3 className="mb-4 text-lg font-semibold text-black">Attributs alimentaires</h3>
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <Label className="block mb-1 text-black">Fibres</Label>
              <Input placeholder="Détails du fournisseur si applicable" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Protéines</Label>
              <Input placeholder="Détails du fournisseur si applicable" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Vitamines</Label>
              <Input placeholder="Détails du fournisseur si applicable" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Minéraux</Label>
              <Input placeholder="Détails du fournisseur si applicable" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Graisses</Label>
              <Input placeholder="Détails du fournisseur si applicable" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Sucres</Label>
              <Input placeholder="Détails du fournisseur si applicable" />
            </div>
            <div
              className="col-span-1 sm:col-span-2 md:col-span-1"
              style={{ width: '100%' }}
            >
              <LableInput
                title="Bienfaits pour la santé"
                placeholder="Ajoutez jusqu'à 6 bienfaits pour la santé ou moins"
                benefits={[]}
              />
            </div>
          </div>

          <Separator className="my-2" />

          <h3 className="mb-4 text-lg font-semibold text-black">Décrire l'aliment</h3>
          <div className="flex flex-col gap-6">
            <div>
              <FormField
                control={form.control}
                name="selection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-2 text-black">Sélection</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        ref={selectionRef}
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val)
                        }}
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
                name="preparation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-2 text-black">Préparation</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        ref={preparationRef}
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val)
                        }}
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
                name="conservation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block mb-2 text-black">Conservation</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        ref={conservationRef}
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-full mt-6 sm:w-2/5 pb-12">
            <h3 className="mb-4 text-lg font-semibold text-black">Télécharger des images</h3>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      title="Sélectionner des images pour votre aliment"
                      onChange={(file) => {
                        field.onChange(file)
                        form.clearErrors("image")
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Save and Cancel buttons */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-4 flex justify-between gap-2 z-50">
            <Button variant="outline" onClick={() => { form.reset(); }}>
              Annuler
            </Button>
            <Button type="submit">Sauvegarder</Button>
          </div>
        </TabsContent>
      </form>
    </Form>
  )
}
