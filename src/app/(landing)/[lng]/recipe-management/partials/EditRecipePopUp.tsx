// // // import { useState } from 'react';
// // // // import { Button, Input, Modal } from "@/components/ui"; // Customize based on your UI components

// // // export function EditRecipePopUp({ open, onClose, recipeData, token }: { open: boolean, onClose: () => void, recipeData: RecipeDataType | null, token: string }) {
// // //   const [name, setName] = useState(recipeData?.name || "");
// // //   const [category, setCategory] = useState(recipeData?.category || "");
// // //   const [servings, setServings] = useState(recipeData?.persons || 0);

// // //   const handleSaveChanges = () => {
// // //     // Logic to save changes to the backend (API call)
// // //     // You will need to send the updated data along with the token for authorization
// // //   };

// // //   return (
// // //     <Modal open={open} onClose={onClose}>
// // //       <div className="modal-content">
// // //         <h2>Edit Recipe</h2>
// // //         <Input 
// // //           label="Recipe Name" 
// // //           value={name} 
// // //           onChange={(e) => setName(e.target.value)} 
// // //         />
// // //         <Input 
// // //           label="Category" 
// // //           value={category} 
// // //           onChange={(e) => setCategory(e.target.value)} 
// // //         />
// // //         <Input 
// // //           label="Servings" 
// // //           value={servings} 
// // //           onChange={(e) => setServings(Number(e.target.value))} 
// // //         />
// // //         <Button onClick={handleSaveChanges}>Save Changes</Button>
// // //         <Button onClick={onClose}>Cancel</Button>
// // //       </div>
// // //     </Modal>
// // //   );
// // // }




// // "use client"

// // import React, { useEffect, useMemo, useRef, useState } from "react"
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogFooter,
// //   DialogTitle
// // } from "@/components/ui/dialog"
// // import { Input } from "@/components/ui/input"
// // import { Separator } from "@/components/ui/separator"
// // import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
// // import dynamic from "next/dynamic"
// // import type { RichTextEditorHandle } from "@/components/Shared/TextEditor/RichTextEditor"
// // import LableInput from "@/components/Shared/LableInput/LableInput"
// // import { Button } from "@/components/ui/button"
// // import { CustomTable } from "@/components/Shared/Table/CustomTable"
// // import { Switch } from "@/components/ui/switch"
// // import { Badge } from "@/components/ui/badge"
// // import { CircleFadingPlus } from "lucide-react"
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue
// // } from "@/components/ui/select"
// // import {
// //   Form,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// //   FormControl
// // } from "@/components/ui/form"
// // import z from "zod"
// // import { toast } from "sonner"
// // import { useForm } from "react-hook-form"
// // import { zodResolver } from "@hookform/resolvers/zod"
// // import { getRecipeById } from "@/app/api/recipe"
// // import Image from "next/image"
// // import { updateRecipe } from "@/app/api/recipe"

// // const imageList = [
// //   "/images/1.jpg",
// //   "/images/2.jpg",
// //   "/images/3.jpg",
// //   "/images/4.jpg",
// //   "/images/5.jpg",
// //   "/images/6.jpg"
// // ]

// // interface Ingredient {
// //   id: number
// //   name: string
// //   quantity: string
// //   isMain: boolean
// //   tags: string[]
// // }

// // interface Option {
// //   value: string
// //   label: string
// // }

// // interface Props {
// //   open: boolean
// //   onClose: () => void
// //   token: string
// //   recipeId: number
// // }

// // interface RecipeDetailsTypes {
// //   id: number
// //   name: string
// //   category: string
// //   season: string
// //   isActive: boolean
// //   attribute: {
// //     preparation: string
// //     rest: string
// //     persons: number
// //   }
// //   describe: {
// //     description: string
// //   }
// //   images: {
// //     imageUrl: string
// //   }[]
// //   healthBenefits: {
// //     healthBenefit: string
// //   }[]
// //   author: {
// //     authorName: string
// //     authorCategory: string
// //     authorPhone: string
// //     authorEmail: string
// //     authorWebsite: string
// //     authorImage: string
// //   }
// //   ingredients: {
// //     ingredientName: string
// //     quantity: string
// //     mainIngredient: boolean
// //     foodId: number
// //     available: boolean
// //     food: {
// //       id: number
// //       name: string
// //       images: {
// //         image: string
// //       }[]
// //     }
// //   }[]
// // }

// // const RecipeSchema = z.object({
// //   name: z
// //     .string()
// //     .nonempty("Required")
// //     .min(2, { message: "Must be at least 2 characters" }),
// //   category: z.string().min(1, "Please select a category"),
// //   season: z.string().min(1, "Please select a Season"),
// //   preparation: z.string().nonempty("Required"),
// //   rest: z.string().nonempty("Required"),
// //   persons: z.string().nonempty("Required"),
// //   benefits: z
// //     .array(z.string())
// //     .refine(arr => arr.some(item => item.trim().length > 0), {
// //       message: "Please enter at least one Benefit"
// //     }),
// //   ingredientData: z
// //     .array(z.unknown())
// //     .nonempty("At least one ingredient/category must be added."),
// //   authorName: z
// //     .string()
// //     .nonempty("Required")
// //     .min(2, { message: "Must be at least 2 characters" }),
// //   authorCategory: z.string().min(1, "Please select a category"),
// //   phone: z
// //     .string()
// //     .nonempty("Required")
// //     .refine(val => /^\d{10}$/.test(val) || /^\+\d{11}$/.test(val), {
// //       message: "Invalid Mobile number (e.g. 0712345678 or +94712345678)"
// //     }),
// //   email: z.string().nonempty("Required").email("Please enter a valid email."),
// //   website: z.string().url("Invalid URL format").optional().or(z.literal("")),
// //   recipe: z.string().refine(
// //     val => {
// //       const plainText = val.replace(/<(.|\n)*?>/g, "").trim()
// //       const hasImage = /<img\s+[^>]*src=["'][^"']+["'][^>]*>/i.test(val)
// //       return plainText !== "" || hasImage
// //     },
// //     {
// //       message: "Required"
// //     }
// //   ),
// //   authorimage: z.custom<File | null>(val => val instanceof File, {
// //     message: "Required"
// //   }),
// //   foodimage: z.custom<File | null>(val => val instanceof File, {
// //     message: "Required"
// //   })
// // })

// // // Dynamically load RichTextEditor with SSR disabled
// // const RichTextEditor = dynamic(
// //   async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
// //   { ssr: false }
// // )

// // export default function EditRecipePopUp({
// //   open,
// //   onClose,
// //   token,
// //   recipeId
// // }: Props): JSX.Element {
// //   const selectionRef = useRef<RichTextEditorHandle>(null)
// //   const [page, setPage] = React.useState<number>(1)
// //   const [pageSize, setPageSize] = React.useState<number>(5)
// //   const [recipeDetails, setRecipeDetails] = useState<RecipeDetailsTypes | null>(
// //     null
// //   )

// //   useEffect(() => {
// //     if (token && recipeId) {
// //       const getUserDetailsByUserId = async (): Promise<void> => {
// //         const response = await getRecipeById(token, recipeId)
// //         if (response.status === 200) {
// //           form.reset({
// //             name: response.data.name,
// //             category: response.data.category,
// //             season: response.data.season,
// //             preparation: response.data.attribute.preparation,
// //             rest: response.data.attribute.rest,
// //             persons: response.data.attribute.persons.toString(),
// //             benefits: response.data.healthBenefits.map(
// //               (b: { healthBenefit: string }) => b.healthBenefit
// //             ),
// //             authorName: response.data.author.authorName,
// //             authorCategory: response.data.author.authorCategory,
// //             phone: response.data.author.authorPhone,
// //             email: response.data.author.authorEmail,
// //             website: response.data.author.authorWebsite,
// //             recipe: response.data.describe.description,
// //             ingredientData: response.data.ingredients,
// //             authorimage: response.data.author.authorImage,
// //             foodimage: null
// //           })
// //           setRecipeDetails(response.data)
// //         } else {
// //           console.error("Failed to get recipe details")
// //         }
// //       }
// //       void getUserDetailsByUserId()
// //     }
// //   }, [token, recipeId])

// //   const onSubmit = (data: z.infer<typeof RecipeSchema>): void => {
// //     handleSaveChanges(data)
// //     toast("Form submitted successfully!", {})
// //   }
// //   const handleCancel = (
// //     form: ReturnType<typeof useForm<z.infer<typeof RecipeSchema>>>
// //   ): void => {
// //     form.reset()
// //   }

// //   // Define function for handling RichTextEditor changes
// //   const handleRichTextEditorChange = (field: any) => (val: string) => {
// //     field.onChange(val)
// //   }

// //   // Define function for handling image upload changes
// //   const handleImageUpload = (field: any) => (files: File[] | null) => {
// //     field.onChange(files && files.length > 0 ? files[0] : null)
// //   }

// //   // Table columns
// //   const ingredientColumns = [
// //     {
// //       header: "Ingredient Name",
// //       accessor: "name" as const
// //     },
// //     {
// //       header: "Quantity",
// //       accessor: "quantity" as const
// //     },
// //     {
// //       header: "Main Ingredient",
// //       accessor: (row: Ingredient) => (
// //         <Switch
// //           checked={row.isMain}
// //           className="scale-75"
// //           style={{ minWidth: 28, minHeight: 16 }}
// //         />
// //       )
// //     },
// //     {
// //       header: "Available in Ingredients",
// //       accessor: (row: Ingredient) =>
// //         row.tags.includes("InSystem") ? (
// //           <Badge className="px-2 py-1 text-xs text-black bg-green-200 rounded-md border border-green-500 transition-colors hover:bg-green-100">
// //             In the System
// //           </Badge>
// //         ) : (
// //           <Button
// //             variant="ghost"
// //             className="flex gap-1 items-center px-2 py-1 text-xs text-secondary-blue hover:bg-transparent focus:bg-transparent active:bg-transparent"
// //             size="sm"
// //           >
// //             <CircleFadingPlus size={14} />
// //             Add to Ingredients
// //           </Button>
// //         )
// //     }
// //   ]

// //   // Define functions to handle page changes
// //   const handlePageChange = (newPage: number): void => {
// //     setPage(newPage)
// //   }

// //   const handlePageSizeChange = (newSize: number): void => {
// //     setPageSize(newSize)
// //     setPage(1)
// //   }

// //   const categories: Option[] = [
// //     { value: "fruits", label: "Fruits" },
// //     { value: "vegetables", label: "Vegetables" },
// //     { value: "dairy", label: "Dairy" },
// //     { value: "Italian", label: "Italian" }
// //   ]
// //   const seasons: Option[] = [
// //     { value: "Spring", label: "Spring" },
// //     { value: "Summer", label: "Summer" },
// //     { value: "Autumn", label: "Autumn" },
// //     { value: "Winter", label: "Winter" }
// //   ]
// //   const authorSpeality: Option[] = [
// //     { value: "Chef", label: "Chef" },
// //     { value: "Summer", label: "Summer" },
// //     { value: "Autumn", label: "Autumn" }
// //   ]

// //   const form = useForm<z.infer<typeof RecipeSchema>>({
// //     resolver: zodResolver(RecipeSchema),
// //     defaultValues: {
// //       name: "",
// //       category: "",
// //       season: "",
// //       preparation: "",
// //       rest: "",
// //       persons: "",
// //       benefits: [],
// //       authorName: "",
// //       authorCategory: "",
// //       phone: "",
// //       email: "",
// //       website: "",
// //       recipe: "",
// //       authorimage: null,
// //       foodimage: null
// //     }
// //   })

// //   const getLinkedFoodImages = (): { src: string; alt: string }[] => {
// //     if (!recipeDetails?.ingredients) return []

// //     return recipeDetails.ingredients.flatMap(
// //       ingredient =>
// //         ingredient.food?.images?.map(img => ({
// //           src: img.image,
// //           alt: ingredient.food?.name || "Food Image"
// //         })) || []
// //     )
// //   }


// //   const handleSaveChanges = async (data: z.infer<typeof RecipeSchema>) => {
// //     try {
// //         const healthBenefits = data.benefits.map((benefit) => ({
// //             healthBenefit: benefit, // Assuming the backend expects an object with `healthBenefit` field
// //         }));
// //         // Construct the request body with form data
// //         const requestBody = {
// //         name: data.name,
// //         category: data.category,
// //         season: data.season,
// //         preparation: data.preparation,
// //         rest: data.rest,
// //         persons: data.persons,
// //         healthBenefits: healthBenefit,
// //         ingredients: data.ingredientData, // Assuming ingredient data is passed correctly
// //         authorName: data.authorName,
// //         authorCategory: data.authorCategory,
// //         phone: data.phone,
// //         email: data.email,
// //         website: data.website,
// //         recipe: data.recipe,
// //         authorimage: data.authorimage,
// //         foodimage: data.foodimage
// //         };

// //         let response;
        
// //         if (recipeId) {
// //         // Update existing recipe using PATCH
// //         response = await updateRecipe(token, recipeId, requestBody);
// //         } else {
// //         // Create new recipe using POST
// //         // response = await addNewRecipe(token, requestBody);
// //         }

// //         if (response.status === 200) {
// //         toast("Recipe saved successfully!");
// //         onClose(); // Close the popup after saving
// //         } else {
// //         toast.error("Failed to save recipe.");
// //         }
// //     } catch (error) {
// //         console.error("Error while saving recipe:", error);
// //         toast.error("An error occurred while saving the recipe.");
// //     }
// //     };

// //     // const onSubmit = (data: z.infer<typeof RecipeSchema>) => {
// //     //   handleSaveChanges(data); // Call handleSaveChanges when the form is submitted
// //     // };


// //   return (
// //     <Dialog open={open} onOpenChange={onClose}>
// //       <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
// //         <Form {...form}>
// //           <form onSubmit={form.handleSubmit(onSubmit)}>
// //             <div
// //               className="h-[calc(80vh-64px)] px-2 pt-2 pb-10 overflow-y-auto"
// //               style={{
// //                 scrollbarWidth: "none", // Firefox
// //                 msOverflowStyle: "none" // IE/Edge
// //               }}
// //             >
// //               <DialogTitle>Edit Recipe</DialogTitle>
// //               <div className="grid grid-cols-1 gap-4 pt-4 pb-6 sm:grid-cols-2 md:grid-cols-3">
// //                 <div>
// //                   <FormField
// //                     control={form.control}
// //                     name="name"
// //                     render={({ field }) => (
// //                       <FormItem className="flex-1">
// //                         <FormLabel className="block mb-1 text-black">
// //                           Name
// //                         </FormLabel>
// //                         <FormControl>
// //                           <Input
// //                             placeholder="Enter food name"
// //                             {...field}
// //                             // disabled
// //                           />
// //                         </FormControl>
// //                         <FormMessage />
// //                       </FormItem>
// //                     )}
// //                   />
// //                 </div>
// //                 <div>
// //                   <FormField
// //                     control={form.control}
// //                     name="category"
// //                     render={({ field }) => (
// //                       <FormItem>
// //                         <FormLabel className="block mb-1 text-black">
// //                           Category
// //                         </FormLabel>
// //                         <FormControl>
// //                           <Select
// //                             onValueChange={field.onChange}
// //                             value={field.value}
// //                             // disabled
// //                           >
// //                             <SelectTrigger className="mt-1 w-full">
// //                               <SelectValue placeholder="Select Category" />
// //                             </SelectTrigger>
// //                             <SelectContent>
// //                               {categories.map((option: Option) => (
// //                                 <SelectItem
// //                                   key={option.value}
// //                                   value={option.value}
// //                                 >
// //                                   {option.label}
// //                                 </SelectItem>
// //                               ))}
// //                             </SelectContent>
// //                           </Select>
// //                         </FormControl>
// //                         <FormMessage />
// //                       </FormItem>
// //                     )}
// //                   />
// //                 </div>
// //                 <div>
// //                   <FormField
// //                     control={form.control}
// //                     name="season"
// //                     render={({ field }) => (
// //                       <FormItem>
// //                         <FormLabel className="block mb-1 text-black">
// //                           Season
// //                         </FormLabel>
// //                         <FormControl>
// //                           <Select
// //                             onValueChange={field.onChange}
// //                             value={field.value}
// //                             // disabled
// //                           >
// //                             <SelectTrigger className="mt-1 w-full">
// //                               <SelectValue placeholder="Select Season" />
// //                             </SelectTrigger>
// //                             <SelectContent>
// //                               {seasons.map((option: Option) => (
// //                                 <SelectItem
// //                                   key={option.value}
// //                                   value={option.value}
// //                                 >
// //                                   {option.label}
// //                                 </SelectItem>
// //                               ))}
// //                             </SelectContent>
// //                           </Select>
// //                         </FormControl>
// //                         <FormMessage />
// //                       </FormItem>
// //                     )}
// //                   />
// //                 </div>
// //               </div>

// //               <Separator />

// //               <DialogTitle className="pt-4">Recipe Attributes</DialogTitle>
// //               <div className="grid grid-cols-1 gap-4 pt-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
// //                 <div>
// //                   <FormField
// //                     control={form.control}
// //                     name="preparation"
// //                     render={({ field }) => (
// //                       <FormItem className="flex-1">
// //                         <FormLabel className="block mb-1 text-black">
// //                           Preparation
// //                         </FormLabel>
// //                         <FormControl>
// //                           <Input
// //                             placeholder="How long does it take to make?"
// //                             {...field}
// //                             // disabled
// //                           />
// //                         </FormControl>
// //                         <FormMessage />
// //                       </FormItem>
// //                     )}
// //                   />
// //                 </div>
// //                 <div>
// //                   <FormField
// //                     control={form.control}
// //                     name="rest"
// //                     render={({ field }) => (
// //                       <FormItem className="flex-1">
// //                         <FormLabel className="block mb-1 text-black">
// //                           Rest
// //                         </FormLabel>
// //                         <FormControl>
// //                           <Input
// //                             placeholder="How long to keep it resting?"
// //                             {...field}
// //                             // disabled
// //                           />
// //                         </FormControl>
// //                         <FormMessage />
// //                       </FormItem>
// //                     )}
// //                   />
// //                 </div>
// //                 <div>
// //                   <FormField
// //                     control={form.control}
// //                     name="persons"
// //                     render={({ field }) => (
// //                       <FormItem className="flex-1">
// //                         <FormLabel className="block mb-1 text-black">
// //                           Persons
// //                         </FormLabel>
// //                         <FormControl>
// //                           <Input
// //                             placeholder="Number of people the meal serves"
// //                             {...field}
// //                             // disabled
// //                           />
// //                         </FormControl>
// //                         <FormMessage />
// //                       </FormItem>
// //                     )}
// //                   />
// //                 </div>
// //               </div>
// //               {/* Lable inputs for the health benefits */}
// //               <div className="w-[100%] ">
// //                 <FormField
// //                   control={form.control}
// //                   name="benefits"
// //                   render={({ field }) => (
// //                     <LableInput
// //                       title="Health Benefits"
// //                       placeholder="Add up to 6 food benefits or lower"
// //                       benefits={field.value || []}
// //                       name="benefits"
// //                       width="w-[32%]"
// //                     //   disable
// //                     />
// //                   )}
// //                 />
// //               </div>

// //               <Separator className="my-4" />

// //               <DialogTitle>Ingredients Selection</DialogTitle>

// //               <div className="flex flex-row gap-2 items-center pt-4 mb-4">
// //                 {/* <div className="flex-1">
// //                   <SearchBar
// //                     title="Select Your Ingredients"
// //                     placeholder="Search for ingredient"
// //                   />
// //                 </div> */}
// //                 {/* <div className="flex items-end mt-7 h-full">
// //                   <Button onClick={() => {}}>Add</Button>
// //                 </div> */}
// //               </div>
// //               <FormField
// //                 control={form.control}
// //                 name="ingredientData"
// //                 render={({ field }) => {
// //                   const ingredients = recipeDetails?.ingredients ?? []

// //                   const tableData = ingredients.map((item, index) => ({
// //                     id: index,
// //                     name: item.ingredientName,
// //                     quantity: item.quantity,
// //                     isMain: item.mainIngredient,
// //                     tags: item.available ? ["InSystem"] : ["Incomplete"]
// //                   }))

// //                   return (
// //                     <>
// //                       <CustomTable
// //                         columns={ingredientColumns}
// //                         data={tableData.slice(
// //                           (page - 1) * pageSize,
// //                           page * pageSize
// //                         )}
// //                         page={page}
// //                         pageSize={pageSize}
// //                         totalItems={tableData.length}
// //                         pageSizeOptions={[1, 5, 10]}
// //                         onPageChange={handlePageChange}
// //                         onPageSizeChange={handlePageSizeChange}
// //                       />
// //                       {tableData.length === 0 && (
// //                         <FormMessage className="text-red-500">
// //                           At least one ingredient/category must be added.
// //                         </FormMessage>
// //                       )}
// //                     </>
// //                   )
// //                 }}
// //               />

// //               <Separator className="my-4" />

// //               <DialogTitle>Describe the Recipe</DialogTitle>
// //               <div className="flex flex-col gap-6 pt-4 pb-2">
// //                 <div>
// //                   <FormField
// //                     control={form.control}
// //                     name="recipe"
// //                     render={({ field }) => (
// //                       <FormItem>
// //                         <FormLabel className="block mb-2 text-black">
// //                           Recipe
// //                         </FormLabel>
// //                         <FormControl>
// //                           <RichTextEditor
// //                             ref={selectionRef}
// //                             initialContent={field.value}
// //                             onChange={handleRichTextEditorChange(field)}
// //                             // disabled
// //                           />
// //                         </FormControl>
// //                         <FormMessage />
// //                       </FormItem>
// //                     )}
// //                   />
// //                 </div>
// //               </div>

// //               <Separator className="my-4" />

// //               <DialogTitle>Add Author</DialogTitle>

// //               <div className="flex flex-col gap-8 items-start pt-4 mb-4 sm:flex-row">
// //                 {/* Left: Author Inputs */}
// //                 <div className="grid flex-1 grid-cols-1 gap-4 w-full sm:grid-cols-2">
// //                   <div className="w-full">
// //                     <FormField
// //                       control={form.control}
// //                       name="authorName"
// //                       render={({ field }) => (
// //                         <FormItem className="flex-1">
// //                           <FormLabel className="block mb-1 text-black">
// //                             Name
// //                           </FormLabel>
// //                           <FormControl>
// //                             <Input
// //                               placeholder="Enter author name"
// //                               {...field}
// //                             //   disabled
// //                             />
// //                           </FormControl>
// //                           <FormMessage />
// //                         </FormItem>
// //                       )}
// //                     />
// //                   </div>
// //                   <div className="w-full">
// //                     <FormField
// //                       control={form.control}
// //                       name="authorCategory"
// //                       render={({ field }) => (
// //                         <FormItem>
// //                           <FormLabel className="block mb-1 text-black">
// //                             Category
// //                           </FormLabel>
// //                           <FormControl>
// //                             <Select
// //                               onValueChange={field.onChange}
// //                               value={field.value}
// //                             //   disabled
// //                             >
// //                               <SelectTrigger className="mt-1 w-full">
// //                                 <SelectValue placeholder="Enter author specialty" />
// //                               </SelectTrigger>
// //                               <SelectContent>
// //                                 {authorSpeality.map((option: Option) => (
// //                                   <SelectItem
// //                                     key={option.value}
// //                                     value={option.value}
// //                                   >
// //                                     {option.label}
// //                                   </SelectItem>
// //                                 ))}
// //                               </SelectContent>
// //                             </Select>
// //                           </FormControl>
// //                           <FormMessage />
// //                         </FormItem>
// //                       )}
// //                     />
// //                   </div>
// //                   <div className="w-full">
// //                     <FormField
// //                       control={form.control}
// //                       name="phone"
// //                       render={({ field }) => (
// //                         <FormItem className="flex-1">
// //                           <FormLabel className="block mb-1 text-black">
// //                             Phone
// //                           </FormLabel>
// //                           <FormControl>
// //                             <Input
// //                               placeholder="Enter author number"
// //                               {...field}
// //                             //   disabled
// //                             />
// //                           </FormControl>
// //                           <FormMessage />
// //                         </FormItem>
// //                       )}
// //                     />
// //                   </div>
// //                   <div className="w-full">
// //                     <FormField
// //                       control={form.control}
// //                       name="email"
// //                       render={({ field }) => (
// //                         <FormItem className="flex-1">
// //                           <FormLabel className="block mb-1 text-black">
// //                             Email
// //                           </FormLabel>
// //                           <FormControl>
// //                             <Input
// //                               placeholder="Enter author email"
// //                               {...field}
// //                             //   disabled
// //                             />
// //                           </FormControl>
// //                           <FormMessage />
// //                         </FormItem>
// //                       )}
// //                     />
// //                   </div>
// //                   <div className="w-full">
// //                     <FormField
// //                       control={form.control}
// //                       name="website"
// //                       render={({ field }) => (
// //                         <FormItem className="flex-1">
// //                           <FormLabel className="block mb-1 text-black">
// //                             Website
// //                           </FormLabel>
// //                           <FormControl>
// //                             <Input
// //                               placeholder="Enter author website"
// //                               {...field}
// //                             //   disabled
// //                             />
// //                           </FormControl>
// //                           <FormMessage />
// //                         </FormItem>
// //                       )}
// //                     />
// //                   </div>
// //                 </div>
// //                 {/* Right: Image Uploader */}
// //                 <div className="w-full sm:w-2/5">
// //                   <FormField
// //                     control={form.control}
// //                     name="authorimage"
// //                     render={({ field }) => (
// //                       <FormItem>
// //                         <FormControl>
// //                           <ImageUploader
// //                             title="Upload Author Image"
// //                             previewUrls={[
// //                               recipeDetails?.author.authorImage || ""
// //                             ]}
// //                             onChange={handleImageUpload(field)}
// //                             // disabled
// //                           />
// //                         </FormControl>
// //                         <FormMessage />
// //                       </FormItem>
// //                     )}
// //                   />
// //                 </div>
// //               </div>

// //               <DialogTitle>Upload Images</DialogTitle>

// //               <div className="pb-2 mt-6 w-full sm:w-2/5">
// //                 <FormField
// //                   control={form.control}
// //                   name="foodimage"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormControl>
// //                         <ImageUploader
// //                           title="Select Images for your Recipe item"
// //                           previewUrls={[
// //                             recipeDetails?.images[0].imageUrl || ""
// //                           ]}
// //                           onChange={handleImageUpload(field)}
// //                         //   disabled
// //                         />
// //                       </FormControl>
// //                       <FormMessage />
// //                     </FormItem>
// //                   )}
// //                 />
// //               </div>
// //               <Separator className="my-4" />

// //               <DialogTitle>Linked Food</DialogTitle>
// //               <div className="flex flex-wrap gap-4 pt-4">
// //                 {getLinkedFoodImages().map((imgObj, index) => (
// //                   <div key={index} className="flex flex-col items-center">
// //                     <Image
// //                       src={imgObj.src}
// //                       alt={imgObj.alt}
// //                       width={80}
// //                       height={80}
// //                       className="rounded-md border"
// //                     />
// //                     <span className="text-sm text-gray-700 mt-1 text-center max-w-[100px] truncate">
// //                       {imgObj.alt}
// //                     </span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             <DialogFooter>
// //               {/* Save and Cancel buttons */}
// //               <div className="flex fixed bottom-0 left-0 z-50 gap-2 justify-between px-4 py-4 w-full bg-white border-t">
// //                 <Button
// //                   variant="outline"
// //                   onClick={() => {
// //                     handleCancel(form)
// //                   }}
// //                 //   disabled
// //                 >
// //                   Cancel
// //                 </Button>
// //                 <Button type="submit" 
// //                 // disabled
// //                 >
// //                   Save
// //                 </Button>
// //               </div>
// //             </DialogFooter>
// //           </form>
// //         </Form>
// //       </DialogContent>
// //     </Dialog>
// //   )
// // }

// import React, { useEffect, useRef, useState } from "react"
// import {
//     Dialog,
//     DialogContent,
//     DialogFooter,
//     DialogTitle
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Separator } from "@/components/ui/separator"
// import { Button } from "@/components/ui/button"
// import { CustomTable } from "@/components/Shared/Table/CustomTable"
// import { Switch } from "@/components/ui/switch"
// import { Badge } from "@/components/ui/badge"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue
// } from "@/components/ui/select"
// import {
//     Form,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
//     FormControl
// } from "@/components/ui/form"
// import z from "zod"
// import { toast } from "sonner"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import dynamic from "next/dynamic"
// import { updateRecipe, getRecipeById } from "@/app/api/recipe"
// import LableInput from "@/components/Shared/LableInput/LableInput"

// const RichTextEditor = dynamic(
//     async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
//     { ssr: false }
// )

// interface Props {
//     open: boolean
//     onClose: () => void
//     token: string
//     recipeId: number
// }

// interface Ingredient {
//     id: number
//     name: string
//     quantity: string
//     isMain: boolean
//     tags: string[]
// }

// const RecipeSchema = z.object({
//     name: z.string().min(2, "Name is required"),
//     category: z.string().min(1, "Category is required"),
//     season: z.string().min(1, "Season is required"),
//     preparation: z.string(),
//     rest: z.string(),
//     persons: z.string(),
//     benefits: z.array(z.string()),
//     ingredientData: z.array(z.any()).min(1, "At least one ingredient is required"),
//     authorName: z.string().min(2),
//     authorCategory: z.string().min(1),
//     phone: z.string(),
//     email: z.string(),
//     website: z.string().optional().or(z.literal("")),
//     recipe: z.string(),
//     authorimage: z.any(),
//     foodimage: z.any()
// })

// export default function EditRecipePopUp({
//     open,
//     onClose,
//     token,
//     recipeId
// }: Props): JSX.Element {
//     const form = useForm<z.infer<typeof RecipeSchema>>({
//         resolver: zodResolver(RecipeSchema),
//         defaultValues: {
//             name: "",
//             category: "",
//             season: "",
//             preparation: "",
//             rest: "",
//             persons: "",
//             benefits: [],
//             ingredientData: [],
//             authorName: "",
//             authorCategory: "",
//             phone: "",
//             email: "",
//             website: "",
//             recipe: "",
//             authorimage: null,
//             foodimage: null
//         }
//     })

//     useEffect(() => {
//         if (token && recipeId) {
//             const fetchRecipe = async () => {
//                 const res = await getRecipeById(token, recipeId)
//                 if (res.status === 200) {
//                     const recipe = res.data
//                     form.reset({
//                         name: recipe.name,
//                         category: recipe.category,
//                         season: recipe.season,
//                         preparation: recipe.attribute.preparation,
//                         rest: recipe.attribute.rest,
//                         persons: recipe.attribute.persons.toString(),
//                         benefits: recipe.healthBenefits.map((b: any) => b.healthBenefit),
//                         authorName: recipe.author.authorName,
//                         authorCategory: recipe.author.authorCategory,
//                         phone: recipe.author.authorPhone,
//                         email: recipe.author.authorEmail,
//                         website: recipe.author.authorWebsite,
//                         recipe: recipe.describe.description,
//                         ingredientData: recipe.ingredients,
//                         authorimage: recipe.author.authorImage,
//                         foodimage: recipe.images[0]?.imageUrl || null
//                     })
//                 }
//             }
//             void fetchRecipe()
//         }
//     }, [token, recipeId])

//     const onSubmit = async (data: z.infer<typeof RecipeSchema>) => {
//         try {
//             const response = await updateRecipe(token, recipeId, data)
//             if (response.success || response.status === 200) {
//                 toast.success("Recipe updated successfully!")
//                 onClose()
//             } else {
//                 toast.error(response.message || "Failed to update recipe")
//             }
//         } catch (error) {
//             console.error(error)
//             toast.error("Update failed.")
//         }
//     }

//     const ingredientColumns = [
//         { header: "Ingredient", accessor: "name" as const },
//         { header: "Quantity", accessor: "quantity" as const },
//         {
//             header: "Main",
//             accessor: (row: Ingredient) => (
//                 <Switch checked={row.isMain} className="scale-75" />
//             )
//         },
//         {
//             header: "Available",
//             accessor: (row: Ingredient) =>
//                 row.tags.includes("InSystem") ? (
//                     <Badge className="bg-green-200 border border-green-500">In System</Badge>
//                 ) : (
//                     <Badge className="bg-red-200 border border-red-500">Not Added</Badge>
//                 )
//         }
//     ]

//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col gap-4">
//                         <DialogTitle>Edit Recipe</DialogTitle>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <FormField control={form.control} name="name" render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Name</FormLabel>
//                                     <FormControl><Input {...field} /></FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />

//                             <FormField control={form.control} name="category" render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Category</FormLabel>
//                                     <FormControl>
//                                         <Select value={field.value} onValueChange={field.onChange}>
//                                             <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="fruits">Fruits</SelectItem>
//                                                 <SelectItem value="vegetables">Vegetables</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />
//                         </div>

//                         <Separator />
//                         <DialogTitle>Recipe Attributes</DialogTitle>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             <FormField control={form.control} name="preparation" render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Preparation</FormLabel>
//                                     <FormControl><Input {...field} /></FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />
//                             <FormField control={form.control} name="rest" render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Rest</FormLabel>
//                                     <FormControl><Input {...field} /></FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />
//                             <FormField control={form.control} name="persons" render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Persons</FormLabel>
//                                     <FormControl><Input {...field} /></FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />
//                         </div>

//                         <Separator />
//                         <DialogTitle>Health Benefits</DialogTitle>
//                         <FormField control={form.control} name="benefits" render={({ field }) => (
//                             <LableInput title="Health Benefits" benefits={field.value || []} name="benefits" onChange={field.onChange} />
//                         )} />

//                         <Separator />
//                         <DialogTitle>Ingredients</DialogTitle>
//                         <CustomTable columns={ingredientColumns} data={form.watch("ingredientData")} />

//                         <Separator />
//                         <DialogTitle>Recipe</DialogTitle>
//                         <FormField control={form.control} name="recipe" render={({ field }) => (
//                             <RichTextEditor initialContent={field.value} onChange={field.onChange} />
//                         )} />

//                         <DialogFooter className="mt-auto">
//                             <Button type="submit">Update Recipe</Button>
//                             <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
//                         </DialogFooter>
//                     </form>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     )
// }
// import React, { useEffect, useRef, useState } from "react"
// import {
//     Dialog,
//     DialogContent,
//     DialogFooter,
//     DialogTitle
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Separator } from "@/components/ui/separator"
// import { Button } from "@/components/ui/button"
// import { CustomTable } from "@/components/Shared/Table/CustomTable"
// import { Switch } from "@/components/ui/switch"
// import { Badge } from "@/components/ui/badge"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue
// } from "@/components/ui/select"
// import {
//     Form,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
//     FormControl
// } from "@/components/ui/form"
// import z from "zod"
// import { toast } from "sonner"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import dynamic from "next/dynamic"
// import { updateRecipe, getRecipeById } from "@/app/api/recipe"
// import LableInput from "@/components/Shared/LableInput/LableInput"

// const RichTextEditor = dynamic(
//     async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
//     { ssr: false }
// )

// interface Props {
//     open: boolean
//     onClose: () => void
//     token: string
//     recipeId: number
// }

// interface Ingredient {
//     id: number
//     name: string
//     quantity: string
//     isMain: boolean
//     tags: string[]
// }

// const RecipeSchema = z.object({
//     name: z.string().min(2, "Name is required"),
//     category: z.string().min(1, "Category is required"),
//     season: z.string().min(1, "Season is required"),
//     preparation: z.string(),
//     rest: z.string(),
//     persons: z.string(),
//     benefits: z.array(z.string()),
//     ingredientData: z.array(z.any()).min(1, "At least one ingredient is required"),
//     authorName: z.string().min(2),
//     authorCategory: z.string().min(1),
//     phone: z.string(),
//     email: z.string(),
//     website: z.string().optional().or(z.literal("")),
//     recipe: z.string(),
//     authorimage: z.any(),
//     foodimage: z.any()
// })

// export default function EditRecipePopUp({
//     open,
//     onClose,
//     token,
//     recipeId
// }: Props): JSX.Element {
//     const form = useForm<z.infer<typeof RecipeSchema>>({
//         resolver: zodResolver(RecipeSchema),
//         defaultValues: {
//             name: "",
//             category: "",
//             season: "",
//             preparation: "",
//             rest: "",
//             persons: "",
//             benefits: [],
//             ingredientData: [],
//             authorName: "",
//             authorCategory: "",
//             phone: "",
//             email: "",
//             website: "",
//             recipe: "",
//             authorimage: null,
//             foodimage: null
//         }
//     })

//     useEffect(() => {
//         if (token && recipeId) {
//             const fetchRecipe = async () => {
//                 const res = await getRecipeById(token, recipeId)
//                 if (res.status === 200) {
//                     const recipe = res.data
//                     form.reset({
//                         name: recipe.name,
//                         category: recipe.category,
//                         season: recipe.season,
//                         preparation: recipe.attribute.preparation,
//                         rest: recipe.attribute.rest,
//                         persons: recipe.attribute.persons.toString(),
//                         benefits: recipe.healthBenefits.map((b: any) => b.healthBenefit),
//                         authorName: recipe.author.authorName,
//                         authorCategory: recipe.author.authorCategory,
//                         phone: recipe.author.authorPhone,
//                         email: recipe.author.authorEmail,
//                         website: recipe.author.authorWebsite,
//                         recipe: recipe.describe.description,
//                         ingredientData: recipe.ingredients,
//                         authorimage: recipe.author.authorImage,
//                         foodimage: recipe.images[0]?.imageUrl || null
//                     })
//                 }
//             }
//             void fetchRecipe()
//         }
//     }, [token, recipeId])

//     const onSubmit = async (data: z.infer<typeof RecipeSchema>) => {
//         try {
//             const response = await updateRecipe(token, recipeId, data)
//             if (response.success || response.status === 200) {
//                 toast.success("Recipe updated successfully!")
//                 onClose()
//             } else {
//                 toast.error(response.message || "Failed to update recipe")
//             }
//         } catch (error) {
//             console.error(error)
//             toast.error("Update failed.")
//         }
//     }

//     const ingredientColumns = [
//         { header: "Ingredient", accessor: "name" as const },
//         { header: "Quantity", accessor: "quantity" as const },
//         {
//             header: "Main",
//             accessor: (row: Ingredient) => (
//                 <Switch checked={row.isMain} className="scale-75" />
//             )
//         },
//         {
//             header: "Available",
//             accessor: (row: Ingredient) =>
//                 row.tags.includes("InSystem") ? (
//                     <Badge className="bg-green-200 border border-green-500">In System</Badge>
//                 ) : (
//                     <Badge className="bg-red-200 border border-red-500">Not Added</Badge>
//                 )
//         }
//     ]

//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col gap-4">
//                         <DialogTitle>Edit Recipe</DialogTitle>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <FormField control={form.control} name="name" render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Name</FormLabel>
//                                     <FormControl><Input {...field} /></FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />

//                             <FormField control={form.control} name="category" render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Category</FormLabel>
//                                     <FormControl>
//                                         <Select value={field.value} onValueChange={field.onChange}>
//                                             <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="fruits">Fruits</SelectItem>
//                                                 <SelectItem value="vegetables">Vegetables</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />
//                         </div>

//                         <Separator />
//                         <DialogTitle>Recipe Attributes</DialogTitle>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             <FormField control={form.control} name="preparation" render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Preparation</FormLabel>
//                                     <FormControl><Input {...field} /></FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />
//                             <FormField control={form.control} name="rest" render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Rest</FormLabel>
//                                     <FormControl><Input {...field} /></FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />
//                             <FormField control={form.control} name="persons" render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Persons</FormLabel>
//                                     <FormControl><Input {...field} /></FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />
//                         </div>

//                         <Separator />
//                         <DialogTitle>Health Benefits</DialogTitle>
//                         <FormField control={form.control} name="benefits" render={({ field }) => (
//                             <LableInput title="Health Benefits" benefits={field.value || []} name="benefits" onChange={field.onChange} />
//                         )} />

//                         <Separator />
//                         <DialogTitle>Ingredients</DialogTitle>
//                         <CustomTable columns={ingredientColumns} data={form.watch("ingredientData")} />

//                         <Separator />
//                         <DialogTitle>Recipe</DialogTitle>
//                         <FormField control={form.control} name="recipe" render={({ field }) => (
//                             <RichTextEditor initialContent={field.value} onChange={field.onChange} />
//                         )} />

//                         <DialogFooter className="mt-auto">
//                             <Button type="submit">Update Recipe</Button>
//                             <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
//                         </DialogFooter>
//                     </form>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     )
// }
