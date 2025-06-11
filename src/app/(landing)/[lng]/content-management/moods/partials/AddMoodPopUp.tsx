"use client"

import React, { useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import ImageUploader from "@/components/Shared/ImageUploder/ImageUploader"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import SearchBar from "@/components/Shared/SearchBar/SearchBar"
import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Badge } from "@/components/ui/badge"

const RichTextEditor = dynamic(
  async () => await import("@/components/Shared/TextEditor/RichTextEditor"),
  { ssr: false }
)

interface Option {
  value: string
  label: string
}
const categories: Option[] = [
  { value: "Breakfast", label: "Breakfast" },
  { value: "Dinner", label: "Dinner" },
  { value: "dairy", label: "Dairy" }
]

const shopStatus: Option[] = [
  { value: "physical", label: "physical" },
  { value: "Online", label: "Online" }
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function AddMoodPopUp({ open, onClose }: Props): JSX.Element {
  const aboutRef = useRef<any>(null)
  const [page, setPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(5)

  interface AvailableItem {
    id: number
    name: string
    type: string
    status: "Active" | "Inactive"
    display: boolean
    tags: string[]
    quantity: string
    isMain: boolean
  }
  // Dummy table data
  const availData: AvailableItem[] = [
    {
      id: 1,
      name: "Tomato",
      type: "Ingredient",
      status: "Active",
      display: true,
      tags: ["InSystem"],
      quantity: "1kg",
      isMain: true
    },
    {
      id: 2,
      name: "Vegetables",
      type: "Category",
      status: "Inactive",
      display: false,
      tags: [],
      quantity: "500g",
      isMain: false
    }
  ]

  const availColumns = [
    {
      header: "Available Ingredients & Categories",
      accessor: "name" as const
    },
    {
      header: "Type",
      accessor: (row: { type: string }) => (
        <Badge className="px-2 py-1 text-xs text-black bg-white border border-gray-100 rounded-md hover:bg-white">
          {row.type}
        </Badge>
      )
    },
    {
      header: "Availability Status",
      accessor: (row: (typeof availData)[0]) => (
        <Badge
          className={
            row.tags.includes("InSystem")
              ? "bg-green-200 text-black text-xs px-2 py-1 rounded-md border border-green-500 hover:bg-green-100 transition-colors"
              : "bg-gray-200 text-black text-xs px-2 py-1 rounded-md border border-gray-500 hover:bg-gray-100 transition-colors"
          }
        >
          {row.tags.includes("InSystem") ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      header: "Display Status",
      accessor: (row: any) => (
        <Switch checked={row.display} className="scale-75" />
      )
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="h-full p-2 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>
            {`div::-webkit-scrollbar { width: 0px; background: transparent; }`}
          </style>

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-black">Add New Store</h2>
          </div>

          {/* Store info */}
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <Label className="block mb-1 text-black">Store Name</Label>
              <Input placeholder="Enter store name" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Category</Label>
              <Input
                id="categorySelect"
                name="categorySelect"
                options={categories}
                placeholder="Select category"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="block mb-1 text-black">Store Location</Label>
              <Input placeholder="Enter store location" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Shop Status</Label>
              <Input
                id="StatusSelect"
                name="StatusSelect"
                options={shopStatus}
                placeholder="Select shop status"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="block mb-1 text-black">
                Store Map Location
              </Label>
              <Input placeholder="Enter map location" />
            </div>

            <div>
              <Label className="block mb-1 text-black">Store Type</Label>
              <div className="flex items-center gap-4 mt-2">
                <Switch />
                <Label className="text-Primary-300">Premium Store</Label>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Time</Label>
              <div className="flex items-center gap-7">
                <div className="flex flex-col">
                  <Label htmlFor="time-from" className="text-xs text-gray-400">
                    From
                  </Label>
                  <Input
                    type="time"
                    id="time-from"
                    step="1"
                    defaultValue="10:30:00"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="time-to" className="text-xs text-gray-400">
                    To
                  </Label>
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

          <Separator className="my-6" />

          {/* Contact info */}
          <h3 className="mb-4 text-lg font-semibold text-black">
            Store Contact
          </h3>
          <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <Label className="block mb-1 text-black">Mobile Number</Label>
              <Input placeholder="Enter store number" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Email</Label>
              <Input placeholder="Enter store email" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Maps Pin</Label>
              <Input placeholder="Enter google maps location" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Facebook</Label>
              <Input placeholder="Enter Facebook URL" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Instagram</Label>
              <Input placeholder="Enter Instagram URL" />
            </div>
            <div>
              <Label className="block mb-1 text-black">Website</Label>
              <Input placeholder="Enter Website URL" />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Available Products */}
          <h3 className="mb-4 text-lg font-semibold text-black">
            Available Products
          </h3>
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-col items-center w-full gap-2 sm:flex-row">
              <div className="flex flex-row items-center flex-1 gap-2 mb-2">
                <div className="flex-1">
                  <SearchBar
                    title="Select available Ingredients"
                    placeholder="Search for ingredients"
                  />
                </div>
                <div className="flex items-end h-full mt-7">
                  <Button onClick={() => {}}>Add</Button>
                </div>
              </div>
              <div className="flex flex-row items-center flex-1 gap-2 mb-2">
                <div className="flex-1">
                  <SearchBar
                    title="Select available categories"
                    placeholder="Search available categories"
                  />
                </div>
                <div className="flex items-end h-full mt-7">
                  <Button onClick={() => {}}>Add</Button>
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
              onPageChange={newPage => {
                setPage(newPage)
              }}
              onPageSizeChange={newSize => {
                setPageSize(newSize)
                setPage(1)
              }}
            />
          </div>

          <Separator className="my-4" />

          {/* About The Shop */}
          <h3 className="mb-4 text-lg font-semibold text-black">
            About The Shop
          </h3>
          <div className="flex flex-col gap-6">
            <div>
              <span className="block mb-2 text-sm text-black">About Us</span>
              <RichTextEditor ref={aboutRef} />
            </div>
          </div>

          <Separator className="my-4" />

          {/* Upload Images */}
          <div className="w-full mt-6 sm:w-2/5">
            <h3 className="mb-4 text-lg font-semibold text-black">
              Upload Images
            </h3>
            <ImageUploader title="Select Images for your store" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
