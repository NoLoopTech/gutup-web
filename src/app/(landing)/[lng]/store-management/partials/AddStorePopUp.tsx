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
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form"
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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

// Validation schema using Zod
const AddStoreSchema = z.object({
    storeName: z.string()
        .nonempty("Required")
        .min(2, { message: "Must be at least 2 characters" }),
    category: z.string().min(1, "Please select a category"),
    storeLocation: z.string().min(1, "Required"),
    shopStatus: z.string().min(1, "Please select a shop status"),
    shoplocation: z.string().min(1, "Required"),
    phone: z.string()
        .nonempty("Required")
        .refine(
            (val) =>
                /^\d{10}$/.test(val) || /^\+\d{11}$/.test(val),
            {
                message: "Invalid Mobile number (e.g. 0712345678 or +94712345678)",
            }
        ),
    email: z.string()
        .nonempty("Required")
        .email("Please enter a valid email."),
    mapsPin: z.string()
        .nonempty("Required"),
    website: z.string().url("Invalid URL format").optional().or(z.literal("")),
    facebook: z.string().url("Invalid URL format").optional().or(z.literal("")),
    instagram: z.string().url("Invalid URL format").optional().or(z.literal("")),
    about: z.string()
        .refine((val) => {
            const plainText = val.replace(/<(.|\n)*?>/g, '').trim();
            const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val);
            return plainText !== '' || hasImage;
        }, {
            message: "Required",
        }),
    storeImage: z.custom<File | null>((val) => val instanceof File, {
        message: "Required"
    }),
});

const onSubmit = (data: z.infer<typeof AddStoreSchema>): void => {
    toast("Form submitted successfully!", {})
}

export default function AddStorePopUp({ open, onClose }: Props): JSX.Element {
    const aboutRef = useRef<any>(null);
    const [page, setPage] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(5);

    const form = useForm<z.infer<typeof AddStoreSchema>>({
        resolver: zodResolver(AddStoreSchema),
        defaultValues: {
            storeName: "",
            category: "",
            storeLocation: "",
            shopStatus: "",
            shoplocation: "",
            phone: "",
            email: "",
            mapsPin: "",
            website: "",
            facebook: "",
            instagram: "",
            about: "",
            storeImage: null,
        },
    });

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
                <style>{`
                    /* Hide scrollbar in Webkit browsers */
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div
                            className="h-[calc(80vh-64px)] p-2 overflow-y-auto"
                            style={{
                                scrollbarWidth: "none", // Firefox
                                msOverflowStyle: "none", // IE/Edge
                            }}
                        >

                            {/* Header */}
                            <DialogTitle>Add New Store</DialogTitle>

                            {/* Store info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 mb-6">
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="storeName"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className="block mb-1 text-black">Store Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter store name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block mb-1 text-black">Category</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full mt-1">
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map((option: Option) => (
                                                                <SelectItem key={option.value} value={option.value}>
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
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="storeLocation"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className="block mb-1 text-black">Store Location</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter store location" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="shopStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block mb-1 text-black">Shop Status</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full mt-1">
                                                            <SelectValue placeholder="Select Shop Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {shopStatus.map((option: Option) => (
                                                                <SelectItem key={option.value} value={option.value}>
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
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="shoplocation"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className="block mb-1 text-black">Store Map Location</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter map location" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className="block mb-1 text-black">Mobile Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter store number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className="block mb-1 text-black">Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter store email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="mapsPin"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className="block mb-1 text-black">Maps Pin</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter google maps location" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="facebook"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className="block mb-1 text-black">Facebook</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Facebook URL" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="instagram"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className="block mb-1 text-black">Instagram</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Instagram URL" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className="block mb-1 text-black">Website</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Website URL" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                    <FormField
                                        control={form.control}
                                        name="about"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block mb-2 text-black">About Us</FormLabel>
                                                <FormControl>
                                                    <RichTextEditor
                                                        ref={aboutRef}
                                                        value={field.value}
                                                        onChange={(val) => {
                                                            field.onChange(val)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* Upload Images */}
                            <DialogTitle className='pt-4'>Upload Images</DialogTitle>
                            <div className="pt-4 w-full sm:w-2/5 pb-8">
                                <FormField
                                    control={form.control}
                                    name="storeImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <ImageUploader
                                                    title="Select Images for your store"
                                                    onChange={(file) => {
                                                        field.onChange(file)
                                                        form.clearErrors("storeImage")
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {/* Save and Cancel buttons */}
                            <div className="fixed bottom-0 left-0 w-full bg-white border-t py-4 px-4 flex justify-between gap-2 z-50">
                                <Button variant="outline" onClick={() => { form.reset(); }}>
                                    Cancel
                                </Button>
                                <Button type="submit">Save</Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
