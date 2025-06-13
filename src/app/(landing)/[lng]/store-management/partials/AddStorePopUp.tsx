// AddStorePopUp.tsx
'use client';

import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import ImageUploader from '@/components/Shared/ImageUploder/ImageUploader';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import SearchBar from '@/components/Shared/SearchBar/SearchBar';
import { CustomTable } from '@/components/Shared/Table/CustomTable';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RichTextEditor = dynamic(
    async () => await import('@/components/Shared/TextEditor/RichTextEditor'),
    { ssr: false }
);

interface Option {
    value: string;
    label: string;
}
interface Props {
    open: boolean;
    onClose: () => void;
}
interface AvailableItem {
    id: number;
    name: string;
    type: string;
    status: 'Active' | 'Inactive';
    display: boolean;
    tags: string[];
    quantity: string;
    isMain: boolean;
}

const categories: Option[] = [
    { value: 'Breakfast', label: 'Breakfast' },
    { value: 'Dinner', label: 'Dinner' },
    { value: 'dairy', label: 'Dairy' },
];

const shopStatus: Option[] = [
    { value: 'physical', label: 'physical' },
    { value: 'Online', label: 'Online' },
];

export default function AddStorePopUp({ open, onClose }: Props): JSX.Element {
    const aboutRef = useRef<any>(null);
    const [page, setPage] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(5);

    // Dummy table data
    const availData: AvailableItem[] = [
        {
            id: 1,
            name: 'Tomato',
            type: 'Ingredient',
            status: 'Active',
            display: true,
            tags: ['InSystem'],
            quantity: '1kg',
            isMain: true,
        },
        {
            id: 2,
            name: 'Vegetables',
            type: 'Category',
            status: 'Inactive',
            display: false,
            tags: [],
            quantity: '500g',
            isMain: false,
        },
    ];

    const availColumns = [
        {
            header: 'Available Ingredients & Categories',
            accessor: 'name' as const,
        },
        {
            header: 'Type',
            accessor: (row: { type: string }) => (
                <Badge className="bg-white text-black text-xs px-2 py-1 rounded-md border border-gray-100 hover:bg-white">
                    {row.type}
                </Badge>
            ),
        },
        {
            header: 'Availability Status',
            accessor: (row: typeof availData[0]) => (
                <Badge
                    className={
                        row.tags.includes('InSystem')
                            ? 'bg-green-200 text-black text-xs px-2 py-1 rounded-md border border-green-500 hover:bg-green-100 transition-colors'
                            : 'bg-gray-200 text-black text-xs px-2 py-1 rounded-md border border-gray-500 hover:bg-gray-100 transition-colors'
                    }
                >
                    {row.tags.includes('InSystem') ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            header: 'Display Status',
            accessor: (row: any) => <Switch checked={row.display} className="scale-75" />,
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
                <div
                    className="h-full overflow-y-auto p-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <style>
                        {`div::-webkit-scrollbar { width: 0px; background: transparent; }`}
                    </style>

                    {/* Header */}
                    <DialogTitle>Add New Store</DialogTitle>

                    {/* Store info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 mb-6">
                        <div>
                            <Label className="text-black mb-1 block">Store Name</Label>
                            <Input placeholder="Enter store name" />
                        </div>
                        <div>
                            <Label className="block mb-1 text-black">Category</Label>
                            <Select>
                                <SelectTrigger id="categorySelect" name="categorySelect" className="w-full mt-1">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-black mb-1 block">Store Location</Label>
                            <Input placeholder="Enter store location" />
                        </div>
                        <div>
                            <Label className="text-black mb-1 block">Shop Status</Label>
                            <Select>
                                <SelectTrigger id="shopStatusSelect" name="shopStatusSelect" className="w-full mt-1">
                                    <SelectValue placeholder="Select Shop Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {shopStatus.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-black mb-1 block">Store Map Location</Label>
                            <Input placeholder="Enter map location" />
                        </div>

                        <div>
                            <Label className="text-black mb-1 block">Store Type</Label>
                            <div className="flex items-center gap-4 mt-2">
                                <Switch />
                                <Label className="text-Primary-300">Premium Store</Label>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label>Time</Label>
                            <div className="flex gap-7 items-center">
                                <div className="flex flex-col">
                                    <Label htmlFor="time-from" className="text-xs text-gray-400">From</Label>
                                    <Input
                                        type="time"
                                        id="time-from"
                                        step="1"
                                        defaultValue="10:30:00"
                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <Label htmlFor="time-to" className="text-xs text-gray-400">To</Label>
                                    <Input
                                        type="time"
                                        id="time-to"
                                        step="1"
                                        defaultValue="18:30:00"
                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Contact info */}
                    <DialogTitle className='pt-4'>Store Contact</DialogTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 mb-6">
                        <div>
                            <Label className="text-black mb-1 block">Mobile Number</Label>
                            <Input placeholder="Enter store number" />
                        </div>
                        <div>
                            <Label className="text-black mb-1 block">Email</Label>
                            <Input placeholder="Enter store email" />
                        </div>
                        <div>
                            <Label className="text-black mb-1 block">Maps Pin</Label>
                            <Input placeholder="Enter google maps location" />
                        </div>
                        <div>
                            <Label className="text-black mb-1 block">Facebook</Label>
                            <Input placeholder="Enter Facebook URL" />
                        </div>
                        <div>
                            <Label className="text-black mb-1 block">Instagram</Label>
                            <Input placeholder="Enter Instagram URL" />
                        </div>
                        <div>
                            <Label className="text-black mb-1 block">Website</Label>
                            <Input placeholder="Enter Website URL" />
                        </div>
                    </div>

                    <Separator />

                    {/* Available Products */}
                    <DialogTitle className='pt-4'>Available Products</DialogTitle>
                    <div className="flex flex-col gap-4 pt-4">
                        <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
                            <div className="flex flex-row gap-2 items-center mb-2 flex-1">
                                <div className="flex-1">
                                    <SearchBar title="Select available Ingredients" placeholder="Search for ingredients" />
                                </div>
                                <div className="flex items-end h-full mt-7">
                                    <Button onClick={() => { }}>Add</Button>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 items-center mb-2 flex-1">
                                <div className="flex-1">
                                    <SearchBar title="Select available categories" placeholder="Search available categories" />
                                </div>
                                <div className="flex items-end h-full mt-7">
                                    <Button onClick={() => { }}>Add</Button>
                                </div>
                            </div>
                        </div>
                        <CustomTable
                            columns={availColumns}
                            data={availData.slice((page - 1) * pageSize, page * pageSize)}
                            page={page}
                            pageSize={pageSize}
                            totalItems={availData.length}
                            pageSizeOptions={[1, 5, 10]}
                            onPageChange={(newPage) => { setPage(newPage); }}
                            onPageSizeChange={(newSize) => {
                                setPageSize(newSize);
                                setPage(1);
                            }}
                        />
                    </div>

                    <Separator />

                    {/* About The Shop */}
                    <DialogTitle className='pt-4'>About The Shop</DialogTitle>
                    <div className="flex flex-col gap-6 pt-4 pb-6">
                        <div>
                            <span className="text-black text-sm mb-2 block">About Us</span>
                            <RichTextEditor ref={aboutRef} />
                        </div>
                    </div>

                    <Separator />

                    {/* Upload Images */}
                    <DialogTitle className='pt-4'>Upload Images</DialogTitle>
                    <div className="pt-4 w-full sm:w-2/5">
                        <ImageUploader title="Select Images for your store" />
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex justify-between w-full gap-2">
                        <Button
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button>Save</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
