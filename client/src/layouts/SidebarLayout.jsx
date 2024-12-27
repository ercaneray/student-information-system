import React from "react";
import CustomSidebar from "../components/CustomSidebar";

// Sidebar componetimi kullanmam için children ve RoleID prop'larını alıyorum

const SidebarLayout = ({ children, RoleID }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <CustomSidebar RoleID={RoleID} />
      {/* Main Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
};

export default SidebarLayout;
