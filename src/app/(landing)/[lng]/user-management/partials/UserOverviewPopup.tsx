// UserOverviewPopup.tsx
"use client"

import React from "react"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Sample from "@/../../public/images/sample-image.png"

interface Props {
  open: boolean
  onClose: () => void
}

export default function UserOverviewPopup({
  open,
  onClose
}: Props): JSX.Element {
  const badges: { label: string; value: string }[] = [
    {
      label: "Stress",
      value: "stress"
    },
    {
      label: "Fatigue",
      value: "fatigue"
    },
    {
      label: "Weight",
      value: "weight"
    }
  ]

  const food: { name: string; image: string }[] = [
    {
      name: "Pizza",
      image: Sample.src
    },
    {
      name: "Pizza",
      image: Sample.src
    },
    {
      name: "Pizza",
      image: Sample.src
    },
    {
      name: "Pizza",
      image: Sample.src
    },
    {
      name: "Pizza",
      image: Sample.src
    },
    {
      name: "Pizza",
      image: Sample.src
    },
    {
      name: "Pizza",
      image: Sample.src
    }
  ]

  const recipes: { name: string; image: string }[] = [
    {
      name: "Pizza",
      image: Sample.src
    },
    {
      name: "Pizza",
      image: Sample.src
    },
    {
      name: "Pizza",
      image: Sample.src
    },
    {
      name: "Pizza",
      image: Sample.src
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="h-full p-2 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* User Details */}
          <h3 className="text-lg font-semibold text-black">User Details</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input placeholder="Name" disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input placeholder="Email" disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Gender</Label>
              <Input placeholder="Gender" disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Birthday</Label>
              <Input placeholder="Birthday" disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Registration Date</Label>
              <Input placeholder="Registration Date" disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Daily Score Points</Label>
              <Input placeholder="Daily Score Points" disabled />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Health Data */}
          <h3 className="text-lg font-semibold text-black">Health Data</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label>How would you describe your current diet?</Label>
              <Input
                placeholder="How would you describe your current diet?"
                disabled
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>What is your rhythm of life?</Label>
              <Input placeholder="What is your rhythm of life?" disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Concerns</Label>
              <div className="flex flex-wrap gap-2">
                {badges.map(badge => (
                  <Badge key={badge.value} variant={"outline"}>
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Favorite Food */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black ">
                Favorite Food
              </h3>
              <h3 className="text-base text-gray-500 ">{food.length} Items</h3>
            </div>
            <div className="flex flex-wrap gap-2 text-center">
              {food.map(f => (
                <div key={f.name}>
                  <Image src={f.image} alt={f.name} width={100} height={100} />
                  <Label>{f.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Favorite Recipes */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black ">
                Favorite Recipes
              </h3>
              <h3 className="text-base text-gray-500 ">
                {recipes.length} Items
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-center">
              {recipes.map(f => (
                <div key={f.name}>
                  <Image src={f.image} alt={f.name} width={100} height={100} />
                  <Label>{f.name}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full gap-2">
            <Button variant={"outline"}>Delete User</Button>
            <Button>Reset Password</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
