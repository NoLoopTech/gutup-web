"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function VideoTipTab(): JSX.Element {
    return (
        <>
            <div className="text-black space-y-4">
                <div className="flex justify-end items-start" style={{ marginTop: "-4.4rem" }}>
                    <div className="w-80" style={{ width: "25.2rem" }}>
                        <Label className="text-black mb-1 block">Title</Label>
                        <Input placeholder="Enter shop name" />
                    </div>
                </div>

                <div>
                    <div className="flex-1 mb-4">
                        <Label className="text-black mb-1 block">Sub Title</Label>
                        <Input placeholder="Enter shop location" />
                    </div>

                    <div className="flex-1 mb-6">
                        <Label className="text-black mb-1 block">Sub Description</Label>
                        <Input
                            placeholder="Describe in detail"
                            className="h-14"
                        />
                    </div>
                </div>

                <Separator />

                <div className="flex-1 mb-4 mt-6">
                    <Label className="text-black mb-1 block">Video Link</Label>
                    <Input placeholder="Enter the video link eg: Youtube & Vimeo" />
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
