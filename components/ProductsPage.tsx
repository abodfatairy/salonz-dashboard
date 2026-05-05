"use client";

import React, { useState, useMemo, useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useOutsideClick } from "@/hooks/use-outside-click";

export interface Product {
  id: string;
  ProductCategoryname: string;
  Name: string;
  Description: string;
  Price: string;
  StockQuantity: string;
  image?: string;
  Images: string[];
  isDigital: boolean;
}

interface Props {
  products: Product[];
}

export default function ProductsClient({ products }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [items, setItems] = useState<Product[]>(products);

  // تحديث الـ Items عند جلب صفحة جديدة
  useEffect(() => {
    setItems(products);
  }, [products]);

  // تسريع البحث (Debounce): لا تقم بالفلترة إلا بعد التوقف عن الكتابة بـ 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredProducts = useMemo(() => {
    return items.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" ||
        p.ProductCategoryname === selectedCategory;
      const matchesSearch = p.Name.toLowerCase().includes(
        debouncedSearch.toLowerCase(),
      );
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, debouncedSearch]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((p) => p.ProductCategoryname))),
    [items],
  );

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <main className='w-full px-4 py-8 sm:p-10 font-sans'>
      <div className='max-w-4xl mx-auto'>
        {/* عنوان */}
        <header className='mb-10 text-center'>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3'
          >
            المنتجات التجميلية والرقمية
          </motion.h1>
          <p className='text-gray-500 text-sm sm:text-base'>
            استعرض أحدث المنتجات وأدر متجرك بكل سهولة ✨
          </p>
        </header>

        {/* بحث + فلترة */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between mb-8 bg-white p-3 rounded-2xl shadow-sm border border-gray-100'
        >
          <Input
            type='search'
            placeholder='🔍 ابحث عن منتج...'
            className='flex-1 bg-gray-50 border-transparent focus:bg-white text-gray-900 placeholder:text-gray-400 h-11 rounded-xl'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className='w-full sm:w-56 bg-gray-50 border-transparent text-gray-900 h-11 rounded-xl focus:ring-indigo-500'>
              <SelectValue placeholder='اختر الفئة' />
            </SelectTrigger>
            <SelectContent className='bg-white text-gray-900 border border-gray-100 rounded-xl shadow-lg'>
              <SelectItem value='all'>جميع الفئات</SelectItem>
              {categories.map((cat) => (
                <SelectItem
                  key={cat}
                  value={cat}
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* عرض المنتجات */}
        <motion.div
          initial='hidden'
          animate='visible'
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className='flex flex-col gap-3'
        >
          {filteredProducts.length === 0 ? (
            <div className='text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm'>
              <p className='text-gray-500'>لا توجد منتجات مطابقة للبحث</p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <ExpandableProductCard
                  {...p}
                  image={p.image ?? "https://picsum.photos/300"}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </main>
  );
}

/* ---------------- Card Component ---------------- */

interface ProductCardProps extends Product {
  onDelete?: (id: string) => void;
}

function ExpandableProductCard({
  id,
  ProductCategoryname,
  Name,
  Description,
  Price,
  StockQuantity,
  image,
  isDigital,
  onDelete,
}: ProductCardProps) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();

  // إغلاق النافذة عند الضغط على ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(false);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = active ? "hidden" : "auto";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [active]);

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () =>
    setActive(false),
  );

  return (
    <>
      {/* Overlay للمودال */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40'
          />
        )}
      </AnimatePresence>

      {/* Expanded View (Modal) */}
      <AnimatePresence>
        {active && (
          <div className='fixed inset-0 z-50 grid place-items-center p-4'>
            <motion.button
              key={`close-${uid}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='absolute top-4 right-4 md:top-6 md:right-6 bg-white text-gray-800 hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center shadow-lg transition-colors'
              onClick={() => setActive(false)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${id}-${uid}`}
              ref={ref}
              className='w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col'
            >
              <motion.div
                layoutId={`image-${id}-${uid}`}
                className='relative h-64 w-full bg-gray-100'
              >
                <Image
                  src={image ?? ""}
                  alt={Name}
                  fill
                  sizes='(max-width: 768px) 100vw, 600px'
                  className='object-cover'
                  priority
                />
              </motion.div>

              <div className='p-6 space-y-4'>
                <motion.h3
                  layoutId={`title-${id}-${uid}`}
                  className='text-2xl font-bold text-gray-900'
                >
                  {Name}
                </motion.h3>

                <motion.p
                  layoutId={`description-${id}-${uid}`}
                  className='text-gray-600 leading-relaxed'
                >
                  {Description}
                </motion.p>

                <div className='flex justify-between items-center bg-gray-50 p-4 rounded-xl'>
                  <span className='text-indigo-600 font-bold text-xl'>
                    ${Price}
                  </span>
                  {isDigital && (
                    <span className='text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-wider'>
                      منتج رقمي
                    </span>
                  )}
                </div>

                <div className='flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-4'>
                  <p>
                    الفئة:{" "}
                    <span className='font-semibold text-gray-900'>
                      {ProductCategoryname}
                    </span>
                  </p>
                  <p>
                    المخزون:{" "}
                    <span className='font-semibold text-gray-900'>
                      {StockQuantity}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Collapsed Card (List Item) */}
      <motion.div
        layoutId={`card-${id}-${uid}`}
        onClick={() => setActive(true)}
        className='group bg-white p-3 sm:p-4 flex items-center justify-between border border-gray-100 shadow-sm rounded-2xl cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all'
      >
        <div className='flex gap-4 items-center flex-1 min-w-0'>
          <motion.div
            layoutId={`image-${id}-${uid}`}
            className='relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50'
          >
            <Image
              src={image ?? ""}
              alt={Name}
              fill
              sizes='80px'
              className='object-cover'
            />
          </motion.div>

          <div className='flex-1 min-w-0 pr-2'>
            <motion.h3
              layoutId={`title-${id}-${uid}`}
              className='text-base sm:text-lg font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors'
            >
              {Name}
            </motion.h3>
            <motion.p
              layoutId={`description-${id}-${uid}`}
              className='text-sm text-gray-500 line-clamp-1 mt-0.5'
            >
              {Description}
            </motion.p>
            <p className='text-indigo-600 font-bold mt-1 text-sm'>${Price}</p>
          </div>
        </div>

        <motion.button
          layoutId={`button-${id}-${uid}`}
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("هل أنت متأكد من حذف المنتج؟")) {
              onDelete?.(id);
            }
          }}
          className='ml-2 px-4 py-2 text-sm rounded-xl font-medium bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors flex-shrink-0'
        >
          حذف
        </motion.button>
      </motion.div>
    </>
  );
}

const CloseIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2.5'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path
      stroke='none'
      d='M0 0h24v24H0z'
      fill='none'
    />
    <path d='M18 6l-12 12' />
    <path d='M6 6l12 12' />
  </svg>
);
