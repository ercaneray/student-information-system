// Öğrencilerin ders almak için danışmanlara istek gönderdiği sayfa

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SidebarLayout from '../../layouts/SidebarLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAuthStore } from '../../store/authStore';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

function RequestCourses() {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [Semester0Courses, setSemester0Courses] = useState([]);
  const [Semester1Courses, setSemester1Courses] = useState([]);
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
        // Kullanıcı sınıfına göre filtreleme
        const filteredByClass = user.Class === 1
          ? response.data.filter(course => course.Class === 1)
          : response.data;

        // Kullanıcının AGNO değerine göre filtreleme
        const filteredByAgno = user.Agno < 1.80
          ? filteredByClass.filter(course => course.Class <= user.Class)
          : filteredByClass;

        // 0. yarıyıl (Semester 0) derslerini ayarlama
        setSemester0Courses(filteredByAgno.filter(course => course.Semester === 0));

        // 1. yarıyıl (Semester 1) derslerini ayarlama
        setSemester1Courses(filteredByAgno.filter(course => course.Semester === 1));


      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    getCourses();
  }, [user]);

  const toast = useRef(null);

  const handleSubmit = async () => {
    if (selectedCourses.length === 0) {
      console.log("Lütfen en az bir kurs seçin");
      return;
    }
    console.log(selectedCourses)
    if (selectedCourses.reduce((acc, course) => acc + course.Akts, 0) > AktsCredit) {
      toast.current.show({
        severity: 'error',
        summary: 'Hata',
        detail: 'Seçilen kursların toplam AKTS değeri 20\'den fazla olamaz.',
        life: 3000,
      });

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
        toast.current.show({
          severity: 'warn',
          summary: 'Bilgi',
          detail: 'Bu dönem için ders seçim isteğiniz gönderilmiş ve beklemede.',
          life: 3000,
        });
        return;
      } else if (response2.data.length > 0) {
        toast.current.show({
          severity: 'info',
          summary: 'Bilgi',
          detail: 'Bu dönem için ders seçim isteğiniz gönderilmiş ve tamamlanmıştır.',
          life: 3000,
        });
        return;
      }
      else {
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
          toast.current.show({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Tüm kurslar başarıyla gönderildi!',
            life: 3000,
          });
        } catch (error) {
          toast.current.show({
            severity: 'error',
            summary: 'Hata',
            detail: 'Kurs gönderme işlemi sırasında bir sorun oluştu.',
            life: 3000,
          });
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
        {user.Agno && (user.Agno < 1.80) ? <h2 className="text-xl mb-4">Agnonuz 1.80 in altında olduğu için üstten ders alamazsınız.</h2> : null}
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
          <Toast ref={toast} />
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
