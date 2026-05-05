"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  ProductCategoryname: string;
  Name: string;
  Description: string;
  Price: string;
  StockQuantity: string;
  image: string;
  Images: string[];
  isDigital: boolean;
  onDelete?: (id: string) => void; // <-- جديد
}

export default function ExpandableProductCard({
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

  // إغلاق عند النقر خارج البطاقة
  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () =>
    setActive(false),
  );

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/40 z-10'
          />
        )}
      </AnimatePresence>

      {/* Expanded View */}
      <AnimatePresence>
        {active && (
          <div className='fixed inset-0 z-[100] grid place-items-center p-3 sm:p-4'>
            <motion.button
              key={`close-${uid}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute top-3 right-3 sm:top-4 sm:right-4 bg-white rounded-full h-8 w-8 flex items-center justify-center shadow'
              onClick={() => setActive(false)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${id}-${uid}`}
              ref={ref}
              className='w-full max-w-[480px] sm:max-w-[500px] bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg'
            >
              <motion.div
                layoutId={`image-${id}-${uid}`}
                className='relative h-52 sm:h-64 w-full'
              >
                <Image
                  src={image}
                  alt={Name}
                  fill
                  sizes='(max-width: 768px) 100vw, 600px'
                  className='object-cover'
                  priority
                />
              </motion.div>

              <div className='p-4 sm:p-5 space-y-2 sm:space-y-3'>
                <motion.h3
                  layoutId={`title-${id}-${uid}`}
                  className='text-lg sm:text-xl font-semibold text-white'
                >
                  {Name}
                </motion.h3>

                <motion.p
                  layoutId={`description-${id}-${uid}`}
                  className='text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed'
                >
                  {Description}
                </motion.p>

                <div className='flex justify-between items-center mt-3'>
                  <span className='text-green-600 font-semibold text-base sm:text-lg'>
                    ${Price}
                  </span>
                  {isDigital && (
                    <span className='text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-2 py-0.5 sm:py-1 rounded-full'>
                      Digital
                    </span>
                  )}
                </div>

                <div className='text-xs text-neutral-500 mt-3 border-t pt-2 sm:mt-4 sm:pt-3 space-y-1'>
                  <p>
                    <strong>Category:</strong> {ProductCategoryname}
                  </p>
                  <p>
                    <strong>Stock:</strong> {StockQuantity}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Collapsed Card */}
      <motion.div
        layoutId={`card-${id}-${uid}`}
        onClick={() => setActive(true)}
        className='group p-3 sm:p-4 flex items-center justify-between hover:bg-gray-300 rounded-xl cursor-pointer transition'
      >
        <div className='flex gap-3 sm:gap-4 items-center'>
          <motion.div
            layoutId={`image-${id}-${uid}`}
            className='relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0'
          >
            <Image
              src={image}
              alt={Name}
              fill
              sizes='64px'
              className='object-cover'
            />
          </motion.div>
          <div className='flex-1'>
            <motion.h3
              layoutId={`title-${id}-${uid}`}
              className='text-sm sm:text-base font-medium text-white group-hover:text-black transition-colors'
            >
              {Name}
            </motion.h3>
            <motion.p
              layoutId={`description-${id}-${uid}`}
              className='text-xs sm:text-sm text-slate-300 line-clamp-2 group-hover:text-gray-700'
            >
              {Description}
            </motion.p>
          </div>
        </div>
        <motion.button
          layoutId={`button-${id}-${uid}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(id);
          }}
          className='px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-sm rounded-full font-bold bg-red-500 hover:bg-red-600 text-white transition'
        >
          حذف
        </motion.button>
        {/* <Link
          href={`/products/${id}`}
          passHref
        >
          <motion.button
            layoutId={`button-${id}-${uid}`}
            onClick={(e) => e.stopPropagation()} // يمنع فتح البطاقة الموسعة عند الضغط على الزر
            className='px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-sm rounded-full font-bold bg-gray-100 hover:bg-main hover:text-white text-black transition'
          >
            عرض المنتج
          </motion.button>
        </Link> */}
      </motion.div>
    </>
  );
}

export const CloseIcon = () => (
  <motion.svg
    xmlns='http://www.w3.org/2000/svg'
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-black'
  >
    <path
      stroke='none'
      d='M0 0h24v24H0z'
      fill='none'
    />
    <path d='M18 6l-12 12' />
    <path d='M6 6l12 12' />
  </motion.svg>
);
