"use client";

import React, { useEffect, useState, useMemo, memo } from "react";
import {
  Home,
  Users,
  User,
  Plus,
  Tags,
  FileText,
  Scissors,
  LayoutGrid,
  Award,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
// import Cookies from "js-cookie";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface StoreData {
  storeName: string;
  imageLogo: string;
}

const MobileSidebar = memo(({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [storeData, setStoreData] = useState<StoreData | null>(null);

  // useEffect(() => {
  //   const cookieData = Cookies.get("storeData");
  //   if (cookieData) {
  //     try {
  //       setStoreData(JSON.parse(cookieData));
  //     } catch {}
  //   }
  // }, []);

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
        path: "/profile",
      },
    ],
    [],
  );

  return (
    <TooltipProvider>
      <div className='flex h-screen w-screen flex-row-reverse dark:bg-gray-900'>
        {/* ✅ الشريط الجانبي */}
        <aside className='relative w-16 bg-gray-800 border-l border-gray-700 flex flex-col items-center py-4 gap-4 shrink-0'>
          {/* شعار المتجر */}
          <Link
            href='/profile'
            className='relative w-10 h-10 mb-2'
          >
            {storeData?.imageLogo ? (
              <Image
                src={storeData.imageLogo}
                alt='Logo'
                fill
                className='object-cover rounded-full'
              />
            ) : (
              <div className='grid h-10 w-10 place-content-center rounded-full bg-pink-500 text-white text-lg font-bold'>
                {storeData?.storeName?.[0]?.toUpperCase() || "S"}
              </div>
            )}
          </Link>

          {/* قائمة العناصر */}
          {menuItems.map((item) => {
            const active =
              pathname === item.path ||
              item.children?.some((child) => pathname.startsWith(child.path));

            if (item.children) {
              return (
                <Popover
                  key={item.name}
                  modal={false}
                >
                  <PopoverTrigger asChild>
                    <button
                      className={`p-2 rounded-md transition-colors ${
                        active
                          ? "bg-pink-500 text-white"
                          : "text-gray-300 hover:text-pink-400 hover:bg-gray-700"
                      }`}
                    >
                      {item.icon}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    side='left'
                    sideOffset={8}
                    align='start'
                    className='w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50'
                  >
                    <div className='flex flex-col gap-1'>
                      {item.children.map((child) => {
                        const isActive = pathname.startsWith(child.path);
                        return (
                          <Link
                            key={child.name}
                            href={child.path}
                            className={`flex flex-row-reverse items-center justify-end gap-2 px-2 py-1 rounded-md text-sm transition-colors ${
                              isActive
                                ? "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            {child.icon}
                            <span>{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.path!}
                    className={`p-2 rounded-md transition-colors ${
                      active
                        ? "bg-pink-500 text-white"
                        : "text-gray-300 hover:text-pink-400 hover:bg-gray-700"
                    }`}
                  >
                    {item.icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side='left'
                  className='text-sm font-medium'
                >
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </aside>

        {/* المحتوى الرئيسي */}
        <main className='flex-1 h-full overflow-auto bg-gray-50 dark:bg-gray-900'>
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
});

MobileSidebar.displayName = "MobileSidebar";
export default MobileSidebar;
