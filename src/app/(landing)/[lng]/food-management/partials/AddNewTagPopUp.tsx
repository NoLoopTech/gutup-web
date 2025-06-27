"use client"

import React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AddNewTag } from "@/app/api/foods"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface Props {
  open: boolean
  onClose: () => void
  token: string
}
interface Option {
  value: string
  label: string
}
// Dummy categories
const categories: Option[] = [
  { value: "Type", label: "Type" },
  { value: "Benefit", label: "Benefit" }
]
// Schema
const TagSchema = z.object({
  category: z.string().nonempty("Please select a category"),
  tagName: z
    .string()
    .nonempty("Required")
    .min(2, "Tag name must be at least 2 characters")
})

export default function AddNewTagPopUp({
  open,
  onClose,
  token
}: Props): JSX.Element {
  const form = useForm<z.infer<typeof TagSchema>>({
    resolver: zodResolver(TagSchema),
    defaultValues: {
      category: "",
      tagName: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof TagSchema>): Promise<void> => {
    try {
      const response = await AddNewTag(token, data)

      if (response?.status === 200 || response?.status === 201) {
        toast.success("Tag added successfully!", {
          description: `${data.tagName} added under ${data.category}`
        })
        onClose()
        form.reset() // reset the form after success
      } else {
        toast.error("Failed to add tag", {
          description: response?.message || "Unexpected error occurred"
        })
      }
    } catch (error: any) {
      toast.error("Error adding tag", {
        description: error?.response?.data?.message || error.message
      })
    }
  }

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
                          {categories.map(option => (
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
  )
}
