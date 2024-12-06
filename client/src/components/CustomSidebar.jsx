import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaBook, FaSignOutAlt } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { MdDashboard, MdCalculate } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai";
import { HiOutlineClipboardList } from "react-icons/hi";

const CustomSidebar = () => {

  const logout = useAuthStore((state) => state.logout);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/dashboard");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const menuItems = [
    { name: "Dashboard", icon: <MdDashboard />, route: "/dashboard" },
    { name: "Özlük bilgileri", icon: <FaUserGraduate />, route: "/info" },
    { name: "Ders Alma", icon: <FaBook />, route: "/courses" },
    { name: "Ders Alma Listesi", icon: <HiOutlineClipboardList />, route: "/course-list" },
    { name: "Agno Hesapla", icon: <MdCalculate />, route: "/calculator" },
    { name: "Mesajlar", icon: <AiFillMessage />, route: "/messages" },
    { name: "Mezuniyet İşlemleri", icon: <HiOutlineClipboardList />, route: "/graduation" },
    { name: "Çıkış", icon: <FaSignOutAlt />, onclick: handleLogout },
  ];

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
            className={`text-xl  font-bold text-gray-800 transition-all ${isCollapsed ? "hidden" : "block"
              }`}
          >
            OBS
          </h1>
          <FiMenu
            className="text-2xl text-gray-800 cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-4">
          {menuItems.map((item, index) =>
            item.name === "Çıkış" ? (
              // Çıkış için button
              <button
                key={index}
                onClick={item.onclick}
                className={`flex items-center gap-4 px-4 py-3 transition-all duration-200 cursor-pointer hover:bg-gray-100 text-base font-medium text-gray-800 w-full ${isCollapsed ? "justify-center" : ""
                  }`}
              >
                <div className="text-xl text-gray-600">{item.icon}</div>
                {!isCollapsed && <span>{item.name}</span>}
              </button>
            ) : (
              // Diğer menü elemanları için a etiketi
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
                {!isCollapsed && (
                  <span className="text-base font-medium text-gray-800">
                    {item.name}
                  </span>
                )}
              </a>
            )
          )}
        </nav>


        {/* Sidebar Footer */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <div className="text-sm text-gray-500">
            {isCollapsed ? "© 2024" : "© 2024 RCN-OBS"}
          </div>
        </div>
      </div>

    </div>
  );
};

export default CustomSidebar;
