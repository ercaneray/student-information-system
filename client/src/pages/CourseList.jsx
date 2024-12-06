import React, { useEffect } from 'react'
import axios from 'axios'
import SidebarLayout from '../layouts/SidebarLayout'
import { useAuthStore } from '../store/authStore'

function CourseList() {
    const user = useAuthStore((state) => state.user)
    const checkAuth = useAuthStore((state) => state.checkAuth)
    const isLoading = useAuthStore((state) => state.isLoading)
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth)
    try {
        async function getCourses() {
            const response = await axios.get("http://localhost:5000/courses/get", {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            console.log(response.data);
        }
        getCourses();
    } catch (error) {
        console.log(error);
    }
    
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth || isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <SidebarLayout RoleID={user.RoleID}>
            <div>StudentList</div>
        </SidebarLayout>
    )
}

export default CourseList