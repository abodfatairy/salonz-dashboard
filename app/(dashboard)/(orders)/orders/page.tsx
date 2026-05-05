"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  MapPin,
  Calendar,
  User,
  CreditCard,
  Receipt,
} from "lucide-react"; // تأكد من تثبيت مكتبة lucide-react (غالباً موجودة مع shadcn)

// ======================================
// 1. TYPES (الهيكلية كما طلبتها بالضبط)
// ======================================
export interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
  unitPrice: number;
  productUrl: string;
  imageUrl: string | null;
  notes: string;
  images: string[];
  attributes: any;
}

export interface Order {
  id: string;
  customerID: string;
  customerName: string;
  paymentType: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: number;
  latitude: number;
  longitude: number;
  shippingAddress: string;
  notes: string;
  createdAt: string;
  completedAt: string;
  cancelledAt: string;
  trackingNumber: string;
  items: OrderItem[];
}

// ======================================
// 2. MOCK DATA (بيانات وهمية للتجربة)
// ======================================
const MOCK_ORDERS: Order[] = [
  {
    id: "ord-1234-5678-9101",
    customerID: "cus-111",
    customerName: "أحمد محمد",
    paymentType: 1, // 1 = عند الاستلام
    totalAmount: 450.0,
    paidAmount: 0.0,
    remainingAmount: 450.0,
    status: 1, // 1 = قيد الانتظار
    latitude: 24.7136,
    longitude: 46.6753,
    shippingAddress: "الرياض، حي الملقا، شارع أنس بن مالك، مبنى 15",
    notes: "الرجاء الاتصال قبل التوصيل بنصف ساعة",
    createdAt: "2023-10-25T14:30:00Z",
    completedAt: "",
    cancelledAt: "",
    trackingNumber: "",
    items: [
      {
        productName: "كريم مرطب للوجه مستخلص من الصبار",
        price: 150.0,
        quantity: 2,
        unitPrice: 75.0,
        productUrl: "",
        imageUrl: "https://via.placeholder.com/150",
        notes: "",
        images: [],
        attributes: null,
      },
      {
        productName: "عطر ليليوم الساحر 100 مل",
        price: 300.0,
        quantity: 1,
        unitPrice: 300.0,
        productUrl: "",
        imageUrl: "https://via.placeholder.com/150",
        notes: "",
        images: [],
        attributes: null,
      },
    ],
  },
  {
    id: "ord-9876-5432-1098",
    customerID: "cus-222",
    customerName: "سارة خالد",
    paymentType: 2, // 2 = بطاقة ائتمان
    totalAmount: 120.0,
    paidAmount: 120.0,
    remainingAmount: 0.0,
    status: 4, // 4 = مكتمل
    latitude: 0.0,
    longitude: 0.0,
    shippingAddress: "جدة، حي الشاطئ، شارع الأمير نايف",
    notes: "",
    createdAt: "2023-10-20T09:15:00Z",
    completedAt: "2023-10-22T18:00:00Z",
    cancelledAt: "",
    trackingNumber: "TRK-998877",
    items: [
      {
        productName: "أحمر شفاه كلاسيكي - لون أحمر ناري",
        price: 120.0,
        quantity: 1,
        unitPrice: 120.0,
        productUrl: "",
        imageUrl: null,
        notes: "تغليف هدية رجاءً",
        images: [],
        attributes: null,
      },
    ],
  },
];

// ======================================
// 3. HELPERS (دوال مساعدة لترجمة الأرقام)
// ======================================
const getStatusBadge = (status: number) => {
  switch (status) {
    case 1:
      return (
        <span className='px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold'>
          قيد الانتظار ⏳
        </span>
      );
    case 2:
      return (
        <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold'>
          قيد التجهيز 📦
        </span>
      );
    case 3:
      return (
        <span className='px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold'>
          تم الشحن 🚚
        </span>
      );
    case 4:
      return (
        <span className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold'>
          مكتمل ✅
        </span>
      );
    case 5:
      return (
        <span className='px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold'>
          ملغي ❌
        </span>
      );
    default:
      return (
        <span className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold'>
          غير معروف
        </span>
      );
  }
};

const getPaymentType = (type: number) => {
  switch (type) {
    case 1:
      return "الدفع عند الاستلام";
    case 2:
      return "بطاقة ائتمانية / مدى";
    case 3:
      return "تحويل بنكي";
    default:
      return "غير محدد";
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "غير متوفر";
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ======================================
// 4. MAIN COMPONENT (المكون الرئيسي)
// ======================================
export default function OrdersPage() {
  const [orders] = useState<Order[]>(MOCK_ORDERS);

  return (
    <div
      className='min-h-screen bg-gray-50 px-4 py-8'
      dir='rtl'
    >
      <div className='max-w-5xl mx-auto space-y-6'>
        {/* ترويسة الصفحة */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-extrabold text-gray-900'>
              إدارة الطلبات
            </h1>
            <p className='text-gray-500 mt-1'>
              تتبع وعالج طلبات عملائك من هنا.
            </p>
          </div>
          <div className='bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-indigo-700 font-bold'>
            إجمالي الطلبات: {orders.length}
          </div>
        </div>

        {/* قائمة الطلبات */}
        {orders.length === 0 ? (
          <div className='text-center py-20 bg-white rounded-2xl border border-gray-100'>
            <Package className='mx-auto h-12 w-12 text-gray-300 mb-4' />
            <h3 className='text-lg font-medium text-gray-900'>
              لا يوجد طلبات حتى الآن
            </h3>
          </div>
        ) : (
          orders.map((order) => (
            <Card
              key={order.id}
              className='bg-white border-0 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow'
            >
              {/* ترويسة البطاقة (رقم الطلب والحالة) */}
              <CardHeader className='border-b border-gray-50 bg-gray-50/50 pb-4 pt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
                <div className='space-y-1'>
                  <CardTitle className='text-lg font-bold text-gray-800 flex items-center gap-2'>
                    طلب رقم:{" "}
                    <span className='text-indigo-600 uppercase text-sm'>
                      {order.id.split("-")[0]}-{order.id.split("-")[1]}
                    </span>
                  </CardTitle>
                  <div className='flex items-center text-sm text-gray-500 gap-1'>
                    <Calendar className='w-4 h-4' />
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </CardHeader>

              <CardContent className='p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  {/* العمود الأول: بيانات العميل والتوصيل */}
                  <div className='space-y-5'>
                    <div>
                      <h4 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3'>
                        بيانات العميل
                      </h4>
                      <div className='flex items-start gap-3'>
                        <div className='p-2 bg-indigo-50 rounded-lg text-indigo-600'>
                          <User className='w-5 h-5' />
                        </div>
                        <div>
                          <p className='font-semibold text-gray-900'>
                            {order.customerName}
                          </p>
                          <p
                            className='text-sm text-gray-500 text-left'
                            dir='ltr'
                          >
                            {order.customerID}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3'>
                        عنوان الشحن
                      </h4>
                      <div className='flex items-start gap-3'>
                        <div className='p-2 bg-indigo-50 rounded-lg text-indigo-600'>
                          <MapPin className='w-5 h-5' />
                        </div>
                        <div>
                          <p className='text-sm text-gray-800 leading-relaxed'>
                            {order.shippingAddress || "لم يتم توفير عنوان"}
                          </p>
                          {order.notes && (
                            <p className='text-xs text-orange-600 mt-1 font-medium bg-orange-50 px-2 py-1 rounded inline-block'>
                              ملاحظة: {order.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* العمود الثاني: بيانات الدفع */}
                  <div className='space-y-5'>
                    <div>
                      <h4 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3'>
                        تفاصيل الدفع
                      </h4>
                      <div className='bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-500 flex items-center gap-2'>
                            <CreditCard className='w-4 h-4' /> طريقة الدفع
                          </span>
                          <span className='font-medium text-gray-900'>
                            {getPaymentType(order.paymentType)}
                          </span>
                        </div>
                        <div className='flex justify-between text-sm border-t border-gray-200 pt-3'>
                          <span className='text-gray-500'>الإجمالي</span>
                          <span className='font-bold text-gray-900'>
                            {order.totalAmount} ل.س
                          </span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-500'>المدفوع</span>
                          <span className='font-bold text-green-600'>
                            {order.paidAmount} ل.س
                          </span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-500'>المتبقي</span>
                          <span className='font-bold text-red-600'>
                            {order.remainingAmount} ل.س
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* قسم المنتجات المطلوبة */}
                <div className='mt-8 pt-6 border-t border-gray-100'>
                  <h4 className='text-sm font-bold text-gray-800 mb-4 flex items-center gap-2'>
                    <Receipt className='w-5 h-5 text-indigo-600' />
                    المنتجات المطلوبة ({order.items.length})
                  </h4>

                  <div className='space-y-3'>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className='flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-100 p-3 rounded-xl hover:bg-gray-50 transition-colors gap-4'
                      >
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden'>
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.productName}
                                className='w-full h-full object-cover'
                              />
                            ) : (
                              <Package className='w-6 h-6 text-gray-400' />
                            )}
                          </div>
                          <div>
                            <p className='font-semibold text-sm text-gray-900 line-clamp-1'>
                              {item.productName}
                            </p>
                            <div className='text-xs text-gray-500 mt-1 flex gap-3'>
                              <span>الكمية: {item.quantity}</span>
                              <span>سعر الوحدة: {item.unitPrice} ل.س</span>
                            </div>
                            {item.notes && (
                              <p className='text-xs text-orange-500 mt-1'>
                                ملاحظة: {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className='font-bold text-gray-900 self-end sm:self-auto bg-gray-100 px-3 py-1 rounded-lg'>
                          {item.price} ل.س
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
