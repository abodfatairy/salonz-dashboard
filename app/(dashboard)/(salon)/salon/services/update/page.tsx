"use client";

import React, { useState } from "react";

// بيانات وهمية
const mockServices = [
  {
    id: "srv-1",
    name: "قص شعر",
  },
  {
    id: "srv-2",
    name: "تسريحات مناسبات",
  },
  {
    id: "srv-3",
    name: "صبغ شعر",
  },
  {
    id: "srv-4",
    name: "تنظيف بشرة",
  },
];

export default function UpdateServicePage() {
  const [selectedId, setSelectedId] = useState("srv-1");
  const [name, setName] = useState("قص شعر");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // عند اختيار خدمة
  const handleSelect = (id: string) => {
    setSelectedId(id);

    const service = mockServices.find((s) => s.id === id);
    if (service) {
      setName(service.name);
    }

    setImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      console.log("Updated Service:", {
        id: selectedId,
        name,
        image,
      });

      alert("Service updated (mock)");
      setLoading(false);
    }, 800);
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-5'
      >
        <h1 className='text-xl font-bold text-gray-800'>Update Service</h1>

        {/* Select Service */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm text-gray-600'>Select Service</label>
          <select
            value={selectedId}
            onChange={(e) => handleSelect(e.target.value)}
            className='border rounded-lg px-3 py-2'
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

        {/* Name */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm text-gray-600'>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black'
          />
        </div>

        {/* Image */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm text-gray-600'>Image (optional)</label>
          <input
            type='file'
            accept='image/*'
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className='border rounded-lg px-3 py-2 bg-white'
          />
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          type='submit'
          className='w-full bg-black text-white py-2.5 rounded-xl hover:bg-gray-800 transition disabled:opacity-50'
        >
          {loading ? "Updating..." : "Update Service"}
        </button>
      </form>
    </div>
  );
}
