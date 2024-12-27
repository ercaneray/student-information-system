// Courselist sayfasında kullandığım yeni ders ekleme formu
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

function AddCourseForm({ onCourseAdded }) {
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const semester = [
        { label: 'Güz', value: 0 },
        { label: 'Bahar', value: 1 }
    ]
    const [formData, setFormData] = useState({
        CourseID: '',
        CourseName: '',
        Akts: '',
        Semester: '',
        Class: '',
        DepartmentID: 0,
        RequiredCourseID: null,
    });
    // Fetch departments
    useEffect(() => {
        const getDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/departments/get', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        getDepartments();

    }, []);
    // Fetch courses
    useEffect(() => {
        const getCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/courses/get', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        getCourses();
    }, []);
    const toast = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/courses/create', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
    
            if (response.status === 201) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Ders başarıyla eklendi.',
                });
    
                // Bölüm adını al
                const departmentName = departments.find(
                    (department) => department.DepartmentID === formData.DepartmentID
                )?.DepartmentName || 'Bilinmeyen Bölüm';
    
                // Yeni ders verilerini bildir
                onCourseAdded({
                    ...formData,
                    DepartmentName: departmentName,
                });
    
                // Formu sıfırla
                setFormData({
                    CourseID: '',
                    CourseName: '',
                    Akts: '',
                    Semester: '',
                    Class: '',
                    DepartmentID: 0,
                    RequiredCourseID: null,
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Ders eklenemedi. Lütfen tekrar deneyin.',
                });
            }
        } catch (error) {
            console.error('Ders ekleme sırasında hata oluştu:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Bir hata oluştu. Ders eklenemedi.',
            });
        }
    };
    
    return (
        <div className="p-4">
            <Toast ref={toast} />
            <h2 className="text-xl font-bold mb-4 text-center">Yeni Ders Ekle</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label htmlFor="StudentID">Ders ID:</label>
                    <input
                        type="text"
                        id="CourseID"
                        name="CourseID"
                        value={formData.CourseID}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="CourseName">Ders Adı:</label>
                    <input
                        type="text"
                        id="CourseName"
                        name="CourseName"
                        value={formData.CourseName}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="Akts">Akts:</label>
                    <input
                        type="number"
                        id="Akts"
                        name="Akts"
                        value={formData.Akts}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="Semester">Dönem</label>
                    <Dropdown
                        value={formData.Semester}
                        options={semester}
                        onChange={(e) => setFormData({ ...formData, Semester: e.value })}
                        className="w-full border p-2 rounded"
                        placeholder='Dönem Seçiniz'
                        required
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="DepartmentID">Bölüm</label>
                    <Dropdown
                        value={formData.DepartmentID}
                        options={departments}
                        onChange={(e) => setFormData({ ...formData, DepartmentID: e.value })}
                        optionLabel="DepartmentName"
                        optionValue='DepartmentID'
                        className="w-full border p-2 rounded"
                        placeholder='Bölüm Seçiniz'
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="Class">Sınıf:</label>
                    <input
                        type="number"
                        id="Class"
                        name="Class"
                        value={formData.Class}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="RequiredCourseID">Gerekli Ders:</label>
                    <Dropdown
                        value={formData.RequiredCourseID}
                        options={courses}
                        onChange={(e) => setFormData({ ...formData, RequiredCourseID: e.value })}
                        optionLabel="CourseName"
                        optionValue='CourseID'
                        className="w-full border p-2 rounded"
                        placeholder='Gerekli Ders Seçiniz'
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Ders Ekle
                </button>
            </form>
        </div>
    );
}

export default AddCourseForm;
