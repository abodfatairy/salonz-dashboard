"use client";

import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import {
  Home,
  Users,
  CreditCard,
  FileText,
  User,
  ChevronDown,
  Tags,
  Plus,
  ScissorsIcon,
  Scissors,
  Store,
  Award,
  LayoutGrid,
} from "lucide-react"; // أيقونات من مكتبة lucide
import Link from "next/link"; // الربط بين الصفحات
import { motion, AnimatePresence } from "framer-motion"; // للتحريك والانتقالات
import { usePathname } from "next/navigation"; // لمعرفة الصفحة الحالية
// import Cookies from "js-cookie"; // للوصول للكعكات
import Image from "next/image"; // عرض الصور بكفاءة
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // Popover من shadcn

// 👇 تعريف واجهة بيانات المتجر
interface StoreData {
  storeName: string;
  imageLogo: string;
}

// 👇 المكون الرئيسي للسايدبار
const DesktopSidebar = memo(({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // لمعرفة الصفحة الحالية
  const [isOpen, setIsOpen] = useState(false); // حالة فتح/غلق السايدبار
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // أي Dropdown مفتوح
  const [storeData, setStoreData] = useState<StoreData | null>(null); // بيانات المتجر من الكعكات

  // 👇 جلب بيانات المتجر عند التحميل من الكعكات
  // useEffect(() => {
  //   const cookieData = Cookies.get("storeData");
  //   if (cookieData) {
  //     try {
  //       setStoreData(JSON.parse(cookieData));
  //     } catch {}
  //   }
  // }, []);

  // 👇 قائمة العناصر والقوائم الفرعية
  const menuItems = useMemo(
    () => [
      {
        name: "المتجر",
        icon: <Store className='h-5 w-5' />, // تم تحديث الأيقونة هنا
        children: [
          {
            name: "متجر جديد",
            path: "/store/create",
            icon: <Plus className='h-4 w-4' />,
          },
          {
            name: "عرض المتاجر",
            path: "/store/get-all",
            icon: <FileText className='h-4 w-4' />,
          },
          {
            name: "أصناف المتجر",
            path: "/store/category",
            icon: <Tags className='h-4 w-4' />,
          },
          {
            name: "العلامات التجارية",
            path: "/store/brands",
            icon: <Award className='h-4 w-4' />, // أيقونة مناسبة للبراندات
          },
          {
            name: "عرض المنتجات",
            path: "/store/products/get-all",
            icon: <LayoutGrid className='h-4 w-4' />,
          },
          {
            name: "إضافة منتج",
            path: "/store/products/add-product",
            icon: <Plus className='h-4 w-4' />,
          },
        ],
      },
      {
        name: "الصالون",
        icon: <Scissors className='h-5 w-5' />,
        children: [
          {
            name: "إضافة صالون",
            path: "/salon/create",
            icon: <Plus className='h-4 w-4' />,
          },
          {
            name: "إضافة خدمة",
            path: "/salon/services/create",
            icon: <Plus className='h-4 w-4' />,
          },
          {
            name: "تعديل خدمة",
            path: "/salon/services/update",
            icon: <FileText className='h-4 w-4' />,
          },
          {
            name: "فئات الصالون",
            path: "/salon/category",
            icon: <Tags className='h-4 w-4' />,
          },
        ],
      },
      {
        name: "الحساب",
        icon: <User className='h-5 w-5' />,
        path: "/dashboard/profile",
      },
    ],
    [],
  );
  // 👇 تعيين Dropdown المفتوح تلقائياً على أساس الصفحة الحالية
  useEffect(() => {
    const found = menuItems.find((item) =>
      item.children?.some((child) => pathname.startsWith(child.path)),
    );
    setOpenDropdown(found?.name || null);
  }, [pathname, menuItems]);

  // 👇 دالة لفتح/غلق السايدبار
  const toggleSidebar = useCallback(() => setIsOpen((p) => !p), []);

  // 👇 دالة فتح/غلق Dropdown
  const toggleDropdown = useCallback(
    (name: string) => setOpenDropdown((prev) => (prev === name ? null : name)),
    [],
  );

  return (
    <div className='flex w-screen h-screen flex-row-reverse dark:bg-gray-900'>
      {/* 👇 Sidebar نفسه */}
      <div
        className={`relative flex flex-col border-l border-gray-200 dark:border-gray-700 
        bg-white dark:bg-gray-800 transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* 👇 زر فتح وغلق Sidebar */}
        <button
          onClick={toggleSidebar}
          className='absolute top-1/2 -left-3 z-50 flex h-6 w-6 -translate-y-1/2
          items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700
          dark:text-gray-200 shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
        >
          {isOpen ? "→" : "←"}
        </button>

        {/* 👇 شعار أو صورة المتجر */}
        <Link
          href='/profile'
          className='flex justify-center items-center h-16 mb-2 cursor-pointer'
        >
          {storeData?.imageLogo ? (
            <div className='relative w-10 h-10 rounded-full overflow-hidden'>
              <Image
                src={storeData.imageLogo}
                alt='Logo'
                fill
                className='object-cover'
              />
            </div>
          ) : (
            <div className='grid h-10 w-10 place-content-center rounded-full bg-pink-300 dark:bg-pink-700 text-white text-lg font-bold'>
              {storeData?.storeName?.[0]?.toUpperCase() || "S"}
            </div>
          )}
        </Link>

        {/* 👇 قائمة العناصر */}
        <div className='flex-1 border-t border-gray-200 dark:border-gray-700 overflow-y-auto scrollbar-hide px-2 py-4 space-y-1'>
          {menuItems.map((item) => {
            const isDropdown = !!item.children; // هل العنصر يحتوي على أولاد؟
            const isActiveDropdown = openDropdown === item.name; // هل Dropdown مفتوح؟
            const isActive =
              (!isDropdown && pathname.startsWith(item.path || "")) ||
              isActiveDropdown; // حالة العنصر النشط

            // 👇 محتوى العنصر (أيقونة + اسم إذا Sidebar مفتوح)
            const ItemContent = (
              <div className='flex flex-row-reverse items-center gap-2'>
                {item.icon}
                {isOpen && (
                  <span className='text-sm font-medium pr-2'>{item.name}</span>
                )}
              </div>
            );

            return (
              <div key={item.name}>
                {/* 👇 إذا Sidebar مغلق ولدينا Dropdown → نستخدم Popover */}
                {!isOpen && isDropdown ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={`w-full flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-200 transition-all hover:bg-pink-100 dark:hover:bg-pink-900/40 ${
                          isActive
                            ? "bg-pink-200 dark:bg-pink-800/50 text-pink-700 dark:text-pink-300 "
                            : ""
                        }`}
                      >
                        {item.icon}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align='start'
                      side='right'
                      sideOffset={8}
                      className='w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2'
                    >
                      <div className='flex flex-col gap-1'>
                        {item.children!.map((child) => (
                          <Link
                            key={child.name}
                            href={child.path}
                            className='flex items-center justify-end gap-2 px-2 py-1 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                          >
                            {child.icon}
                            <span>{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : isDropdown ? (
                  // 👇 إذا Sidebar مفتوح → نستخدم زر Dropdown + Chevron
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`w-full flex items-center justify-between rounded-md px-2 py-2
                    text-gray-700 dark:text-gray-200 flex-row-reverse transition-all
                    hover:bg-pink-100 dark:hover:bg-pink-900/40 ${
                      isActive
                        ? "bg-pink-200 dark:bg-pink-800/50 text-pink-700 dark:text-pink-300"
                        : ""
                    }`}
                  >
                    {ItemContent}
                    {isOpen && (
                      <motion.div
                        animate={{ rotate: isActiveDropdown ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                      </motion.div>
                    )}
                  </button>
                ) : (
                  // 👇 عنصر بدون أولاد → رابط مباشر
                  <Link
                    href={item.path!}
                    className={`w-full flex items-center justify-center rounded-md px-2 py-2 text-gray-700 dark:text-gray-200
                    flex-row-reverse transition-all ${
                      isActive
                        ? "bg-pink-200 dark:bg-pink-800/50 text-pink-700 dark:text-pink-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {ItemContent}
                  </Link>
                )}

                {/* 👇 Dropdown children (ظهور العناصر الفرعية) */}
                <AnimatePresence>
                  {isDropdown && isActiveDropdown && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className='flex flex-col pr-8 mt-1 space-y-1 overflow-hidden'
                    >
                      {item.children!.map((child) => {
                        const isActiveChild = pathname.startsWith(child.path);
                        return (
                          <Link
                            key={child.name}
                            href={child.path}
                            className={`flex items-center justify-end gap-2 text-sm px-2 py-1 rounded transition-colors ${
                              isActiveChild
                                ? "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300"
                                : "text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-300"
                            }`}
                          >
                            {child.icon}
                            {isOpen && <span>{child.name}</span>}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 👇 المحتوى الرئيسي */}
      <main className='flex-1 min-w-0 bg-gray-50 dark:bg-gray-900 overflow-auto transition-all scrollbar-hide'>
        {children}
      </main>
    </div>
  );
});

// 👇 تعيين اسم العرض للمكون لتسهيل Debugging
DesktopSidebar.displayName = "DesktopSidebar";
export default DesktopSidebar;
