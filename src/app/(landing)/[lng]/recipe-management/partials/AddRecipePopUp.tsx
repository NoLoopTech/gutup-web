'use client';

import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader";
import dynamic from "next/dynamic";
import type { RichTextEditorHandle } from "@/components/Shared/TextEditor/RichTextEditor";
import LableInput from "@/components/Shared/LableInput/LableInput";
import SearchBar from "@/components/Shared/SearchBar/SearchBar";
import { Button } from "@/components/ui/button";
import { CustomTable } from "@/components/Shared/Table/CustomTable";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CircleFadingPlus } from "lucide-react";
import CustomImage from "@/components/Shared/CustomImage/CustomImage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const imageList = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg",
    "/images/6.jpg",
];

interface Ingredient {
    id: number;
    name: string;
    quantity: string;
    isMain: boolean;
    tags: string[];
}
interface Option {
    value: string;
    label: string;
}
interface Props {
    open: boolean;
    onClose: () => void;
}

// Dummy data
const ingredientData: Ingredient[] = [
    {
        id: 1,
        name: "Tomato",
        quantity: "2 pcs",
        isMain: true,
        tags: ["InSystem"],
    },
    {
        id: 2,
        name: "Basil",
        quantity: "5 leaves",
        isMain: false,
        tags: [],
    },
    {
        id: 3,
        name: "Mozzarella",
        quantity: "100g",
        isMain: false,
        tags: [],
    },
];


// Table columns
const ingredientColumns = [
    {
        header: "Ingredient Name",
        accessor: "name" as const,
    },
    {
        header: "Quantity",
        accessor: "quantity" as const,
    },
    {
        header: "Main Ingredient",
        accessor: (row: { id: number; name: string; quantity: string; isMain: boolean; tags: string[] }) => (
            <Switch
                checked={row.isMain}
                className="scale-75"
                style={{ minWidth: 28, minHeight: 16 }}
            />
        ),
    },
    {
        header: "Available in Ingredients",
        accessor: (row: { id: number; name: string; quantity: string; isMain: boolean; tags: string[] }) =>
            row.tags.includes("InSystem") ? (
                <Badge
                    className="bg-green-200 text-black text-xs px-2 py-1 rounded-md border border-green-500 hover:bg-green-100 transition-colors"
                >
                    In the System
                </Badge>
            ) : (
                <Button
                    variant="ghost"
                    className="text-secondary-blue text-xs px-2 py-1 flex items-center gap-1 hover:bg-transparent focus:bg-transparent active:bg-transparent"
                    size="sm"
                >
                    <CircleFadingPlus size={14} />
                    Add to Ingredients
                </Button>
            ),
    },
];

// Dynamically load RichTextEditor with SSR disabled
const RichTextEditor = dynamic(
    async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
    { ssr: false }
);

export default function AddRecipePopup({ open, onClose }: Props): JSX.Element {
    const selectionRef = useRef<RichTextEditorHandle>(null);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);

    const categories: Option[] = [
        { value: "fruits", label: "Fruits" },
        { value: "vegetables", label: "Vegetables" },
        { value: "dairy", label: "Dairy" },
        { value: "grains", label: "Grains" },
    ];
    const seasons: Option[] = [
        { value: "spring", label: "Spring" },
        { value: "summer", label: "Summer" },
        { value: "autumn", label: "Autumn" },
        { value: "winter", label: "Winter" },
    ];
    const authorSpeality: Option[] = [
        { value: "spring", label: "Spring" },
        { value: "summer", label: "Summer" },
        { value: "autumn", label: "Autumn" },
    ];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
                <div
                    className="h-full overflow-y-auto p-2"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    <style>
                        {`
              div::-webkit-scrollbar {
                width: 0px;
                background: transparent;
              }
            `}
                    </style>

                    <DialogTitle>Add New Recipe</DialogTitle>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 pb-6">
                        <div>
                            <Label className="text-black mb-1 block">Name</Label>
                            <Input placeholder="Enter recipe name" />
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
                            <Label className="block mb-1 text-black">Season</Label>
                            <Select>
                                <SelectTrigger id="seasonSelect" name="seasonSelect" className="w-full mt-1">
                                    <SelectValue placeholder="Select season" />
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
                    </div>

                    <Separator />

                    <DialogTitle className="pt-4">Recipe Attributes</DialogTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 mb-4">
                        <div>
                            <Label className="text-black mb-1 block">Preparation</Label>
                            <Input placeholder="How long does it take to make?" />
                        </div>
                        <div>
                            <Label className="text-black mb-1 block">Rest</Label>
                            <Input placeholder="How long to keep it resting?" />
                        </div>
                        <div>
                            <Label className="text-black mb-1 block">Persons</Label>
                            <Input placeholder="Number of people the meal serves" />
                        </div>
                        {/* Lable inputs for the health benefits */}
                        <div
                            className="col-span-1 sm:col-span-2 md:col-span-1"
                            style={{ width: "100%" }}
                        >
                            <LableInput
                                title="Health Benefits"
                                placeholder="Add up to 6 food benefits or lower"
                                benefits={[]}
                            />
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <DialogTitle>Ingredients Selection</DialogTitle>

                    <div className="flex flex-row gap-2 items-center pt-4 mb-4">
                        <div className="flex-1">
                            <SearchBar title="Select Your Ingredients" placeholder="Search for ingredient" />
                        </div>
                        <div className="flex items-end h-full mt-7">
                            <Button onClick={() => { }}>Add</Button>
                        </div>
                    </div>
                    <CustomTable
                        columns={ingredientColumns}
                        data={ingredientData.slice((page - 1) * pageSize, page * pageSize)}
                        page={page}
                        pageSize={pageSize}
                        totalItems={ingredientData.length}
                        pageSizeOptions={[2, 5, 10]}
                        onPageChange={(newPage) => { setPage(newPage); }}
                        onPageSizeChange={(newSize) => {
                            setPageSize(newSize);
                            setPage(1);
                        }}
                    />

                    <Separator className="my-4" />

                    <DialogTitle>Describe the Recipe</DialogTitle>
                    <div className="flex flex-col gap-6 pt-4 pb-2">
                        <div>
                            <span className="text-black text-sm mb-2 block">Recipe</span>
                            <RichTextEditor ref={selectionRef} />
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <DialogTitle>Add Author</DialogTitle>

                    <div className="flex flex-col sm:flex-row gap-8 mb-4 pt-4 items-start">
                        {/* Left: Author Inputs */}
                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="w-full">
                                <Label className="text-black mb-2 block">Name</Label>
                                <Input placeholder="Enter author name" className="w-full" />
                            </div>
                            <div className="w-full">
                                <Label className="block mb-1 text-black">Category</Label>
                                <Select>
                                    <SelectTrigger id="categorySelect" name="categorySelect" className="w-full mt-1">
                                        <SelectValue placeholder="Enter author specialty " />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {authorSpeality.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full">
                                <Label className="text-black mb-2 block">Phone</Label>
                                <Input placeholder="Enter author number" className="w-full" />
                            </div>
                            <div className="w-full">
                                <Label className="text-black mb-2 block">Email</Label>
                                <Input placeholder="Enter author email" className="w-full" />
                            </div>
                            <div className="w-full">
                                <Label className="text-black mb-2 block">Website</Label>
                                <Input placeholder="Enter author website" className="w-full" />
                            </div>
                        </div>
                        {/* Right: Image Uploader */}
                        <div className="w-full sm:w-2/5 ">
                            <ImageUploader title="Upload Autor Image" />
                        </div>
                    </div>

                    <DialogTitle>Upload Images</DialogTitle>
                    
                    <div className="mt-6 pb-2 w-full sm:w-2/5">
                        <ImageUploader title="Select Images for your food item" />
                    </div>
                    <Separator className="my-4" />

                    <DialogTitle className="pb-4">Linked Food </DialogTitle>

                    <CustomImage
                        srcList={imageList}
                        count={5}
                        maxCount={6}
                        text="Recipe Image"
                        width={80}
                        height={80}
                    />
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