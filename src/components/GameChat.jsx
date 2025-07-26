import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import EmojiPicker from 'emoji-picker-react';
import { FaRegPaperPlane } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoArrowBackOutline } from "react-icons/io5";

// 👇 Создаём соединение с сокет-сервером
const socket = io("https://server-mafia.onrender.com");

const GameChat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const user = useSelector((state) => state?.auth?.user);
    const params = useParams();
    const navigate = useNavigate();

    const roomId = params.roomId;

    // 🧠 Загружаем сохранённые сообщения из localStorage при старте
    useEffect(() => {
        const savedMessages = localStorage.getItem(`chat_${roomId}`);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }

        // 👋 Заходим в комнату через сокет
        socket.emit("join_room", {
            roomId,
            userId: user?.user?._id,
            username: user?.user?.username,
        });

        return () => {
            // socket.emit("leave_room", { roomId }); // можно включить если сервер это обрабатывает
        };
    }, [roomId, user]);

    // 📥 Получение новых сообщений по сокету
    useEffect(() => {
        const handleReceiveMessage = (receivedMessage) => {
            setMessages(prev => [...prev, receivedMessage]);
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, []);

    // 💾 Сохраняем все сообщения в localStorage при каждом изменении
    useEffect(() => {
        localStorage.setItem(`chat_${roomId}`, JSON.stringify(messages));
    }, [messages, roomId]);

    // 🔙 Назад на главную
    const handleBack = () => {
        navigate('/');
    };

    // 📤 Отправка сообщений
    const handleSendMessage = () => {
        if (!message.trim()) return;

        const chatMessage = {
            text: message,
            name: user?.user?.username || "Неизвестный",
            avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
            alignment: "end",
            bubbleStyle: "chat-bubble-primary",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Отправляем сообщение в комнату
        socket.emit("send_message", { roomId, message: chatMessage });

        setMessage('');
    };

    // 😁 Добавление эмодзи
    const handleEmojiClick = (emojiData) => {
        setMessage(prev => prev + emojiData.emoji);
    };

    return (
        <div className='bg-base-100 h-full flex flex-col border-2 border-primary rounded-r-2xl'>
            {/* 🧠 Хедер */}
            <div className='flex w-full bg-teal border-b-2 shadow-primary border-primary p-2 justify-between items-center'>
                <div className='flex items-center gap-3'>
                    <IoArrowBackOutline className='text-3xl border-2 border-primary cursor-pointer rounded-full h-8 w-8' onClick={handleBack} />
                    <img src="https://cdn-icons-png.flaticon.com/512/6858/6858504.png" alt="Avatar" className='w-10 h-10 rounded-full' />
                    <p className='font-bold text-2xl'>Mafia chat</p>
                </div>
            </div>

            <div className='flex-1 overflow-y-auto p-4 space-y-2 items-center'>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-2 items-center chat chat-${msg?.alignment}`}>
                        <img src={msg?.avatar} alt="Avatar" className="size-14" />
                        <div className={`${msg?.bubbleStyle} chat-bubble flex flex-col`}>
                            <p className='text-sm'>{msg.name}</p>
                            <span>{msg?.text}</span>
                            <span className='text-end text-xs'>{msg?.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-base-300 flex items-end gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Введите сообщение..."
                        className="input input-bordered w-full border border-primary"
                    />
                    {showEmojiPicker && (
                        <div className="absolute bottom-full right-0 z-10">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                </div>
                <button onClick={() => setShowEmojiPicker(prev => !prev)} className="btn">😊</button>
                <button onClick={handleSendMessage} className="btn btn-primary">
                    <FaRegPaperPlane />
                </button>
            </div>
        </div>
    );
};

export default GameChat;
