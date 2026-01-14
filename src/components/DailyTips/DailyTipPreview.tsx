"use client"

import React from "react"
import { Lightbulb, ThumbsUp, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BasicLayoutPreviewProps {
  title: string
  subTitleOne: string
  subDescriptionOne: string
  subTitleTwo: string
  subDescriptionTwo: string
  image: string
  share: boolean
  buttonLabel?: string
  concern: string[]
}

interface VideoTipPreviewProps {
  title: string
  subTitle: string
  subDescription: string
  videoLink: string
  hideVideo: boolean
  buttonLabel?: string
  concern: string[]
}

interface ShopPromotionPreviewProps {
  title: string
  shopName: string
  shopLocation: string
  subDescription: string
  image: string
  buttonLabel?: string
  concern: string[]
}

export function BasicLayoutPreview({
  title,
  subTitleOne,
  subDescriptionOne,
  subTitleTwo,
  subDescriptionTwo,
  image,
  share,
  buttonLabel,
  concern
}: BasicLayoutPreviewProps): JSX.Element {
  return (
    <div className="relative w-full max-w-[400px] bg-[#F5E6D3] rounded-lg shadow-lg overflow-hidden">
      {/* Header Tape */}
      <div className="absolute top-0 right-0 w-20 h-8 bg-[#B4D7B4] transform rotate-12 translate-x-2 -translate-y-2" />

      {/* Close Button */}
      <button className="absolute top-2 right-2 z-10">
        <X className="w-5 h-5 text-gray-800" />
      </button>

      {/* Content */}
      <div className="p-6 pt-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">
          {title || "Swiss lentils"}
        </h2>

        {/* Tip Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-600 fill-yellow-400" />
            <span className="font-semibold text-gray-900">
              {subTitleOne || "Tip"}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {subDescriptionOne ||
              "Choose filtered water, free from microplastics and pesticides... you can visit one of our partner stores."}
          </p>
        </div>

        {/* Why Section */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            {subTitleTwo || "Why?"}
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {subDescriptionTwo ||
              "Water hydrates and wakes up your body... only 8 more glasses to drink in a day!"}
          </p>
        </div>

        {/* Image */}
        {image ? (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-48 object-cover"
            />
          </div>
        ) : (
          <div className="mb-6 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center h-48">
            <span className="text-gray-400 text-sm">Image preview</span>
          </div>
        )}

        {/* Share Button (if enabled) */}
        {share && (
          <button className="w-full mb-4 px-4 py-2 border-2 border-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <span>Share it with a friend</span>
            <span className="text-lg">↗</span>
          </button>
        )}

        {/* CTA Button */}
        {buttonLabel && (
          <button className="w-full px-4 py-2 border-2 border-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
            {buttonLabel}
          </button>
        )}

        {/* Like Button */}
        <div className="absolute bottom-4 right-4">
          <button className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
            <ThumbsUp className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function VideoTipPreview({
  title,
  subTitle,
  subDescription,
  videoLink,
  hideVideo,
  buttonLabel,
  concern
}: VideoTipPreviewProps): JSX.Element {
  // Extract YouTube video ID if it's a YouTube link
  const getYouTubeId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoId = videoLink ? getYouTubeId(videoLink) : null

  return (
    <div className="relative w-full max-w-[400px] bg-[#F5E6D3] rounded-lg shadow-lg overflow-hidden">
      {/* Header Tape */}
      <div className="absolute top-0 right-0 w-20 h-8 bg-[#B4D7B4] transform rotate-12 translate-x-2 -translate-y-2" />

      {/* Close Button */}
      <button className="absolute top-2 right-2 z-10">
        <X className="w-5 h-5 text-gray-800" />
      </button>

      {/* Content */}
      <div className="p-6 pt-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">
          {title || "Swiss lentils"}
        </h2>

        {/* Sub Title */}
        <div className="mb-4">
          <p className="text-lg text-gray-900 leading-relaxed">
            {subTitle || "Your anti-blood sugar spike safeguard"}
          </p>
        </div>

        {/* Sub Description */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            {subDescription ||
              "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien. Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa..."}
          </p>
        </div>

        {/* Video Embed (if not hidden) */}
        {!hideVideo && videoId && (
          <div className="mb-6 rounded-lg overflow-hidden aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* Video Link Display */}
        {videoLink && (
          <div className="mb-6 text-sm">
            <span className="font-semibold text-gray-900">Video Link: </span>
            <a
              href={videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {videoLink}
            </a>
          </div>
        )}

        {/* CTA Button */}
        {buttonLabel && (
          <button className="w-full px-4 py-2 border-2 border-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
            {buttonLabel}
          </button>
        )}

        {/* Like Button */}
        <div className="absolute bottom-4 right-4">
          <button className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
            <ThumbsUp className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function ShopPromotionPreview({
  title,
  shopName,
  shopLocation,
  subDescription,
  image,
  buttonLabel,
  concern
}: ShopPromotionPreviewProps): JSX.Element {
  return (
    <div className="relative w-full max-w-[400px] bg-[#F5E6D3] rounded-lg shadow-lg overflow-hidden">
      {/* Header Tape */}
      <div className="absolute top-0 right-0 w-20 h-8 bg-[#B4D7B4] transform rotate-12 translate-x-2 -translate-y-2" />

      {/* Close Button */}
      <button className="absolute top-2 right-2 z-10">
        <X className="w-5 h-5 text-gray-800" />
      </button>

      {/* Content */}
      <div className="p-6 pt-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">
          {title || "Shop Promotion"}
        </h2>

        {/* Shop Name */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {shopName || "Shop Name"}
        </h3>

        {/* Shop Location */}
        <p className="text-sm text-gray-600 mb-4">
          {shopLocation || "Shop Location"}
        </p>

        {/* Description */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            {subDescription || "Shop description goes here..."}
          </p>
        </div>

        {/* Image */}
        {image ? (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={image}
              alt={shopName}
              className="w-full h-48 object-cover"
            />
          </div>
        ) : (
          <div className="mb-6 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center h-48">
            <span className="text-gray-400 text-sm">Image preview</span>
          </div>
        )}

        {/* CTA Button */}
        {buttonLabel && (
          <button className="w-full px-4 py-2 border-2 border-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
            {buttonLabel}
          </button>
        )}

        {/* Like Button */}
        <div className="absolute bottom-4 right-4">
          <button className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
            <ThumbsUp className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Preview Wrapper Component
interface DailyTipPreviewProps {
  type: "basicForm" | "shopPromote" | "videoForm"
  data: any
}

export default function DailyTipPreview({
  type,
  data
}: DailyTipPreviewProps): JSX.Element {
  if (type === "basicForm") {
    return <BasicLayoutPreview {...data} />
  }

  if (type === "videoForm") {
    return <VideoTipPreview {...data} />
  }

  if (type === "shopPromote") {
    return <ShopPromotionPreview {...data} />
  }

  return <div>Unknown layout type</div>
}
