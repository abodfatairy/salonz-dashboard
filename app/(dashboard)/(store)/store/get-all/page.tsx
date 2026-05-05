"use client";

import React, { useState } from "react";
import { Search, MapPin, User, CalendarDays, Store } from "lucide-react";

/* ---------------- Types ---------------- */

interface StoreType {
  id: string;
  firstName: string;
  lastName: string;
  storeName: string;
  description: string;
  address: string;
  dob: string;
  city: string;
  region: string;
  imageUrl: string;
}

/* ---------------- Dummy Data ---------------- */

const MOCK_STORES: StoreType[] = [
  {
    id: "1",
    firstName: "محمد",
    lastName: "الشامي",
    storeName: "جمالكِ بدمشق",
    description:
      "مركز متكامل لأحدث صيحات المكياج والعناية بالبشرة من الماركات العالمية والمحلية.",
    address: "دمشق، شارع الحمراء، مقابل سينما الشام",
    dob: "12/05/1984",
    city: "دمشق",
    region: "المركز",
    imageUrl: "https://picsum.photos/seed/damas1/600/400",
  },
  {
    id: "2",
    firstName: "لينا",
    lastName: "القدسي",
    storeName: "أوركيد لمستحضرات التجميل",
    description:
      "تشكيلة واسعة من العطور والزيوت الطبيعية ومستحضرات العناية بالجسم والشعر.",
    address: "دمشق، حي أبو رمانة، جادة الجلاء",
    dob: "30/09/1995",
    city: "دمشق",
    region: "المركز",
    imageUrl: "https://picsum.photos/seed/damas2/600/400",
  },
  {
    id: "3",
    firstName: "سامر",
    lastName: "الحمصي",
    storeName: "روز ماري للتجميل",
    description:
      "نؤمن لكِ أفضل منتجات العناية الاحترافية المخصصة لصالونات التجميل.",
    address: "دمشق، المزة، أوتوستراد المزة، بناء المهندسين",
    dob: "14/02/1989",
    city: "دمشق",
    region: "المزة",
    imageUrl: "https://picsum.photos/seed/damas3/600/400",
  },
  {
    id: "4",
    firstName: "هالة",
    lastName: "الخطيب",
    storeName: "لؤلؤة الشام للمكياج",
    description:
      "متجر متخصص بماركات التجميل النباتية والطبيعية والخالية من الكيماويات.",
    address: "دمشق القديمة، مدخل سوق ساروجة",
    dob: "21/07/1991",
    city: "دمشق",
    region: "دمشق القديمة",
    imageUrl: "https://picsum.photos/seed/damas4/600/400",
  },
];

/* ---------------- Main Component ---------------- */

export default function StoresListPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // فلترة المتاجر بناءً على نص البحث (يبحث في اسم المتجر أو المدينة أو اسم المالك)
  const filteredStores = MOCK_STORES.filter((store) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      store.storeName.toLowerCase().includes(searchLower) ||
      store.city.toLowerCase().includes(searchLower) ||
      store.firstName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div
      dir='rtl'
      className='min-h-screen bg-gray-50 p-6 md:p-10 font-sans'
    >
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-3'>
              <Store className='w-8 h-8 text-indigo-600' />
              إدارة المتاجر
            </h1>
            <p className='text-gray-500 mt-2 text-sm'>
              استعرض وقم بإدارة جميع المتاجر المسجلة في النظام.
            </p>
          </div>

          {/* Search Bar */}
          <div className='relative w-full md:w-96'>
            <input
              type='text'
              placeholder='ابحث عن متجر، مدينة، أو مالك...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-4 pr-11 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow shadow-sm'
            />
            <Search className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
          </div>
        </div>

        {/* Grid Container */}
        {filteredStores.length === 0 ? (
          <div className='bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm'>
            <Store className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h2 className='text-xl font-bold text-gray-700'>لا يوجد نتائج</h2>
            <p className='text-gray-500 mt-2'>
              لم نتمكن من العثور على أي متجر يطابق بحثك "{searchQuery}".
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Store Card Component ---------------- */

function StoreCard({ store }: { store: StoreType }) {
  return (
    <div className='bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full'>
      {/* Image Header */}
      <div className='relative h-48 overflow-hidden bg-gray-100'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={store.imageUrl}
          alt={store.storeName}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
        />
        {/* City Badge */}
        <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm'>
          {store.city}
        </div>
      </div>

      {/* Content */}
      <div className='p-5 flex flex-col flex-1'>
        {/* Store Info */}
        <div className='mb-4'>
          <h2
            className='text-lg font-bold text-gray-900 truncate'
            title={store.storeName}
          >
            {store.storeName}
          </h2>
          <p
            className='text-sm text-gray-500 mt-1 line-clamp-2'
            title={store.description}
          >
            {store.description}
          </p>
        </div>

        {/* Divider */}
        <hr className='border-gray-100 mb-4' />

        {/* Details List */}
        <div className='space-y-3 mb-6 flex-1'>
          <div className='flex items-start gap-2 text-sm text-gray-600'>
            <MapPin className='w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0' />
            <span className='line-clamp-2'>
              {store.region} - {store.address}
            </span>
          </div>

          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <User className='w-4 h-4 text-gray-400 flex-shrink-0' />
            <span>
              {store.firstName} {store.lastName}
            </span>
          </div>

          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <CalendarDays className='w-4 h-4 text-gray-400 flex-shrink-0' />
            <span
              dir='ltr'
              className='text-right'
            >
              {store.dob}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className='w-full bg-gray-50 text-indigo-600 font-semibold py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors border border-gray-100 hover:border-transparent'>
          عرض التفاصيل
        </button>
      </div>
    </div>
  );
}
