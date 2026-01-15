"use client"

import React from "react"
import Image from "next/image"

import bBackgroundImg from "@/../public/assets/dailytip/bBackground.png"
import CloseIconImg from "@/../public/assets/dailytip/close.png"
import TipIconImg from "@/../public/assets/dailytip/Tip.png"
import videoPlaceholderImg from "@/../public/assets/dailytip/video-placeholder.png"
import landscapePlaceholderImg from "@/../public/assets/dailytip/landscape-placeholder.png"
import shareIconImg from "@/../public/assets/dailytip/share.png"

// Color constants matching mobile theme
const COLORS = {
  primary: "#000000",
  subtitleGray: "#616161",
  likeInactive: "#F4B9A0",
  likeActive: "#27AE60",
  dislikeActive: "#EB5757",
  white: "#ffffff",
  buttonBorder: "#000000"
}

// Like SVG Icon matching mobile design
const LikeIcon = ({
  filled = false,
  size = 20
}: {
  filled?: boolean
  size?: number
}): JSX.Element => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 33 32"
    fill={filled ? COLORS.likeActive : COLORS.likeInactive}
  >
    <path d="M3.29302 31.2837H4.93952V9.87919H3.29302C2.41966 9.87919 1.58207 10.2261 0.964508 10.8437C0.346951 11.4612 7.62939e-06 12.2988 7.62939e-06 13.1722V27.9907C7.62939e-06 28.864 0.346951 29.7016 0.964508 30.3192C1.58207 30.9368 2.41966 31.2837 3.29302 31.2837ZM29.6371 9.87919H18.1116L19.9589 4.33378C20.1238 3.83887 20.1687 3.31187 20.09 2.7962C20.0112 2.28053 19.8111 1.79095 19.5061 1.36777C19.2011 0.944584 18.7999 0.599915 18.3356 0.36215C17.8713 0.124386 17.3572 0.000326157 16.8355 0.000190735H16.4651L8.23253 8.95386V31.2837H26.3441L32.8264 17.0431L32.9301 16.5607V13.1722C32.9301 12.2988 32.5832 11.4612 31.9656 10.8437C31.3481 10.2261 30.5105 9.87919 29.6371 9.87919Z" />
  </svg>
)

// Dislike SVG Icon matching mobile design
const DislikeIcon = ({
  filled = false,
  size = 20
}: {
  filled?: boolean
  size?: number
}): JSX.Element => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 33 33"
    fill={filled ? COLORS.dislikeActive : COLORS.likeInactive}
  >
    <path d="M29.707 0.757812H28.0605V22.1623H29.707C30.5803 22.1623 31.4179 21.8154 32.0355 21.1978C32.653 20.5803 33 19.7427 33 18.8693V4.05081C33 3.17745 32.653 2.33987 32.0355 1.72231C31.4179 1.10475 30.5803 0.757813 29.707 0.757812ZM3.3629 22.1623H14.8884L13.0411 27.7077C12.8762 28.2026 12.8313 28.7296 12.91 29.2453C12.9888 29.761 13.1889 30.2506 13.4939 30.6737C13.7989 31.0969 14.2001 31.4416 14.6644 31.6794C15.1287 31.9171 15.6428 32.0412 16.1645 32.0413H16.5349L24.7675 23.0876V0.757812H6.65591L0.173615 14.9984L0.0698853 15.4808V18.8693C0.0698853 19.7427 0.416826 20.5803 1.03439 21.1978C1.65194 21.8154 2.48954 22.1623 3.3629 22.1623Z" />
  </svg>
)

// CTA Button component matching mobile CtaButton.tsx
const CtaButton = ({
  label,
  onClick
}: {
  label: string
  onClick?: () => void
}): JSX.Element => (
  <button
    onClick={onClick}
    className="px-4 py-1.5 bg-white rounded-[10px] border-[1.5px] border-black shadow-sm hover:shadow-md transition-shadow"
    style={{
      fontFamily: "'Raleway', sans-serif",
      fontSize: "9px",
      fontWeight: 700,
      color: COLORS.primary
    }}
  >
    {label}
  </button>
)

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

// Basic Layout Preview - matches mobile TipContent
export function BasicLayoutPreview({
  title,
  subTitleOne,
  subDescriptionOne,
  subTitleTwo,
  subDescriptionTwo,
  image,
  share,
  buttonLabel
}: BasicLayoutPreviewProps): JSX.Element {
  return (
    <div className="relative w-full h-[340px] rounded-xl overflow-hidden">
      {/* Background Image - full coverage */}
      <Image
        src={bBackgroundImg}
        alt="Background"
        fill
        className="object-fill"
      />

      {/* Close Button - top right */}
      <button className="absolute top-3 right-2 z-30 p-1">
        <Image src={CloseIconImg} alt="Close" width={12} height={12} />
      </button>

      {/* Content Container - centered */}
      <div className="absolute inset-0 z-20 flex flex-col items-center pt-6 px-4 overflow-hidden">
        {/* Scrollable Content Area */}
        <div
          className="flex-1 w-full overflow-y-auto overflow-x-hidden px-2"
          style={{ maxHeight: "230px" }}
        >
          {/* Main Title */}
          <h2
            className="text-center mb-1"
            style={{
              fontFamily: "'Delicious Handrawn', cursive",
              fontSize: "14px",
              fontWeight: 400,
              color: COLORS.primary,
              lineHeight: 1.2
            }}
          >
            {title || "Your Title"}
          </h2>

          {/* First Section with Tip Icon */}
          <div className="mb-2">
            <div className="flex items-start gap-1 mb-0.5">
              <Image
                src={TipIconImg}
                alt="Tip"
                width={8}
                height={12}
                className="mt-0.5 flex-shrink-0"
              />
              <span
                style={{
                  fontFamily: "'Delicious Handrawn', cursive",
                  fontSize: "11px",
                  fontWeight: 400,
                  color: COLORS.subtitleGray
                }}
              >
                {subTitleOne || "Sub Title One"}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "9px",
                fontWeight: 400,
                color: COLORS.primary,
                lineHeight: 1.4,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap"
              }}
            >
              {subDescriptionOne || "Your daily tip description one here."}
            </p>
          </div>

          {/* Second Section with Tip Icon */}
          <div className="mb-2">
            <div className="flex items-start gap-1 mb-0.5">
              <Image
                src={TipIconImg}
                alt="Tip"
                width={8}
                height={12}
                className="mt-0.5 flex-shrink-0"
              />
              <span
                style={{
                  fontFamily: "'Delicious Handrawn', cursive",
                  fontSize: "11px",
                  fontWeight: 400,
                  color: COLORS.subtitleGray
                }}
              >
                {subTitleTwo || "Sub Title Two"}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "9px",
                fontWeight: 400,
                color: COLORS.primary,
                lineHeight: 1.4,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap"
              }}
            >
              {subDescriptionTwo || "Your daily tip description two here."}
            </p>
          </div>

          {/* Main Image or Placeholder */}
          <div className="flex justify-center mb-2">
            {image ? (
              <img
                src={image}
                alt={title || "Daily tip image"}
                className="w-[45%] h-auto object-cover rounded-lg"
                style={{ maxHeight: "55px" }}
              />
            ) : (
              <div
                className="w-[45%] rounded-lg overflow-hidden relative bg-gray-100 flex items-center justify-center"
                style={{ height: "45px" }}
              >
                <Image
                  src={landscapePlaceholderImg}
                  alt="Image placeholder"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Share with friend - styled like CTA button */}
          {share && (
            <div className="flex justify-center mb-2">
              <button
                className="px-3 py-1 bg-white rounded-[10px] border-[1.5px] border-black shadow-sm flex items-center gap-1"
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "8px",
                  fontWeight: 700,
                  color: COLORS.primary
                }}
              >
                Share it with a friend
                <Image
                  src={shareIconImg}
                  alt="Share"
                  width={10}
                  height={10}
                  className="ml-0.5"
                />
              </button>
            </div>
          )}
        </div>

        {/* Footer Area - CTA Button (only show if buttonLabel exists) */}
        {buttonLabel && (
          <div className="w-full flex justify-center items-center py-2 mt-auto">
            <CtaButton label={buttonLabel} />
          </div>
        )}
      </div>

      {/* Like/Dislike Buttons - staggered diagonal like mobile */}
      <button
        className="absolute z-30 p-1"
        style={{
          right: "45px",
          bottom: "8px"
        }}
      >
        <LikeIcon size={16} />
      </button>
      <button
        className="absolute z-30 p-1"
        style={{
          right: "20px",
          bottom: "-4px"
        }}
      >
        <DislikeIcon size={16} />
      </button>
    </div>
  )
}

// Video Tip Preview - matches mobile VideoContent
export function VideoTipPreview({
  title,
  subTitle,
  subDescription,
  videoLink,
  hideVideo,
  buttonLabel
}: VideoTipPreviewProps): JSX.Element {
  // Extract YouTube video ID
  const getYouTubeId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoId = videoLink ? getYouTubeId(videoLink) : null

  return (
    <div className="relative w-full h-[340px] rounded-xl overflow-hidden">
      {/* Background Image */}
      <Image
        src={bBackgroundImg}
        alt="Background"
        fill
        className="object-fill"
      />

      {/* Close Button */}
      <button className="absolute top-3 right-2 z-30 p-1">
        <Image src={CloseIconImg} alt="Close" width={12} height={12} />
      </button>

      {/* Content Container */}
      <div className="absolute inset-0 z-20 flex flex-col items-center pt-6 px-4 overflow-hidden">
        {/* Scrollable Content */}
        <div
          className="flex-1 w-full overflow-y-auto overflow-x-hidden px-2"
          style={{ maxHeight: "230px" }}
        >
          {/* Main Title */}
          <h2
            className="text-center mb-1"
            style={{
              fontFamily: "'Delicious Handrawn', cursive",
              fontSize: "14px",
              fontWeight: 400,
              color: COLORS.primary,
              lineHeight: 1.2
            }}
          >
            {title || "Your Title"}
          </h2>

          {/* Subtitle */}
          <p
            className="text-center mb-1"
            style={{
              fontFamily: "'Delicious Handrawn', cursive",
              fontSize: "11px",
              fontWeight: 400,
              color: COLORS.subtitleGray
            }}
          >
            {subTitle || "Add your subtitle"}
          </p>

          {/* Description */}
          <div className="mb-2">
            <p
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "9px",
                fontWeight: 400,
                color: COLORS.primary,
                lineHeight: 1.4,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap"
              }}
            >
              {subDescription || "Enter your daily tip description here."}
            </p>
            {!subDescription && (
              <p
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "9px",
                  fontWeight: 400,
                  color: "#9CA3AF",
                  lineHeight: 1.4,
                  marginTop: "4px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "pre-wrap"
                }}
              >
                Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et
                massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                sapien.
              </p>
            )}
          </div>

          {/* Video Embed or Placeholder */}
          {!hideVideo && (
            <div className="flex justify-center mb-2">
              {videoId ? (
                <div className="w-full aspect-video rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={title || "Video"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  className="w-full rounded-lg overflow-hidden relative"
                  style={{ height: "70px" }}
                >
                  <Image
                    src={videoPlaceholderImg}
                    alt="Video placeholder"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md">
                      <div className="w-0 h-0 border-l-[10px] border-l-gray-700 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
                    </div>
                  </div>
                  <p
                    className="absolute bottom-1 left-0 right-0 text-center"
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: "7px",
                      color: "#666"
                    }}
                  >
                    Your video here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Area - only show if buttonLabel exists */}
        {buttonLabel && (
          <div className="w-full flex justify-center items-center py-2 mt-auto">
            <CtaButton label={buttonLabel} />
          </div>
        )}
      </div>

      {/* Like/Dislike Buttons - staggered diagonal like mobile */}
      <button
        className="absolute z-30 p-1"
        style={{
          right: "45px",
          bottom: "8px"
        }}
      >
        <LikeIcon size={16} />
      </button>
      <button
        className="absolute z-30 p-1"
        style={{
          right: "20px",
          bottom: "-4px"
        }}
      >
        <DislikeIcon size={16} />
      </button>
    </div>
  )
}

// Shop Promotion Preview - matches mobile ShopContent
export function ShopPromotionPreview({
  shopName,
  shopLocation,
  subDescription,
  image,
  buttonLabel
}: ShopPromotionPreviewProps): JSX.Element {
  return (
    <div className="relative w-full h-[340px] rounded-xl overflow-hidden">
      {/* Background Image */}
      <Image
        src={bBackgroundImg}
        alt="Background"
        fill
        className="object-fill"
      />

      {/* Close Button */}
      <button className="absolute top-3 right-2 z-30 p-1">
        <Image src={CloseIconImg} alt="Close" width={12} height={12} />
      </button>

      {/* Content Container */}
      <div className="absolute inset-0 z-20 flex flex-col items-center pt-6 px-4 overflow-hidden">
        {/* Scrollable Content */}
        <div
          className="flex-1 w-full overflow-y-auto overflow-x-hidden px-2"
          style={{ maxHeight: "230px" }}
        >
          {/* Shop Name - Main Title */}
          <h2
            className="text-center mb-1"
            style={{
              fontFamily: "'Delicious Handrawn', cursive",
              fontSize: "14px",
              fontWeight: 400,
              color: COLORS.primary,
              lineHeight: 1.2
            }}
          >
            {shopName || "Shop Name"}
          </h2>

          {/* Shop Location */}
          <p
            className="text-center mb-2 flex items-center justify-center gap-1"
            style={{
              fontFamily: "'Delicious Handrawn', cursive",
              fontSize: "11px",
              fontWeight: 400,
              color: COLORS.subtitleGray
            }}
          >
            <span>📍</span>
            {shopLocation || "Shop Location"}
          </p>

          {/* Description */}
          <div className="mb-2">
            <p
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "9px",
                fontWeight: 400,
                color: COLORS.primary,
                lineHeight: 1.4,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap"
              }}
            >
              {subDescription || "Enter your shop description here."}
            </p>
            {!subDescription && (
              <p
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "9px",
                  fontWeight: 400,
                  color: "#9CA3AF",
                  lineHeight: 1.4,
                  marginTop: "4px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "pre-wrap"
                }}
              >
                Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et
                massa mi. Aliquam in hendrerit urna.
              </p>
            )}
          </div>

          {/* Shop Image */}
          {image && (
            <div className="flex justify-center mb-2">
              <img
                src={image}
                alt={shopName || "Shop image"}
                className="w-[45%] h-auto object-cover rounded-lg"
                style={{ maxHeight: "55px" }}
              />
            </div>
          )}
        </div>

        {/* Footer Area - only show if buttonLabel exists */}
        {buttonLabel && (
          <div className="w-full flex justify-center items-center py-2 mt-auto">
            <CtaButton label={buttonLabel} />
          </div>
        )}
      </div>

      {/* Like/Dislike Buttons - staggered diagonal like mobile */}
      <button
        className="absolute z-30 p-1"
        style={{
          right: "45px",
          bottom: "8px"
        }}
      >
        <LikeIcon size={16} />
      </button>
      <button
        className="absolute z-30 p-1"
        style={{
          right: "20px",
          bottom: "-4px"
        }}
      >
        <DislikeIcon size={16} />
      </button>
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
  return (
    <div className="sticky top-4">
      {type === "basicForm" && <BasicLayoutPreview {...data} />}
      {type === "videoForm" && <VideoTipPreview {...data} />}
      {type === "shopPromote" && <ShopPromotionPreview {...data} />}
    </div>
  )
}
