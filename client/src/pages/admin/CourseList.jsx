// Dersleri listelediğim ve üzerinde işlemler yapılabilen admin sayfası

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SidebarLayout from '../../layouts/SidebarLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ContextMenu } from 'primereact/contextmenu';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useAuthStore } from '../../store/authStore';
import AddCourseForm from './addForms/AddCourse';

function CourseList() {
    const user = useAuthStore((state) => state.user);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    const [courses, setCourses] = useState([]);
    const [isError, setIsError] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);


    const cm = useRef(null); // ContextMenu referansı
    const toast = useRef(null); // Toast referansı

    // Ders silme işlemi
    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:5000/courses/delete/${selectedCourse.CourseID}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            if (response.status === 200) {
                setCourses(courses.filter(course => course.CourseID !== selectedCourse.CourseID));
                toast.current.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: `Silinen ders: ${selectedCourse.CourseName}`,
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Ders silinemedi. Lütfen tekrar deneyin.',
                });
            }
        } catch (error) {
            console.error("Silme hatası:", error);
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Bir hata oluştu. Ders silinemedi.',
            });
        }
    };
    const handleCourseAdded = (newCourse) => {
        setCourses((prevCourses) => [...prevCourses, newCourse]);
        setIsAddFormVisible(false); // Formu kapat
    };

    // Kullanıcı doğrulaması
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Ders listesini API'den çek
    useEffect(() => {
        const getCourses = async () => {
            try {
                const response = await axios.get("http://localhost:5000/courses/get", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setIsError(true);
            }
        };
        getCourses();
    }, []);
    if (isCheckingAuth || isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return (
            <SidebarLayout RoleID={user.RoleID}>
                <div>Ders bilgileri yüklenirken bir hata oluştu.</div>
            </SidebarLayout>
        );
    }

    // ContextMenu için menü öğeleri
    const contextMenuItems = [
        {
            label: 'Düzenle',
            icon: 'pi pi-pencil',
            command: () => {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Düzenle',
                    detail: `Düzenleme işlemi: ${selectedCourse.CourseName}`,
                });
            },
        },
        {
            label: 'Sil',
            icon: 'pi pi-trash',
            command: handleDelete,
        },
    ];
    // Ders listesini getirdiğim datatable componenti
    return (
        <SidebarLayout RoleID={user.RoleID}>
            <div className="datatable-responsive">
                <Toast ref={toast} />
                <ContextMenu model={contextMenuItems} ref={cm} />
                <h1 className="text-2xl font-bold mb-4">Ders Listesi</h1>
                <Button
                    label="Yeni Ders Ekle"
                    icon="pi pi-plus"
                    className="mb-4"
                    onClick={() => setIsAddFormVisible(true)}
                />
                <Dialog
                    visible={isAddFormVisible}
                    style={{ width: '30vw' }}
                    onHide={() => setIsAddFormVisible(false)}
                >
                    <AddCourseForm onCourseAdded={handleCourseAdded} />
                </Dialog>
                <DataTable
                    value={courses}
                    paginator
                    stripedRows
                    rows={7}
                    className="p-datatable-md shadow-md"
                    showGridlines
                    removableSort
                    sortField='CourseID'
                    sortOrder={1}
                    resizableColumns
                    contextMenuSelection={selectedCourse}
                    onContextMenuSelectionChange={(e) => setSelectedCourse(e.value)}
                    onContextMenu={(e) => cm.current.show(e.originalEvent)}
                >
                    <Column field="CourseID" header="Ders Kodu" sortable></Column>
                    <Column field="CourseName" header="Ders Adı" sortable></Column>
                    <Column field="Semester" header="Dönem" body={(rowData) => (rowData.Semester ? "Bahar" : "Güz")} sortable></Column>
                    <Column field="Class" header="Sınıf" sortable></Column>
                    <Column field="Akts" header="Akts/Kredi" sortable></Column>
                    <Column field="DepartmentName" header="Bölüm" sortable></Column>
                    <Column field="RequiredCourseName" header="Ön Koşul" sortable></Column>
                </DataTable>
            </div>
        </SidebarLayout>
    );
}

export default CourseList;
