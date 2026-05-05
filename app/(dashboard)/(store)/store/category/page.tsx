"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Upload, ImageIcon, Sparkles } from "lucide-react";
import { toast } from "sonner"; // تأكد من تثبيت مكتبة sonner للإشعارات أو استخدم مكتبتك المفضلة

/* ---------------- Types ---------------- */

interface Category {
  id: string;
  name: string;
  description: string;
  imageFile: File | null;
  imageUrl?: string;
}

interface FormState {
  name: string;
  description: string;
  imageFile: File | null;
}

/* ---------------- Dummy Data ---------------- */

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat_1",
    name: "عناية بالبشرة",
    description: "مجموعة متكاملة من الكريمات والسيروم لتغذية ونضارة البشرة.",
    imageFile: null,
    imageUrl: "https://picsum.photos/seed/skin/300/300",
  },
  {
    id: "cat_2",
    name: "مكياج الوجه",
    description: "كريم أساس، كونسيلر، وبودرة لمظهر مثالي يدوم طوال اليوم.",
    imageFile: null,
    imageUrl: "https://picsum.photos/seed/makeup/300/300",
  },
  {
    id: "cat_3",
    name: "عطور فرمونية",
    description: "عطور جذابة وفخمة تناسب جميع الأذواق والمناسبات.",
    imageFile: null,
    imageUrl: "https://picsum.photos/seed/perfume/300/300",
  },
];

/* ---------------- Main Component ---------------- */

export default function StoreCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    imageFile: null,
  });

  /* ---------------- Handlers ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, imageFile: file }));

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      toast.error("الرجاء إدخال اسم ووصف القسم");
      return;
    }

    const newImageUrl = form.imageFile
      ? URL.createObjectURL(form.imageFile)
      : undefined;

    if (editingId) {
      // Update existing category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingId
            ? { ...cat, ...form, imageUrl: newImageUrl || cat.imageUrl }
            : cat,
        ),
      );
      toast.success("تم تحديث القسم بنجاح");
    } else {
      // Create new category
      if (!form.imageFile && !newImageUrl) {
        toast.error("الرجاء إرفاق صورة للقسم");
        return;
      }

      const newCategory: Category = {
        id: crypto.randomUUID(),
        ...form,
        imageUrl: newImageUrl,
      };
      setCategories((prev) => [newCategory, ...prev]);
      toast.success("تم إضافة القسم الجديد بنجاح");
    }

    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description,
      imageFile: null, // لا نضع الملف هنا
    });
    setPreview(category.imageUrl || null);

    // تمرير الشاشة للأعلى لتسهيل التعديل
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا القسم؟")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success("تم حذف القسم");
      // إذا كان المستخدم يحذف القسم الذي يقوم بتعديله حالياً
      if (editingId === id) resetForm();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      imageFile: null,
    });
    setPreview(null);
  };

  // تنظيف الذاكرة للصور المؤقتة
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* ---------------- UI ---------------- */

  return (
    <div
      dir='rtl'
      className='min-h-screen bg-gray-50 p-4 md:p-8 font-sans'
    >
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-3'>
            <Sparkles className='w-8 h-8 text-indigo-600' />
            أقسام منتجات التجميل
          </h1>
          <p className='text-gray-500 mt-2 text-sm'>
            أضف، عدل، أو احذف التصنيفات الخاصة بمتجرك.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* ---------------- 1. FORM SECTION ---------------- */}
          <div className='lg:col-span-4'>
            <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-8'>
              <div className='flex items-center gap-3 mb-6 pb-4 border-b border-gray-100'>
                <div className='w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600'>
                  {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                </div>
                <h2 className='text-xl font-bold text-gray-800'>
                  {editingId ? "تعديل القسم" : "إضافة قسم جديد"}
                </h2>
              </div>

              <form
                onSubmit={handleSubmit}
                className='space-y-5'
              >
                {/* Name */}
                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-semibold text-gray-700'>
                    اسم القسم
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    placeholder='مثال: عطور نسائية'
                    className='w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent rounded-xl px-4 py-2.5 transition-all text-right'
                    required
                  />
                </div>

                {/* Description */}
                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-semibold text-gray-700'>
                    الوصف
                  </label>
                  <textarea
                    name='description'
                    value={form.description}
                    onChange={handleChange}
                    placeholder='وصف مختصر للقسم...'
                    className='w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent rounded-xl px-4 py-3 h-24 resize-none transition-all text-right'
                    required
                  />
                </div>

                {/* Image Upload ($binary) */}
                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-semibold text-gray-700'>
                    صورة القسم *
                  </label>
                  <label className='border-2 border-dashed border-gray-200 rounded-2xl h-40 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-indigo-400 transition-colors group relative overflow-hidden bg-gray-50/50'>
                    {preview ? (
                      <div className='absolute inset-0 w-full h-full bg-white flex items-center justify-center'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt='Preview'
                          className='w-full h-full object-cover group-hover:opacity-40 transition-opacity'
                        />
                        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                          <span className='bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg'>
                            تغيير الصورة
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className='w-8 h-8 text-gray-400 group-hover:text-indigo-600 transition-colors mb-2' />
                        <span className='text-sm font-medium text-gray-700'>
                          اضغط لرفع الصورة
                        </span>
                        <span className='text-xs text-gray-400 mt-1'>
                          PNG, JPG (الحد الأقصى 2MB)
                        </span>
                      </>
                    )}
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleImageChange}
                      className='hidden'
                      required={!editingId && !preview}
                    />
                  </label>
                </div>

                {/* Actions */}
                <div className='pt-4 flex gap-3'>
                  <button
                    type='submit'
                    className='flex-1 bg-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all'
                  >
                    {editingId ? "حفظ التعديلات" : "إضافة القسم"}
                  </button>

                  {editingId && (
                    <button
                      type='button'
                      onClick={resetForm}
                      className='flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all'
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* ---------------- 2. LIST SECTION ---------------- */}
          <div className='lg:col-span-8'>
            <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[500px]'>
              <div className='flex justify-between items-center mb-6 pb-4 border-b border-gray-100'>
                <h2 className='text-xl font-bold text-gray-800'>
                  الأقسام الحالية
                </h2>
                <span className='bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-lg'>
                  {categories.length} أقسام
                </span>
              </div>

              {categories.length === 0 ? (
                // Empty State
                <div className='flex flex-col items-center justify-center h-64 text-center'>
                  <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4'>
                    <ImageIcon className='w-10 h-10 text-gray-300' />
                  </div>
                  <h3 className='text-lg font-bold text-gray-800'>
                    لا يوجد أقسام
                  </h3>
                  <p className='text-gray-500 text-sm mt-1 max-w-sm'>
                    ابدأ بإضافة أول قسم لمنتجاتك من النموذج الجانبي.
                  </p>
                </div>
              ) : (
                // Categories Grid
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className={`group border rounded-2xl p-4 flex gap-4 transition-all hover:shadow-md hover:border-indigo-100 ${
                        editingId === cat.id
                          ? "ring-2 ring-indigo-500 border-transparent bg-indigo-50/30"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className='w-24 h-24 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 relative'>
                        {cat.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center'>
                            <ImageIcon className='w-8 h-8 text-gray-300' />
                          </div>
                        )}
                      </div>

                      {/* Content & Actions */}
                      <div className='flex-1 min-w-0 flex flex-col'>
                        <h3 className='font-bold text-gray-900 truncate text-lg'>
                          {cat.name}
                        </h3>
                        <p className='text-sm text-gray-500 line-clamp-2 mt-1 flex-1 leading-relaxed'>
                          {cat.description}
                        </p>

                        {/* Action Buttons */}
                        <div className='mt-3 flex justify-end gap-2'>
                          <button
                            onClick={() => handleEdit(cat)}
                            className='p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors tooltip'
                            title='تعديل'
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className='p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip'
                            title='حذف'
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
