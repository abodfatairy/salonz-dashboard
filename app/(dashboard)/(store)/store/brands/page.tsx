"use client";

import React, { useState, useEffect } from "react";

/* ---------------- Types & Interfaces ---------------- */

type Brand = {
  id: string;
  name: string;
  description: string;
  imageLogo: File | null;
  imageUrl?: string;
};

type FormState = {
  name: string;
  description: string;
  imageLogo: File | null;
};

const initialMockBrands: Brand[] = [
  {
    id: "b1",
    name: "Mac Cosmetics",
    description: "Leading professional makeup authority.",
    imageLogo: null,
    imageUrl: "https://picsum.photos/seed/mac/200/200",
  },
  {
    id: "b2",
    name: "Fenty Beauty",
    description: "Beauty for all, created by Rihanna.",
    imageLogo: null,
    imageUrl: "https://picsum.photos/seed/fenty/200/200",
  },
  {
    id: "b3",
    name: "Rare Beauty",
    description: "Breaking down unrealistic standards of perfection.",
    imageLogo: null,
    imageUrl: "https://picsum.photos/seed/rare/200/200",
  },
];

/* ---------------- Main Component ---------------- */

export default function MakeupBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(initialMockBrands);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    imageLogo: null,
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
    setForm((prev) => ({ ...prev, imageLogo: file }));

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newImageUrl = form.imageLogo
      ? URL.createObjectURL(form.imageLogo)
      : undefined;

    if (editingId) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingId
            ? { ...b, ...form, imageUrl: newImageUrl || b.imageUrl }
            : b,
        ),
      );
    } else {
      const newBrand: Brand = {
        id: crypto.randomUUID(),
        ...form,
        imageUrl: newImageUrl,
      };
      setBrands((prev) => [newBrand, ...prev]);
    }

    resetForm();
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setForm({
      name: brand.name,
      description: brand.description,
      imageLogo: null,
    });
    setPreview(brand.imageUrl || null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      imageLogo: null,
    });
    setPreview(null);
  };

  // Clean up Object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* ---------------- UI ---------------- */

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8 font-sans'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Makeup Brands</h1>
          <p className='text-gray-500 mt-1 text-sm'>
            Manage your store's makeup brands and products.
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
                  {editingId ? "Edit Brand" : "New Brand"}
                </h2>
              </div>

              <div className='space-y-5'>
                <Input
                  label='Brand Name'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  placeholder='e.g. Dior Beauty'
                  required
                />

                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-semibold text-gray-700'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    value={form.description}
                    onChange={handleChange}
                    placeholder='Brief details about the brand...'
                    className='border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 bg-gray-50 focus:bg-white transition-all h-24 resize-none'
                    required
                  />
                </div>

                {/* Custom File Upload for Logo */}
                <div className='flex flex-col gap-1.5'>
                  <label className='text-sm font-semibold text-gray-700'>
                    Brand Logo (Image)
                  </label>
                  <label className='border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-slate-800 transition-colors group relative overflow-hidden bg-gray-50'>
                    {preview ? (
                      <div className='absolute inset-0 w-full h-full bg-white flex items-center justify-center'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt='Logo Preview'
                          className='w-full h-full object-cover opacity-90 group-hover:opacity-30 transition-opacity'
                        />
                        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                          <span className='bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium'>
                            Change Image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadIcon className='w-8 h-8 text-gray-400 group-hover:text-slate-800 transition-colors mb-2' />
                        <span className='text-sm font-medium text-gray-700'>
                          Upload Logo
                        </span>
                        <span className='text-xs text-gray-500 mt-1'>
                          PNG, JPG up to 2MB
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
              </div>

              <div className='mt-8 flex gap-3'>
                <button
                  type='submit'
                  className='flex-1 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 shadow-md transition-all'
                >
                  {editingId ? "Save Changes" : "Create Brand"}
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
                <h2 className='text-xl font-bold text-gray-800'>All Brands</h2>
                <span className='bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full'>
                  {brands.length} Brands
                </span>
              </div>

              {brands.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-64 text-center'>
                  <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4'>
                    <SparklesIcon className='w-10 h-10 text-gray-300' />
                  </div>
                  <h3 className='text-lg font-medium text-gray-800'>
                    No brands found
                  </h3>
                  <p className='text-gray-500 text-sm mt-1 max-w-sm'>
                    Start by adding a new makeup brand from the form.
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {brands.map((b) => (
                    <div
                      key={b.id}
                      className={`group border rounded-xl p-4 flex gap-4 transition-all hover:shadow-md hover:border-slate-300 ${
                        editingId === b.id
                          ? "ring-2 ring-slate-900 border-transparent bg-slate-50"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {/* Logo Thumbnail */}
                      <div className='w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200'>
                        {b.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={b.imageUrl}
                            alt={b.name}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <ImageIcon className='w-8 h-8 text-gray-300' />
                        )}
                      </div>

                      {/* Content */}
                      <div className='flex-1 min-w-0 flex flex-col'>
                        <h3 className='font-bold text-gray-900 truncate'>
                          {b.name}
                        </h3>
                        <p className='text-sm text-gray-500 line-clamp-2 mt-1 flex-1'>
                          {b.description}
                        </p>

                        {/* Action */}
                        <div className='mt-3 flex justify-end'>
                          <button
                            onClick={() => handleEdit(b)}
                            className='text-xs font-medium text-slate-700 bg-gray-100 hover:bg-slate-900 hover:text-white px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5'
                          >
                            <EditIcon className='w-3 h-3' />
                            Edit
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

/* ---------------- Reusable UI Components & Types ---------------- */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Input({ label, type = "text", ...props }: InputProps) {
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

/* ---------------- Simple SVG Icons (Type-Safe) ---------------- */

interface IconProps extends React.SVGProps<SVGSVGElement> {}

function PlusIcon(props: IconProps) {
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

function EditIcon(props: IconProps) {
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

function UploadIcon(props: IconProps) {
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

function ImageIcon(props: IconProps) {
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

function SparklesIcon(props: IconProps) {
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
      <path d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' />
    </svg>
  );
}
