"use client";

import ProductsClient from "@/components/ProductsPage";
import React, { useState, useEffect, useRef } from "react";
// import ProductsClient from "./ProductsClient"; // تأكد من المسار الصحيح

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

// إنشاء بيانات وهمية
async function fetchMockProducts(page: number, limit: number) {
  // تم تقليل وقت التأخير لتسريع الإحساس بالاستجابة
  await new Promise((resolve) => setTimeout(resolve, 300));

  const totalPages = 5;
  const data: Product[] = [];

  if (page <= totalPages) {
    for (let i = 1; i <= limit; i++) {
      const uniqueId = `prod-${page}-${i}`;
      data.push({
        id: uniqueId,
        ProductCategoryname: `تصنيف ${Math.floor(Math.random() * 5) + 1}`,
        Name: `منتج تجريبي رقم ${page}-${i}`,
        Description: `وصف المنتج التجريبي رقم ${page}-${i}. تفاصيل رائعة ومميزة جداً تناسب جميع احتياجاتك.`,
        Price: (Math.random() * 100 + 10).toFixed(2),
        StockQuantity: Math.floor(Math.random() * 50).toString(),
        image: `https://picsum.photos/seed/${uniqueId}/300/300`,
        Images: [
          `https://picsum.photos/seed/${uniqueId}-1/300/300`,
          `https://picsum.photos/seed/${uniqueId}-2/300/300`,
        ],
        isDigital: Math.random() > 0.8,
      });
    }
  }

  return { data, currentPage: page, totalPages };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      if (isFetchingRef.current || !hasMore) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        const res = await fetchMockProducts(page, 30);
        if (isMounted) {
          setProducts((prev) => [...prev, ...(res.data ?? [])]);
          setHasMore(res.currentPage < (res.totalPages ?? 1));
        }
      } catch (err) {
        console.error("❌ Error loading products:", err);
        if (isMounted) setHasMore(false);
      } finally {
        if (isMounted) {
          isFetchingRef.current = false;
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [page]);

  useEffect(() => {
    function handleScroll() {
      if (!hasMore || isFetchingRef.current) return;
      const scrollPos = window.innerHeight + window.scrollY;
      const bottom = document.body.offsetHeight - 500;
      if (scrollPos >= bottom) setPage((prev) => prev + 1);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <div
      className='min-h-screen bg-gray-50 pb-10'
      dir='rtl'
    >
      <ProductsClient products={products} />

      {loading && (
        <div className='flex justify-center items-center py-6'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <p className='text-center mt-4 text-gray-500 font-medium pb-4'>
          لا توجد منتجات إضافية
        </p>
      )}

      {products.length === 0 && !loading && (
        <p className='text-center mt-4 text-gray-500 pb-4'>
          لا توجد منتجات حالياً
        </p>
      )}
    </div>
  );
}
