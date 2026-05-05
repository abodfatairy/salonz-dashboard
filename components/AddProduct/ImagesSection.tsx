"use client";

import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { FormState } from "./ProductForm";

/* ---------- قسم رفع الصور ---------- */
export default function ImagesSection({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const handleMainImageChange = (files: File[]) => {
    setForm((p) => ({ ...p, Image: files[0] || undefined }));
  };

  const handleSecondaryImagesChange = (files: File[]) => {
    setForm((p) => ({ ...p, Images: files.slice(0, 3) }));
  };

  return (
    <div className='space-y-4'>
      {/* 📸 الصورة الرئيسية */}
      <div className='flex flex-col space-y-2'>
        <Label>الصورة الرئيسية</Label>
        <FileUpload
          multiple={false}
          files={form.Image ? [form.Image] : []}
          onChange={handleMainImageChange}
        />
      </div>

      {/* 🖼️ الصور الثانوية */}
      <div className='flex flex-col space-y-2'>
        <Label>صور ثانوية (حتى 3)</Label>
        <FileUpload
          multiple
          files={form.Images}
          maxFiles={3}
          onChange={handleSecondaryImagesChange}
        />
      </div>
    </div>
  );
}
