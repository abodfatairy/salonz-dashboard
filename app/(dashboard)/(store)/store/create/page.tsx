"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

/* ---------------- Types ---------------- */

interface StoreFormData {
  otpid: string;
  firstName: string;
  lastName: string;
  storeName: string;
  description: string;
  address: string;
  dob: string;
  city: string;
  region: string;
  payoutPercentage: string;
  password: string;
}

/* ---------------- Main Component ---------------- */

export default function CreateStorePage() {
  const [form, setForm] = useState<Omit<StoreFormData, "dob">>({
    otpid: "",
    firstName: "",
    lastName: "",
    storeName: "",
    description: "",
    address: "",
    city: "",
    region: "",
    payoutPercentage: "",
    password: "",
  });

  const [dobDate, setDobDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ---------------- Handlers ---------------- */

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = (): boolean => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("❌ الرجاء إدخال الاسم الأول واسم العائلة.");
      return false;
    }

    if (!dobDate) {
      toast.error("📅 الرجاء اختيار تاريخ الميلاد.");
      return false;
    }

    const payout = Number(form.payoutPercentage);
    if (isNaN(payout) || payout < 0 || payout > 100) {
      toast.error("💰 نسبة الأرباح يجب أن تكون بين 0 و 100.");
      return false;
    }

    if (form.password.length < 6) {
      toast.error("🔒 كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // تنسيق التاريخ بصيغة DD/MM/YYYY
    const formattedDob = dobDate
      ? `${dobDate.getDate().toString().padStart(2, "0")}/${(
          dobDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${dobDate.getFullYear()}`
      : "";

    const payload: StoreFormData = {
      ...form,
      dob: formattedDob,
    };

    // 🚀 محاكاة إرسال البيانات (بدون API)
    setTimeout(() => {
      console.log("📤 Payload Generated:", payload);
      toast.success("✅ تم إنشاء المتجر بنجاح!");

      // إعادة تفريغ الحقول بعد النجاح
      setForm({
        otpid: "",
        firstName: "",
        lastName: "",
        storeName: "",
        description: "",
        address: "",
        city: "",
        region: "",
        payoutPercentage: "",
        password: "",
      });
      setDobDate(undefined);
      setLoading(false);
    }, 1500); // تأخير وهمي
  };

  /* ---------------- Fields Config ---------------- */

  const formFields = [
    { key: "otpid", label: "رمز OTP" },
    { key: "storeName", label: "اسم المتجر" },
    { key: "firstName", label: "الاسم الأول" },
    { key: "lastName", label: "الكنية" },
    { key: "city", label: "المدينة" },
    { key: "region", label: "المنطقة" },
    { key: "address", label: "العنوان" },
    { key: "payoutPercentage", label: "نسبة البيع الإلكتروني (%)" },
  ];

  /* ---------------- UI ---------------- */

  return (
    <div
      dir='rtl'
      className='min-h-screen flex justify-center items-center bg-gray-50 text-gray-900 p-4 md:p-8 font-sans'
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className='w-full max-w-4xl'
      >
        <div className='bg-white border border-gray-200 shadow-xl rounded-3xl overflow-hidden'>
          {/* Header */}
          <div className='bg-gray-50/80 px-8 py-6 border-b border-gray-100'>
            <h1 className='text-center text-2xl font-bold text-gray-900 flex items-center justify-center gap-3'>
              <span>🏪</span> إنشاء متجر جديد
            </h1>
            <p className='text-center text-gray-500 text-sm mt-2'>
              قم بملء البيانات التالية لتسجيل المتجر الجديد في النظام
            </p>
          </div>

          <div className='p-8'>
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
            >
              {/* الحقول النصية (مقسمة إلى عمودين) */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {formFields.map(({ key, label }) => (
                  <div
                    key={key}
                    className='flex flex-col gap-1.5'
                  >
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      name={key}
                      type='text'
                      value={form[key as keyof typeof form]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}

                {/* حقل الوصف (يأخذ المساحة كاملة) */}
                <div className='flex flex-col gap-1.5 md:col-span-2'>
                  <Label htmlFor='description'>الوصف</Label>
                  <Input
                    id='description'
                    name='description'
                    type='text'
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* مكون التاريخ المخصص */}
                <Calendar22
                  date={dobDate}
                  onChange={setDobDate}
                  label='تاريخ الميلاد'
                />

                {/* كلمة المرور */}
                <div className='flex flex-col gap-1.5 relative'>
                  <Label htmlFor='password'>كلمة المرور</Label>
                  <div className='relative'>
                    <Input
                      id='password'
                      name='password'
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors'
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* زر الإرسال */}
              <div className='pt-6 mt-6 border-t border-gray-100'>
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full md:w-auto px-10 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all flex justify-center items-center gap-2 float-left shadow-lg shadow-indigo-600/20'
                >
                  {loading ? (
                    <span className='animate-pulse'>جارٍ إنشاء المتجر...</span>
                  ) : (
                    "إنشاء المتجر"
                  )}
                </button>
                <div className='clear-both'></div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- Custom UI Components ---------------- */

// 1. Calendar22 Component (Light Mode)
interface Calendar22Props {
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label: string;
}

function Calendar22({ date, onChange, label }: Calendar22Props) {
  // Format Date to YYYY-MM-DD for HTML input[type="date"]
  const dateString = date ? date.toISOString().split("T")[0] : "";

  return (
    <div className='flex flex-col gap-1.5'>
      <Label>{label}</Label>
      <div className='relative'>
        <input
          type='date'
          value={dateString}
          onChange={(e) => {
            if (e.target.value) {
              onChange(new Date(e.target.value));
            } else {
              onChange(undefined);
            }
          }}
          required
          className='w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 rounded-xl px-4 py-2.5 transition-all text-right [color-scheme:light]'
        />
      </div>
    </div>
  );
}

// 2. Simple Label Component (Light Mode)
function Label({
  children,
  htmlFor,
  className = "",
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-semibold text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
}

// 3. Simple Input Component (Light Mode)
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 rounded-xl px-4 py-2.5 transition-all text-right ${props.className || ""}`}
    />
  );
}
