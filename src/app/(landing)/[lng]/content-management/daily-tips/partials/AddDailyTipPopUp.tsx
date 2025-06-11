"use client"

import React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface Props {
  open: boolean
  onClose: () => void
}

export default function AddDailyTipPopUp({
  open,
  onClose
}: Props): JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="h-full p-2 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>
            {`div::-webkit-scrollbar { width: 0px; background: transparent; }`}
          </style>

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-black">Add New Daily Tip</h2>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
