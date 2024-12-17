import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarLayout from "../../layouts/SidebarLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useAuthStore } from "../../store/authStore";

// Tekrarlanan DataTable için modüler komponent
function SemesterTable({ header, courses }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-3">{header}</h2>
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
        <Column field="CourseID" header="Ders Kodu" sortable />
        <Column field="CourseName" header="Ders Adı" sortable />
        <Column field="Akts" header="AKTS/Kredi" sortable />
        <Column field="LastLetterGrade" header="Harf Notu" sortable />
      </DataTable>
    </div>
  );
}

function Calculator() {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const getCourses = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/courses/get/student/${user.UserID}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    getCourses();
  }, [user]);

  if (isCheckingAuth || isLoading) return <div>Yükleniyor...</div>;

  // Her sınıf (1, 2, 3, 4) ve dönem (0, 1) için veriyi filtrele
  const classes = [1, 2, 3, 4];
  const semesters = [0, 1];

  return (
    <SidebarLayout RoleID={user.RoleID}>
      <div className="datatable-responsive">
        <h1 className="text-2xl font-bold mb-6">Agno Hesapla</h1>
        {classes.map((classNumber) => (
          <div key={classNumber} className="mb-10">
            <h2 className="text-2xl font-bold mb-4">{classNumber}. Sınıf</h2>
            <div className="flex space-x-10">
              {semesters.map((semester) => {
                const filteredCourses = courses.filter(
                  (course) =>
                    course.Class === classNumber &&
                    course.Semester === semester
                );
                return (
                  <SemesterTable
                    key={`class-${classNumber}-sem-${semester}`}
                    header={`${classNumber}. Sınıf - ${
                      semester === 0 ? "1. Dönem" : "2. Dönem"
                    }`}
                    courses={filteredCourses}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </SidebarLayout>
  );
}

export default Calculator;
