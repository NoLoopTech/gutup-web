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
import { FoodDetailsTypes } from "./ViewFoodPopUp"

const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)

interface ViewFoodEnglishProps {
  selectionRef: React.Ref<RichTextEditorHandle>
  preparationRef: React.Ref<RichTextEditorHandle>
  conservationRef: React.Ref<RichTextEditorHandle>
  foodDetails: FoodDetailsTypes | null
}

export default function ViewFoodEnglish({
  selectionRef,
  preparationRef,
  conservationRef,
  foodDetails
}: ViewFoodEnglishProps): JSX.Element {
  // handle change rich text editor
  const handleContentChange = (newContent: string) => {
    console.log(newContent)
  }

  return (
    <TabsContent value="english">
      {/* English Tab Content */}
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Label className="block mb-1 text-black">Name</Label>
          <Input
            placeholder="Enter food name"
            value={foodDetails?.name || ""}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Category</Label>
          <Input
            placeholder="Enter food name"
            value={foodDetails?.category || ""}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Season</Label>
          <Input
            placeholder="Enter food name"
            value={foodDetails?.season || ""}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Country</Label>
          <Input
            placeholder="Enter food name"
            value={foodDetails?.country || ""}
            disabled
          />
        </div>
      </div>

      <Separator className="my-2" />

      <h3 className="mb-4 text-lg font-semibold text-black">Food Attributes</h3>
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Label className="block mb-1 text-black">Fiber</Label>
          <Input
            placeholder="Provider details if applicable"
            value={foodDetails?.attributes.fiber}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Proteins</Label>
          <Input
            placeholder="Provider details if applicable"
            value={foodDetails?.attributes.proteins}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Vitamins</Label>
          <Input
            placeholder="Provider details if applicable"
            value={foodDetails?.attributes.vitamins}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Minerals</Label>
          <Input
            placeholder="Provider details if applicable"
            value={foodDetails?.attributes.minerals}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Fat</Label>
          <Input
            placeholder="Provider details if applicable"
            value={foodDetails?.attributes.fat}
            disabled
          />
        </div>
        <div>
          <Label className="block mb-1 text-black">Sugar</Label>
          <Input
            placeholder="Provider details if applicable"
            value={foodDetails?.attributes.sugar}
            disabled
          />
        </div>
        <div
          className="col-span-1 sm:col-span-2 md:col-span-1"
          style={{ width: "100%" }}
        >
          <LableInput
            title="Health Benefits"
            placeholder="Add up to 6 food benefits or lower"
            benefits={
              foodDetails?.healthBenefits?.map(item => item.healthBenefit) || []
            }
            disabled
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
          <RichTextEditor
            ref={selectionRef}
            onChange={handleContentChange}
            initialContent={foodDetails?.describe.selection}
            disabled
          />
        </div>
        <div>
          <span className="block mb-2 text-sm text-black">Preparation</span>
          <RichTextEditor
            ref={preparationRef}
            initialContent={foodDetails?.describe.preparation}
            disabled
          />
        </div>
        <div>
          <span className="block mb-2 text-sm text-black">Conservation</span>
          <RichTextEditor
            ref={conservationRef}
            initialContent={foodDetails?.describe.conservation}
            disabled
          />
        </div>
      </div>

      <div className="w-full pb-6 mt-6 sm:w-2/5">
        <h3 className="mb-4 text-lg font-semibold text-black">Upload Images</h3>
        <ImageUploader
          title="Select Images for your food item"
          imageUrls={foodDetails?.images?.map(item => item.image) || []}
        />
      </div>
    </TabsContent>
  )
}
