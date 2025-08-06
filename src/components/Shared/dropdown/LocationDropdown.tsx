import AsyncSelect from "react-select/async"
import axios from "axios"
import { useState } from "react"

interface LocationDropdownProps {
  onSelect: (selectedOptions: string[]) => void
  errorMessage?: string
  selectedOption: OptionType | null
  defaultLocation?: OptionType
  onSelectLocation: (selectedOptions: OptionType) => void
}

interface OptionType {
  value: string
  label: string
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  onSelect,
  errorMessage,
  selectedOption,
  defaultLocation,
  onSelectLocation
}) => {
  const [localSelectedOption, setLocalSelectedOption] =
    useState<OptionType | null>(selectedOption)

  const fetchLocations = async (inputValue: string) => {
    if (!inputValue) return []

    try {
      const response = await axios.get(
        `/api/places/autocomplete?input=${inputValue}`
      )
      return response.data.results
    } catch (error) {
      console.error("Error fetching locations:", error)
      return []
    }
  }

  // Custom styles for the AsyncSelect component
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "36px", 
      height: "36px",
      borderRadius: "6px",
      borderColor: state.isFocused ? "#969595" : "#e5e5e5",
      borderWidth: "1.3px",
      boxShadow: state.isFocused
        ? "0 1px 4px rgba(0,0,0,0.06)"
        : "0 1px 2px rgba(0,0,0,0.04)",
      outline: "none",
      backgroundColor: "#fff",
      fontSize: "0.875rem",
      color: "#000000",
      "&:hover": {
        borderColor: "#c4c4c4"
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#fff",
      fontSize: "0.875rem",
      color: "#000000"
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#fff" : "",
      fontSize: "0.875rem",
      color: "#000000"
    }),
    singleValue: (provided: any) => ({
      ...provided,
      fontSize: "0.875rem",
      color: "#000000"
    }),
    input: (provided: any) => ({
      ...provided,
      outline: "none",
      boxShadow: "none"
    })
  }

  return (
    <div className="relative z-50">
      <AsyncSelect
        cacheOptions
        loadOptions={fetchLocations}
        defaultOptions
        value={
          localSelectedOption === null
            ? defaultLocation || null
            : localSelectedOption
        }
        placeholder="Enter location"
        onChange={(option: OptionType | OptionType[] | null) => {
          if (option) {
            const selectedValues = Array.isArray(option)
              ? option.map(opt => opt.value)
              : [option.value]

            // console.log("Selected location ID:", selectedValues);

            onSelect(selectedValues)
            setLocalSelectedOption(Array.isArray(option) ? option[0] : option)
            onSelectLocation(Array.isArray(option) ? option[0] : option)
          } else {
            onSelect([]) // Handle case where no option is selected
          }
        }}
        styles={customStyles}
      />

      {errorMessage && (
        <div
          className={`flex ml-1 text-sm text-pink-700 font-Inter sm:text-md 3xl:text-xl 4xl:text-2xl`}
        >
          {errorMessage}
        </div>
      )}
    </div>
  )
}

export default LocationDropdown
