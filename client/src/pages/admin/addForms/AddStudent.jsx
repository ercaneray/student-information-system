import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

function AddStudentForm({ onStudentAdded }) {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        StudentID: '',
        FirstName: '',
        LastName: '',
        Password: '',
        DepartmentID: 0,
        Class: '',
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
    const toast = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            const response = await axios.post('http://localhost:5000/students/create', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
    
            if (response.status === 201) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Öğrenci başarıyla eklendi.',
                });
    
                // Bölüm adını al
                const departmentName = departments.find(
                    (department) => department.DepartmentID === formData.DepartmentID
                )?.DepartmentName || 'Bilinmeyen Bölüm';
    
                // Yeni öğrenci bilgilerini üst componente bildir
                onStudentAdded({
                    ...formData,
                    DepartmentName: departmentName,
                });
    
                // Formu sıfırla
                setFormData({
                    StudentID: '',
                    FirstName: '',
                    LastName: '',
                    Password: '',
                    DepartmentID: '',
                    Class: '',
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Öğrenci eklenemedi. Lütfen tekrar deneyin.',
                });
            }
        } catch (error) {
            console.error('Öğrenci ekleme sırasında hata oluştu:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            });
        }
    };
    

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <h2 className="text-xl font-bold mb-4 text-center">Yeni Öğrenci Ekle</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label htmlFor="StudentID">Öğrenci ID:</label>
                    <input
                        type="text"
                        id="StudentID"
                        name="StudentID"
                        value={formData.StudentID}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="FirstName">Ad:</label>
                    <input
                        type="text"
                        id="FirstName"
                        name="FirstName"
                        value={formData.FirstName}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="LastName">Soyad:</label>
                    <input
                        type="text"
                        id="LastName"
                        name="LastName"
                        value={formData.LastName}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="Password">Şifre:</label>
                    <input
                        type="password"
                        id="Password"
                        name="Password"
                        value={formData.Password}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
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
                        type="text"
                        id="Class"
                        name="Class"
                        value={formData.Class}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Öğrenci Ekle
                </button>
            </form>
        </div>
    );
}

export default AddStudentForm;
