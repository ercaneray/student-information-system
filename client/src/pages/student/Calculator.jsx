// Agno hesaplama sayfası

import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarLayout from "../../layouts/SidebarLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { useAuthStore } from "../../store/authStore";

// Anlık hesaplama için agno değerleri
const letterGrades = [
  { label: "Seçiniz", value: "" },
  { label: "AA", value: "AA", point: 4.0 },
  { label: "BA", value: "BA", point: 3.5 },
  { label: "BB", value: "BB", point: 3.0 },
  { label: "CB", value: "CB", point: 2.5 },
  { label: "CC", value: "CC", point: 2.0 },
  { label: "FF", value: "FF", point: 0.0 },
];

// Harf notu dropdown'u
function gradeEditor(rowData, updateGrade) {
  const dropdownClass = !rowData.LastLetterGrade || rowData.LastLetterGrade === ""
    ? "bg-gray-100 text-gray-700" 
    : rowData.LastLetterGrade === "FF"
      ? "bg-red-500 text-white" 
      : "bg-green-500 text-black"; 
  return (
    <Dropdown
      value={rowData.LastLetterGrade || ""}
      options={letterGrades}
      optionLabel="label" // Hangi alanın etiketi göstereceğini belirtir
      optionValue="value"
      onChange={(e) => updateGrade(rowData.index, e.value)}
      placeholder="Seçiniz"
      className={`w-full ${dropdownClass}`}
    />
  );
}

// Tekrarlanan DataTable için component
function SemesterTable({ header, courses, updateGrade }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold mb-3">{header}</h2>
      <DataTable value={courses} stripedRows className="p-datatable-sm">
        <Column field="CourseID" header="Ders Kodu" />
        <Column field="CourseName" header="Ders Adı" />
        <Column field="Akts" header="AKTS/Kredi" />
        <Column
          header="Harf Notu"
          body={(rowData) => gradeEditor(rowData, updateGrade)}
        />
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
          `http://localhost:5000/courses/get/department/${user.DepartmentID}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        // Index ekleyerek orijinal veriyi takip edebilmek için
        const indexedCourses = response.data.map((course, index) => ({
          ...course,
          index,
        }));
        setCourses(indexedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    getCourses();
  }, [user]);

  // Harf notunu güncelleme
  const updateGrade = (index, newGrade) => {
    const updatedCourses = [...courses];
    updatedCourses[index].LastLetterGrade = newGrade;
    setCourses(updatedCourses);
  };

  // Agno hesaplama fonksiyonu
  const calculateAgno = () => {
    let totalPoints = 0;
    let totalAkts = 0;

    courses.forEach((course) => {
      if (course.LastLetterGrade) {
        const gradePoint =
          letterGrades.find((grade) => grade.value === course.LastLetterGrade)
            ?.point || 0;
        totalPoints += gradePoint * course.Akts;
        totalAkts += course.Akts;
      }
    });

    return totalAkts > 0 ? (totalPoints / totalAkts).toFixed(2) : "0.00";
  };

  if (isCheckingAuth || isLoading) return <div>Yükleniyor...</div>;

  const classes = [1, 2, 3, 4];
  const semesters = [0, 1];

  return (
    <SidebarLayout RoleID={user.RoleID}>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">
          Agno Hesapla | Hesaplanan Agno: {calculateAgno()}
        </h1>
        {classes.map((classNumber) => (
          <div key={classNumber} className="mb-10">
            <h2 className="text-2xl font-bold mb-4">{classNumber}. Sınıf</h2>
            <div className="flex space-x-10">
              {semesters.map((semester) => {
                const filteredCourses = courses.filter(
                  (course) =>
                    parseInt(course.Class) === classNumber &&
                    parseInt(course.Semester) === semester
                );
                return (
                  <SemesterTable
                    key={`class-${classNumber}-sem-${semester}`}
                    header={`${classNumber}. Sınıf - ${semester === 0 ? "1. Dönem" : "2. Dönem"
                      }`}
                    courses={filteredCourses}
                    updateGrade={updateGrade}
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
