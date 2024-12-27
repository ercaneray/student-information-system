// Eğitmenleri listelediğim ve üzerinde işlemler yapılabilen admin sayfası
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SidebarLayout from '../../layouts/SidebarLayout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ContextMenu } from 'primereact/contextmenu';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useAuthStore } from '../../store/authStore';
import AddInstructorForm from './addForms/AddInstructor';

function InstructorList() {
    const user = useAuthStore((state) => state.user);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    const [instructors, setInstructors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [connectedCourses, setConnectedCourses] = useState([]);
    const [isError, setIsError] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [isConnectionsDialogVisible, setIsConnectionsDialogVisible] = useState(false);
    const [isAddCourseDialogVisible, setIsAddCourseDialogVisible] = useState(false);



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
    // Eğitmene ders ekleme
    const handleAddCourse = async (CourseID) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/instructors/add-connection/${selectedInstructor.InstructorID}`,
                { CourseID },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            if (response.status === 201) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: `Ders eklendi: ${CourseID}`,
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Ders eklenemedi. Lütfen tekrar deneyin.',
                });
            }
        } catch (error) {
            console.error("Ders ekleme hatası:", error);
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Bir hata oluştu. Ders eklenemedi.',
            });
        }
    };

    const handleInstructorAdded = (newInstructor) => {
        setInstructors((prevInstructors) => [...prevInstructors, newInstructor]);
        setIsAddFormVisible(false); // Formu kapat
        console.log(newInstructor);
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
    // Ders verilerini çek
    const getCourses = async () => {
        setCourses([]); // Dersleri sıfırla
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
    // Bağlı dersleri çek
    const getConnections = async () => {
        setConnectedCourses([]); // Bağlı dersleri sıfırla
        try {
            const response = await axios.get(
                `http://localhost:5000/instructors/get-connections/${selectedInstructor.InstructorID}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            setConnectedCourses(response.data);
        } catch (error) {
            console.error("Error fetching connections:", error);
            setIsError(true);
        }
    };


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
            label: 'Bağlı dersleri görüntüle',
            icon: 'pi pi-eye',
            command: async () => {
                await getConnections(); // API'den veriyi çek
                setIsConnectionsDialogVisible(true); // Dialog'u aç
            },
        },
        {
            label: 'Ders ekle',
            icon: 'pi pi-plus',
            command: async () => {
                await getCourses(); // Ders listesini çek
                setIsAddCourseDialogVisible(true); // Dialog'u aç
            },
        },
        {
            label: 'Sil',
            icon: 'pi pi-trash',
            command: handleDelete,
        },
    ];


    return (
        // Eğitmen listesini getirdiğim datatable componenti ve sayfanın devamı
        <SidebarLayout RoleID={user.RoleID}>
            <div className="datatable-responsive">
                <Toast ref={toast} />
                <ContextMenu model={contextMenuItems} ref={cm} />
                <h1 className="text-2xl font-bold mb-4">Eğitmen Listesi</h1>
                <Button
                    label="Yeni Eğitmen Ekle"
                    icon="pi pi-plus"
                    className="mb-4"
                    onClick={() => setIsAddFormVisible(true)}
                />
                <Dialog
                    visible={isAddFormVisible}
                    style={{ width: '30vw' }}
                    onHide={() => setIsAddFormVisible(false)}
                >
                    <AddInstructorForm onInstructorAdded={handleInstructorAdded} />
                </Dialog>
                <DataTable
                    value={instructors}
                    paginator
                    stripedRows
                    rows={7}
                    className="p-datatable-md shadow-md"
                    showGridlines
                    removableSort
                    sortField='InstructorID'
                    sortOrder={1}
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
                <Dialog
                    header="Bağlı Dersler"
                    visible={isConnectionsDialogVisible}
                    style={{ width: '50vw' }}
                    onHide={() => setIsConnectionsDialogVisible(false)}
                >
                    {connectedCourses.length > 0 ? (
                        <DataTable value={connectedCourses} showGridlines>
                            <Column field="CourseID" header="Ders ID"></Column>
                            <Column field="CourseName" header="Ders Adı"></Column>
                            <Column field="Akts" header="Akts/Kredi"></Column>
                            <Column field="Semester" header="Dönem" body={(rowData) => (rowData.Semester ? "Bahar" : "Güz")}></Column>
                            <Column field="Class" header="Sınıf"></Column>
                        </DataTable>
                    ) : (
                        <p>Bağlı ders bulunmamaktadır.</p>
                    )}
                </Dialog>
                <Dialog
                    header="Ders Ekle"
                    visible={isAddCourseDialogVisible}
                    style={{ width: '30vw' }}
                    onHide={() => setIsAddCourseDialogVisible(false)}
                >
                    <Dropdown
                        value={null}
                        options={courses} // Ders listesini options olarak veriyoruz
                        onChange={(e) => setSelectedCourse(e.value)} // Seçilen ders ID'si
                        optionLabel="CourseName"
                        optionValue="CourseID"
                        placeholder="Ders Seçiniz"
                        className="w-full mb-10 mt-4"
                        itemTemplate={(option) => (
                            <div className="flex flex-col p-2 ">
                                <div className="font-bold">{option.CourseName}</div>
                                <small className="text-gray-600">
                                    AKTS: {option.Akts} | Dönem: {option.Semester ? "Bahar" : "Güz"} | Sınıf: {option.Class}
                                </small>
                            </div>
                        )}
                    />
                    <Button
                        label="Dersi Ekle"
                        icon="pi pi-check"
                        className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded shadow-md"
                        onClick={() => {
                            handleAddCourse(selectedCourse); // Seçilen dersi handleAddCourse ile gönderiyoruz
                            setIsAddCourseDialogVisible(false); // Dialog'u kapat
                        }}
                        disabled={!selectedCourse} // Ders seçilmediğinde buton devre dışı
                    />
                </Dialog>
            </div>
        </SidebarLayout>
    );
}

export default InstructorList;
