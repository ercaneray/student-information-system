import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarLayout from '../../layouts/SidebarLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAuthStore } from '../../store/authStore';
import { Button } from 'primereact/button';

function RequestCourses() {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  const [courses, setCourses] = useState([]);
  const filterByClass = user.Class === 1 ? courses.filter(course => course.Class === 1) : courses
  const filterByAgno = user.Agno < 1.80 ? filterByClass.filter(course => course.Class <= user.Class) : filterByClass
  const [selectedCourses, setSelectedCourses] = useState([]);
  const Semester0Courses = filterByAgno.filter((course) => (course.Semester === 0));
  const Semester1Courses = filterByAgno.filter((course) => (course.Semester === 1));
  const Semester = false;
  const AktsCredit = 20;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const getCourses = async () => {
      if (!user) {
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/courses/get/department/${user.DepartmentID}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    getCourses();
  }, [user]);

  const handleSubmit = async () => {
    if (selectedCourses.length === 0) {
      console.log("Lütfen en az bir kurs seçin");
      return;
    }
    console.log(selectedCourses)
    if (selectedCourses.reduce((acc, course) => acc + course.Akts, 0) > AktsCredit) {
      console.log("Seçilen kurslar AKTS kredisini aşmaktadır.");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/courses/check-request/${user.UserID}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("Check request response:", response);
      const response2 = await axios.get(`http://localhost:5000/courses/get/student/${user.UserID}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        console.log("Bu dönem için ders seçim isteğiniz gönderilmiş ve beklemede.");
        return;
      } else if (response2.data.length > 0) {
        console.log("Bu dönem için ders seçim isteğiniz gönderilmiş ve tamamlanmıştır.");
        return;
      } else {
        try {
          // Seçilen kurslar için gerekli bilgileri içeren istekleri oluştur
          const promises = selectedCourses.map((course) => {
            return axios.put(
              `http://localhost:5000/courses/request-approval`,
              {
                CourseID: course.CourseID,
                StudentID: user.UserID, // Auth Store'dan gelen öğrenci ID'si
                DepartmentID: user.DepartmentID, // Auth Store'dan gelen departman ID'si
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );
          });
          // Tüm isteklerin tamamlanmasını bekle
          const responses = await Promise.all(promises);
          console.log("Kurslar başarıyla gönderildi:", responses);
        } catch (error) {
          console.error("Kurs gönderme işlemi sırasında hata oluştu:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };


  if (isCheckingAuth || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarLayout RoleID={user.RoleID}>
      <div className="datatable-responsive">
        <h1 className="text-2xl font-bold mb-4">Ders alma listesi | AKTS Limitiniz : 20 </h1>
        {user.Agno < 1.80 ? <h2 className="text-xl mb-4">Agnonuz 1.80 in altında olduğu için üstten ders alamazsınız.</h2> : null}
        <div className='flex space-x-20'>
          <DataTable
            value={Semester0Courses}
            paginator
            stripedRows
            rows={7}
            className="p-datatable-lg"
            showGridlines
            removableSort
            resizableColumns
            selectionMode={!Semester ? "multiple" : null}
            selection={!Semester ? selectedCourses : null}
            onSelectionChange={(e) => setSelectedCourses(e.value)}
          >
            {!Semester && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>}
            <Column field="CourseID" header="Ders Kodu" sortable></Column>
            <Column field="CourseName" header="Ders Adı" sortable></Column>
            <Column field="Akts" header="Akts/Kredi" sortable></Column>
          </DataTable>
          <DataTable
            value={Semester1Courses}
            paginator
            stripedRows
            rows={7}
            className="p-datatable-lg"
            showGridlines
            removableSort
            resizableColumns
            selectionMode={Semester ? "multiple" : null}
            selection={Semester ? selectedCourses : null}
            onSelectionChange={(e) => setSelectedCourses(e.value)}
          >
            {Semester && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>}
            <Column field="CourseID" header="Ders Kodu" sortable></Column>
            <Column field="CourseName" header="Ders Adı" sortable></Column>
            <Column field="Akts" header="Akts/Kredi" sortable></Column>
          </DataTable>
        </div>
        <Button label="Gönder" icon="pi pi-check" onClick={handleSubmit} className="mt-4" />
      </div>
    </SidebarLayout>
  );
}

export default RequestCourses;
