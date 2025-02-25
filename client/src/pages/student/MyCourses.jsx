// Öğrencilerin denışman tarafından onaylanan derslerini gördüğü sayfa
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarLayout from '../../layouts/SidebarLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAuthStore } from '../../store/authStore';

function MyCourses() {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  // Ders listesini API'den çek
  useEffect(() => {
    const getCourses = async () => {
      if (!user) {
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/courses/get/student/${user.UserID}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setCourses(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    getCourses();
  }, [user]);

  if (isCheckingAuth || isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <SidebarLayout RoleID={user.RoleID}>
      <div className="datatable-responsive">
        <h1 className="text-2xl font-bold mb-4">Aldığım dersler</h1>
        <div>
          <DataTable
            value={courses}
            paginator
            stripedRows
            rows={7}
            className="p-datatable-lg"
            showGridlines
            removableSort
            resizableColumns
          >
            <Column field="CourseID" header="Ders Kodu" sortable></Column>
            <Column field="CourseName" header="Ders Adı" sortable></Column>
            <Column field="Akts" header="Akts/Kredi" sortable></Column>
            <Column field="LastLetterGrade" header="Harf Notu" sortable></Column>
          </DataTable>

        </div>
      </div>

    </SidebarLayout>
  );
}

export default MyCourses;
