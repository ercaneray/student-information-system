// Kullanıcıların kendi bilgilerini gördüğü sayfa

import React, { useEffect } from "react";
import SidebarLayout from "../layouts/SidebarLayout";
import { useAuthStore } from "../store/authStore";

const PersonalInfo = () => {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarLayout RoleID={user ? user.RoleID : null} >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Özlük Bilgileri</h2>
        <div className="space-y-4 text-gray-700">
          <p><span className="font-semibold">Ad Soyad:</span> {user.FirstName ? user.FirstName + " " + user.LastName : "Admin"} </p>
          <p><span className="font-semibold">Öğrenci Numarası:</span> {user.UserID} </p>
          <p><span className="font-semibold">Bölüm:</span> {user.DepartmentName} </p>
          <p><span className="font-semibold">Sınıf:</span> {user.Class} </p>
          <p><span className="font-semibold">Agno:</span> {user.Agno} </p>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default PersonalInfo
