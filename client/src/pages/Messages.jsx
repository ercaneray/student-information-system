import React, { useEffect, useState } from 'react';
import SidebarLayout from '../layouts/SidebarLayout';
import { useAuthStore } from '../store/authStore';
import MessageList from '../components/MessageList';

function Messages() {
    const user = useAuthStore((state) => state.user);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // API'den mesajları al
    useEffect(() => {
        {
            fetch('http://localhost:5000/messages/getMyMessages/190005') // Backend endpoint
                .then((response) => response.json())
                .then((data) => {
                    setMessages(data);
                })
                .catch((error) => {
                    console.error('Error fetching messages:', error);
                });
                
        }
    }, [user?.UserID]);

    if (isCheckingAuth || isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <SidebarLayout RoleID={user.RoleID}>
            <div>
                <h1>Messages</h1>
                <MessageList messages={messages} />
            </div>
        </SidebarLayout>
    );
}

export default Messages;
