import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SidebarLayout from '../../layouts/SidebarLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ContextMenu } from 'primereact/contextmenu';
import { Toast } from 'primereact/toast';
import { useAuthStore } from '../../store/authStore';

function InstructorList() {
    const user = useAuthStore((state) => state.user);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    const [instructors, setInstructors] = useState([]);
    const [isError, setIsError] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    const cm = useRef(null); // ContextMenu referansı
    const toast = useRef(null); // Toast referansı

    // Eğitmen silme işlemi
    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:5000/instructors/delete/${selectedInstructor.InstructorID}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                setInstructors(
                    instructors.filter(
                        instructor => instructor.InstructorID !== selectedInstructor.InstructorID
                    )
                );
                toast.current.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: `Silinen eğitmen: ${selectedInstructor.FirstName}`,
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Eğitmen silinemedi. Lütfen tekrar deneyin.',
                });
            }
        } catch (error) {
            console.error("Silme hatası:", error);
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Bir hata oluştu. Eğitmen silinemedi.',
            });
        }
    };

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
                setInstructors(response.data);
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

    // ContextMenu için menü öğeleri
    const contextMenuItems = [
        {
            label: 'Düzenle',
            icon: 'pi pi-pencil',
            command: () => {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Düzenle',
                    detail: `Düzenleme işlemi: ${selectedInstructor.FirstName}`,
                });
            },
        },
        {
            label: 'Sil',
            icon: 'pi pi-trash',
            command: handleDelete,
        },
    ];

    return (
        <SidebarLayout RoleID={user.RoleID}>
            <div className="datatable-responsive">
                <Toast ref={toast} />
                <ContextMenu model={contextMenuItems} ref={cm} />
                <h1 className="text-2xl font-bold mb-4">Eğitmen Listesi</h1>
                <DataTable
                    value={instructors}
                    paginator
                    stripedRows
                    rows={7}
                    className="p-datatable-md shadow-md"
                    showGridlines
                    removableSort
                    resizableColumns
                    contextMenuSelection={selectedInstructor}
                    onContextMenuSelectionChange={(e) => setSelectedInstructor(e.value)}
                    onContextMenu={(e) => cm.current.show(e.originalEvent)}
                    rowHover={true}

                >
                    <Column field="InstructorID" header="ID" sortable></Column>
                    <Column field="FirstName" header="Adı" sortable></Column>
                    <Column field="LastName" header="Soyadı" sortable></Column>
                    <Column field="DepartmentName" header="Bölüm" sortable></Column>
                    <Column field="RoleName" header="Rol" sortable></Column>
                </DataTable>
            </div>
        </SidebarLayout>
    );
}

export default InstructorList;
