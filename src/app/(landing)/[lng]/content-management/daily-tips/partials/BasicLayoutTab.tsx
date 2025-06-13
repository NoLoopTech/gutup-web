"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import { Button } from "@/components/ui/button"

export default function BasicLayoutTab(): JSX.Element {
  return (
    <>
      <div className="space-y-4 text-black">
        {/* Header */}
        <div
          className="flex items-start justify-end"
          style={{ marginTop: "-4.4rem" }}
        >
          <div className="w-80" style={{ width: "25.5rem" }}>
            <Label className="block mb-1 text-black">Main Title</Label>
            <Input placeholder="Give a tip title" />
          </div>
        </div>

        <Separator />

        {/* Sub Title and Sub Description */}
        <div className="flex gap-4">
          <div className="flex-1 mb-1">
            <Label className="block mb-1 text-black">Sub Title</Label>
            <Input placeholder="Give a tip title" />
          </div>

          <div className="flex-1 mb-1">
            <Label className="block mb-1 text-black">Sub Description</Label>
            <Input placeholder="Describe in detail" className="h-14" />
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex-1 mb-4">
            <Label className="block mb-1 text-black">Sub Title</Label>
            <Input placeholder="Give a tip title" />
          </div>

          <div className="flex-1 mb-1">
            <Label className="block mb-1 text-black">Sub Description</Label>
            <Input placeholder="Describe in detail" className="h-14" />
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between mt-4 mb-4">
          <h2 className="text-lg font-bold text-black">Upload Images</h2>
        </div>
        {/* Image Uploader */}
        <div className="pb-12 w-100">
          <ImageUploader title="Select Images for your food item" />
        </div>
      </div>
      {/* Buttons */}
      <div className="fixed bottom-0 left-0 z-50 flex justify-between w-full px-8 py-2 bg-white border-t border-gray-200">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </div>
    </>
  )
}
