"use client";

import { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

/* ---------- شكل الحالة العامة للنموذج ---------- */
export interface FormState {
  ProductCategoryID: string;
  Name: string;
  Description: string;
  Price: string;
  OldPrice?: string;
  Size?: string;
  StockQuantity: string;
  Image?: File;
  Images: File[];
  ProductTypeID: string;
  Survery?: Array<{
    productTypeAttributeID: string;
    selectedOptionIDs: string[];
  }>;
}

interface Props {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  categories: { id: string; name: string }[];
  loadingCategories: boolean;
  fromCache?: boolean;
}

/* ---------- المكون ---------- */
export default function ProductForm({
  form,
  setForm,
  categories,
  loadingCategories,
  fromCache = false,
}: Props) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className='space-y-5'>
      {/* 🏷️ اسم المنتج */}
      <InputField
        label='اسم المنتج'
        name='Name'
        value={form.Name}
        onChange={handleChange}
        placeholder='مثال: كريم مرطب للوجه'
      />

      {/* 🗂️ الفئة */}
      <div className='flex flex-col space-y-2'>
        <Label className='text-gray-700 font-semibold text-sm'>الفئة</Label>
        <Select
          value={form.ProductCategoryID}
          onValueChange={(val) =>
            setForm((p) => ({ ...p, ProductCategoryID: val }))
          }
        >
          {/* تحويل للوضع الفاتح هنا */}
          <SelectTrigger className='bg-gray-50 border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 transition-all rounded-xl h-11'>
            <SelectValue
              placeholder={loadingCategories ? "جارٍ التحميل..." : "اختر الفئة"}
            />
          </SelectTrigger>
          <SelectContent className='bg-white border-gray-100 shadow-lg text-gray-900 rounded-xl'>
            {categories.map((c) => (
              <SelectItem
                key={c.id}
                value={c.id}
                className='cursor-pointer hover:bg-gray-50 focus:bg-gray-50 transition-colors'
              >
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fromCache && (
          <p className='text-xs text-gray-500 mt-1'>
            (يتم تحديث البيانات بالخلفية 🔄)
          </p>
        )}
      </div>

      {/* 📝 الوصف */}
      <TextareaField
        label='الوصف'
        name='Description'
        value={form.Description}
        onChange={handleChange}
        placeholder='اكتب وصفاً مفصلاً للمنتج هنا...'
      />

      {/* 💰 السعر و الكمية و السعر القديم و الحجم */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <InputField
          label='السعر'
          name='Price'
          value={form.Price}
          onChange={handleChange}
          placeholder='0.00'
        />
        <InputField
          label='الكمية'
          name='StockQuantity'
          value={form.StockQuantity}
          onChange={handleChange}
          placeholder='0'
        />
        <InputField
          label='السعر القديم (اختياري)'
          name='OldPrice'
          value={form.OldPrice || ""}
          onChange={handleChange}
          placeholder='0.00'
        />
        <InputField
          label='الحجم (اختياري)'
          name='Size'
          value={form.Size || ""}
          onChange={handleChange}
          placeholder='مثال: 50ml'
        />
      </div>
    </div>
  );
}

/* ---------- مكون فرعي لحقل إدخال ---------- */
function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className='flex flex-col space-y-2'>
      <Label className='text-gray-700 font-semibold text-sm'>{label}</Label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-all rounded-xl h-11'
      />
    </div>
  );
}

/* ---------- مكون فرعي لحقل النصوص الطويلة ---------- */
function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className='flex flex-col space-y-2'>
      <Label className='text-gray-700 font-semibold text-sm'>{label}</Label>
      <Textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-all rounded-xl min-h-[120px] resize-y'
      />
    </div>
  );
}
