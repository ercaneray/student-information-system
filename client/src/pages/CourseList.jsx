import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarLayout from '../layouts/SidebarLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAuthStore } from '../store/authStore';

function CourseList() {
    const user = useAuthStore((state) => state.user);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    const [courses, setCourses] = useState([]);
    const [isError, setIsError] = useState(false);

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
                setCourses(response.data); // Gelen verileri state'e ata
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

    // Reusable DataTable bileşeni
    const CustomDataTable = ({ data, columns, title }) => {
        return (
            <div className="datatable-responsive">
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                <DataTable
                    value={data}
                    paginator
                    stripedRows
                    rows={7}
                    className="p-datatable-md"
                    showGridlines
                    removableSort
                    resizableColumns
                >
                    {columns.map((col, index) => (
                        <Column key={index} field={col.field} header={col.header} sortable />
                    ))}
                </DataTable>
            </div>
        );
    };

    // Ders tablosu sütun bilgileri
    const columns = [
        { field: 'CourseID', header: 'Ders Kodu' },
        { field: 'CourseName', header: 'Ders Adı' },
        { field: 'Akts', header: 'Akts/Kredi' },
    ];

    return (
        <SidebarLayout RoleID={user.RoleID}>
            <CustomDataTable data={courses} columns={columns} title="Ders Listesi" />
        </SidebarLayout>
    );
}

export default CourseList;
