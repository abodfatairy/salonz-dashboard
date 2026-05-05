"use client";
import { useState } from "react";
import {
  Menu,
  X,
  Home as HomeIcon,
  Calendar,
  Users,
  Bell,
  TrendingUp,
  Settings,
  Scissors,
  LogOut,
  ChevronLeft,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "إجمالي الأرباح",
      value: "12,450 ل.س",
      change: "+12.5%",
      icon: <TrendingUp size={24} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "الحجوزات النشطة",
      value: "42",
      change: "+3 فترات",
      icon: <Calendar size={24} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "العملاء الجدد",
      value: "156",
      change: "+18% هذا الشهر",
      icon: <Users size={24} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div
      className='flex min-h-screen bg-[#f8f9fa] text-slate-800 font-sans'
      dir='rtl'
    >
      {/* Overlay for mobile */}
      {/* {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity'
          onClick={() => setIsSidebarOpen(false)}
        />
      )} */}

      {/* Sidebar */}
      {/* <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-white border-l border-slate-100 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className='flex items-center gap-3 px-8 py-8'>
          <div className='bg-purple-600 p-2 rounded-xl'>
            <Scissors
              className='text-white'
              size={24}
            />
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
            Salonz
          </h1>
        </div>

        <nav className='px-4 space-y-1'>
          <NavItem
            icon={<HomeIcon size={20} />}
            label='الرئيسية'
            active
          />
          <NavItem
            icon={<Calendar size={20} />}
            label='المواعيد'
          />
          <NavItem
            icon={<Users size={20} />}
            label='العملاء'
          />
          <NavItem
            icon={<TrendingUp size={20} />}
            label='التقارير'
          />
          <NavItem
            icon={<Settings size={20} />}
            label='الإعدادات'
          />
        </nav>

        <div className='absolute bottom-8 w-full px-4'>
          <button className='flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors'>
            <LogOut size={20} />
            <span className='font-medium'>تسجيل الخروج</span>
          </button>
        </div>
      </aside> */}

      {/* Main Content */}
      <main className='flex-1 flex flex-col min-w-0'>
        {/* Header */}
        <header className='h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100'>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='p-2 hover:bg-slate-100 rounded-lg md:hidden'
          >
            <Menu size={24} />
          </button>

          <div className='flex items-center gap-4 mr-auto'>
            <button className='p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all relative'>
              <Bell size={22} />
              <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white'></span>
            </button>
            <div className='h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border-2 border-white shadow-sm ring-1 ring-slate-100' />
          </div>
        </header>

        {/* Dashboard Body */}
        <div className='p-8 space-y-8 max-w-7xl mx-auto w-full'>
          <div>
            <h2 className='text-3xl font-extrabold text-slate-900'>
              أهلاً بك مجدداً 👋
            </h2>
            <p className='text-slate-500 mt-1'>إليك ما يحدث في صالونك اليوم.</p>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {stats.map((s, i) => (
              <div
                key={i}
                className='group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300'
              >
                <div className='flex justify-between items-start'>
                  <div
                    className={`p-3 rounded-xl ${s.bg} ${s.color} group-hover:scale-110 transition-transform`}
                  >
                    {s.icon}
                  </div>
                  <span className='text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg'>
                    {s.change}
                  </span>
                </div>
                <div className='mt-4'>
                  <p className='text-sm font-medium text-slate-500'>
                    {s.title}
                  </p>
                  <h3 className='text-2xl font-bold text-slate-900 mt-1'>
                    {s.value}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions / Placeholders */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='bg-white p-8 rounded-2xl border border-slate-100 shadow-sm'>
              <h3 className='text-lg font-bold mb-6 flex items-center justify-between'>
                ملخص الأداء الأسبوعي
                <button className='text-sm text-purple-600 hover:underline'>
                  التفاصيل
                </button>
              </h3>
              <div className='h-48 w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center'>
                <p className='text-slate-400'>سيتم ربط الرسم البياني قريباً</p>
              </div>
            </div>

            <div className='bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden'>
              <div className='relative z-10'>
                <h3 className='text-xl font-bold mb-2'>توسيع نطاق عملك؟</h3>
                <p className='text-purple-100 mb-6 text-sm opacity-90'>
                  قم بإضافة خدمات جديدة وتفعيل الحجز الأونلاين لزيادة أرباحك
                  بنسبة 30%.
                </p>
                <button className='bg-white text-purple-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors'>
                  استكشاف الإعدادات
                </button>
              </div>
              {/* Decorative circles */}
              <div className='absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl' />
              <div className='absolute -top-10 -right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl' />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-component for Nav Items to keep code clean
// const NavItem = ({ icon, label, active = false }) => (
//   <button
//     className={`flex items-center justify-between w-full p-3.5 rounded-xl transition-all duration-200 group ${
//       active
//         ? "bg-purple-50 text-purple-600"
//         : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
//     }`}
//   >
//     <div className='flex items-center gap-3'>
//       {icon}
//       <span className='font-semibold'>{label}</span>
//     </div>
//     {active && <ChevronLeft size={16} />}
//   </button>
// );

export default Dashboard;
