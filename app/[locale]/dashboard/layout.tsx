import React from "react";
import { redirect } from "next/navigation";
import DashboardSideNav from "../../components/dashboardComponents/DashboardSideNav";
import { checkAdminAccess } from "@/lib/adminAuth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // Check admin access
  const { isAdmin } = await checkAdminAccess();
  
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex">
        <DashboardSideNav />
        <main className="flex-1 overflow-x-hidden">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
