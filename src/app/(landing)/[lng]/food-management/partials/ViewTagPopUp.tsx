"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

interface Props {
  open: boolean
  onClose: () => void
  tagData: {
    category: string
    tagNameFr: string
  }
}

export default function ViewTagPopUp({
  open,
  onClose,
  tagData
}: Props): JSX.Element {
  const [activeTab, setActiveTab] = useState<"en" | "fr">("en")

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) onClose()
      }}
    >
      <DialogContent className="max-w-md p-6 rounded-xl">
        <DialogTitle>View Tag</DialogTitle>
        <Tabs
          value={activeTab}
          onValueChange={val => {
            setActiveTab(val as "en" | "fr")
          }}
          className="w-full"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 justify-between items-start sm:flex-row sm:items-center">
              <TabsList>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="fr">French</TabsTrigger>
              </TabsList>
            </div>
            {/* English content */}
            <TabsContent value="en">
              <div className="flex flex-col gap-4">
                <Label className="text-black">Tag Name</Label>
                <Input value={tagData.category} disabled />
              </div>
            </TabsContent>
            {/* French content */}
            <TabsContent value="fr">
              <div className="flex flex-col gap-4">
                <Label className="text-black">Nom du tag</Label>
                <Input value={tagData.tagNameFr} disabled />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
