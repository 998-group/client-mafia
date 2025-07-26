import React, { useState, useEffect } from 'react';
import { FaRegPaperPlane } from 'react-icons/fa';
import { IoArrowBackOutline } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import socket from '../socket';

const GameChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const user = useSelector((state) => state?.auth?.user);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const roomId = params.roomId;
    socket.emit("join_room", { roomId, userId: user?.user?._id, username: user?.user?.username });
    return () => {
      console.log("🔴 Left room:", roomId);
    };
  }, []);

  useEffect(() => {
    const handleReceiveMessage = (receivedMessage) => {
      setMessages(prev => [...prev, receivedMessage]);
    };
    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const chatMessage = {
      text: message,
      name: "Вы",
      avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
      alignment: "end",
      bubbleStyle: "chat-bubble-primary",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.emit("send_message", { roomId: params.roomId, message: chatMessage });
    setMessage('');
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] rounded-t-2xl">
        <div className="flex items-center gap-3">
          <IoArrowBackOutline
            onClick={handleBack}
            className="text-white text-2xl cursor-pointer border border-primary p-1 rounded-full hover:bg-white/10"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/6858/6858504.png"
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <p className="text-white text-xl font-semibold">Mafia Chat</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat chat-${msg.alignment}`}>
            <img src={msg.avatar} alt="Avatar" className="size-12 rounded-full shadow" />
            <div className={`${msg.bubbleStyle} chat-bubble bg-white/20 backdrop-blur-md border border-white/20 text-white`}>
              <span className="text-sm">{msg.text}</span>
              <span className="text-xs text-right opacity-70 mt-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input & Emoji Picker */}
      <div className="p-4 border-t border-white/10 bg-white/10 backdrop-blur-md rounded-b-2xl flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Xabar yozing..."
            className="input input-bordered w-full border border-primary bg-white/20 backdrop-blur-sm text-white placeholder-white/70"
          />
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
            </div>
          )}
        </div>
        <button onClick={() => setShowEmojiPicker((prev) => !prev)} className="btn bg-white/20 text-white hover:bg-white/30">
          😊
        </button>
        <button onClick={handleSendMessage} className="btn btn-primary">
          <FaRegPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default GameChat;
