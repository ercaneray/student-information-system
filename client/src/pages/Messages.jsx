import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SidebarLayout from '../layouts/SidebarLayout';
import { useAuthStore } from '../store/authStore';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';

function Messages() {
    const user = useAuthStore((state) => state.user);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [showNewChatDialog, setShowNewChatDialog] = useState(false);
    const [selectedNewUser, setSelectedNewUser] = useState(null);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Mevcut mesajları çek
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

    // Kişi listesi oluştur
    useEffect(() => {
        const extractContacts = () => {
            const uniqueContacts = [];
            const addedIds = new Set();

            messages.forEach((msg) => {
                const contactID = msg.SenderID === user.UserID ? msg.ReceiverID : msg.SenderID;
                const contactName =
                    msg.SenderID === user.UserID
                        ? `${msg.ReceiverFirstName || 'Bilinmeyen'} ${msg.ReceiverLastName || 'Kişi'}`
                        : `${msg.SenderFirstName || 'Bilinmeyen'} ${msg.SenderLastName || 'Kişi'}`;
                const lastMessageDate = msg.LastMessageDate;

                if (!addedIds.has(contactID)) {
                    uniqueContacts.push({
                        id: contactID,
                        name: contactName,
                        lastMessageDate: lastMessageDate ? new Date(lastMessageDate).toLocaleString() : 'Henüz mesaj yok',
                    });
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

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/messages/getAllNonAdmin`);
            setAllUsers(response.data);
        } catch (error) {
            console.error('Kullanıcılar alınırken hata oluştu:', error);
        }
    };

    const startNewChat = () => {
        if (!selectedNewUser) return;

        const newContact = {
            id: selectedNewUser.UserID,
            name: `${selectedNewUser.FirstName} ${selectedNewUser.LastName}`,
        };

        setContacts((prevContacts) => [...prevContacts, newContact]);
        setSelectedContact(newContact);
        setShowNewChatDialog(false);
    };

    const sendMessage = async () => {
        if (newMessage.trim() === '' || !selectedContact) return;

        const newMsg = {
            SenderID: user.UserID,
            ReceiverID: selectedContact.id,
            Message: newMessage,
            MessageID: Date.now(),
            Date: new Date().toISOString(),
        };

        try {
            await axios.post('http://localhost:5000/messages/create', newMsg);
            setMessages((prevMessages) => [...prevMessages, newMsg]);
            setNewMessage('');
        } catch (error) {
            console.error('Mesaj gönderilirken hata oluştu:', error);
        }
    };

    const filteredMessages = messages.filter(
        (msg) =>
            (msg.SenderID === selectedContact?.id && msg.ReceiverID === user.UserID) ||
            (msg.SenderID === user.UserID && msg.ReceiverID === selectedContact?.id)
    );

    if (isCheckingAuth || isLoading) return <div>Yükleniyor...</div>;

    return (
        <SidebarLayout RoleID={user.RoleID}>
            <div className="p-4 flex h-full">
                {/* Kişi Listesi */}
                <div className="w-1/4 bg-white border rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4 flex justify-between">
                        Mesajlar
                        <Button
                            icon="pi pi-plus"
                            className="p-button-rounded p-button-sm"
                            onClick={() => {
                                setShowNewChatDialog(true);
                                fetchAllUsers();
                            }}
                            tooltip="Yeni Sohbet"
                        />
                    </h2>
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => setSelectedContact(contact)}
                            className={`p-3 cursor-pointer rounded-md ${
                                selectedContact?.id === contact.id
                                    ? 'bg-blue-50 border-l-4 border-blue-500'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <div className="font-semibold">{contact.name}</div>
                            <div className="text-xs text-gray-500">{contact.lastMessageDate}</div>
                        </div>
                    ))}
                </div>

                {/* Mesaj Alanı */}
                <div className="w-3/4 flex flex-col ml-4 bg-white border rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                        {selectedContact ? selectedContact.name : 'Kişi seçin'}
                    </h2>
                    <div className="flex flex-col flex-grow overflow-y-auto">
                        {selectedContact ? (
                            filteredMessages.map((msg) => (
                                <div
                                    key={msg.MessageID}
                                    className={`p-3 my-2 rounded-lg ${
                                        msg.SenderID === user.UserID
                                            ? 'self-end bg-blue-500 text-white'
                                            : 'self-start bg-gray-200'
                                    }`}
                                >
                                    <div>{msg.Message}</div>
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
                        <div className="mt-4 flex items-center gap-2">
                            <InputText
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Mesaj yazın..."
                                className="w-full"
                            />
                            <Button icon="pi pi-send" onClick={sendMessage} />
                        </div>
                    )}
                </div>

                {/* Yeni Sohbet Dialog */}
                <Dialog
                    header="Yeni Sohbet Oluştur"
                    visible={showNewChatDialog}
                    onHide={() => setShowNewChatDialog(false)}
                >
                    <Dropdown
                        value={selectedNewUser}
                        options={allUsers}
                        onChange={(e) => setSelectedNewUser(e.value)}
                        optionLabel="FullName"
                        placeholder="Kişi seçin"
                        className="w-full mb-4 mt-2"
                    />

                    <Button label="Başlat" icon="pi pi-check" onClick={startNewChat} />
                </Dialog>
            </div>
        </SidebarLayout>
    );
}

export default Messages;
