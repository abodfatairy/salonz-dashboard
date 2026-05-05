"use client";

import { useState, useEffect, FormEvent } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react"; // أيقونة جمالية للمتجر

// استدعاء مكوناتك الخاصة (تأكد من مساراتها)
import ProductForm, { FormState } from "@/components/AddProduct/ProductForm";
import ImagesSection from "@/components/AddProduct/ImagesSection";
import ProductTypeSurvey from "@/components/AddProduct/BeautySurvey";

/* ---------- Types ---------- */
interface Category {
  id: string;
  name: string;
}

// أضفنا نوع بيانات المتجر المبسط للاختيار
interface SimpleStore {
  id: string;
  name: string;
}

export interface StoreData {
  storeID: string;
  storeName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  description: string;
  address: string;
  city: string;
  region: string;
  imageLogo: string;
  coverImage: string;
  payoutPercentage: number;
  dob: string;
  createdAt: string;
}

/* ---------- Mock Data (بيانات وهمية بديلة للـ API) ---------- */
const MOCK_CATEGORIES: Category[] = [
  { id: "cat_1", name: "عناية بالبشرة" },
  { id: "cat_2", name: "مكياج" },
  { id: "cat_3", name: "عطور" },
];

const MOCK_PRODUCT_TYPES = [
  {
    id: "a6ac3a35-bc48-4765-8a59-25c2013cbee0",
    name: "منتجات التجميل",
    attributes: [
      {
        id: "attr_1",
        name: "نوع البشرة المناسب",
        options: [
          { id: "opt_1", name: "دهنية" },
          { id: "opt_2", name: "جافة" },
        ],
      },
    ],
  },
];

// 🆕 قائمة المتاجر الوهمية
const MOCK_STORES: SimpleStore[] = [
  { id: "store_1", name: "بوتيك الأناقة - الرياض" },
  { id: "store_2", name: "عالم الجمال - جدة" },
  { id: "store_3", name: "صالون الكلاسيك - الدمام" },
];

export default function AddProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState({ categories: false, submit: false });
  const [fromCache, setFromCache] = useState(false);

  const [dataFromAPI, setDataFromAPI] = useState<any[]>([]); // product types
  const [loadingProductTypes, setLoadingProductTypes] = useState(false);

  // 🆕 تمت إضافة StoreID إلى حالة النموذج
  const [form, setForm] = useState<
    FormState & {
      StoreID: string;
      OldPrice?: string;
      Size?: string;
      Survery?: Array<{
        productTypeAttributeID: string;
        selectedOptionIDs: string[];
      }>;
    }
  >({
    StoreID: "", // الحقل الجديد
    ProductCategoryID: "",
    Name: "",
    Description: "",
    Price: "",
    OldPrice: "",
    Size: "",
    StockQuantity: "",
    Image: undefined,
    Images: [],
    ProductTypeID: "",
    Survery: [],
  });

  /* ---------- Load Store Data ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("storeData");
    if (saved) setStoreData(JSON.parse(saved));
  }, []);

  /* ---------- Load Product Types (محاكاة) ---------- */
  useEffect(() => {
    let mounted = true;

    setLoadingProductTypes(true);
    setTimeout(() => {
      if (mounted) {
        setDataFromAPI(MOCK_PRODUCT_TYPES);
        setLoadingProductTypes(false);
      }
    }, 1000);

    return () => {
      mounted = false;
    };
  }, []);

  /* ---------- Load Categories (محاكاة) ---------- */
  useEffect(() => {
    let isMounted = true;

    setLoading((s) => ({ ...s, categories: true }));
    setTimeout(() => {
      if (isMounted) {
        setCategories(MOCK_CATEGORIES);
        setFromCache(false);
        setLoading((s) => ({ ...s, categories: false }));
      }
    }, 800);

    return () => {
      isMounted = false;
    };
  }, []);

  /* ---------- Submit (محاكاة) ---------- */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🆕 التحقق من اختيار المتجر
    if (!form.StoreID) {
      return toast.error("الرجاء اختيار المتجر الذي ينتمي إليه المنتج");
    }

    if (
      !form.ProductCategoryID ||
      !form.Name.trim() ||
      !form.Description.trim() ||
      !form.Price ||
      !form.StockQuantity ||
      !form.Image
    ) {
      return toast.error("املأ جميع الحقول المطلوبة");
    }

    if (isNaN(Number(form.Price)) || isNaN(Number(form.StockQuantity))) {
      return toast.error("السعر والكمية يجب أن يكونا أرقام صحيحة");
    }

    setLoading((s) => ({ ...s, submit: true }));

    setTimeout(() => {
      console.log("البيانات المرسلة (محاكاة):", {
        StoreID: form.StoreID, // إرسال المتجر
        ProductCategoryID: form.ProductCategoryID,
        Name: form.Name,
        Description: form.Description,
        Price: form.Price,
        OldPrice: form.OldPrice,
        Size: form.Size,
        StockQuantity: form.StockQuantity,
        Image: form.Image,
        Images: form.Images,
        ProductTypeID: "a6ac3a35-bc48-4765-8a59-25c2013cbee0",
        Survery: form.Survery,
      });

      toast.success("تم إنشاء المنتج بنجاح! (تجريبي)");

      setForm({
        StoreID: "",
        ProductCategoryID: "",
        Name: "",
        Description: "",
        Price: "",
        OldPrice: "",
        Size: "",
        StockQuantity: "",
        Image: undefined,
        Images: [],
        ProductTypeID: "",
        Survery: [],
      });

      setLoading((s) => ({ ...s, submit: false }));
    }, 1500);
  };

  return (
    <div
      className='min-h-screen bg-gray-50 text-gray-900 px-4 py-10 flex justify-center'
      dir='rtl'
    >
      <div className='w-full max-w-3xl space-y-6'>
        <Card className='bg-white border-0 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden'>
          <CardHeader className='border-b border-gray-100 bg-gray-50/50 pb-6 pt-8'>
            <CardTitle className='text-center text-2xl font-extrabold text-gray-800'>
              إضافة منتج جديد
            </CardTitle>
          </CardHeader>

          <CardContent className='pt-8 px-6 sm:px-10 pb-10'>
            <form
              onSubmit={handleSubmit}
              className='space-y-8'
            >
              {/* 🆕 قسم اختيار المتجر */}
              <div className='bg-gray-50/50 border border-gray-100 p-6 rounded-2xl'>
                <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-3'>
                  <Store className='w-5 h-5 text-indigo-600' />
                  المتجر <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <select
                    value={form.StoreID}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, StoreID: e.target.value }))
                    }
                    className='w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all cursor-pointer appearance-none shadow-sm'
                    required
                  >
                    <option
                      value=''
                      disabled
                    >
                      -- اختر المتجر الذي سيتم إضافة المنتج إليه --
                    </option>
                    {MOCK_STORES.map((store) => (
                      <option
                        key={store.id}
                        value={store.id}
                      >
                        {store.name}
                      </option>
                    ))}
                  </select>
                  {/* سهم مخصص للقائمة المنسدلة */}
                  <div className='absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                    <svg
                      className='w-5 h-5 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M19 9l-7 7-7-7'
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* باقي مكونات النموذج */}
              <ProductForm
                form={form}
                setForm={setForm}
                categories={categories}
                loadingCategories={loading.categories}
                fromCache={fromCache}
              />

              <hr className='border-gray-100' />

              <ImagesSection
                form={form}
                setForm={setForm}
              />

              <hr className='border-gray-100' />

              <ProductTypeSurvey
                productTypes={dataFromAPI}
                onChange={(answers) =>
                  setForm((prev) => ({ ...prev, Survery: answers }))
                }
              />

              <div className='pt-4'>
                <Button
                  type='submit'
                  className={`w-full py-6 text-lg font-bold rounded-xl transition-all duration-300 ${
                    loading.submit
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
                      : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 text-white"
                  }`}
                  disabled={loading.submit}
                >
                  {loading.submit ? "جارٍ الإرسال..." : "إضافة المنتج"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
