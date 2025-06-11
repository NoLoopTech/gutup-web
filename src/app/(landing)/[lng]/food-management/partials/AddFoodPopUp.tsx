'use client';

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddFoodEnglish from "./AddFoodEnglish";

import type { RichTextEditorHandle } from "@/components/Shared/TextEditor/RichTextEditor";
import AddFoodFranch from './AddFoodFranch';

interface Props {
  open: boolean;
  onClose: () => void;
}
interface Option {
  value: string;
  label: string;
}

export default function AddFoodPopUp({ open, onClose }: Props): JSX.Element {
  const [allowMultiLang, setAllowMultiLang] = useState(false);
  const [activeTab, setActiveTab] = useState<"english" | "french">("english");

  // Refs for each RichTextEditor
  const selectionRef = useRef<RichTextEditorHandle>(null);
  const preparationRef = useRef<RichTextEditorHandle>(null);
  const conservationRef = useRef<RichTextEditorHandle>(null);

  // Shared data arrays
  const categories: Option[] = [
    { value: "fruits", label: "Fruits" },
    { value: "vegetables", label: "Vegetables" },
    { value: "dairy", label: "Dairy" },
    { value: "grains", label: "Grains" },
  ];
  const seasons: Option[] = [
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "autumn", label: "Autumn" },
    { value: "winter", label: "Winter" },
  ];
  const countries: Option[] = [
    { value: "switzerland", label: "Switzerland" },
    { value: "france", label: "France" },
    { value: "germany", label: "Germany" },
    { value: "italy", label: "Italy" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-6 rounded-xl overflow-hidden">
        <div
          className="h-full overflow-y-auto p-2"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              width: 0px;
              background: transparent;
            }
          `}</style>

          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-black">Add New Food Item</h2>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val as "english" | "french");
            }}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <TabsList>
                <TabsTrigger value="english">English</TabsTrigger>
                {allowMultiLang && <TabsTrigger value="french">French</TabsTrigger>}
              </TabsList>

              <div className="flex items-center gap-2">
                <Switch
                  id="multi-lang"
                  checked={allowMultiLang}
                  onCheckedChange={(val) => {
                    setAllowMultiLang(val);
                    if (!val) setActiveTab("english");
                  }}
                />
                <Label htmlFor="multi-lang" className="text-Primary-300">
                  Allow Multi Lang
                </Label>
              </div>
            </div>

            {/* Render each tab’s content component */}
            <AddFoodEnglish
              categories={categories}
              seasons={seasons}
              countries={countries}
              selectionRef={selectionRef}
              preparationRef={preparationRef}
              conservationRef={conservationRef}
            />

            {allowMultiLang && (
              <AddFoodFranch
                categories={categories}
                seasons={seasons}
                countries={countries}
                selectionRef={selectionRef}
                preparationRef={preparationRef}
                conservationRef={conservationRef}
              />
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
