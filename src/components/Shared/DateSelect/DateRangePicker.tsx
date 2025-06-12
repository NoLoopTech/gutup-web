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

export function DateRangePicker({
  onChange,
  value
}: {
  onChange?: (range: any) => void
  value?: {
    startDate: Date | null
    endDate: Date | null
  }
}) {
  const [open, setOpen] = React.useState(false)

  const [date, setDate] = React.useState<any>({
    startDate: value?.startDate || null,
    endDate: value?.endDate || null,
    key: "selection"
  })

  const prevStartRef = React.useRef<Date | null>(null)

  React.useEffect(() => {
    if (value?.startDate && value?.endDate) {
      setDate({
        startDate: value.startDate,
        endDate: value.endDate,
        key: "selection"
      })
    } else {
      setDate({
        startDate: null,
        endDate: null,
        key: "selection"
      })
    }
  }, [value?.startDate, value?.endDate])

  const formattedRange =
    date.startDate && date.endDate
      ? `${format(date.startDate, "MMM dd, yyyy")} - ${format(
          date.endDate,
          "MMM dd, yyyy"
        )}`
      : "Select date range"

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
          onChange={(range: any) => {
            const selection = range.selection
            setDate(selection)

            // Fire parent's onChange
            onChange?.({
              startDate: selection.startDate,
              endDate: selection.endDate
            })

            // Only close if a new endDate is selected after the startDate
            if (
              selection.startDate &&
              selection.endDate &&
              prevStartRef.current &&
              selection.startDate.getTime() === prevStartRef.current.getTime()
            ) {
              setOpen(false)
            }

            // Save latest startDate for comparison on next change
            prevStartRef.current = selection.startDate
          }}
          moveRangeOnFirstSelection={false}
          months={1}
          direction="horizontal"
        />
      </PopoverContent>
    </Popover>
  )
}
