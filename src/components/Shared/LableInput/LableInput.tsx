"use client";

import React, { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface Props {
  title: string;
  placeholder: string;
  benefits?: string[];
}

export default function LableInput({
  title,
  placeholder,
  benefits = [],
}: Props): React.ReactElement {
  const [value, setValue] = useState("");
  const [items, setItems] = useState<string[]>(benefits);

  /* add a benefit */
  const addItem = (): void => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!items.includes(trimmed) && items.length < 6) {
      setItems((prev) => [...prev, trimmed]);
    }
    setValue("");
  };

  /* remove a benefit */
  const removeItem = (benefit: string): void =>
    { setItems((prev) => prev.filter((b) => b !== benefit)); };

  /* handle Enter key */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div
      className="col-span-1 sm:col-span-2 md:col-span-1"
      style={{ width: "100%" }}
    >
      <Label className="text-black mb-1 block">{title}</Label>

      {/* input for new benefit */}
      <Input
        placeholder={placeholder}
        className="mb-2"
        value={value}
        onChange={(e) => { setValue(e.target.value); }}
        onKeyDown={handleKeyDown}
      />

      {/* list of pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between bg-white text-black shadow-sm border border-gray-300 h-6 py-1 px-2 text-sm rounded"
          >
            <span className="truncate">{item}</span>
            <button
              type="button"
              onClick={() => { removeItem(item); }}
              className="ml-1 text-gray-500 hover:text-red-500 focus:outline-none"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
