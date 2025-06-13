"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface Option {
  value: string
  label: string
}

const seasons: Option[] = [
  { value: "happy", label: "Happy" },
  { value: "angry", label: "Angry" },
  { value: "sad", label: "Sad" }
]

export default function QuoteTab(): JSX.Element {
  return (
    <>
      <div className="space-y-4 text-black">
        <div>
          <Label className="block mb-1 text-black">Select Mood</Label>
          <Select>
            <SelectTrigger
              id="moodSelect"
              name="moodSelect"
              className="w-full mt-1"
            >
              <SelectValue placeholder="Select Mood" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex-1 pt-4 mb-4">
          <Label className="block mb-1 text-black">Quote Author</Label>
          <Input placeholder="Enter quote author" />
        </div>

        <div className="flex-1 mb-6">
          <Label className="block mb-1 text-black">Quote</Label>
          <Input placeholder="Add the quote here in detail" className="h-14" />
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
