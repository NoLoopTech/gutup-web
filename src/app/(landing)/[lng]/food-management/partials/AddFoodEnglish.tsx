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

interface AddFoodEnglishProps {
  selectionRef: React.Ref<RichTextEditorHandle>;
  preparationRef: React.Ref<RichTextEditorHandle>;
  conservationRef: React.Ref<RichTextEditorHandle>;
  categories: Array<{ value: string; label: string }>;
  seasons: Array<{ value: string; label: string }>;
  countries: Array<{ value: string; label: string }>;
}

export default function AddFoodEnglish({
  selectionRef,
  preparationRef,
  conservationRef,
  categories,
  seasons,
  countries
}: AddFoodEnglishProps): JSX.Element {
  return (
    <TabsContent value="english">
      {/* English Tab Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label className="text-black mb-1 block">Name</Label>
          <Input placeholder="Enter food name" />
        </div>
        <div>
          <Label className="text-black mb-1 block">Category</Label>
          <Input
            id="categorySelect"
            name="categorySelect"
            options={categories}
            placeholder="Select category"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-black mb-1 block">Season</Label>
          <Input
            id="seasonSelect"
            name="seasonSelect"
            options={seasons}
            placeholder="Select season"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-black mb-1 block">Country</Label>
          <Input
            id="countrySelect"
            name="vSelect"
            options={countries}
            placeholder="Select Country"
            className="mt-1"
          />
        </div>
      </div>

      <Separator className="my-4" />

      <h3 className="text-lg font-semibold mb-4 text-black">
        Food Attributes
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label className="text-black mb-1 block">Fiber</Label>
          <Input placeholder="Provider details if applicable" />
        </div>
        <div>
          <Label className="text-black mb-1 block">Proteins</Label>
          <Input placeholder="Provider details if applicable" />
        </div>
        <div>
          <Label className="text-black mb-1 block">Vitamins</Label>
          <Input placeholder="Provider details if applicable" />
        </div>
        <div>
          <Label className="text-black mb-1 block">Minerals</Label>
          <Input placeholder="Provider details if applicable" />
        </div>
        <div>
          <Label className="text-black mb-1 block">Fat</Label>
          <Input placeholder="Provider details if applicable" />
        </div>
        <div>
          <Label className="text-black mb-1 block">Sugar</Label>
          <Input placeholder="Provider details if applicable" />
        </div>
        <div
          className="col-span-1 sm:col-span-2 md:col-span-1"
          style={{ width: '100%' }}
        >
          <LableInput
            title="Health Benefits"
            placeholder="Add up to 6 food benefits or lower"
            benefits={[]}
          />
        </div>
      </div>

      <Separator className="my-4" />

      <h3 className="text-lg font-semibold mb-4 text-black">
        Describe the Food
      </h3>
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-black text-sm mb-2 block">
            Selection
          </span>
          <RichTextEditor ref={selectionRef} />
        </div>
        <div>
          <span className="text-black text-sm mb-2 block">
            Preparation
          </span>
          <RichTextEditor ref={preparationRef} />
        </div>
        <div>
          <span className="text-black text-sm mb-2 block">
            Conservation
          </span>
          <RichTextEditor ref={conservationRef} />
        </div>
      </div>

      <div className="mt-6 w-full sm:w-2/5">
        <h3 className="text-lg font-semibold mb-4 text-black">
          Upload Images
        </h3>
        <ImageUploader title="Select Images for your food item" />
      </div>
    </TabsContent>
  );
}