import React, { useState, useEffect, useRef } from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';
import { IoArrowBackOutline } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import socket from '../socket';

const GameChat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messageEndRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  console.log("user chat:", user)

  console.log("message:", messages)

  const handleSendMessage = () => {
    if (message.trim()) {
      const msgData = {
        roomId,
        sender: user?.username,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      socket.emit("send_message", msgData);
      setMessages((prev) => [...prev, msgData]);
      setMessage('');
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on("receive_chat_message", handleReceiveMessage);

    return () => {
      socket.off("receive_chat_message", handleReceiveMessage); 
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 bg-base-200 flex items-center gap-2">
        <IoArrowBackOutline className="text-2xl cursor-pointer" onClick={() => navigate(-1)} />
        <h2 className="font-semibold">Game Chat</h2>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat ${msg.sender === user.username ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-header text-xs text-gray-400">{msg.sender}</div>
            <div className="chat-bubble">{msg.text}</div>
            <div className="chat-footer opacity-50 text-xs">{msg.time}</div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-3 bg-base-200 flex items-center gap-2">
        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="btn btn-sm"
        >
          😊
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-16 left-2 z-50">
            <EmojiPicker
              onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)}
              theme="dark"
            />
          </div>
        )}

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="input input-bordered w-full"
          placeholder="Type your message..."
        />
        <button className="btn btn-primary btn-square" onClick={handleSendMessage}>
          <FaRegPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default GameChat;
