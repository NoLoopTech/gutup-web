"use client"

import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import sampleImage from "@/../../public/images/sample-image.png"
import { MoreVertical, ThumbsDown, ThumbsUp } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import AddDailyTipMainPopUp from "./AddDailyTipMainPopUp"
import {
  AddNewDailyTips,
  deleteDailyTipById,
  getAllDailyTips,
  updateDailyTip
} from "@/app/api/daily-tip"
import { useDailyTipStore } from "@/stores/useDailyTipStore"
import {
  deleteImageFromFirebase,
  uploadImageToFirebase
} from "@/lib/firebaseImageUtils"
import { toast } from "sonner"
import EditDailyTipMainPopUp from "./EditDailyTipMainPopUp"
import { useUpdateDailyTipStore } from "@/stores/useUpdateDailyTipStore"
import { EditDailyTipTypes } from "@/types/dailyTipTypes"
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

interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface DailyTipsDataType {
  dailyTipsId: number
  imageOrVideoUrl: string
  title: string
  content: string
  dateCreated: string
  status: boolean
  countLikes: number
  countDisLikes: number
  type: string
}

export default function DailyTipsPage({
  token,
  userName
}: {
  token: string
  userName: string
}): React.ReactElement {
  const [isOpenAddTip, setIsOpenAddTip] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [dailyTips, setDailyTips] = useState<DailyTipsDataType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpenEditDailyTip, setIsOpenEditDailyTip] = useState<boolean>(false)
  const [selectedTipId, setSelectedTipId] = useState<number>(0)
  const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)

  const { activeLang, translationsData, activeTab, resetTranslations } =
    useDailyTipStore()

  const { resetUpdatedStore } = useUpdateDailyTipStore()

  const handleOpenAddTip = (): void => {
    setIsOpenAddTip(true)
  }
  const handleCloseAddTip = (): void => {
    setIsOpenAddTip(false)
  }

  const handleOpenEditDailyTip = (id: number): void => {
    setSelectedTipId(id)
    setIsOpenEditDailyTip(true)
  }
  const handleCloseEditDailyTip = async (): Promise<void> => {
    setIsOpenEditDailyTip(false)
    setSelectedTipId(0)

    // clear store and session
    await resetTranslations()
    await resetUpdatedStore()

    sessionStorage.removeItem("daily-tip-storage")
    sessionStorage.removeItem("update-daily-tip-storage")
  }

  // handle open delete confirmation popup
  const handleOpenDeleteConfirmationPopup = (id: number): void => {
    setSelectedTipId(id)
    setConfirmDeleteOpen(true)
  }

  // handle close delete confirmation popup
  const handleCloseDeleteConfirmationPopup = (): void => {
    setConfirmDeleteOpen(false)
  }

  const getDailyTips = async () => {
    try {
      const resposne = await getAllDailyTips(token)
      if (resposne.status === 200) {
        setDailyTips(resposne.data)
      } else {
        console.log("getDailyTips", resposne.data)
      }
    } catch (error) {
      console.log("getDailyTips", error)
    }
  }

  useEffect(() => {
    void getDailyTips()
  }, [])

  const uploadDailyTipImageAndSetUrl = async (): Promise<string | null> => {
    let imageFile: string | File | undefined = undefined

    if (activeTab === "basicForm") {
      imageFile = translationsData.basicLayoutData[activeLang].image
    } else if (activeTab === "shopPromote") {
      imageFile = translationsData.shopPromotionData[activeLang].image
    }

    if (!imageFile) return null

    const folder =
      activeTab === "basicForm"
        ? "daily-tip/basic-form"
        : "daily-tip/shop-promote"
    const fileNamePrefix =
      activeTab === "basicForm" ? "basic-form-image" : "shop-promote-image"
    const fileName = `${fileNamePrefix}-${Date.now()}`

    let fileToUpload: File | Blob

    if (typeof imageFile === "string") {
      // Convert data URL or blob URL to Blob
      try {
        const blob = await fetch(imageFile).then(res => res.blob())
        fileToUpload = blob
      } catch (err) {
        console.error("Failed to convert string to Blob", err)
        return null
      }
    } else {
      fileToUpload = imageFile
    }

    const uploadedUrl = await uploadImageToFirebase(
      fileToUpload,
      folder,
      fileName
    )

    return uploadedUrl
  }

  const handleAddDailyTip = async () => {
    try {
      setIsLoading(true)

      let uploadedImageUrl: string | null = null

      // Upload and update image URL first
      uploadedImageUrl = await uploadDailyTipImageAndSetUrl()
      // Get fresh state after image update
      const {
        allowMultiLang: currentAllowMultiLang,
        activeTab: currentTab,
        translationsData: currentTranslations
      } = useDailyTipStore.getState()

      const shopFoods =
        currentTranslations.shopPromotionData.en.shopPromoteFoods ?? []

      const updateShopPromoteFoods = shopFoods.map((item, index) => {
        // Access the corresponding French item by index
        const translatedItem =
          currentTranslations.shopPromotionData.fr.shopPromoteFoods[index]

        return {
          ...item,
          nameFR: translatedItem ? translatedItem.name : item.name
        }
      })

      const requestBody = {
        allowMultiLang: currentAllowMultiLang,
        concern:
          currentTab === "basicForm"
            ? currentTranslations.basicLayoutData.en.concern
            : currentTab === "videoForm"
            ? currentTranslations.videoTipData.en.concern
            : currentTranslations.shopPromotionData.en.reason,
        concernFR:
          currentTab === "basicForm"
            ? currentTranslations.basicLayoutData.fr.concern
            : currentTab === "videoForm"
            ? currentTranslations.videoTipData.fr.concern
            : currentTranslations.shopPromotionData.fr.reason,

        title:
          currentTab === "basicForm"
            ? currentTranslations.basicLayoutData.en.title
            : currentTab === "videoForm"
            ? currentTranslations.videoTipData.en.title
            : currentTranslations.shopPromotionData.en.shopName,
        titleFR:
          currentTab === "basicForm"
            ? currentTranslations.basicLayoutData.fr.title
            : currentTab === "videoForm"
            ? currentTranslations.videoTipData.fr.title
            : currentTranslations.shopPromotionData.en.shopName,
        type:
          currentTab === "basicForm"
            ? "basic"
            : currentTab === "videoForm"
            ? "video"
            : "store",
        typeFR:
          currentTab === "basicForm"
            ? "basic"
            : currentTab === "videoForm"
            ? "video"
            : "store",
        status: true,
        basicForm: {
          subTitleOne: currentTranslations.basicLayoutData.en.subTitleOne,
          subTitleOneFR: currentTranslations.basicLayoutData.fr.subTitleOne,
          subDescOne: currentTranslations.basicLayoutData.en.subDescriptionOne,
          subDescOneFR:
            currentTranslations.basicLayoutData.fr.subDescriptionOne,
          subTitleTwo: currentTranslations.basicLayoutData.en.subTitleTwo,
          subTitleTwoFR: currentTranslations.basicLayoutData.fr.subTitleTwo,
          subDescTwo: currentTranslations.basicLayoutData.en.subDescriptionTwo,
          subDescTwoFR:
            currentTranslations.basicLayoutData.fr.subDescriptionTwo,
          share: currentTranslations.basicLayoutData.en.share,
          image: uploadedImageUrl || ""
        },
        shopPromote: {
          name: currentTranslations.shopPromotionData.en.shopName,
          location: currentTranslations.shopPromotionData.en.shopLocation,
          locationLat:
            currentTranslations.shopPromotionData.en.shopLocationLatLng.lat,
          locationLng:
            currentTranslations.shopPromotionData.en.shopLocationLatLng.lng,
          category: currentTranslations.shopPromotionData.en.shopCategory,
          categoryFR: currentTranslations.shopPromotionData.fr.shopCategory,
          desc: currentTranslations.shopPromotionData.en.subDescription,
          descFR: currentTranslations.shopPromotionData.fr.subDescription,
          phoneNumber: currentTranslations.shopPromotionData.en.mobileNumber,
          email: currentTranslations.shopPromotionData.en.email,
          facebook: currentTranslations.shopPromotionData.en.facebook,
          instagram: currentTranslations.shopPromotionData.en.instagram,
          website: currentTranslations.shopPromotionData.en.website,
          image: uploadedImageUrl || "",
          shopPromoteFoods: updateShopPromoteFoods
        },
        videoForm: {
          subTitle: currentTranslations.videoTipData.en.subTitle,
          subTitleFR: currentTranslations.videoTipData.fr.subTitle,
          subDesc: currentTranslations.videoTipData.en.subDescription,
          subDescFR: currentTranslations.videoTipData.fr.subDescription,
          videoUrl: currentTranslations.videoTipData.en.videoLink
        }
      }

      const response = await AddNewDailyTips(token, requestBody)
      if (response.status === 200 || response.status === 201) {
        toast.success("Daily Tip added successfully")
        setIsOpenAddTip(false)
        getDailyTips()

        sessionStorage.removeItem("daily-tip-storage")

        // clear store and session
        resetTranslations()
        resetUpdatedStore()
      } else {
        toast.error(response.data.message[0])
        if (uploadedImageUrl) {
          await deleteImageFromFirebase(uploadedImageUrl)
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  // handle update Daily Tip
  const handleUpdateDailyTip = async () => {
    try {
      setIsLoading(true)

      const { activeTab } = useDailyTipStore.getState()
      const { translationsData: updatedTranslations } =
        useUpdateDailyTipStore.getState()

      let uploadedImageUrl: string | null = null

      const isImageChanged =
        (activeTab === "basicForm" &&
          updatedTranslations.basicLayoutData.en.image) ||
        (activeTab === "shopPromote" &&
          updatedTranslations.shopPromotionData.en.image)

      if (isImageChanged) {
        uploadedImageUrl = await uploadDailyTipImageAndSetUrl()
      }

      const requestBody: EditDailyTipTypes = {}
      const updatedState = useUpdateDailyTipStore.getState().translationsData

      // Root-level fields
      if (activeTab === "basicForm") {
        if ("concern" in updatedState.basicLayoutData.en)
          requestBody.concern = updatedState.basicLayoutData.en
            .concern as string
        if ("concern" in updatedState.basicLayoutData.fr)
          requestBody.concernFR = updatedState.basicLayoutData.fr
            .concern as string
        if ("title" in updatedState.basicLayoutData.en)
          requestBody.title = updatedState.basicLayoutData.en.title as string
        if ("title" in updatedState.basicLayoutData.fr)
          requestBody.titleFR = updatedState.basicLayoutData.fr.title as string
      }

      if (activeTab === "videoForm") {
        if ("concern" in updatedState.videoTipData.en)
          requestBody.concern = updatedState.videoTipData.en.concern as string
        if ("concern" in updatedState.videoTipData.fr)
          requestBody.concernFR = updatedState.videoTipData.fr.concern as string
        if ("title" in updatedState.videoTipData.en)
          requestBody.title = updatedState.videoTipData.en.title as string
        if ("title" in updatedState.videoTipData.fr)
          requestBody.titleFR = updatedState.videoTipData.fr.title as string
      }

      if (activeTab === "shopPromote") {
        if ("concern" in updatedState.shopPromotionData.en)
          requestBody.concern = updatedState.shopPromotionData.en
            .reason as string
        if ("concern" in updatedState.shopPromotionData.fr)
          requestBody.concernFR = updatedState.shopPromotionData.fr
            .reason as string
        if ("title" in updatedState.shopPromotionData.en)
          requestBody.title = updatedState.shopPromotionData.en
            .shopName as string
        if ("title" in updatedState.shopPromotionData.fr)
          requestBody.titleFR = updatedState.shopPromotionData.fr
            .shopName as string
      }

      // basicForm
      if (activeTab === "basicForm") {
        const basicData = updatedState.basicLayoutData
        const basicForm: EditDailyTipTypes["basicForm"] = {}

        console.log("basicData", basicData)

        if ("subTitleOne" in basicData.en)
          basicForm.subTitleOne = basicData.en.subTitleOne as string
        if ("subTitleOne" in basicData.fr)
          basicForm.subTitleOneFR = basicData.fr.subTitleOne as string
        if ("subDescriptionOne" in basicData.en)
          basicForm.subDescOne = basicData.en.subDescriptionOne as string
        if ("subDescriptionOne" in basicData.fr)
          basicForm.subDescOneFR = basicData.fr.subDescriptionOne as string
        if ("subDescriptionTwo" in basicData.en)
          basicForm.subTitleTwo = basicData.en.subDescriptionTwo as string
        if ("subDescriptionTwo" in basicData.fr)
          basicForm.subTitleTwoFR = basicData.fr.subDescriptionTwo as string
        if ("subDescTwo" in basicData.en)
          basicForm.subDescTwo = basicData.en.subDescTwo as string
        if ("subDescTwo" in basicData.fr)
          basicForm.subDescTwoFR = basicData.fr.subDescTwo as string
        if ("share" in basicData.en)
          basicForm.share = basicData.en.share as boolean
        if (uploadedImageUrl) basicForm.image = uploadedImageUrl

        if (Object.keys(basicForm).length > 0) {
          requestBody.basicForm = basicForm
        }
      }

      // shopPromote
      if (activeTab === "shopPromote") {
        const shopData = updatedState.shopPromotionData
        const shopPromote: EditDailyTipTypes["shopPromote"] = {}

        if ("shopName" in shopData.en)
          shopPromote.name = shopData.en.shopName as string
        if ("shopLocation" in shopData.en)
          shopPromote.location = shopData.en.shopLocation as string
        if ("shopLocation" in shopData.en)
          shopPromote.locationLat = shopData.en.shopLocationLatLng
            ?.lat as number
        if ("shopLocation" in shopData.en)
          shopPromote.locationLng = shopData.en.shopLocationLatLng
            ?.lng as number
        if ("shopCategory" in shopData.en)
          shopPromote.category = shopData.en.shopCategory as string
        if ("shopCategory" in shopData.fr)
          shopPromote.categoryFR = shopData.fr.shopCategory as string
        if ("subDescription" in shopData.en)
          shopPromote.desc = shopData.en.subDescription as string
        if ("subDescription" in shopData.fr)
          shopPromote.descFR = shopData.fr.subDescription as string
        if ("mobileNumber" in shopData.en)
          shopPromote.phoneNumber = shopData.en.mobileNumber as string
        if ("email" in shopData.en)
          shopPromote.email = shopData.en.email as string
        if ("facebook" in shopData.en)
          shopPromote.facebook = shopData.en.facebook as string
        if ("instagram" in shopData.en)
          shopPromote.instagram = shopData.en.instagram as string
        if ("website" in shopData.en)
          shopPromote.website = shopData.en.website as string
        if (
          "shopPromoteFoods" in shopData.en ||
          "shopPromoteFoods" in shopData.fr
        ) {
          const enFoods = shopData.en.shopPromoteFoods ?? []
          const frFoods = shopData.fr.shopPromoteFoods ?? []

          const updatedShopPromoteFoods = enFoods.map((item, index) => {
            const translatedItem = frFoods[index]

            return {
              ...item,
              nameFR: translatedItem ? translatedItem.name : item.name
            }
          })

          shopPromote.shopPromoteFoods = updatedShopPromoteFoods
        }
        if (uploadedImageUrl) shopPromote.image = uploadedImageUrl

        if (Object.keys(shopPromote).length > 0) {
          requestBody.shopPromote = shopPromote
        }
      }

      // videoForm
      if (activeTab === "videoForm") {
        const videoData = updatedState.videoTipData
        const videoForm: EditDailyTipTypes["videoForm"] = {}

        if ("subTitle" in videoData.en)
          videoForm.subTitle = videoData.en.subTitle as string
        if ("subTitle" in videoData.fr)
          videoForm.subTitleFR = videoData.fr.subTitle as string
        if ("subDescription" in videoData.en)
          videoForm.subDesc = videoData.en.subDescription as string
        if ("subDescription" in videoData.fr)
          videoForm.subDescFR = videoData.fr.subDescription as string
        if ("videoLink" in videoData.en)
          videoForm.videoUrl = videoData.en.videoLink as string

        if (Object.keys(videoForm).length > 0) {
          requestBody.videoForm = videoForm
        }
      }

      const response = await updateDailyTip(token, selectedTipId, requestBody)

      if (response.status === 200 || response.status === 201) {
        toast.success("Daily Tip updated successfully")
        setIsOpenEditDailyTip(false)
        getDailyTips()

        if (isImageChanged && previousImageUrl) {
          await deleteImageFromFirebase(previousImageUrl)
          setPreviousImageUrl(null)
        }

        setSelectedTipId(0)

        // clear store and session
        resetTranslations()
        resetUpdatedStore()
      } else {
        toast.error(response.data.message[0])
        if (isImageChanged && uploadedImageUrl) {
          await deleteImageFromFirebase(uploadedImageUrl)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong during update!")
    } finally {
      sessionStorage.removeItem("daily-tip-storage")
      sessionStorage.removeItem("update-daily-tip-storage")
      setIsLoading(false)
    }
  }

  // handle update daily tip status
  const handleUpdateDailyTipStatus = async (
    dailyTipId: number,
    status: boolean
  ): Promise<void> => {
    const requestBody = { status: status ? false : true }
    try {
      // Submit updated data
      const response = await updateDailyTip(token, dailyTipId, requestBody)

      if (response.status === 200 || response.status === 201) {
        toast.success("Daily Tip updated successfully")
        getDailyTips()
      } else {
        toast.error("Failed to update daily tip!")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong during update!")
    } finally {
      setIsLoading(false)
    }
  }

  // handle delete daily tip
  const handleDeleteDailyTip = async (): Promise<void> => {
    try {
      const response = await deleteDailyTipById(token, selectedTipId)
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message)
        getDailyTips()
      } else {
        console.log("failed to delete mood : ", response)
        toast.error("Failed to delete mood!")
      }
    } catch (error) {
      console.log("failed to delete mood : ", error)
    }
  }

  const columns: Array<Column<DailyTipsDataType>> = [
    {
      accessor: "imageOrVideoUrl",
      header: "Media",
      cell: (row: DailyTipsDataType) => (
        <Image
          src={row.type !== "video" ? row.imageOrVideoUrl : sampleImage}
          alt={row.title}
          width={40}
          height={40}
          className="rounded"
        />
      )
    },
    {
      accessor: "title",
      header: "Title"
    },
    {
      accessor: "content",
      header: "Content"
    },
    {
      accessor: "dateCreated",
      header: "Date Created",
      cell: (row: any) => dayjs(row.dateCreated).format("DD/MM/YYYY")
    },
    {
      accessor: "status",
      header: "Status",
      className: "w-40",
      cell: (row: DailyTipsDataType) => (
        <Badge
          className={
            row.status
              ? "bg-[#B2FFAB] text-green-700 hover:bg-green-200 border border-green-700"
              : "bg-yellow-200 text-yellow-800 hover:bg-yellow-100 border border-yellow-700"
          }
        >
          {row.status ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      id: "engagement",
      header: "Engagement",
      className: "w-40",
      cell: (row: DailyTipsDataType) => (
        <div className="flex gap-4 items-center">
          <div className="flex gap-1 items-center text-green-600">
            <span>{row.countLikes}</span>
            <ThumbsUp size={16} />
          </div>
          <div className="flex gap-1 items-center text-red-600">
            <span>{row.countDisLikes}</span>
            <ThumbsDown size={16} />
          </div>
        </div>
      )
    },
    {
      id: "actions",
      className: "w-12",
      cell: (row: DailyTipsDataType) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-6"
              size="icon"
            >
              <MoreVertical className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() =>
                handleUpdateDailyTipStatus(row.dailyTipsId, row.status)
              }
            >
              {row.status ? "Inactive" : "Active"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleOpenEditDailyTip(row.dailyTipsId)
                setPreviousImageUrl(row.imageOrVideoUrl || "")
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleOpenDeleteConfirmationPopup(row.dailyTipsId)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const pageSizeOptions: number[] = [5, 10, 20]

  const totalItems: number = dailyTips.length
  const startIndex: number = (page - 1) * pageSize
  const endIndex: number = startIndex + pageSize
  const paginatedData: DailyTipsDataType[] = dailyTips.slice(
    startIndex,
    endIndex
  )

  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end -mt-14 mb-5">
        <Button onClick={handleOpenAddTip}>Add New</Button>
      </div>
      {/* user management table */}
      <CustomTable
        columns={columns}
        data={paginatedData}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        pageSizeOptions={pageSizeOptions}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <AddDailyTipMainPopUp
        open={isOpenAddTip}
        onClose={handleCloseAddTip}
        token={token}
        userName={userName}
        addDailyTip={handleAddDailyTip}
        isLoading={isLoading}
      />

      <EditDailyTipMainPopUp
        open={isOpenEditDailyTip}
        onClose={handleCloseEditDailyTip}
        token={token}
        userName={userName}
        isLoading={isLoading}
        tipId={selectedTipId}
        editDailyTip={handleUpdateDailyTip}
      />

      {/* delete confirmation popup  */}
      <AlertDialog
        open={confirmDeleteOpen}
        onOpenChange={handleCloseDeleteConfirmationPopup}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Mood</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this mood?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteConfirmationPopup}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDailyTip}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
