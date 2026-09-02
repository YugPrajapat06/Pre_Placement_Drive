import React from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.12),transparent_30%),linear-gradient(135deg,#fffaf5_0%,#ffffff_45%,#fff7ed_100%)]">
      <Sidebar />

      {/* Content area: offset for desktop sidebar, top/bottom bars on mobile */}
      <main
        className={[
          // Desktop: push content right of 256px sidebar
          "lg:ml-64",
          // Mobile: add top padding for the header bar + bottom padding for tab bar
          "pt-15 pb-17 lg:pt-0 lg:pb-0",
          "min-h-screen",
        ].join(" ")}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
