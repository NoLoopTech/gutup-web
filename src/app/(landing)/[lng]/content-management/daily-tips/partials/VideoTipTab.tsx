"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Option {
  value: string
  label: string
}

const concerns: Option[] = [
  { value: "Stress", label: "Stress" },
  { value: "Anxiety", label: "Anxiety" },
  { value: "Depression", label: "Depression" },
]


export default function VideoTipTab(): JSX.Element {
  return (
    <>
      <div className="space-y-4 text-black">
        <div className="flex items-start lg:justify-end lg:-mt-[4.4rem]">
          <div className="w-[25.5rem]">
            <Label className="block mb-1 text-black">Concerns</Label>
            <Select>
              <SelectTrigger id="countrySelect" name="countrySelect" className="w-full mt-1">
                <SelectValue placeholder="Select Concern" />
              </SelectTrigger>
              <SelectContent>
                {concerns.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label>When to be Displayed</Label>
          <div className="flex gap-7 items-center">
            <div className="flex flex-col">
              <Label htmlFor="time-from" className="text-xs text-gray-400">From</Label>
              <Input
                type="time"
                id="time-from"
                step="1"
                defaultValue="10:30:00"
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="time-to" className="text-xs text-gray-400">To</Label>
              <Input
                type="time"
                id="time-to"
                step="1"
                defaultValue="18:30:00"
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex-1 mb-4">
          <Label className="block mb-1 text-black">Title</Label>
          <Input placeholder="Enter shop location" />
        </div>

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

      <div className="flex-1 mt-6 mb-6">
        <Label className="block mb-1 text-black">Video Link</Label>
        <Input placeholder="Enter the video link eg: Youtube & Vimeo" />
      </div>

      {/* Buttons */ }
      < div className = "fixed bottom-0 left-0 z-50 flex justify-between w-full px-8 py-2 bg-white border-t border-gray-200" >
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </div >
    </>
  )
}
