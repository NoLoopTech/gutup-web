"use client"

import React, { useState, useRef } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddFoodEnglish from "./AddFoodEnglish"

import type { RichTextEditorHandle } from "@/components/Shared/TextEditor/RichTextEditor"
import AddFoodFranch from "./AddFoodFranch"

interface Props {
  open: boolean
  onClose: () => void
}

export default function AddFoodPopUp({ open, onClose }: Props): JSX.Element {
  const [allowMultiLang, setAllowMultiLang] = useState(false)
  const [activeTab, setActiveTab] = useState<"english" | "french">("english")

  // Refs for each RichTextEditor
  const selectionRef = useRef<RichTextEditorHandle>(null)
  const preparationRef = useRef<RichTextEditorHandle>(null)
  const conservationRef = useRef<RichTextEditorHandle>(null)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="overflow-y-auto p-2 h-full"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none" // IE/Edge
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              width: 0px;
              background: transparent;
            }
          `}</style>

          <DialogTitle>Add New Food Item</DialogTitle>

          <Tabs
            value={activeTab}
            onValueChange={val => {
              setActiveTab(val as "english" | "french")
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
                    setAllowMultiLang(val)
                    if (!val) setActiveTab("english")
                  }}
                />
                <Label htmlFor="multi-lang" className="text-Primary-300">
                  Allow Multi Lang
                </Label>
              </div>
            </div>

            {/* Render each tab’s content component */}
            <AddFoodEnglish
              selectionRef={selectionRef}
              preparationRef={preparationRef}
              conservationRef={conservationRef}
            />

            {allowMultiLang && (
              <AddFoodFranch
                selectionRef={selectionRef}
                preparationRef={preparationRef}
                conservationRef={conservationRef}
              />
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
