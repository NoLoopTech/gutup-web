import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface dataListTypes {
  value: string
  label: string
}

export default function FoodOverviewPage() {
  const categories: dataListTypes[] = [
    { value: "Fruits", label: "Fruits" },
    { value: "Vegetables", label: "Vegetables" },
    { value: "Meat", label: "Meat" },
    { value: "Dairy", label: "Dairy" }
  ]

  const nutritional: dataListTypes[] = [
    { value: "Low Calories", label: "Low Calories" },
    { value: "High Calories", label: "High Calories" },
    { value: "Low Fat", label: "Low Fat" },
    { value: "High Fat", label: "High Fat" }
  ]

  const seasons: dataListTypes[] = [
    { value: "Spring", label: "Spring" },
    { value: "Summer", label: "Summer" },
    { value: "Autumn", label: "Autumn" },
    { value: "Winter", label: "Winter" }
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {/* search foods by name */}
        <Input className="max-w-xs" placeholder="Search by food name..." />

        {/* select category */}
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="max-h-40">
            <SelectGroup>
              {categories.map(item => (
                <SelectItem value={item.value.toString()}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* select Nutritional */}
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Nutritional" />
          </SelectTrigger>
          <SelectContent className="max-h-40">
            <SelectGroup>
              {nutritional.map(item => (
                <SelectItem value={item.value.toString()}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* select Season */}
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Season" />
          </SelectTrigger>
          <SelectContent className="max-h-40">
            <SelectGroup>
              {seasons.map(item => (
                <SelectItem value={item.value.toString()}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
