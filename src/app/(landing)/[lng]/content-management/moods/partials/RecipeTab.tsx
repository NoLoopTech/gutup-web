"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import RichTextEditor from "@/components/Shared/TextEditor/RichTextEditor"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"

interface Option {
    value: string;
    label: string;
}

const seasons: Option[] = [
    { value: "happy", label: "Happy" },
    { value: "angry", label: "Angry" },
    { value: "sad", label: "Sad" },
];

export default function RecipeTab(): JSX.Element {
    const selectionRef = React.useRef<any>(null);
    return (
        <>
            <div className="text-black space-y-4">
                <div>
                    <Label className="text-black mb-1 block">Select Mood</Label>
                    <Input
                        id="moodSelect"
                        name="moodSelect"
                        options={seasons}
                        placeholder="Select Mood"
                        className="mt-1"
                    />
                </div>

                <Separator />

                <div className="flex-1 mb-4 pt-2">
                    <Label className="text-black mb-1 block">Recipie name</Label>
                    <Input placeholder="Enter quote author" />
                </div>

                <div className="flex-1 mb-6">
                    <Label className="text-black mb-1 block">Serving</Label>
                    <Input placeholder="Enter serving amount" />
                </div>

                <div className="flex-1 mb-6">
                    <Label className="text-black mb-1 block">Preparation Time</Label>
                    <Input placeholder="Enter preparation duration" />
                </div>
            </div>
            <div className="flex flex-col gap-6 pt-4">
                <div>
                    <Label className="text-black mb-1 block">Instructions</Label>
                    <RichTextEditor ref={selectionRef} />
                </div>
            </div>
            {/* Image Uploader */}
            <div className="w-100 pt-4 pb-8 ">
                <h3 className="text-lg font-semibold mb-2 pt-2 text-black">Upload Images</h3>
                <ImageUploader title="Select Images for your food item" />
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
