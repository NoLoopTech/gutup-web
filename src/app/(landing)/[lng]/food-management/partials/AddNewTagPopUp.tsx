'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
    open: boolean;
    onClose: () => void;
}
interface Option {
    value: string;
    label: string;
}
// Dummy categories
const categories: Option[] = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
];

export default function AddNewTagPopUp({ open, onClose }: Props): JSX.Element {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-6 rounded-xl">
                <div className="flex flex-col gap-4">
                    {/* Title */}
                    <h2 className="text-lg font-bold text-black">Add New Tag</h2>

                    {/* Category Selection */}
                    <div>
                        <Label className="text-black mb-2 block">Category</Label>
                        <Input
                            id="categorySelect"
                            name="categorySelect"
                            options={categories}
                            placeholder="Select Category"
                            className="mt-1"
                        />
                    </div>

                    {/* Tag Name Input */}
                    <div>
                        <Label className="text-black mb-2 block">Tag Name</Label>
                        <Input placeholder="Give a Tag Name" />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-4">
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button>Save</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
