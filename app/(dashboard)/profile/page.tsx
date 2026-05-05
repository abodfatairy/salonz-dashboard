"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Star, MapPin, Phone, Calendar, Store, Percent } from "lucide-react";

/* ---------------- Types ---------------- */

export interface StoreData {
  storeID: string;
  storeName: string;
  firstName: string;
  lastName: string;
  averageRating: number;
  createdAt: string;
  phoneNumber: string;
  dob: string;
  description: string;
  city: string;
  region: string;
  address: string;
  payoutPercentage: number;
  coverImage: string;
  imageLogo: string;
}

/* ---------------- Mock Data ---------------- */

const MOCK_STORE_DATA: StoreData = {
  storeID: "st-987654",
  storeName: "بوتيك الأناقة والجمال",
  firstName: "سارة",
  lastName: "المحمود",
  averageRating: 4.8,
  createdAt: "2023-05-12T10:00:00Z",
  phoneNumber: "+966 50 123 4567",
  dob: "1992-08-22",
  description:
    "متجر متخصص في تقديم أرقى مستحضرات التجميل والعناية بالبشرة من ماركات عالمية أصلية 100%. نهتم بجمالك وتألقك اليومي.",
  city: "الرياض",
  region: "المنطقة الوسطى",
  address: "شارع العليا العام، بجوار برج المملكة",
  payoutPercentage: 85,
  coverImage: "https://picsum.photos/seed/storecover/1200/400",
  imageLogo: "https://picsum.photos/seed/storelogo/200/200",
};

/* ---------------- Main Component ---------------- */

export default function StoreProfilePage() {
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);

  // 🚀 محاكاة جلب البيانات من API
  useEffect(() => {
    let isMounted = true;

    const fetchStoreProfile = async () => {
      try {
        // تأخير وهمي لمدة ثانية ونصف لمحاكاة الشبكة
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (isMounted) {
          setStoreData(MOCK_STORE_DATA);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
        setLoading(false);
      }
    };

    fetchStoreProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // حالة التحميل (Loading State)
  if (loading) {
    return (
      <div
        dir='rtl'
        className='min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4'
      >
        <div className='w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin'></div>
        <p className='text-gray-500 font-medium animate-pulse'>
          جارٍ جلب بيانات المتجر...
        </p>
      </div>
    );
  }

  // إذا لم يتم العثور على بيانات
  if (!storeData) {
    return (
      <div
        dir='rtl'
        className='min-h-screen bg-gray-50 flex items-center justify-center'
      >
        <p className='text-red-500 font-bold'>حدث خطأ أثناء تحميل البيانات.</p>
      </div>
    );
  }

  return (
    <div
      dir='rtl'
      className='min-h-screen bg-gray-50 pb-12 font-sans'
    >
      {/* 1. Cover Image Section */}
      <div className='w-full h-64 md:h-80 relative bg-gray-200'>
        <Image
          src={storeData.coverImage}
          alt='Store Cover'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent'></div>
      </div>

      {/* 2. Main Content Container (Overlap Cover) */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
          {/* ----------- Left Column (Profile Info Card) ----------- */}
          <div className='lg:col-span-1'>
            <Card className='pt-0 flex flex-col items-center p-6 text-center shadow-lg shadow-gray-200/50'>
              {/* Profile Logo */}
              <div className='relative w-36 h-36 rounded-full overflow-hidden border-4 border-white bg-white shadow-md -mt-20 mb-4'>
                <Image
                  src={storeData.imageLogo}
                  alt='Store Logo'
                  fill
                  className='object-cover'
                />
              </div>

              {/* Name & Desc */}
              <h1 className='text-2xl font-extrabold text-gray-900'>
                {storeData.storeName}
              </h1>
              <p className='text-sm text-gray-500 mt-2 leading-relaxed'>
                {storeData.description}
              </p>

              {/* Stats */}
              <div className='w-full mt-6 space-y-4'>
                <div className='flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100'>
                  <div className='flex items-center gap-2 text-yellow-600 font-bold'>
                    <Star className='w-5 h-5 fill-yellow-500 text-yellow-500' />
                    <span>التقييم</span>
                  </div>
                  <span className='text-gray-900 font-bold'>
                    {storeData.averageRating} / 5
                  </span>
                </div>

                <div className='flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100'>
                  <div className='flex items-center gap-2 text-indigo-600 font-bold'>
                    <Percent className='w-5 h-5' />
                    <span>نسبة الدفع الكتروني</span>
                  </div>
                  <span className='text-gray-900 font-bold'>
                    {storeData.payoutPercentage}%
                  </span>
                </div>

                <div className='flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100'>
                  <div className='flex items-center gap-2 text-teal-600 font-bold'>
                    <Store className='w-5 h-5' />
                    <span>تاريخ الانضمام</span>
                  </div>
                  <span className='text-gray-900 font-bold text-sm'>
                    {new Date(storeData.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* ----------- Right Column (Form Info) ----------- */}
          <div className='lg:col-span-2'>
            <Card className='p-6 md:p-8 shadow-sm'>
              <div className='mb-6 pb-6 border-b border-gray-100'>
                <h2 className='text-xl font-bold text-gray-900'>
                  معلومات الحساب والتواصل
                </h2>
                <p className='text-gray-500 text-sm mt-1'>
                  البيانات المسجلة للمتجر وصاحب الحساب.
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <InputGroup
                  label='الاسم الأول'
                  icon={<span className='text-gray-400'>👤</span>}
                >
                  <Input
                    value={storeData.firstName}
                    readOnly
                  />
                </InputGroup>

                <InputGroup label='الاسم الأخير'>
                  <Input
                    value={storeData.lastName}
                    readOnly
                  />
                </InputGroup>

                <InputGroup
                  label='رقم الهاتف'
                  icon={<Phone className='w-4 h-4 text-gray-400' />}
                >
                  <Input
                    value={storeData.phoneNumber}
                    readOnly
                    dir='ltr'
                    className='text-left'
                  />
                </InputGroup>

                <InputGroup
                  label='تاريخ الميلاد'
                  icon={<Calendar className='w-4 h-4 text-gray-400' />}
                >
                  <Input
                    value={storeData.dob}
                    readOnly
                  />
                </InputGroup>

                <InputGroup
                  label='المدينة'
                  icon={<MapPin className='w-4 h-4 text-gray-400' />}
                >
                  <Input
                    value={storeData.city}
                    readOnly
                  />
                </InputGroup>

                <InputGroup label='المنطقة'>
                  <Input
                    value={storeData.region}
                    readOnly
                  />
                </InputGroup>

                <div className='md:col-span-2'>
                  <InputGroup label='العنوان التفصيلي'>
                    <Input
                      value={storeData.address}
                      readOnly
                    />
                  </InputGroup>
                </div>
              </div>

              <div className='mt-8 flex justify-end'>
                <Button onClick={() => alert("ميزة التحديث ستتوفر قريباً!")}>
                  تحديث المعلومات
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Reusable UI Components ---------------- */

// 1. Card Component
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-3xl  ${className}`}
    >
      {children}
    </div>
  );
}

// 2. Input Group Helper (Label + Icon Wrapper)
function InputGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label className='text-sm font-bold text-gray-700'>{label}</label>
      <div className='relative'>
        {icon && (
          <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
            {icon}
          </div>
        )}
        <div className={icon ? "pr-10" : ""}>{children}</div>
      </div>
    </div>
  );
}

// 3. Input Component (Styled for ReadOnly mode)
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors 
      ${props.readOnly ? "opacity-80 cursor-default focus:border-gray-200" : ""} 
      ${props.className || ""}`}
    />
  );
}

// 4. Button Component
function Button({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}
