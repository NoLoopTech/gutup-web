import AsyncSelect from "react-select/async"
import axios from "axios"
import { useState } from "react"

interface LocationDropdownProps {
  name: string
  onSelect: (selectedOptions: string[]) => void // Define a prop for onSelect callback
  errorMessage: string
  selectedOption: OptionType | null
  onSelectLocation: (selectedOptions: OptionType) => void
}

interface OptionType {
  value: string
  label: string
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  name,
  onSelect,
  errorMessage,
  selectedOption,
  onSelectLocation
}) => {
  const [localSelectedOption, setLocalSelectedOption] =
    useState<OptionType | null>(selectedOption)
  const fetchLocations = async (inputValue: string) => {
    if (!inputValue) {
      return []
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputValue}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )

      return response.data.predictions.map((place: any) => ({
        label: place.description,
        value: place.place_id
      }))
    } catch (error) {
      console.error("Error fetching locations:", error)
      return []
    }
  }

  // Custom styles for the AsyncSelect component
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: "8px", // Adjust border radius as desired
      borderColor: state.isFocused ? "#4D194D" : "#4D194D",
      borderWidth: "2px", // Adjust border width as desired
      boxShadow: state.isFocused ? "none" : "none", // Remove default box-shadow
      outline: "none", // Remove the outline
      backgroundColor: "#fef2f2",
      "&:hover": {
        borderColor: "#4D194D" // Change this to your desired hover border color
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#fef2f2" // Change this to your desired background color
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#FFEBE7" : "", // Change this to your desired background color
      color: "#4D194D" // Text color
    }),
    singleValue: (provided: any) => ({
      ...provided,
      fontFamily: "PlayfairDisplay" // Change this to your desired font family
    }),
    input: (provided: any) => ({
      ...provided,
      outline: "none", // Remove the outline for the input
      boxShadow: "none" // Remove the box-shadow for the input
    })
  }

  return (
    <div className="relative z-50">
      <AsyncSelect
        cacheOptions
        loadOptions={fetchLocations}
        defaultOptions
        value={localSelectedOption}
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
          className={`flex ml-1 text-sm text-pink-700 font-Vollkorn sm:text-md 3xl:text-xl 4xl:text-2xl`}
        >
          {errorMessage}
        </div>
      )}
    </div>
  )
}

export default LocationDropdown
