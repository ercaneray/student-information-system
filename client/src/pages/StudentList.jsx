import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarLayout from '../layouts/SidebarLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAuthStore } from '../store/authStore';

function StudentList() {
    const user = useAuthStore((state) => state.user);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    const [students, setStudents] = useState([]); // Öğrenci verilerini saklamak için state
    const [isError, setIsError] = useState(false); // Hata durumunu kontrol etmek için state

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
                setStudents(response.data); // Veriyi state'e kaydet
            } catch (error) {
                console.error("Error fetching students:", error);
                setIsError(true); // Hata durumunu güncelle
            }
        };
        getStudents();
    }, []); // Component mount olduğunda çalışır

    // Kullanıcı yetkilendirmesini kontrol et
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

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

    return (
        <SidebarLayout RoleID={user.RoleID}>
            <div className="datatable-responsive">
                <h1 className="text-2xl font-bold mb-4">Öğrenci Listesi</h1>
                <DataTable
                    value={students}
                    paginator
                    stripedRows
                    rows={7}
                    className="p-datatable-md"
                    showGridlines
                    removableSort
                    resizableColumns 
                >
                    <Column field="StudentID" header="ID" sortable></Column>
                    <Column field="FirstName" header="Adı" sortable></Column>
                    <Column field="LastName" header="Soyadı" sortable></Column>
                    <Column field="Agno" header="AGNO" sortable></Column>
                    <Column field="Department" header="Bölüm" sortable></Column>
                </DataTable>
            </div>
        </SidebarLayout>
    );
}

export default StudentList;
