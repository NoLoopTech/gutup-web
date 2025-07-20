"use client"

import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Sample from "@/../../public/images/sample-image.png"
import { deleteUserById, getUserById } from "@/app/api/user"
import { getUserFavorites } from "@/app/api/store"
import dayjs from "dayjs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Props {
  open: boolean
  onClose: () => void
  userId: number
  token: string
  getUsers: () => void
}

export interface UserDetails {
  id: number
  name: string
  email: string
  gender: string | null
  dob: string | null
  currentDiet: string | null
  rhythmOfLife: string | null
  dailyScore: number
  createdAt: string
  updatedAt: string
}

interface FavoriteFood {
  id: number
  food: {
    id: number
    name: string
    images: string[]
  }
}

interface FavoriteRecipe {
  id: number
  recipe: {
    id: number
    name: string
    images: string[]
  }
}

interface UserFavorites {
  favouriteFoods: FavoriteFood[]
  favouriteRecipes: FavoriteRecipe[]
}

export default function UserOverviewPopup({
  open,
  onClose,
  token,
  userId,
  getUsers
}: Props): JSX.Element {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const [userFavorites, setUserFavorites] = useState<UserFavorites | null>(null)

  // Reset state only when userId changes
  useEffect(() => {
    setUserDetails(null)
    setUserFavorites(null)
  }, [userId])

  useEffect(() => {
    if (open && token && userId) {
      const getUserDetailsByUserId = async (): Promise<void> => {
        const response = await getUserById(token, userId)
        if (response.status === 200) {
          setUserDetails(response.data)
        } else {
          console.error("Failed to get user details")
        }
      }

      const fetchUserFavorites = async (): Promise<void> => {
        const response = await getUserFavorites(token, userId)
        if (response.status === 200) {
          setUserFavorites(response.data)
        } else {
          console.error("Failed to get user favorites")
        }
      }

      void getUserDetailsByUserId()
      void fetchUserFavorites()
    }
  }, [open, token, userId])

  // handle delete user by id
  const handleDeleteUserById = async (): Promise<void> => {
    const response = await deleteUserById(token, userId)
    if (response.status === 200 && response.data.success) {
      toast.success(response.data.message)
      onClose()
      setConfirmDeleteOpen(false)
      getUsers()
    } else {
      toast.error("Failed to delete user", {
        description: response.data.message
      })
      setConfirmDeleteOpen(false)
    }
  }

  // handle open delete confirmation popup
  const handleOpenDeleteConfirmationPopup = (): void => {
    setConfirmDeleteOpen(true)
  }

  // handle close delete confirmation popup
  const handleCloseDeleteConfirmationPopup = (): void => {
    setConfirmDeleteOpen(false)
  }

  const badges: any[] = [
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="h-full p-2 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* User Details */}
          <DialogTitle>User Details</DialogTitle>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input
                placeholder="Name"
                disabled
                value={userDetails?.name ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                placeholder="Email"
                disabled
                value={userDetails?.email ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Gender</Label>
              <Input
                placeholder="Gender"
                disabled
                value={userDetails?.gender ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Birthday</Label>
              <Input
                placeholder="Birthday"
                disabled
                value={dayjs(userDetails?.dob).format("DD/MM/YYYY") || ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Registration Date</Label>
              <Input
                placeholder="Registration Date"
                disabled
                value={dayjs(userDetails?.createdAt).format("DD/MM/YYYY") || ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Daily Score Points</Label>
              <Input
                placeholder="Daily Score Points"
                disabled
                value={userDetails?.dailyScore?.toString() ?? ""}
              />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Health Data */}
          <DialogTitle>Health Data</DialogTitle>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label>How would you describe your current diet?</Label>
              <Input
                placeholder="How would you describe your current diet?"
                disabled
                value={userDetails?.currentDiet ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>What is your rhythm of life?</Label>
              <Input
                placeholder="What is your rhythm of life?"
                disabled
                value={userDetails?.rhythmOfLife ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Concerns</Label>
              <div className="flex flex-wrap gap-2">
                {badges.map(badge => (
                  <Badge key={badge.value} variant={"outline"}>
                    {badge.label}
                  </Badge>
                ))}
                {badges.length === 0 && (
                  <Label className="mt-4 text-gray-500">
                    No concerns added yet
                  </Label>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Favorite Food */}
          <div>
            <div className="flex items-center justify-between">
              <DialogTitle>Favorite Food</DialogTitle>
              <h3 className="text-base text-gray-500 ">
                {userFavorites?.favouriteFoods.length ?? 0} Items
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-center">
              {userFavorites?.favouriteFoods.map(f => (
                <div key={f.id} className="flex flex-col items-center">
                  <Image
                    src={
                      f.food.images?.[0] ? `${f.food.images[0]}` : Sample.src
                    }
                    alt={f.food.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <Label className="mt-2 text-sm">{f.food.name}</Label>
                </div>
              ))}

              {(!userFavorites?.favouriteFoods ||
                userFavorites.favouriteFoods.length === 0) && (
                <Label className="mt-4 text-gray-500">
                  No favorite foods added yet
                </Label>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Favorite Recipes */}
          <div>
            <div className="flex items-center justify-between">
              <DialogTitle>Favorite Recipes</DialogTitle>
              <h3 className="text-base text-gray-500 ">
                {userFavorites?.favouriteRecipes.length ?? 0} Items
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-center">
              {userFavorites?.favouriteRecipes.map(f => (
                <div key={f.id} className="flex flex-col items-center">
                  <Image
                    src={
                      f.recipe.images?.[0]
                        ? `${f.recipe.images[0]}`
                        : Sample.src
                    }
                    alt={f.recipe.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <Label className="mt-2 text-sm">{f.recipe.name}</Label>
                </div>
              ))}

              {(!userFavorites?.favouriteRecipes ||
                userFavorites.favouriteRecipes.length === 0) && (
                <Label className="mt-4 text-gray-500">
                  No favorite recipes added yet
                </Label>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full gap-2">
            <Button
              variant="outline"
              onClick={handleOpenDeleteConfirmationPopup}
            >
              Delete User
            </Button>
            <Button>Reset Password</Button>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* delete confirmation popup  */}
      <AlertDialog
        open={confirmDeleteOpen}
        onOpenChange={handleCloseDeleteConfirmationPopup}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteConfirmationPopup}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUserById}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
