import Header from "@/components/Header";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="px-3 lg:px-14">
        <Header />
        {children}
      </main>
    </>
  );
};

export default DashboardLayout;
