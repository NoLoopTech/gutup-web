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
            <div className="text-black space-y-4">
                {/* Header */}
                <div className="flex justify-end items-start" style={{ marginTop: "-4.4rem" }}>
                    <div className="w-80" style={{ width: "25.2rem" }}>
                        <Label className="text-black mb-1 block">Main Title</Label>
                        <Input placeholder="Give a tip title" />
                    </div>
                </div>

                <Separator />

                {/* Sub Title and Sub Description */}
                <div className="flex gap-6">
                    <div className="flex-1 mb-1">
                        <Label className="text-black mb-1 block">Sub Title</Label>
                        <Input placeholder="Give a tip title" />
                    </div>

                    <div className="flex-1 mb-1">
                        <Label className="text-black mb-1 block">Sub Description</Label>
                        <Input
                            placeholder="Describe in detail"
                            className="h-14"
                        />
                    </div>
                </div>

                <Separator />

                <div>
                    <div className="flex-1 mb-4">
                        <Label className="text-black mb-1 block">Sub Title</Label>
                        <Input placeholder="Give a tip title" />
                    </div>

                    <div className="flex-1 mb-1">
                        <Label className="text-black mb-1 block">Sub Description</Label>
                        <Input
                            placeholder="Describe in detail"
                            className="h-14"
                        />
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center mt-4 mb-4">
                    <h2 className="text-lg font-bold text-black">Upload Images</h2>
                </div>
                {/* Image Uploader */}
                <div className="w-100 pb-12">
                    <ImageUploader title="Select Images for your food item" />
                </div>
            </div>
            {/* Buttons */}
            <div
                className="fixed left-0 bottom-0 w-full bg-white border-t border-gray-200 flex justify-between px-8 py-2 z-50">
                <Button variant="secondary">
                    Cancel
                </Button>
                <Button>Save</Button>
            </div>
        </>
    )
}
