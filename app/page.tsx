"use client";
import React, { useState } from "react";
import {
  Menu,
  X,
  Home as HomeIcon,
  Calendar,
  Users,
  Scissors,
  Settings,
  Bell,
  Search,
  TrendingUp,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stats = [
    {
      title: "أرباح اليوم",
      value: "1,250 SAR",
      icon: <TrendingUp className='text-pink-500' />,
      bg: "bg-pink-100",
    },
    {
      title: "حجوزات اليوم",
      value: "24",
      icon: <Calendar className='text-purple-500' />,
      bg: "bg-purple-100",
    },
    {
      title: "العملاء الجدد",
      value: "8",
      icon: <Users className='text-blue-500' />,
      bg: "bg-blue-100",
    },
  ];

  const appointments = [
    {
      id: 1,
      client: "سارة أحمد",
      service: "قص وتسريح",
      time: "10:00 ص",
      status: "مكتمل",
      color: "text-green-600 bg-green-100",
    },
  ];

  return (
    <div
      className='flex h-screen bg-gray-50 text-gray-800'
      dir='rtl'
    >
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-20 md:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-30 w-64 bg-white shadow-xl transform transition md:static ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0`}
      >
        <div className='flex items-center justify-between p-6 border-b'>
          <h1 className='text-xl font-bold'>Salonz</h1>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X />
          </button>
        </div>

        <nav className='p-4 space-y-2'>
          <button className='flex items-center gap-2 p-2 bg-purple-100 rounded'>
            <HomeIcon /> الرئيسية
          </button>
        </nav>
      </aside>

      <main className='flex-1 flex flex-col'>
        <header className='flex justify-between p-4 bg-white shadow'>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu />
          </button>

          <div className='flex items-center gap-4'>
            <Bell />
          </div>
        </header>

        <div className='p-6'>
          <h2 className='text-xl font-bold mb-4'>لوحة التحكم</h2>

          <div className='grid md:grid-cols-3 gap-4'>
            {stats.map((s, i) => (
              <div
                key={i}
                className='bg-white p-4 rounded shadow'
              >
                <div className='flex justify-between'>
                  <div>
                    <p>{s.title}</p>
                    <h3 className='text-xl font-bold'>{s.value}</h3>
                  </div>
                  <div className={s.bg}>{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div className='mt-6 bg-white p-4 rounded shadow'>
            <h3 className='mb-4 font-bold'>المواعيد</h3>

            {appointments.map((a) => (
              <div
                key={a.id}
                className='flex justify-between py-2 border-b'
              >
                <span>{a.client}</span>
                <span>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
