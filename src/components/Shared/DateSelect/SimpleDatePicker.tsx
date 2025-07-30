"use client"

import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

interface SimpleDatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  label?: string
  minDate?: Date
  maxDate?: Date
}

export function SimpleDatePicker({
  value,
  onChange,
  label = "Pick a date",
  minDate = new Date("1900-01-01"),
  maxDate = new Date()
}: SimpleDatePickerProps): React.ReactElement {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-sm font-medium">{label}</span>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-[25.4rem] pl-3 text-left font-normal ${
              !value ? "text-muted-foreground" : ""
            }`}
          >
            {value ? format(value, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto" align="start">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={date => {
              onChange(date ?? null)
              setOpen(false)
            }}
            disabled={date =>
              (maxDate && date > maxDate) || (minDate && date < minDate)
            }
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
