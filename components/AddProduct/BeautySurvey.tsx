"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// ======================================
// TYPES
// ======================================
interface ProductTypeOption {
  id: string;
  name: string;
  createdAt: string;
  productAttributes: {
    id: string;
    productTypeID: string;
    attributeName: string;
    createdAt: string;
    productAttributeOptions: {
      id: string;
      optionName: string;
      isSingleChoiceForCustomer: boolean;
    }[];
  }[];
}

interface AnswerItem {
  productTypeAttributeID: string;
  selectedOptionIDs: string[];
}

// ======================================
// MAIN COMPONENT
// ======================================
export default function ProductTypeSurvey({
  productTypes,
  onChange,
}: {
  productTypes: ProductTypeOption[];
  onChange: (answers: AnswerItem[]) => void;
}) {
  const [selectedTypeID, setSelectedTypeID] = useState<string>("");
  const [answers, setAnswers] = useState<AnswerItem[]>([]);

  const selectedType = useMemo(
    () => productTypes.find((x) => x.id === selectedTypeID),
    [selectedTypeID, productTypes],
  );

  const updateAnswers = (newAnswers: AnswerItem[]) => {
    setAnswers(newAnswers);
    onChange(newAnswers);
  };

  const toggleOption = (
    attributeID: string,
    optionID: string,
    singleChoice: boolean,
  ) => {
    updateAnswers(
      (function () {
        const existing = answers.find(
          (x) => x.productTypeAttributeID === attributeID,
        );

        if (!existing) {
          return [
            ...answers,
            {
              productTypeAttributeID: attributeID,
              selectedOptionIDs: [optionID],
            },
          ];
        }

        if (singleChoice) {
          return answers.map((x) =>
            x.productTypeAttributeID === attributeID
              ? { ...x, selectedOptionIDs: [optionID] }
              : x,
          );
        }

        const alreadySelected = existing.selectedOptionIDs.includes(optionID);
        return answers.map((x) =>
          x.productTypeAttributeID === attributeID
            ? {
                ...x,
                selectedOptionIDs: alreadySelected
                  ? x.selectedOptionIDs.filter((id) => id !== optionID)
                  : [...x.selectedOptionIDs, optionID],
              }
            : x,
        );
      })(),
    );
  };

  const handleTypeChange = (typeID: string) => {
    setSelectedTypeID(typeID);
    updateAnswers([]);
  };

  return (
    <div className='space-y-6 select-none'>
      {/* Product Type Dropdown */}
      <div className='space-y-2'>
        <Label className='text-gray-700 font-semibold text-sm'>
          خصائص إضافية للمنتج (نوع المنتج)
        </Label>

        <Select
          onValueChange={handleTypeChange}
          value={selectedTypeID}
        >
          {/* تحويل للوضع الفاتح */}
          <SelectTrigger className='w-full bg-gray-50 border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500 rounded-xl h-11'>
            <SelectValue placeholder='اختر نوع المنتج لظهور الخصائص' />
          </SelectTrigger>

          <SelectContent className='bg-white border-gray-100 shadow-lg rounded-xl'>
            {productTypes.map((pt) => (
              <SelectItem
                key={pt.id}
                value={pt.id}
                className='cursor-pointer hover:bg-gray-50 text-gray-900'
              >
                {pt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Attributes + Options */}
      {selectedType && (
        <Card className='p-6 bg-gray-50/50 border border-gray-100 shadow-inner rounded-xl space-y-8'>
          {selectedType.productAttributes.length === 0 && (
            <p className='text-gray-500 text-sm text-center py-4'>
              لا يوجد أسئلة مخصصة لهذه الفئة.
            </p>
          )}

          {selectedType.productAttributes.map((attr) => {
            const isSingle =
              attr.productAttributeOptions[0]?.isSingleChoiceForCustomer ??
              true;

            const saved = answers.find(
              (x) => x.productTypeAttributeID === attr.id,
            );

            return (
              <div
                key={attr.id}
                className='space-y-4'
              >
                <Label className='font-bold text-gray-800 text-base pb-2 border-b border-gray-200 block'>
                  {attr.attributeName}
                </Label>

                {isSingle ? (
                  <RadioGroup
                    value={saved?.selectedOptionIDs[0] ?? ""}
                    onValueChange={(val) => toggleOption(attr.id, val, true)}
                    className='grid grid-cols-1 sm:grid-cols-2 gap-3'
                  >
                    {attr.productAttributeOptions.map((opt) => (
                      <div
                        key={opt.id}
                        className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors'
                      >
                        <RadioGroupItem
                          value={opt.id}
                          id={opt.id}
                          className='border-gray-400 text-indigo-600 focus:ring-indigo-500'
                        />
                        <Label
                          htmlFor={opt.id}
                          className='text-gray-700 cursor-pointer w-full font-medium'
                        >
                          {opt.optionName}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {attr.productAttributeOptions.map((opt) => {
                      const checked =
                        saved?.selectedOptionIDs.includes(opt.id) ?? false;

                      return (
                        <div
                          key={opt.id}
                          className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors'
                        >
                          <Checkbox
                            id={opt.id}
                            checked={checked}
                            onCheckedChange={() =>
                              toggleOption(attr.id, opt.id, false)
                            }
                            className='border-gray-400 text-indigo-600 focus:ring-indigo-500'
                          />
                          <Label
                            htmlFor={opt.id}
                            className='text-gray-700 cursor-pointer w-full font-medium'
                          >
                            {opt.optionName}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
