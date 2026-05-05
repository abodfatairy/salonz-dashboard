"use client";

import React, { useState } from "react";

export default function CreateServicePage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !image) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image); // binary upload

    setLoading(true);

    try {
      const res = await fetch("/api/services/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed");

      setName("");
      setImage(null);

      alert("Service created");
    } catch (err) {
      console.error(err);
      alert("Error creating service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-5'
      >
        <h1 className='text-xl font-bold text-gray-800'>Create Service</h1>

        {/* Name */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm text-gray-600'>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black'
            placeholder='Service name'
          />
        </div>

        {/* Image */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm text-gray-600'>Image</label>
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
          {loading ? "Creating..." : "Create Service"}
        </button>
      </form>
    </div>
  );
}
