"use client"

import React from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import dynamic from "next/dynamic"
import type { RichTextEditorHandle } from "@/components/Shared/TextEditor/RichTextEditor"
import LableInput from "@/components/Shared/LableInput/LableInput"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)

interface AddFoodEnglishProps {
  selectionRef: React.Ref<RichTextEditorHandle>
  preparationRef: React.Ref<RichTextEditorHandle>
  conservationRef: React.Ref<RichTextEditorHandle>
  categories: Array<{ value: string; label: string }>
  seasons: Array<{ value: string; label: string }>
  countries: Array<{ value: string; label: string }>
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
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Label className="block mb-1 text-black">Name</Label>
          <Input placeholder="Enter food name" />
        </div>
        <div>
          <Label className="block mb-1 text-black">Category</Label>
          <Select>
            <SelectTrigger id="categorySelect" name="categorySelect" className="w-full mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block mb-1 text-black">Season</Label>
          <Select>
            <SelectTrigger id="seasonSelect" name="seasonSelect" className="w-full mt-1">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block mb-1 text-black">Country</Label>
          <Select>
            <SelectTrigger id="countrySelect" name="countrySelect" className="w-full mt-1">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-2" />

      <h3 className="mb-4 text-lg font-semibold text-black">Food Attributes</h3>
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Label className="block mb-1 text-black">Fiber</Label>
          <Input placeholder="Provider details if applicable" />
        </div>
        <div>
          <Label className="block mb-1 text-black">Proteins</Label>
          <Input placeholder="Provider details if applicable" />
        </div>
        <div>
          <Label className="block mb-1 text-black">Vitamins</Label>
          <Input placeholder="Provider details if applicable" />
        </div>
        <div>
          <Label className="block mb-1 text-black">Minerals</Label>
          <Input placeholder="Provider details if applicable" />
        </div>
        <div>
          <Label className="block mb-1 text-black">Fat</Label>
          <Input placeholder="Provider details if applicable" />
        </div>
        <div>
          <Label className="block mb-1 text-black">Sugar</Label>
          <Input placeholder="Provider details if applicable" />
        </div>
        <div
          className="col-span-1 sm:col-span-2 md:col-span-1"
          style={{ width: "100%" }}
        >
          <LableInput
            title="Health Benefits"
            placeholder="Add up to 6 food benefits or lower"
            benefits={[]}
          />
        </div>
      </div>

      <Separator className="my-2" />

      <h3 className="mb-4 text-lg font-semibold text-black">
        Describe the Food
      </h3>
      <div className="flex flex-col gap-6">
        <div>
          <span className="block mb-2 text-sm text-black">Selection</span>
          <RichTextEditor ref={selectionRef} />
        </div>
        <div>
          <span className="block mb-2 text-sm text-black">Preparation</span>
          <RichTextEditor ref={preparationRef} />
        </div>
        <div>
          <span className="block mb-2 text-sm text-black">Conservation</span>
          <RichTextEditor ref={conservationRef} />
        </div>
      </div>

      <div className="w-full mt-6 sm:w-2/5 pb-6">
        <h3 className="mb-4 text-lg font-semibold text-black">Upload Images</h3>
        <ImageUploader title="Select Images for your food item" />
      </div>
    </TabsContent>
  )
}
