import React, { useEffect } from 'react'
import SidebarLayout from '../layouts/SidebarLayout'
import { DataTable } from 'primereact/datatable'
import { useAuthStore } from '../store/authStore'

function CourseList() {
    const user = useAuthStore((state) => state.user)
    const checkAuth = useAuthStore((state) => state.checkAuth)
    const isLoading = useAuthStore((state) => state.isLoading)
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth)
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth || isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <SidebarLayout RoleID={user.RoleID}>
            <div>Course List</div>
        </SidebarLayout>
    )
}

export default CourseList