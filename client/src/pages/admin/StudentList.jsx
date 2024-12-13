import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SidebarLayout from '../../layouts/SidebarLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ContextMenu } from 'primereact/contextmenu';
import { Toast } from 'primereact/toast';
import { useAuthStore } from '../../store/authStore';

function StudentList() {
    const user = useAuthStore((state) => state.user);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    const [students, setStudents] = useState([]);
    const [isError, setIsError] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const cm = useRef(null); // ContextMenu referansı
    const toast = useRef(null); // Toast referansı
    const handleDelete = async () => {
        try {
            // API isteğiyle öğrenci silme işlemi
            const response = await axios.delete(
                `http://localhost:5000/students/delete/${selectedStudent.StudentID}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            // API yanıtını kontrol et
            if (response.status === 200) {
                // Başarılı silme işlemi
                setStudents(students.filter(student => student.StudentID !== selectedStudent.StudentID));
                toast.current.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: `Silinen öğrenci: ${selectedStudent.FirstName}`,
                });
            } else {
                // Başarısız silme işlemi
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Öğrenci silinemedi. Lütfen tekrar deneyin.',
                });
            }
        } catch (error) {
            console.error("Silme hatası:", error);

            // Hata mesajı göster
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Bir hata oluştu. Öğrenci silinemedi.',
            });
        }
    }

    // Kullanıcı doğrulaması
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Öğrencileri API'den çek
    useEffect(() => {
        const getStudents = async () => {
            try {
                const response = await axios.get("http://localhost:5000/students/get", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
                setIsError(true);
            }
        };
        getStudents();
    }, []);

    if (isCheckingAuth || isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return (
            <SidebarLayout RoleID={user.RoleID}>
                <div>Öğrenci bilgileri yüklenirken bir hata oluştu.</div>
            </SidebarLayout>
        );
    }

    // ContextMenu için menü öğeleri
    const contextMenuItems = [
        {
            label: 'Düzenle',
            icon: 'pi pi-pencil',
            command: () => {
                toast.current.show({ severity: 'warn', summary: 'Düzenle', detail: `Düzenleme işlemi: ${selectedStudent.FirstName}` });
            },
        },
        {
            label: 'Sil',
            icon: 'pi pi-trash',
            command: handleDelete
        },
    ];

    return (
        <SidebarLayout RoleID={user.RoleID}>
            <div className="datatable-responsive">
                <Toast ref={toast} />
                <ContextMenu model={contextMenuItems} ref={cm} />
                <h1 className="text-2xl font-bold mb-4">Öğrenci Listesi</h1>
                <DataTable
                    value={students}
                    paginator
                    stripedRows
                    rows={7}
                    className="p-datatable-md shadow-md"
                    showGridlines
                    removableSort
                    resizableColumns
                    contextMenuSelection={selectedStudent}
                    onContextMenuSelectionChange={(e) => setSelectedStudent(e.value)}
                    onContextMenu={(e) => cm.current.show(e.originalEvent)}
                >
                    <Column field="StudentID" header="ID" sortable></Column>
                    <Column field="FirstName" header="Adı" sortable></Column>
                    <Column field="LastName" header="Soyadı" sortable></Column>
                    <Column field="Agno" header="AGNO" sortable></Column>
                    <Column field="DepartmentName" header="Bölüm" sortable></Column>
                </DataTable>
            </div>
        </SidebarLayout>
    );
}

export default StudentList;
