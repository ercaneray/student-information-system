// InstructorList sayfasında kullandığım yeni eğitmen ekleme formu

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

function AddInstructorForm({ onInstructorAdded }) {
    const [departments, setDepartments] = useState([]);
    const roles = [
        { RoleID: 2, RoleName: 'Eğitmen' },
        { RoleID: 3, RoleName: 'Danışman' },
    ]
    const [formData, setFormData] = useState({
        InstructorID: '',
        FirstName: '',
        LastName: '',
        Password: '',
        DepartmentID: 0,
        RoleID: 2,
    });

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
            const response = await axios.post('http://localhost:5000/instructors/create', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            if (response.status === 201) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Eğitmen başarıyla eklendi.',
                });
                onInstructorAdded(formData);

                setFormData({
                    InstructorID: '',
                    FirstName: '',
                    LastName: '',
                    Password: '',
                    DepartmentID: '',
                    RoleID: '',
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Eğitmen eklenemedi. Lütfen tekrar deneyin.',
                });
            }
        } catch (error) {
            console.log(formData);

            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Bir hata oluştu. Eğitmen eklenemedi.',
            });
        }
    };

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <h2 className="text-xl font-bold mb-4 text-center">Yeni Eğitmen Ekle</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label htmlFor="InstructorID">Eğitmen ID:</label>
                    <input
                        type="text"
                        id="InstructorID"
                        name="InstructorID"
                        value={formData.InstructorID}
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
                        optionValue="DepartmentID"
                        className="w-full border p-2 rounded"
                        placeholder='Bölüm Seçiniz'
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="RoleID">Rol:</label>
                    <Dropdown
                        value={formData.RoleID}
                        options={roles}
                        onChange={(e) => setFormData({ ...formData, RoleID: e.value })}
                        optionLabel="RoleName"
                        optionValue="RoleID"
                        className="w-full border p-2 rounded"
                        placeholder='Rol Seçiniz'
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Eğitmen Ekle
                </button>
            </form>
        </div>
    );
}

export default AddInstructorForm;
