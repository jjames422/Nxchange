"use client";

import { usePathname } from "next/navigation";
import CustomNavbar from "@/components/navbar";
import DashboardNavbar from "@/components/dashboardNavbar";

const ClientWrapper = ({ children }) => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      {isDashboard ? <DashboardNavbar /> : <CustomNavbar />}
      {children}
    </>
  );
};

export default ClientWrapper;
