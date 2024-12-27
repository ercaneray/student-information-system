// Eğitmenlerin derslere not girebileceği sayfa

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
function SetGrades() {
    const user = useAuthStore((state) => state.user);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    const [connectedCourses, setConnectedCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseStudents, setCourseStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [grades, setGrades] = useState({
        Exam1Grade: null,
        Exam2Grade: null,
    });

    const [isError, setIsError] = useState(false);
    const [isStudentsVisible, setIsStudentsVisible] = useState(false);
    const [isGradeFormVisible, setIsGradeFormVisible] = useState(false);

    const cm = useRef(null); // ContextMenu referansı
    const toast = useRef(null); // Toast referansı

    // Eğitmenin derslerini getirme
    useEffect(() => {
        if (!user) return;
        const getInstructorCourses = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/instructors/get-connections/${user.UserID}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    }
                );
                setConnectedCourses(response.data);
            } catch (error) {
                console.error('Error fetching instructor courses:', error);
                setIsError(true);
            }
        };
        getInstructorCourses();
    }, [user]);

    // Kullanıcı doğrulaması
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Seçilen dersin öğrencilerini getir
    const getStudentsByCourse = async (CourseID) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/students/get-connections/${CourseID}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
            setCourseStudents(response.data);
        } catch (error) {
            console.error('Error fetching students by course:', error);
            setIsError(true);
        }
    };
    // Seçilen öğrenciye not gir
    const setGrade = async (StudentID, CourseID, Exam1Grade, Exam2Grade) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/courses/update-connection/${CourseID}`,
                {
                    StudentID,
                    Exam1Grade,
                    Exam2Grade
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
            console.log(response.data);
            toast.current.show({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Notlar başarıyla kaydedildi.',
                life: 3000,
            });
        } catch (error) {
            console.error('Error setting grade:', error);
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
            label: 'Bu ders için not gir',
            icon: 'pi pi-eye',
            command:
                async () => {
                    console.log(selectedCourse);
                    await getStudentsByCourse(selectedCourse.CourseID); // API'den veriyi çek
                    setIsStudentsVisible(true); // Dialog'u aç
                },
        },
    ];


    return (
        <SidebarLayout RoleID={user.RoleID}>
            <div className="datatable-responsive">
                <Toast ref={toast} />
                <ContextMenu model={contextMenuItems} ref={cm} />
                <h1 className="text-2xl font-bold mb-4">Derslerim</h1>
                <DataTable
                    value={connectedCourses}
                    paginator
                    stripedRows
                    rows={7}
                    className="p-datatable-md shadow-md"
                    showGridlines
                    removableSort
                    resizableColumns
                    contextMenuSelection={selectedCourse}
                    onContextMenuSelectionChange={(e) => setSelectedCourse(e.value)}
                    onContextMenu={(e) => cm.current.show(e.originalEvent)}
                    rowHover={true}

                >
                    <Column field="CourseID" header="Ders No" sortable></Column>
                    <Column field="CourseName" header="Ders adı" sortable></Column>
                    <Column field="Akts" header="AKTS" sortable></Column>
                </DataTable>
                <Dialog
                    header="Öğrenci Notları"
                    visible={isStudentsVisible}
                    style={{ width: '50vw' }}
                    onHide={() => setIsStudentsVisible(false)}
                >
                    <DataTable
                        value={courseStudents}
                        selectionMode={'single'}
                        selection={selectedStudent}
                        onSelectionChange={(e) => setSelectedStudent(e.value)}
                        onRowClick={(e) => setIsGradeFormVisible(true)}
                        paginator
                        stripedRows
                        rows={7}
                        className="p-datatable-md shadow-md"
                        showGridlines
                        removableSort
                        resizableColumns
                    >
                        <Column field="StudentID" header="Öğrenci No" sortable></Column>
                        <Column field="FirstName" header="Ad" sortable></Column>
                        <Column field="LastName" header="Soyad" sortable></Column>
                        <Column field="Exam1Grade" header="1. Sınav Notu" sortable></Column>
                        <Column field="Exam2Grade" header="2. Sınav Notu" sortable></Column>
                    </DataTable>
                </Dialog>
                <Dialog
                    header="Not Gir"
                    visible={isGradeFormVisible}
                    style={{ width: '50vw' }}
                    onHide={() => {
                        setIsGradeFormVisible(false);
                        setGrades({ Exam1Grade: null, Exam2Grade: null }); // Form sıfırlama
                    }}
                >
                    <div className="p-field">
                        <label htmlFor="Exam1Grade">1. Sınav Notu</label>
                        <input
                            id="Exam1Grade"
                            type="number"
                            className="p-inputtext p-component w-full"
                            value={grades.Exam1Grade || ''}
                            onChange={(e) => setGrades({ ...grades, Exam1Grade: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="Exam2Grade">2. Sınav Notu</label>
                        <input
                            id="Exam2Grade"
                            type="number"
                            className="p-inputtext p-component w-full"
                            value={grades.Exam2Grade || ''}
                            onChange={(e) => setGrades({ ...grades, Exam2Grade: e.target.value })}
                        />
                    </div>
                    <Button
                        label="Kaydet"
                        className="p-button-success"
                        onClick={() => {
                            setGrade(
                                selectedStudent.StudentID,
                                selectedCourse.CourseID,
                                grades.Exam1Grade,
                                grades.Exam2Grade
                            );
                            setIsGradeFormVisible(false);
                            setGrades({ Exam1Grade: null, Exam2Grade: null }); // Form sıfırlama
                        }}
                        disabled={!grades.Exam1Grade || !grades.Exam2Grade} // Boş not girişi varsa devre dışı
                    />
                </Dialog>

            </div>
        </SidebarLayout>
    );
}

export default SetGrades;
