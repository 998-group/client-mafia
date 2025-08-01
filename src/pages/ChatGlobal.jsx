    import React, { useEffect, useState, useRef } from 'react';
    import { IoIosSend } from 'react-icons/io';
    import socket from '../socket';
    import { useSelector } from 'react-redux';

    const ChatGlobal = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const user = useSelector((state) => state?.auth?.user);
    const messagesEndRef = useRef(null);

    console.log("message:", messages)

    const sendMessage = () => {
        if (!input.trim() || !user) {
        console.warn('Cannot send message: Input empty or user not logged in');
        return;
        }

        socket.emit('send_message', {
        data: {
            message: input,
            user: user?.username  // Asosiy user strukturasini yuborish
        },
        global: true,
        });

        setInput('');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!socket.connected) {
        console.warn('Socket not connected, attempting to connect...');
        socket.connect();
        }

        socket.emit('fetch_messages', { global: true });

        socket.on('initial_messages', (initialMessages) => {
        console.log('Received initial messages:', initialMessages);
        setMessages(initialMessages || []);
        });

        socket.on('receive_message', (message) => {
        console.log('Received message:', message);
        setMessages((prev) => [...prev, message]);
        });

        socket.on('error', (error) => {
        console.error('Socket error:', error.message);
        alert(`Error: ${error.message}`);
        });

        socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
        console.warn('Socket disconnected');
        });

        return () => {
        socket.off('initial_messages');
        socket.off('receive_message');
        socket.off('error');
        socket.off('connect');
        socket.off('disconnect');
        };
    }, []);

    return (
        <div className="h-full p-4 flex flex-col gap-2">
        <div className="flex-1 flex flex-col overflow-y-auto">
            {messages.length === 0 && (
            <p className="text-center text-base-100">No messages yet</p>
            )}
            {messages.map((message, index) => (
            <div
                key={index}
                className={`flex items-start gap-2 my-3 ${
                message.sender._id === user?._id ? 'justify-end' : 'justify-start'
                }`}
            >
                <img
                src={message.sender.avatar || '/default-avatar.png'}
                alt={message.sender.username}
                className="w-10 h-10 rounded-full"
                />
                <div
                className={`chat-bubble max-w-[50%] flex flex-col p-2 rounded-lg ${
                    message.sender._id === user?._id
                    ? 'bg-primary text-white'
                    : 'bg-base-300 text-black'
                }`}
                >
                <span className="font-semibold text-xs text-success">
                    {message.sender.username || 'Unknown'}
                </span>
                <p>{message.text}</p>
                </div>
            </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center">
            <input
            type="text"
            placeholder="Type your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim()) {
                sendMessage();
                }
            }}
            className="input flex-1 input-primary rounded-r-none"
            disabled={!user}
            />
            <button
            onClick={sendMessage}
            disabled={!input.trim() || !user}
            className="btn btn-primary rounded-l-none"
            >
            <IoIosSend className="text-2xl" />
            </button>
        </div>
        </div>
    );
    };

    export default ChatGlobal;
