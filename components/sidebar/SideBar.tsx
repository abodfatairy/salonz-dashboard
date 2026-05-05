"use client";
import React from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileSidebar from "./MobileSidebar";
// import MobileSidebar from "./MobileSidebar";

export default function SideBar({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen w-screen'>
      {/* Desktop Sidebar → يظهر فقط على الشاشات sm فما فوق */}
      <div className='hidden sm:flex h-full w-full'>
        <DesktopSidebar>{children}</DesktopSidebar>
      </div>

      {/* Mobile Sidebar → يظهر فقط على الجوال (أقل من sm) */}
      <div className='flex sm:hidden h-full w-full'>
        <MobileSidebar>{children}</MobileSidebar>
      </div>
    </div>
  );
}
