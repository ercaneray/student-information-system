import React from "react";
import CustomSidebar from "../components/CustomSidebar";

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <CustomSidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
};

export default SidebarLayout;
