import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { FaUserGraduate, FaBook, FaCog } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FiMenu } from "react-icons/fi";

const CustomSidebar = () => {
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/dashboard");

  const handleLogout = async () => {
    await logout();
  };
  const allMenuItems = [
    { name: "Dashboard", icon: <MdDashboard />, route: "/dashboard", roles: [1, 2] },
    { name: "Özlük bilgileri", icon: <FaUserGraduate />, route: "/info", roles: [1] },
    { name: "Ders Alma", icon: <FaBook />, route: "/courses", roles: [1, 2] },
    { name: "Ders Alma Listesi", icon: <FaCog />, route: "/course-list", roles: [1] },
    { name: "Agno Hesapla", icon: <FaCog />, route: "/calculator", roles: [1] },
    { name: "Mesajlar", icon: <FaCog />, route: "/messages", roles: [1, 2] },
    { name: "Mezuniyet İşlemleri", icon: <FaCog />, route: "/graduation", roles: [1] },
    { name: "Çıkış", icon: <FaCog />, onclick: handleLogout() , roles: [0, 1, 2] },
  ];

  const menuItems = allMenuItems.filter((item) => item.roles.includes(user.RoleID));



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white h-full border-r border-gray-200 shadow-lg transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          <h1
            className={`text-xl font-bold text-gray-800 transition-all ${isCollapsed ? "hidden" : "block"
              }`}
          >
            StudentSys
          </h1>
          <FiMenu
            className="text-2xl text-gray-800 cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.route}
              onClick={() => setActiveRoute(item.route)}
              className={`flex items-center gap-4 px-4 py-3 transition-all duration-200 ${activeRoute === item.route
                ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                : "hover:bg-gray-100"
                }`}
            >
              <div className="text-xl text-gray-600">{item.icon}</div>
              <span
                className={`text-base font-medium text-gray-800 ${isCollapsed ? "hidden" : "block"
                  }`}
              >
                {item.name}
              </span>
            </a>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <div className="text-sm text-gray-500">
            {isCollapsed ? "© 2024" : "© 2024 StudentSys"}
          </div>
        </div>
      </div>

    </div>
  );
};

export default CustomSidebar;
