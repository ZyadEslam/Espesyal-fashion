import React from "react";
import DashboardSideNav from "../components/dashboardComponents/DashboardSideNav";

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <DashboardSideNav />
      <div>{children}</div>
    </div>
  );
};

export default Dashboardlayout;
