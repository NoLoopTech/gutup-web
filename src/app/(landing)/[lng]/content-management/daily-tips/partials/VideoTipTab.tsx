"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function VideoTipTab(): JSX.Element {
  return (
    <>
      <div className="space-y-4 text-black">
        <div className="flex items-start justify-end w-[-4.4rem]">
          <div className="w-[25.5rem]">
            <Label className="block mb-1 text-black">Title</Label>
            <Input placeholder="Enter shop name" />
          </div>
        </div>

        <div>
          <div className="flex-1 mb-4">
            <Label className="block mb-1 text-black">Sub Title</Label>
            <Input placeholder="Enter shop location" />
          </div>

          <div className="flex-1 mb-6">
            <Label className="block mb-1 text-black">Sub Description</Label>
            <Input placeholder="Describe in detail" className="h-14" />
          </div>
        </div>

        <Separator />

        <div className="flex-1 mt-6 mb-4">
          <Label className="block mb-1 text-black">Video Link</Label>
          <Input placeholder="Enter the video link eg: Youtube & Vimeo" />
        </div>
      </div>

      {/* Buttons */}
      <div className="fixed bottom-0 left-0 z-50 flex justify-between w-full px-8 py-2 bg-white border-t border-gray-200">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </div>
    </>
  )
}
