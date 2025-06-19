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
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form"
import z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
const RecipeSchema = z.object({
    name: z.string()
        .nonempty("Required")
        .min(2, { message: "Must be at least 2 characters" }),
    category: z.string().min(1, "Please select a category"),
    season: z.string().min(1, "Please select a Season"),
    authorName: z.string()
        .nonempty("Required")
        .min(2, { message: "Must be at least 2 characters" }),
    authorCategory: z.string().min(1, "Please select a category"),
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
    website: z.string().url("Invalid URL format").optional().or(z.literal("")),
    recipe: z.string()
        .refine((val) => {
            const plainText = val.replace(/<(.|\n)*?>/g, '').trim();
            const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val);
            return plainText !== '' || hasImage;
        }, {
            message: "Required",
        }),
    authorimage: z.custom<File | null>((val) => val instanceof File, {
        message: "Required"
    }),
    foodimage: z.custom<File | null>((val) => val instanceof File, {
        message: "Required"
    }),
});

const onSubmit = (data: z.infer<typeof RecipeSchema>): void => {
    toast("Form submitted successfully!", {})
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
    const form = useForm<z.infer<typeof RecipeSchema>>({
        resolver: zodResolver(RecipeSchema),
        defaultValues: {
            name: "",
            category: "",
            season: "",
            authorName: "",
            authorCategory: "",
            phone: "",
            email: "",
            website: "",
            recipe: "",
            authorimage: null,
            foodimage: null,
        }
    })

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
                            <DialogTitle>Add New Recipe</DialogTitle>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 pb-6">
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel className="block mb-1 text-black">Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter food name" {...field} />
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
                                        name="season"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block mb-1 text-black">Season</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full mt-1">
                                                            <SelectValue placeholder="Select Season" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {seasons.map((option: Option) => (
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
                                    <FormField
                                        control={form.control}
                                        name="recipe"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block mb-2 text-black">Recipe</FormLabel>
                                                <FormControl>
                                                    <RichTextEditor
                                                        ref={selectionRef}
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

                            <Separator className="my-4" />

                            <DialogTitle>Add Author</DialogTitle>

                            <div className="flex flex-col sm:flex-row gap-8 mb-4 pt-4 items-start">
                                {/* Left: Author Inputs */}
                                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="authorName"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="block mb-1 text-black">Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter author name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="authorCategory"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="block mb-1 text-black">Category</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-full mt-1">
                                                                <SelectValue placeholder="Enter author specialty" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {authorSpeality.map((option: Option) => (
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
                                    <div className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="block mb-1 text-black">Phone</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter author number" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="block mb-1 text-black">Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter author email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="website"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="block mb-1 text-black">Website</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter author website" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                {/* Right: Image Uploader */}
                                <div className="w-full sm:w-2/5 ">
                                    <FormField
                                        control={form.control}
                                        name="authorimage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <ImageUploader
                                                        title="Upload Autor Image"
                                                        onChange={(file) => {
                                                            field.onChange(file)
                                                            form.clearErrors("authorimage")
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <DialogTitle>Upload Images</DialogTitle>

                            <div className="mt-6 pb-2 w-full sm:w-2/5">
                                <FormField
                                    control={form.control}
                                    name="foodimage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <ImageUploader
                                                    title="Select Images for your food item"
                                                    onChange={(file) => {
                                                        field.onChange(file)
                                                        form.clearErrors("foodimage")
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Separator className="my-4" />
                            <DialogTitle>Linked Food</DialogTitle>

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