import React, { useEffect } from 'react'
import SidebarLayout from '../../layouts/SidebarLayout'
import { useAuthStore } from '../../store/authStore'
function ApproveCourse() {
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
            <div>
                <h1>Approve Courses</h1>
            </div>
        </SidebarLayout>
    )
}

export default ApproveCourse