'use client';

import { useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

const imageList = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg",
    "/images/6.jpg",
];
// Dummy data
const ingredientData = [
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

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function AddRecipePopup({ open, onClose }: Props): JSX.Element {
    const selectionRef = useRef<RichTextEditorHandle>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const categories = [
        { value: "fruits", label: "Fruits" },
        { value: "vegetables", label: "Vegetables" },
        { value: "dairy", label: "Dairy" },
        { value: "grains", label: "Grains" },
    ];
    const seasons = [
        { value: "spring", label: "Spring" },
        { value: "summer", label: "Summer" },
        { value: "autumn", label: "Autumn" },
        { value: "winter", label: "Winter" },
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

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-black">Add New Recipe</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <Label className="text-black mb-1 block">Name</Label>
                            <Input placeholder="Enter recipe name" />
                        </div>
                        <div>
                            <Label className="text-black mb-1 block">Category</Label>
                            <Input
                                id="categorySelect"
                                name="categorySelect"
                                options={categories}
                                placeholder="Select category"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-black mb-1 block">Season</Label>
                            <Input
                                id="seasonSelect"
                                name="seasonSelect"
                                options={seasons}
                                placeholder="Select season"
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <h3 className="text-lg font-semibold mb-4 text-black">Recipe Attributes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-black">Ingredients Selection</h2>
                    </div>

                    <div className="flex flex-row gap-2 items-center mb-4">
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

                    <h3 className="text-lg font-semibold mb-4 text-black">Describe the Recipe</h3>
                    <div className="flex flex-col gap-6">
                        <div>
                            <span className="text-black text-sm mb-2 block">Recipe</span>
                            <RichTextEditor ref={selectionRef} />
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center mt-4 mb-4">
                        <h2 className="text-lg font-bold text-black">Add Author</h2>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-8 mb-4 items-start">
                        {/* Left: Author Inputs */}
                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="w-full">
                                <Label className="text-black mb-2 block">Name</Label>
                                <Input placeholder="Enter author name" className="w-full" />
                            </div>
                            <div className="w-full">
                                <Label className="text-black mb-2 block">Category</Label>
                                <Input placeholder="Enter author specialty " className="w-full" />
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

                    <div className="mt-6 w-full sm:w-2/5">
                        <h3 className="text-lg font-semibold mb-4 text-black">Upload Images</h3>
                        <ImageUploader title="Select Images for your food item" />
                    </div>
                    <Separator className="my-4" />

                    <div className="flex justify-between items-center mt-4 mb-4">
                        <h2 className="text-lg font-bold text-black">Linked Food </h2>
                    </div>
                    <CustomImage
                        srcList={imageList}
                        count={5}
                        maxCount={6}
                        text="Recipe Image"
                        width={80}
                        height={80}
                    />

                </div>
            </DialogContent>
        </Dialog>
    );
}