'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
// Schema
const TagSchema = z.object({
    category: z.string().nonempty('Please select a category'),
    tagName: z
        .string()
        .nonempty('Required')
        .min(2, 'Tag name must be at least 2 characters')
});

export default function AddNewTagPopUp({ open, onClose }: Props): JSX.Element {
    const form = useForm<z.infer<typeof TagSchema>>({
        resolver: zodResolver(TagSchema),
        defaultValues: {
            category: '',
            tagName: ''
        }
    });

    const onSubmit = (data: z.infer<typeof TagSchema>): void => {
        toast('Tag added successfully!', {});
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-6 rounded-xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-4">
                            {/* Title */}
                            <h2 className="text-lg font-bold text-black">Add New Tag</h2>

                            {/* Category Field */}
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">Category</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger className="w-full mt-1">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Tag Name Field */}
                            <FormField
                                control={form.control}
                                name="tagName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black">Tag Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Give a Tag Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Buttons */}
                            <div className="flex justify-between mt-4">
                                <Button variant="secondary" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button>Save</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
