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
import AddDailyTipMainPopUp from "./AddDailyTipMainPopUp.tsx"
import { AddNewDailyTips, getAllDailyTips } from "@/app/api/daily-tip"
import { useDailyTipStore } from "@/stores/useDailyTipStore"
import {
  deleteImageFromFirebase,
  uploadImageToFirebase
} from "@/lib/firebaseImageUtils"
import { toast } from "sonner"

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

  const {
    activeLang,
    translationsData,
    activeTab,
    setTranslationField,
    resetTranslations
  } = useDailyTipStore()

  const handleOpenAddTip = (): void => {
    setIsOpenAddTip(true)
  }
  const handleCloseAddTip = (): void => {
    setIsOpenAddTip(false)
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

    if (activeTab === "basicForm") {
      setTranslationField("basicLayoutData", activeLang, "image", uploadedUrl)
    } else if (activeTab === "shopPromote") {
      setTranslationField("shopPromotionData", activeLang, "image", uploadedUrl)
    }

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

      const requestBody = {
        allowMultiLang: currentAllowMultiLang,
        concern:
          currentTab === "basicForm"
            ? currentTranslations.basicLayoutData.en.concern
            : currentTab === "videoForm"
            ? currentTranslations.videoTipData.en.concern
            : "",
        concernFR:
          currentTab === "basicForm"
            ? currentTranslations.basicLayoutData.fr.concern
            : currentTab === "videoForm"
            ? currentTranslations.videoTipData.fr.concern
            : "",

        title:
          currentTab === "basicForm"
            ? currentTranslations.basicLayoutData.en.title
            : currentTab === "videoForm"
            ? currentTranslations.videoTipData.en.title
            : "",
        titleFR:
          currentTab === "basicForm"
            ? currentTranslations.basicLayoutData.fr.title
            : currentTab === "videoForm"
            ? currentTranslations.videoTipData.fr.title
            : "",
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
        status: false,
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
          image: currentTranslations.basicLayoutData.en.image
        },
        shopPromote: {
          reason: currentTranslations.shopPromotionData.en.reason,
          reasonFR: currentTranslations.shopPromotionData.fr.reason,
          name: currentTranslations.shopPromotionData.en.shopName,
          location: currentTranslations.shopPromotionData.en.shopLocation,
          category: currentTranslations.shopPromotionData.en.shopCategory,
          categoryFR: currentTranslations.shopPromotionData.fr.shopCategory,
          desc: currentTranslations.shopPromotionData.en.subDescription,
          descFR: currentTranslations.shopPromotionData.fr.subDescription,
          phoneNumber: currentTranslations.shopPromotionData.en.mobileNumber,
          email: currentTranslations.shopPromotionData.en.email,
          mapsPin: currentTranslations.shopPromotionData.en.mapsPin,
          facebook: currentTranslations.shopPromotionData.en.facebook,
          instagram: currentTranslations.shopPromotionData.en.instagram,
          website: currentTranslations.shopPromotionData.en.website,
          image: currentTranslations.shopPromotionData.en.image,
          shopPromoteFoods:
            currentTranslations.shopPromotionData.en.shopPromoteFoods
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
      console.log(response)
      if (response.status === 200 || response.status === 201) {
        toast.success("Daily Tip added successfully")
        setIsOpenAddTip(false)
        getDailyTips()

        // clear store and session
        resetTranslations()
      } else {
        toast.error("Failed to add daily tip!")
        if (uploadedImageUrl) {
          await deleteImageFromFirebase(uploadedImageUrl)
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      sessionStorage.removeItem("daily-tip-storage")
      setIsLoading(false)
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
      header: "Date Created"
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
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
    </div>
  )
}
