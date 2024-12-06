import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarLayout from '../layouts/SidebarLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAuthStore } from '../store/authStore';

function InstructorList() {
    const user = useAuthStore((state) => state.user);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    const [instructors, setInstructors] = useState([]);
    const [isError, setIsError] = useState(false);

    // Kullanıcı doğrulaması
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Eğitmen verilerini çek
    useEffect(() => {
        const getInstructors = async () => {
            try {
                const response = await axios.get("http://localhost:5000/instructors/get", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });
                setInstructors(response.data); // Gelen verileri state'e ata
            } catch (error) {
                console.error("Error fetching instructors:", error);
                setIsError(true);
            }
        };
        getInstructors();
    }, []);

    if (isCheckingAuth || isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return (
            <SidebarLayout RoleID={user.RoleID}>
                <div>Eğitmen bilgileri yüklenirken bir hata oluştu.</div>
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
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    className="p-datatable-md"
                >
                    {columns.map((col, index) => (
                        <Column key={index} field={col.field} header={col.header} sortable />
                    ))}
                </DataTable>
            </div>
        );
    };

    // Eğitmen tablosu sütun bilgileri
    const columns = [
        { field: 'InstructorID', header: 'ID' },
        { field: 'FirstName', header: 'Adı' },
        { field: 'LastName', header: 'Soyadı' },
        { field: 'Department', header: 'Bölüm' },
    ];

    return (
        <SidebarLayout RoleID={user.RoleID}>
            <CustomDataTable data={instructors} columns={columns} title="Eğitmen Listesi" />
        </SidebarLayout>
    );
}

export default InstructorList;
