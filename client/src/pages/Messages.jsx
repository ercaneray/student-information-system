import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SidebarLayout from '../layouts/SidebarLayout';
import { useAuthStore } from '../store/authStore';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

function Messages() {
    const user = useAuthStore((state) => state.user);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!user) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/messages/getUserMessages/${user.UserID}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Mesajlar alınırken hata oluştu:', error);
            }
        };

        fetchMessages();
    }, [user]);

    useEffect(() => {
        const extractContacts = () => {
            if (!messages.length) return;

            const uniqueContacts = [];
            const addedIds = new Set();

            messages.forEach((msg) => {
                const contactID = msg.SenderID === user.UserID ? msg.ReceiverID : msg.SenderID;
                const contactName =
                    msg.SenderID === user.UserID
                        ? `${msg.ReceiverFirstName} ${msg.ReceiverLastName}`
                        : `${msg.SenderFirstName} ${msg.SenderLastName}`;

                if (!addedIds.has(contactID)) {
                    uniqueContacts.push({ id: contactID, name: contactName });
                    addedIds.add(contactID);
                }
            });

            setContacts(uniqueContacts);
        };

        extractContacts();
    }, [messages, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedContact]);

    const filteredMessages = messages.filter(
        (msg) =>
            (msg.SenderID === selectedContact?.id && msg.ReceiverID === user.UserID) ||
            (msg.SenderID === user.UserID && msg.ReceiverID === selectedContact?.id)
    );

    const sendMessage = async () => {
        if (newMessage.trim() === '' || !selectedContact) return;

        const newMsg = {
            SenderID: user.UserID,
            ReceiverID: selectedContact.id,
            Message: newMessage,
            MessageID: Date.now(),
        };

        try {
            const response = await axios.post('http://localhost:5000/messages/create', newMsg);

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    ...response.data,
                    UserRole: 'Sender',
                },
            ]);

            setNewMessage('');
        } catch (error) {
            console.error('Mesaj gönderilirken hata oluştu:', error);
            alert('Mesaj gönderilemedi, lütfen tekrar deneyin!');
        }
    };

    if (isCheckingAuth || isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <SidebarLayout RoleID={user.RoleID}>
            <div className="p-4 flex h-full max-h-[calc(100vh-64px)]">
                <div className="w-1/4 bg-white border rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4">Mesajlar</h2>
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => setSelectedContact(contact)}
                            className={`p-3 cursor-pointer rounded-md flex items-center gap-2 ${selectedContact?.id === contact.id
                                    ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                                    : "hover:bg-gray-100"
                                }`}
                        >
                            <div className="font-medium">{contact.name}</div>
                        </div>
                    ))}
                </div>

                <div className="w-3/4 flex flex-col ml-4 bg-white border rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                        {selectedContact ? selectedContact.name : 'Kişi seçin'}
                    </h2>
                    <div className="flex flex-col flex-grow overflow-y-auto max-h-[calc(100vh-200px)]">
                        {selectedContact ? (
                            filteredMessages.map((msg) => (
                                <div
                                    key={msg.MessageID}
                                    className={`p-4 my-2 rounded-lg shadow-lg ${msg.UserRole === 'Sender'
                                            ? 'self-end bg-blue-500 text-white'
                                            : 'self-start bg-gray-100 text-gray-900'
                                        } max-w-md`}
                                >
                                    <div className="text-sm font-semibold">
                                        {msg.UserRole === 'Sender' ? 'You' : `${msg.SenderFirstName} ${msg.SenderLastName}`}
                                    </div>
                                    <div className="text-base">{msg.Message}</div>
                                    <div className="text-xs text-gray-400 text-right">
                                        {new Date(msg.Date).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 italic">Kişi seçin</div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {selectedContact && (
                        <div className="mt-4 flex items-center gap-2 border-t pt-4">
                            <InputTextarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Mesaj yazın..."
                                className="w-full"
                                rows={2}
                            />
                            <Button
                                label=""
                                icon="pi pi-send"
                                className="p-button-rounded p-button-primary"
                                onClick={sendMessage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}

export default Messages;
