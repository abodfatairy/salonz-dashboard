// app/(dashboard)/layout.tsx

import SideBar from "@/components/sidebar/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex'>
      <SideBar>
        <main className='flex-1'>{children}</main>
      </SideBar>
    </div>
  );
}
