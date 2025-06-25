import React from "react"

export default function Loading(): React.ReactNode {
  return (
    <div className="flex items-center justify-center h-full py-10">
      <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin" />
    </div>
  )
}
