import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import EmojiPicker from 'emoji-picker-react';
import { FaRegPaperPlane } from "react-icons/fa";

// Подключение к серверу
const socket = io("http://localhost:5000");

const GameChat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Когда компонент загрузится — присоединяемся к комнате
    useEffect(() => {
        const roomId = "room_123"; // замени на динамический ID

        socket.emit("join_room", { roomId, userId: "123", username: "User123" });
        console.log("🟢 Присоединились к комнате:", roomId);

        console.log(socket);
        

        return () => {
            console.log("🔴 Покинули комнату");
        };
    }, []);

    // Слушаем входящие сообщения
    useEffect(() => {
        socket.on("receive_message", (receivedMessage) => {
            console.log('habar keldi');
            
            setMessages(prev => [...prev, receivedMessage]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, []);

    // Отправка сообщения
    const handleSendMessage = () => {
        if (!message.trim()) return;

        const chatMessage = {
            text: message,
            name: "Вы",
            avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
            alignment: "end",
            bubbleStyle: "chat-bubble-warning",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const roomId = "room_123"; // замени на динамический ID
        const resopnse = socket.emit("send_message", { roomId, message: chatMessage });


        console.log(resopnse);


        setMessage('');
    };

    // Выбор эмодзи
    const handleEmojiClick = (emojiData) => {
        setMessage(prev => prev + emojiData.emoji);
    };

    return (
        <div className='bg-base-100 h-[90vh] flex flex-col border-2 border-primary rounded-r-2xl'>
            {/* Заголовок */}
            <div className='flex w-full bg-teal border-b-2 shadow-primary border-primary p-2 justify-between items-center'>
                <div className='flex items-center gap-3'>
                    <img src="https://cdn-icons-png.flaticon.com/512/6858/6858504.png" alt="Avatar" className='w-10 h-10 rounded-full' />
                    <p className='font-bold text-2xl'>Мафия Чат</p>
                </div>
            </div>

            {/* Сообщения */}
            <div className='flex-1 overflow-y-auto p-4 space-y-2 items-center'>
                {messages.map((msg, index) => (
                    <div key={index} className={`chat chat-${msg.alignment}`}>
                        <img src={msg.avatar} alt="Avatar" className="size-14 relative top-13" />
                        <div className={`${msg.bubbleStyle} chat-bubble flex flex-col`}>
                            <span>{msg.text}</span>
                            <span className='text-end text-xs'>{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ввод текста */}
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