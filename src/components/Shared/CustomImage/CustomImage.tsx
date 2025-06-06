"use client";

import Image from "next/image";
import React from "react";

interface CustomImageProps {
  srcList: string[];
  count?: number;
  maxCount?: number;
  text?: string;
  width?: number;
  height?: number;
}

const CustomImage: React.FC<CustomImageProps> = ({
  srcList,
  count,
  maxCount = Infinity,
  text = "Image Preview",
  width = 200,
  height = 200,
}) => {
  const displayImages = srcList.slice(0, Math.min(count ?? srcList.length, maxCount));

  return (
    <div className="flex flex-wrap gap-4 justify-start sm:flex-row flex-col">
      {displayImages.map((src, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className="relative rounded-lg border overflow-hidden"
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <p className="mt-2 text-xs text-center text-black">{text}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomImage;
