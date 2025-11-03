import React from "react";
import DashboardSideNav from "../../components/dashboardComponents/DashboardSideNav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
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
