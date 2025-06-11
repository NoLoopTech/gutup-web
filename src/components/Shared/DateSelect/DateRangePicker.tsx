"use client"

import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import * as React from "react"
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function DateRangePicker({ onChange }: { onChange?: Function }) {
  const [date, setDate] = React.useState<any>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  })

  const [open, setOpen] = React.useState(false)

  const formattedRange = `${format(date.startDate, "MMM dd, yyyy")} - ${format(
    date.endDate,
    "MMM dd, yyyy"
  )}`

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>{formattedRange}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 mr-10">
        <DateRange
          ranges={[date]}
          onChange={(item: any) => {
            setDate(item.selection)
            onChange?.(item.selection)
          }}
          moveRangeOnFirstSelection={false}
          months={1}
          direction="horizontal"
        />
      </PopoverContent>
    </Popover>
  )
}
