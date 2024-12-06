import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { FaUserGraduate, FaBook, FaCog } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FiMenu } from "react-icons/fi";

const CustomSidebar = () => {
  const { user } = useAuthStore(); // Assumes user object is fetched from the store
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/dashboard");

  // Default menu items based on RoleID
  const menuItems = (() => {
    if (user.RoleID === 1) {
      return [
        { name: "Dashboard", icon: <MdDashboard />, route: "/dashboard" },
        { name: "Özlük bilgileri", icon: <FaUserGraduate />, route: "/info" },
        { name: "Ders Alma", icon: <FaBook />, route: "/courses" },
        { name: "Ders Alma Listesi", icon: <FaCog />, route: "/course-list" },
        { name: "Agno Hesapla", icon: <FaCog />, route: "/calculator" },
        { name: "Mesajlar", icon: <FaCog />, route: "/messages" },
        { name: "Mezuniyet İşlemleri", icon: <FaCog />, route: "/graduation" },
        { name: "Çıkış", icon: <FaCog />, route: "/logout" },
      ];
    } else if (user.RoleID === 2) {
      return [
        { name: "Dashboard", icon: <MdDashboard />, route: "/dashboard" },
        { name: "Personal Info", icon: <FaUserGraduate />, route: "/personal-info" },
        { name: "Ders Onayla", icon: <FaBook />, route: "/courses" },
        { name: "Mesajlar", icon: <FaCog />, route: "/messages" },
        { name: "Sınav gir", icon: <FaCog />, route: "/exam-entry" },
        { name: "Çıkış", icon: <FaCog />, route: "/logout" },
      ];
    } else if (user.RoleID === 0) {
      return [
        { name: "Öğrenci Düzenle", icon: <FaBook />, route: "/edit-student" },
        { name: "Eğitmen Düzenle", icon: <FaCog />, route: "/edit-instructor" },
        { name: "Ders Düzenle", icon: <FaCog />, route: "/edit-course" },
        { name: "Çıkış", icon: <FaCog />, route: "/logout" },
      ];
    } else {
      return []; // Fallback for undefined or unexpected roles
    }
  })();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white h-full border-r border-gray-200 shadow-lg transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          <h1
            className={`text-xl font-bold text-gray-800 transition-all ${
              isCollapsed ? "hidden" : "block"
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
              className={`flex items-center gap-4 px-4 py-3 transition-all duration-200 ${
                activeRoute === item.route
                  ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="text-xl text-gray-600">{item.icon}</div>
              <span
                className={`text-base font-medium text-gray-800 ${
                  isCollapsed ? "hidden" : "block"
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
