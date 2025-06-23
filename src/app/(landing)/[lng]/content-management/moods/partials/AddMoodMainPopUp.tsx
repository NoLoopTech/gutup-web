"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import AddMoodPopUp from "./AddMoodPopUp"
import AddMoodFrench from "./AddMoodFrench"

interface Props {
  open: boolean
  onClose: () => void
}

export default function AddMoodMainPopUp({
  open,
  onClose
}: Props): JSX.Element {
  const [allowMultiLang, setAllowMultiLang] = useState(false) // Controls the language toggle
  const [activeTab, setActiveTab] = useState<"english" | "french">("english") // Default active tab

  // Refs for each RichTextEditor

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="overflow-y-auto p-2 h-full"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none" // IE/Edge
          }}
        >
          <DialogTitle>Add New Mood</DialogTitle>

          <Tabs
            value={activeTab}
            onValueChange={val => {
              setActiveTab(val as "english" | "french") // Set active tab when switching
            }}
            className="w-full"
          >
            <div className="flex flex-col gap-4 justify-between items-start mt-4 mb-6 sm:flex-row sm:items-center">
              <TabsList>
                <TabsTrigger value="english">English</TabsTrigger>
                {allowMultiLang && (
                  <TabsTrigger value="french">French</TabsTrigger>
                )}
              </TabsList>

              <div className="flex gap-2 items-center">
                <Switch
                  id="multi-lang"
                  checked={allowMultiLang}
                  onCheckedChange={val => {
                    setAllowMultiLang(val) // Toggle between languages
                    if (!val) setActiveTab("english") // Switch to English if multi-lang is disabled
                  }}
                />
                <Label htmlFor="multi-lang" className="text-Primary-300">
                  Allow Multi Lang
                </Label>
              </div>
            </div>

            {/* English Tab Content */}
            <TabsContent value="english">
              <AddMoodPopUp open={open} onClose={onClose} />
            </TabsContent>

            {/* French Tab Content (if multi-language is allowed) */}
            {/* {allowMultiLang && (
              <TabsContent value="french">
                <AddMoodFrench open={open} onClose={onClose} />
              </TabsContent>
            )} */}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
