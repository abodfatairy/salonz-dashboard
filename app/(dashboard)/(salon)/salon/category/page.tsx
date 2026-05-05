"use client";

import React, { useState, useEffect } from "react";

/* ---------------- Mock Data ---------------- */

const mockServices = [
  { id: "srv-1", name: "قص شعر" },
  { id: "srv-2", name: "صبغ شعر" },
  { id: "srv-3", name: "تنظيف بشرة" },
];

type Category = {
  id: string;
  name: string;
  priority: number;
  serviceId: string;
  image?: File | null;
  imageUrl?: string; // أضفنا هذا لعرض الصورة في القائمة
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    priority: 1,
    serviceId: mockServices[0].id,
    image: null as File | null,
  });

  /* ---------------- Handlers ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "priority" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrl = form.image ? URL.createObjectURL(form.image) : undefined;

    if (editingId) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, ...form, imageUrl: imageUrl || c.imageUrl }
            : c,
        ),
      );
    } else {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        ...form,
        imageUrl,
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    resetForm();
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      priority: cat.priority,
      serviceId: cat.serviceId,
      image: null,
    });
    setPreview(cat.imageUrl || null);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      priority: 1,
      serviceId: mockServices[0].id,
      image: null,
    });
    setPreview(null);
  };

  // تنظيف الذاكرة للصور المؤقتة
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* ---------------- UI ---------------- */

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8 font-sans'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Categories Management
          </h1>
          <p className='text-gray-500 mt-1 text-sm'>
            Organize and manage service categories.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* ---------------- FORM SECTION ---------------- */}
          <div className='lg:col-span-4'>
            <form
              onSubmit={handleSubmit}
              className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8'
            >
              <div className='flex items-center gap-2 mb-6'>
                <div className='w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white'>
                  {editingId ? <EditIcon /> : <PlusIcon />}
                </div>
                <h2 className='text-xl font-bold text-gray-800'>
                  {editingId ? "Edit Category" : "New Category"}
                </h2>
              </div>

              <div className='space-y-5'>
                <Input
                  label='Category Name'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  placeholder='e.g. Hair Care'
                  required
                />

                <div className='grid grid-cols-2 gap-4'>
                  <Input
                    label='Priority'
                    type='number'
                    name='priority'
                    value={form.priority}
                    onChange={handleChange}
                    min='1'
                    required
                  />

                  <div className='flex flex-col gap-1.5'>
                    <label className='text-sm font-semibold text-gray-700'>
                      Service
                    </label>
                    <select
                      name='serviceId'
                      value={form.serviceId}
                      onChange={handleChange}
                      className='border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 bg-gray-50 focus:bg-white transition-all w-full appearance-none cursor-pointer'
                    >
                      {mockServices.map((s) => (
                        <option
                          key={s.id}
                          value={s.id}
                        >
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Custom File Upload */}
                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-semibold text-gray-700'>
                    Category Image
                  </label>
                  <label className='border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-slate-800 transition-colors group relative overflow-hidden'>
                    {preview ? (
                      <div className='absolute inset-0 w-full h-full'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt='Preview'
                          className='w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity'
                        />
                        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                          <span className='bg-slate-900 text-white px-3 py-1 rounded-lg text-sm'>
                            Change Image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadIcon className='w-8 h-8 text-gray-400 group-hover:text-slate-800 transition-colors mb-2' />
                        <span className='text-sm font-medium text-gray-700'>
                          Click to upload image
                        </span>
                        <span className='text-xs text-gray-500 mt-1'>
                          PNG, JPG up to 5MB
                        </span>
                      </>
                    )}
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleImageChange}
                      className='hidden'
                    />
                  </label>
                </div>
              </div>

              <div className='mt-8 flex gap-3'>
                <button
                  type='submit'
                  className='flex-1 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 shadow-md transition-all'
                >
                  {editingId ? "Save Changes" : "Create Category"}
                </button>

                {editingId && (
                  <button
                    type='button'
                    onClick={resetForm}
                    className='flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all'
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ---------------- LIST SECTION ---------------- */}
          <div className='lg:col-span-8'>
            <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-gray-800'>
                  All Categories
                </h2>
                <span className='bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full'>
                  {categories.length} Total
                </span>
              </div>

              {categories.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-64 text-center'>
                  <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4'>
                    <FolderIcon className='w-10 h-10 text-gray-300' />
                  </div>
                  <h3 className='text-lg font-medium text-gray-800'>
                    No categories found
                  </h3>
                  <p className='text-gray-500 text-sm mt-1 max-w-sm'>
                    Get started by creating a new category from the form on the
                    left.
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {categories.map((c) => {
                    const service = mockServices.find(
                      (s) => s.id === c.serviceId,
                    );

                    return (
                      <div
                        key={c.id}
                        className={`group border rounded-xl p-4 flex items-start gap-4 transition-all hover:shadow-md hover:border-slate-300 ${
                          editingId === c.id
                            ? "ring-2 ring-slate-900 border-transparent bg-slate-50"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {/* Image Thumbnail */}
                        <div className='w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200'>
                          {c.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={c.imageUrl}
                              alt={c.name}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <ImageIcon className='w-6 h-6 text-gray-400' />
                          )}
                        </div>

                        {/* Content */}
                        <div className='flex-1 min-w-0'>
                          <div className='flex justify-between items-start mb-1'>
                            <h3 className='font-bold text-gray-900 truncate pr-2'>
                              {c.name}
                            </h3>
                            <span className='inline-flex items-center justify-center bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider'>
                              Pri: {c.priority}
                            </span>
                          </div>
                          <p className='text-sm text-gray-500 truncate mb-3'>
                            <span className='text-gray-400'>Service:</span>{" "}
                            {service?.name}
                          </p>

                          {/* Action */}
                          <button
                            onClick={() => handleEdit(c)}
                            className='text-xs font-medium text-slate-700 bg-gray-100 hover:bg-slate-900 hover:text-white px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5'
                          >
                            <EditIcon className='w-3 h-3' />
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Reusable UI Components ---------------- */

function Input({ label, type = "text", ...props }: any) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label className='text-sm font-semibold text-gray-700'>{label}</label>
      <input
        type={type}
        {...props}
        className='border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 bg-gray-50 focus:bg-white transition-all w-full'
      />
    </div>
  );
}

/* ---------------- Simple SVG Icons ---------------- */

function PlusIcon(props: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <line
        x1='12'
        y1='5'
        x2='12'
        y2='19'
      ></line>
      <line
        x1='5'
        y1='12'
        x2='19'
        y2='12'
      ></line>
    </svg>
  );
}

function EditIcon(props: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
      <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
    </svg>
  );
}

function UploadIcon(props: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
      <polyline points='17 8 12 3 7 8'></polyline>
      <line
        x1='12'
        y1='3'
        x2='12'
        y2='15'
      ></line>
    </svg>
  );
}

function ImageIcon(props: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <rect
        x='3'
        y='3'
        width='18'
        height='18'
        rx='2'
        ry='2'
      ></rect>
      <circle
        cx='8.5'
        cy='8.5'
        r='1.5'
      ></circle>
      <polyline points='21 15 16 10 5 21'></polyline>
    </svg>
  );
}

function FolderIcon(props: any) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'></path>
    </svg>
  );
}
