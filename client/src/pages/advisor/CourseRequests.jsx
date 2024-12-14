import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarLayout from '../../layouts/SidebarLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useAuthStore } from '../../store/authStore';


function CourseRequests() {
    const user = useAuthStore((state) => state.user);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    const [requests, setRequests] = useState([]);
    const [selectedRequests, setSelectedRequests] = useState([]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    // Ders listesini API'den çek
    useEffect(() => {
        const getRequests = async () => {
            if (!user) {
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/courses/get/pending-requests/${user.DepartmentID}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });
                setRequests(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        getRequests();
    }, [user]);
    const handleSubmit = async () => {
        try {
            console.log(selectedRequests);
            const promises = selectedRequests.map((request) => {
                return axios.put(
                    `http://localhost:5000/courses/approve-request`,
                    {
                        RequestID: request.RequestID,
                        CourseID: request.CourseID,
                        StudentID: request.StudentID,
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
            setRequests(requests.filter((request) => !selectedRequests.includes(request)));
            console.log("Kurslar başarıyla gönderildi:", responses);
        } catch (error) {
            console.error("Kurs gönderme işlemi sırasında hata oluştu:", error);
        }
    };
    const handleDelete = async () => {
        try {
            const promises = selectedRequests.map((request) => {
                return axios.delete(
                    `http://localhost:5000/courses/deny-request/${request.RequestID}`,
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
            console.log("Kurslar başarıyla silindi:", responses);
            setRequests(requests.filter((request) => !selectedRequests.includes(request)));
        } catch (error) {
            console.error("Kurs silme işlemi sırasında hata oluştu:", error);
        }
    }

    if (isCheckingAuth || isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <SidebarLayout RoleID={user.RoleID}>
            <div className="datatable-responsive">
                <h1 className="text-2xl font-bold mb-4">Bekleyen ders istekleri</h1>
                <div >
                    <DataTable
                        value={requests}
                        paginator
                        stripedRows
                        rows={7}
                        className="p-datatable-lg"
                        showGridlines
                        removableSort
                        resizableColumns
                        selectionMode={"multiple"}
                        selection={selectedRequests}
                        onSelectionChange={(e) => setSelectedRequests(e.value)}
                    >
                        <Column selectionMode='multiple' headerStyle={{ width: '3rem' }}></Column>
                        <Column field="Student Name" header="Öğrenci" body={(rowData) => `${rowData.FirstName} ${rowData.LastName}`} sortable></Column>
                        <Column field="Course" header="Ders" body={(rowData) => `${rowData.CourseID} ${rowData.CourseName}`} sortable></Column>
                        <Column field="Akts" header="AKTS" sortable></Column>
                    </DataTable>
                </div>
                <Button label="Onayla" icon="pi pi-check" onClick={handleSubmit} className="mt-4" />
                <Button label="Reddet" icon="pi pi-times" onClick={handleDelete} className="mt-4" />
            </div>

        </SidebarLayout>
    );
}

export default CourseRequests;
