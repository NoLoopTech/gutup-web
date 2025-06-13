"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import { Button } from "@/components/ui/button"
import { CustomTable } from "@/components/Shared/Table/CustomTable"
import SearchBar from "@/components/Shared/SearchBar/SearchBar"
import { Switch } from "@/components/ui/switch"

interface Ingredient {
  id: number
  name: string
  quantity: string
  isMain: boolean
  tags: string[]
}
// Column type
interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
}

// Table columns
const ingredientColumns: Array<Column<Ingredient>> = [
  {
    header: "Ingredient Name",
    accessor: "name" as const
  },
  {
    header: "Main Ingredient",
    accessor: (row: {
      id: number
      name: string
      quantity: string
      isMain: boolean
      tags: string[]
    }) => (
      <Switch
        checked={row.isMain}
        className="scale-75"
        style={{ minWidth: 28, minHeight: 16 }}
      />
    )
  }
]

export default function ShopPromotionTab(): JSX.Element {
  // Sample data for ingredients
  const [ingredientData] = React.useState<Ingredient[]>([
    { id: 1, name: "Tomato", quantity: "2", isMain: true, tags: ["fresh"] },
    { id: 2, name: "Onion", quantity: "1", isMain: false, tags: ["spicy"] },
    {
      id: 3,
      name: "Garlic",
      quantity: "3 cloves",
      isMain: false,
      tags: ["aromatic"]
    },
    {
      id: 4,
      name: "Basil",
      quantity: "a handful",
      isMain: false,
      tags: ["herb"]
    },
    {
      id: 5,
      name: "Olive Oil",
      quantity: "2 tbsp",
      isMain: false,
      tags: ["oil"]
    }
  ])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(2)

  return (
    <>
      <div className="space-y-4 text-black">
        <div
          className="flex items-start justify-end"
          style={{ marginTop: "-4.4rem" }}
        >
          <div className="w-80" style={{ width: "25.5rem" }}>
            <Label className="block mb-1 text-black">Shop Name</Label>
            <Input placeholder="Enter shop name" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 mb-1">
            <Label className="block mb-1 text-black">Sub Title</Label>
            <Input placeholder="Give a tip title" />
          </div>

          <div className="flex-1 mb-1">
            <Label className="block mb-1 text-black">Sub Description</Label>
            <Input placeholder="Describe in detail" />
          </div>
        </div>
        <div className="flex-1 mb-2 w-100">
          <Label className="block mb-1 text-black">Sub Description</Label>
          <Input placeholder="Describe in detail" className="h-14" />
        </div>

        <Separator />

        <div className="flex items-center justify-between mt-4 mb-4">
          <h2 className="text-lg font-bold text-black">Store Contact</h2>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 mb-1">
            <Label className="block mb-1 text-black">Mobile Number</Label>
            <Input placeholder="+123456789" />
          </div>

          <div className="flex-1 mb-1">
            <Label className="block mb-1 text-black">Email</Label>
            <Input placeholder="example@example.com" />
          </div>

          <div className="flex-1 mb-1">
            <Label className="block mb-1 text-black">Maps Pin</Label>
            <Input placeholder="Enter google maps location" />
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex-1 mb-1">
            <Label className="block mb-1 text-black">Facebook</Label>
            <Input placeholder="Enter Facebook URL" />
          </div>

          <div className="flex-1 mb-1">
            <Label className="block mb-1 text-black">Instagram</Label>
            <Input placeholder="Enter Instagram URL" />
          </div>

          <div className="flex-1 mb-1">
            <Label className="block mb-1 text-black">Website</Label>
            <Input placeholder="Enter website URL" />
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between mt-4 mb-4">
          <h2 className="text-lg font-bold text-black">Star Products</h2>
        </div>

        <div className="flex flex-row items-center gap-2 mb-4">
          <div className="flex-1">
            <SearchBar
              title="Select Featured Ingredients"
              placeholder="Search for ingredient"
            />
          </div>
          <div className="flex items-end h-full mt-7">
            <Button onClick={() => {}}>Add</Button>
          </div>
        </div>
        <Label className="block text-gray-500">
          Cant find the ingredient you want? Please add the food item first to
          select the ingredient
        </Label>
        <CustomTable
          columns={ingredientColumns}
          data={ingredientData.slice((page - 1) * pageSize, page * pageSize)}
          page={page}
          pageSize={pageSize}
          totalItems={ingredientData.length}
          pageSizeOptions={[2, 5, 10]}
          onPageChange={newPage => {
            setPage(newPage)
          }}
          onPageSizeChange={newSize => {
            setPageSize(newSize)
            setPage(1)
          }}
        />

        <Separator />

        <div className="flex items-center justify-between mt-4 mb-4">
          <h2 className="text-lg font-bold text-black">Upload Images</h2>
        </div>
        {/* Image Uploader */}
        <div className="w-full pb-8 sm:w-2/5">
          <ImageUploader title="Select Images for your food item" />
        </div>
      </div>
      {/* Buttons */}
      <div className="fixed bottom-0 left-0 z-50 flex justify-between w-full px-8 py-2 bg-white border-t border-gray-200">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </div>
    </>
  )
}
