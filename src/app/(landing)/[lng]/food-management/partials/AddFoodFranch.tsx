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

const RichTextEditor = dynamic(
  async () => await import('@/components/Shared/TextEditor/RichTextEditor'),
  { ssr: false }
);

interface AddFoodFrenchProps {
  selectionRef: React.Ref<RichTextEditorHandle>;
  preparationRef: React.Ref<RichTextEditorHandle>;
  conservationRef: React.Ref<RichTextEditorHandle>;
  categories: Array<{ value: string; label: string }>;
  seasons: Array<{ value: string; label: string }>;
  countries: Array<{ value: string; label: string }>;
}

export default function AddFoodFrench({
  selectionRef,
  preparationRef,
  conservationRef,
  categories,
  seasons,
  countries
}: AddFoodFrenchProps): JSX.Element {
  return (
    <TabsContent value="french">
      {/* French Tab Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label className="text-black mb-1 block">Nom</Label>
          <Input placeholder="Entrez le nom de l'aliment" />
        </div>
        <div>
          <Label className="text-black mb-1 block">Catégorie</Label>
          <Input
            id="categorySelect"
            name="categorySelect"
            options={categories}
            placeholder="Sélectionner une catégorie"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-black mb-1 block">Saison</Label>
          <Input
            id="seasonSelect"
            name="seasonSelect"
            options={seasons}
            placeholder="Sélectionner une saison"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-black mb-1 block">Pays</Label>
          <Input
            id="countrySelect"
            name="vSelect"
            options={countries}
            placeholder="Sélectionner un comptoir"
            className="mt-1"
          />
        </div>
      </div>

      <Separator className="my-4" />

      <h3 className="text-lg font-semibold mb-4 text-black">
        Attributs alimentaires
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label className="text-black mb-1 block">Fibres</Label>
          <Input placeholder="Détails du fournisseur si applicable" />
        </div>
        <div>
          <Label className="text-black mb-1 block">Protéines</Label>
          <Input placeholder="Détails du fournisseur si applicable" />
        </div>
        <div>
          <Label className="text-black mb-1 block">Vitamines</Label>
          <Input placeholder="Détails du fournisseur si applicable" />
        </div>
        <div>
          <Label className="text-black mb-1 block">Minéraux</Label>
          <Input placeholder="Détails du fournisseur si applicable" />
        </div>
        <div>
          <Label className="text-black mb-1 block">Graisses</Label>
          <Input placeholder="Détails du fournisseur si applicable" />
        </div>
        <div>
          <Label className="text-black mb-1 block">Sucres</Label>
          <Input placeholder="Détails du fournisseur si applicable" />
        </div>
        <div
          className="col-span-1 sm:col-span-2 md:col-span-1"
          style={{ width: '100%' }}
        >
          <LableInput
            title="Bienfaits pour la santé"
            placeholder="Add up to 6 food benefits or lower"
            benefits={[]}
          />
        </div>
      </div>

      <Separator className="my-4" />

      <h3 className="text-lg font-semibold mb-4 text-black">
        Décrire l'aliment
      </h3>
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-black text-sm mb-2 block">Sélection</span>
          <RichTextEditor ref={selectionRef} />
        </div>
        <div>
          <span className="text-black text-sm mb-2 block">Préparation</span>
          <RichTextEditor ref={preparationRef} />
        </div>
        <div>
          <span className="text-black text-sm mb-2 block">Conservation</span>
          <RichTextEditor ref={conservationRef} />
        </div>
      </div>

      <div className="mt-6 w-full sm:w-2/5">
        <h3 className="text-lg font-semibold mb-4 text-black">
          Télécharger des images
        </h3>
        <ImageUploader title="Sélectionnez des images pour votre aliment" />
      </div>
    </TabsContent>
  );
}