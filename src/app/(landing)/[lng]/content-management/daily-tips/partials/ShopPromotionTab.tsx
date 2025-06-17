"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import { Button } from "@/components/ui/button"
import { CustomTable } from "@/components/Shared/Table/CustomTable"
import SearchBar from "@/components/Shared/SearchBar/SearchBar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface Option { value: string; label: string }
interface Ingredient { id: number; name: string; quantity: string; isMain: boolean; tags: string[] }
interface Column<T> { header: string; accessor: keyof T | ((row: T) => React.ReactNode) }

const concerns: Option[] = [
  { value: "Stress", label: "Stress" },
  { value: "Anxiety", label: "Anxiety" },
  { value: "Depression", label: "Depression" },
]

const ingredientColumns: Array<Column<Ingredient>> = [
  { header: "Ingredient Name", accessor: "name" },
  {
    header: "Main Ingredient",
    accessor: row => (
      <Switch checked={row.isMain} className="scale-75" style={{ minWidth: 28, minHeight: 16 }} />
    ),
  },
]

// Validate only inputs and select
const FormSchema = z.object({
  shopName: z.string().min(1, { message: "Required" }),
  reason: z.string().nonempty("Please select a reason to display"),
  shopLocation: z.string().min(2, { message: "Required" }),
  shopCategory: z.string().min(2, { message: "Required" }),
  subDescription: z
    .string()
    .nonempty("Required")
    .min(10, { message: "Sub Description must be at least 10 characters long" }),
  mobileNumber: z
    .string()
    .nonempty("Required")
    .regex(/^(\+\d{11}|\d{10})$/, "Invalid mobile number format. Use +94712345678 or 0712345678"),
  email: z.string()
    .nonempty("Required")
    .email({ message: "Invalid email address" }),
  mapsPin: z.string().min(1, { message: "Required" }),
  facebook: z.string()
    .nonempty("Required")
    .url({ message: "Invalid Facebook URL" }),
  instagram: z.string()
    .nonempty("Required")
    .url({ message: "Invalid Instagram URL" }),
  website: z.string()
    .nonempty("Required")
    .url({ message: "Invalid Website URL" }),
  image: z
    .custom<File | null>((val) => val instanceof File, {
      message: "Required",
    }),
  dateselect: z.date({
    required_error: "Required",
  }),
})

export default function ShopPromotionTab(): JSX.Element {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(2)
  const [ingredientData] = React.useState<Ingredient[]>([
    { id: 1, name: "Tomato", quantity: "2", isMain: true, tags: ["fresh"] },
    { id: 2, name: "Onion", quantity: "1", isMain: false, tags: ["spicy"] },
    { id: 3, name: "Garlic", quantity: "3 cloves", isMain: false, tags: ["aromatic"] },
    { id: 4, name: "Basil", quantity: "a handful", isMain: false, tags: ["herb"] },
    { id: 5, name: "Olive Oil", quantity: "2 tbsp", isMain: false, tags: ["oil"] },
  ])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      shopName: "",
      reason: "",
      shopLocation: "",
      shopCategory: "",
      subDescription: "",
      mobileNumber: "",
      email: "",
      mapsPin: "",
      facebook: "",
      instagram: "",
      website: "",
      image: null,
      dateselect: undefined,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    toast("Form submitted", {
      description: JSON.stringify(data, null, 2),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-3 text-black">
          {/* Shop Name */}
          <div className="flex items-start lg:justify-end lg:-mt-[4.8rem]">
            <div className="w-[25.5rem]">
              <FormField control={form.control} name="shopName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shop name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row pt-2">
            <div className="w-full md:w-[25.5rem]">
              <FormField
                control={form.control}
                name="dateselect"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>When to be Displayed</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!field}
                          className="data-[empty=true]:text-muted-foreground w-[25.5rem] justify-between text-left font-normal"
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : <span>Pick a date</span>
                          }
                          <CalendarIcon className="ml-2 h-4 w-4 text-gray-500" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Reason */}
            <div className="w-full md:w-[25.5rem] mt-[-0.4rem]">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason to Display</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {concerns.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
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

          <div className="flex gap-4">
            {/* Location */}
            <FormField control={form.control} name="shopLocation" render={({ field }) => (
              <FormItem className="flex-1 mb-1">
                <FormLabel>Shop Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter shop location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {/* Category */}
            <FormField control={form.control} name="shopCategory" render={({ field }) => (
              <FormItem className="flex-1 mb-1">
                <FormLabel>Shop Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter shop category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Sub Description */}
          <div className="pb-1">
            <FormField control={form.control} name="subDescription" render={({ field }) => (
              <FormItem className="flex-1 mb-2">
                <FormLabel>Sub Description</FormLabel>
                <FormControl>
                  <Input placeholder="Describe in detail" className="h-14" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <Separator />

          {/* Store Contact */}
          <div className="flex gap-6">
            <FormField control={form.control} name="mobileNumber" render={({ field }) => (
              <FormItem className="flex-1 mb-1">
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="+123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem className="flex-1 mb-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mapsPin" render={({ field }) => (
              <FormItem className="flex-1 mb-1">
                <FormLabel>Maps Pin</FormLabel>
                <FormControl>
                  <Input placeholder="Enter google maps location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="flex gap-6 pb-1">
            <FormField control={form.control} name="facebook" render={({ field }) => (
              <FormItem className="flex-1 mb-1">
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Facebook URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="instagram" render={({ field }) => (
              <FormItem className="flex-1 mb-1">
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Instagram URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="website" render={({ field }) => (
              <FormItem className="flex-1 mb-1">
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Enter website URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <Separator />

          {/* Star Products */}
          <div className="flex flex-row items-center gap-2 mb-4">
            <SearchBar title="Select Featured Ingredients" placeholder="Search for ingredient" />
            <Button className="mt-7" onClick={() => { }}>Add</Button>
          </div>
          <Label className="block text-gray-500">
            Cant find the ingredient you want? Please add the food item first to select the ingredient
          </Label>
          <CustomTable
            columns={ingredientColumns}
            data={ingredientData.slice((page - 1) * pageSize, page * pageSize)}
            page={page}
            pageSize={pageSize}
            totalItems={ingredientData.length}
            pageSizeOptions={[2, 5, 10]}
            onPageChange={newPage => { setPage(newPage); }}
            onPageSizeChange={newSize => { setPageSize(newSize); setPage(1) }}
          />

          <Separator />

          <div className="flex items-center justify-between mt-4 mb-4">
            <h2 className="text-lg font-bold text-black">Upload Images</h2>
          </div>

          {/* Image Uploader */}
          <div className="w-full pb-8 sm:w-2/5">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      title="Select Images for your food item"
                      onChange={(file) => {
                        field.onChange(file)
                        form.clearErrors("image")
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


          </div>
        </div>

        {/* Buttons */}
        <div className="fixed bottom-0 left-0 z-50 flex justify-between w-full px-8 py-2 bg-white border-t border-gray-200">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  )
}
