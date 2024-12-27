
// Her sayfada kullandığım sidebar componenti. Kullanıcının rolüne göre sidebar menüsü değişiyor.

import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserGraduate, FaBook, FaSignOutAlt, FaHome, FaChalkboardTeacher } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { MdCalculate } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai";
import { HiOutlineClipboardList } from "react-icons/hi";

const CustomSidebar = ({ RoleID }) => {

  const logout = useAuthStore((state) => state.logout);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Çıkış işlemi
  const handleLogout = async () => {
    navigate("/login");
    await logout();
  };

  // Kullanıcı rollerine göre sidebar menüsü itemleri
  const menuItemsByRole = {
    0: [
      { name: "Öğrenci Listesi", route: "/students", icon: <FaUserGraduate />, },
      { name: "Eğitmen Listesi", route: "/instructors", icon: <FaChalkboardTeacher />, },
      { name: "Ders Listesi", route: "/course-list", icon: <FaBook />, },
      { name: "Çıkış", onclick: handleLogout, icon: <FaSignOutAlt />, },
    ],
    1: [
      { name: "Özlük bilgileri", icon: <FaUserGraduate />, route: "/info" },
      { name: "Ders Alma", icon: <FaBook />, route: "/request-courses" },
      { name: "Derslerim", icon: <HiOutlineClipboardList />, route: "/my-courses" },
      { name: "Agno Hesapla", icon: <MdCalculate />, route: "/calculator" },
      { name: "Sınavlar", icon: <HiOutlineClipboardList />, route: "/grades" },
      { name: "Mesajlar", icon: <AiFillMessage />, route: "/messages" },
      { name: "Çıkış", icon: <FaSignOutAlt />, onclick: handleLogout },
    ],
    2: [
      { name: "Sınav Notu Ekle", icon: <HiOutlineClipboardList />, route: "/set-grades" },
      { name: "Mesajlar", icon: <AiFillMessage />, route: "/messages" },
      { name: "Çıkış", icon: <FaSignOutAlt />, onclick: handleLogout },
    ],
    3: [
      { name: "Ders Onayla", icon: <FaBook />, route: "/course-requests" },
      { name: "Sınav Notu Ekle", icon: <HiOutlineClipboardList />, route: "/set-grades" },
      { name: "Mesajlar", icon: <AiFillMessage />, route: "/messages" },
      { name: "Çıkış", icon: <FaSignOutAlt />, onclick: handleLogout },
    ]
  }

  const menuItems = menuItemsByRole[RoleID] || [];

  // Sidebar componenti
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white h-full border-r border-gray-200 shadow-lg transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          <h1
            className={`text-xl  font-bold text-gray-800 transition-all ${isCollapsed ? "hidden" : "block"}`}
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
                className={`flex items-center gap-4 px-4 py-3 transition-all duration-200 cursor-pointer hover:bg-gray-100 text-base font-medium text-gray-800 w-full ${isCollapsed ? "justify-center" : ""}`}
              >
                <div className="text-xl text-gray-600">{item.icon}</div>
                {!isCollapsed && <span>{item.name}</span>}
              </button>
            ) : (
              // Diğer menü elemanları için a etiketi
              <a
                key={index}
                href={item.route}
                onClick={(e) => {
                  e.preventDefault(); // Sayfa yeniden yüklenmesini engeller
                  if (item.route) navigate(item.route);
                }}
                className={`flex items-center gap-4 px-4 py-3 transition-all duration-200 ${location.pathname === item.route
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
