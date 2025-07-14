"use client"

import React, { useEffect, useState, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { getAllTagsByCategory } from "@/app/api/foods"

interface Props {
  title: string
  placeholder: string
  benefits?: string[]
  name: string
  disable?: boolean
  width?: string
  suggestions: string[]
  onChange?: (items: string[]) => void
  onBlur?: () => void
}

export default function LableInput({
  title,
  placeholder,
  benefits = [],
  name,
  disable,
  width = "w-64",
  suggestions = [],
  onChange,
  onBlur
}: Props): React.ReactElement {
  const {
    setValue,
    formState: { errors },
    trigger
  } = useFormContext()
  const [value, setValueState] = useState("")
  const [items, setItems] = useState<string[]>(benefits)
  const [allbenefits, setAllBenefits] = useState<string[]>([])

   useEffect(() => {
    if (suggestions) {
      setAllBenefits(suggestions)
    }
  }, [suggestions])

  const updateItems = (updatedItems: string[]): void => {
    setItems(updatedItems)
    setValue(name, updatedItems)
    if (onChange) {
      onChange(updatedItems)
    }
    void trigger(name)
  }

  // const addItem = (): void => {
  //   const trimmed = value.trim()
  //   if (!trimmed) return

  //   // Prevent duplicates and max length of 6 items
  //   if (!items.includes(trimmed) && items.length < 6) {
  //     const updatedItems = [...items, trimmed]
  //     updateItems(updatedItems)
  //   }

  //   setValueState("") // Reset input field
  // }

  const addItem = (custom?: string): void => {
    const trimmed = (custom ?? value).trim()
    if (!trimmed) return

    if (!items.includes(trimmed) && items.length < 6) {
      updateItems([...items, trimmed])
    }

    setValueState("")
  }


  const removeItem = (benefit: string): void => {
    const updatedItems = items.filter(b => b !== benefit)
    updateItems(updatedItems)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault()
      addItem()
    }
  }

  const filteredAllBenefits = allbenefits.filter(tag =>
    typeof tag === "string" &&
    tag.toLowerCase().trim().includes(value.toLowerCase().trim()) &&
    !items.includes(tag)
  )

 


  return (
    <div className="col-span-1 w-full sm:col-span-2 md:col-span-1">
      <Label className="block mb-1 text-black">{title}</Label>

      {/* {!disable && (
        <Input
          placeholder={placeholder}
          className={`mb-2 ${width}`}
          value={value}
          onChange={e => {
            setValueState(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          disabled={disable}
          onBlur={onBlur}
        />
      )} */}

      {!disable && (
        <div className="relative">
          <Input
            placeholder={placeholder}
            className={`mb-2 ${width}`}
            value={value}
            onChange={e => setValueState(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={onBlur} // ✅ Blur event is now forwarded
            disabled={disable}
          />

          {value && filteredAllBenefits.length > 0 && (
            <div className="absolute z-50 bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-48 overflow-auto w-full">
              {filteredAllBenefits.map((item: string) => (
                <div
                  key={item}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => addItem(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <div
            key={item}
            className="flex items-center px-2 py-1 max-w-full text-sm text-black bg-white rounded border border-gray-300 shadow-sm"
          >
            <span className="mr-1">{item}</span>
            <button
              type="button"
              onClick={() => {
                removeItem(item)
              }}
              className="text-gray-500 hover:text-red-500 focus:outline-none"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Display error message if no labels are entered */}
      {errors[name]?.message && (
        <div className="text-sm text-red-500">
          {String(errors[name]?.message)}
        </div>
      )}
    </div>
  )
}

// import React, { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { X } from "lucide-react"

// interface Props {
//   title: string
//   placeholder: string
//   benefits: string[]
//   name: string
//   width?: string
//   disable?: boolean
//   onChange?: (items: string[]) => void
//   onBlur?: () => void
// }

// export default function LabelInput({
//   title,
//   placeholder,
//   benefits,
//   name,
//   width = "w-full",
//   disable = false,
//   onChange,
//   onBlur
// }: Props): React.ReactElement {
//   const [value, setValue] = useState("")

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if ((e.key === "Enter" || e.key === ",") && value.trim()) {
//       e.preventDefault()
//       const newBenefits = [...benefits, value.trim()]
//       setValue("")
//       onChange?.(newBenefits)
//     }
//   }

//   const handleRemove = (index: number) => {
//     const updated = benefits.filter((_, i) => i !== index)
//     onChange?.(updated)
//   }

//   return (
//     <div className={`flex flex-col gap-1 ${width}`}>
//       <Label className="mb-1">{title}</Label>

//       <div className="flex flex-wrap gap-1 border rounded px-2 py-1 min-h-[42px] items-center">
//         {benefits.map((item, idx) => (
//           <div
//             key={idx}
//             className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm flex items-center gap-1"
//           >
//             {item}
//             {!disable && (
//               <X
//                 size={14}
//                 className="cursor-pointer"
//                 onClick={() => handleRemove(idx)}
//               />
//             )}
//           </div>
//         ))}

//         {!disable && (
//           <Input
//             value={value}
//             placeholder={placeholder}
//             className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 w-auto"
//             onChange={(e) => setValue(e.target.value)}
//             onKeyDown={handleKeyDown}
//             onBlur={onBlur} // ✅ Forwarded here
//           />
//         )}
//       </div>
//     </div>
//   )
// }
