"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Option {
    value: string;
    label: string;
}

const seasons: Option[] = [
    { value: "happy", label: "Happy" },
    { value: "angry", label: "Angry" },
    { value: "sad", label: "Sad" },
];

export default function QuoteTab(): JSX.Element {
    return (
        <>
            <div className="text-black space-y-4">
                <div>
                    <Label className="text-black mb-1 block">Select Mood</Label>
                    <Select>
                        <SelectTrigger id="moodSelect" name="moodSelect" className="w-full mt-1">
                            <SelectValue placeholder="Select Mood" />
                        </SelectTrigger>
                        <SelectContent>
                            {seasons.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                <div className="flex-1 mb-4 pt-4">
                    <Label className="text-black mb-1 block">Quote Author</Label>
                    <Input placeholder="Enter quote author" />
                </div>

                <div className="flex-1 mb-6">
                    <Label className="text-black mb-1 block">Quote</Label>
                    <Input
                        placeholder="Add the quote here in detail"
                        className="h-14"
                    />
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
