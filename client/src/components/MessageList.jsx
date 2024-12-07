import React from 'react';

const MessageList = ({ messages }) => {
    const roles = {
        1: 'Öğrenci',
        2: 'Eğitmen',
    };
    return (
        <div>
            {messages.map((msg) => (
                <div
                    key={msg.MessageID}
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        marginBottom: '10px',
                        padding: '10px',
                        backgroundColor: msg.MessageType === 'Sent' ? '#e0f7fa' : '#fff3e0',
                    }}
                >
                    <p>
                        <strong>
                            {msg.MessageType === 'Sent' ? 'To:' : 'From:'}
                        </strong>{' '}
                        {msg.FullName} ({roles[msg.RoleID]})
                    </p>
                    <p>{msg.Message}</p>
                    <small>{new Date(msg.Date).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
