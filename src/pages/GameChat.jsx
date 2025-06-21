    import React, { useState } from 'react';
    import { useSelector } from 'react-redux';
    import { FaRegPaperPlane } from "react-icons/fa";
    import EmojiPicker from 'emoji-picker-react';
    import { IoMdArrowRoundBack } from "react-icons/io";
    import { useNavigate } from 'react-router-dom';


    const GameChat = () => {
        const [message, setMessage] = useState('');
        const [showEmojiPicker, setShowEmojiPicker] = useState(false);

        const navigate = useNavigate()

        const handleEmojiClick = (emojiData) => {
            setMessage(prev => prev + emojiData.emoji);
        };

        const handleSendMessage = () => {
            if (!message.trim()) return;
            console.log("Send:", message);
            setMessage('');
        };

        const chatMessages = [
            {
                id: 1,
                text: "What kind of nonsense is this",
                name: "Doni Gey",
                avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
                alignment: "start",
                bubbleStyle: "chat-bubble-primary",
                timestamp: "20:00"
            },
            {
                id: 2,
                text: "Put me on the Council and not make me a Master!??",
                name: "Doni Gey",
                avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
                alignment: "start",
                bubbleStyle: "chat-bubble-primary",
                timestamp: null
            },
            {
                id: 3,
                text: "That's never been done in the history of the Jedi.",
                alignment: "start",
                name: "Doni Gey",
                avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
                bubbleStyle: "chat-bubble-primary",
                timestamp: null
            },
            {
                id: 4,
                text: "It's insulting!",
                alignment: "end",
                name: "Doni Gey",
                avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
                bubbleStyle: "chat-bubble-warning",
                timestamp: null
            },
            {
                id: 5,
                text: "Calm down, Anakin.",
                alignment: "end",
                name: "Doni Gey",
                avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
                bubbleStyle: "chat-bubble-warning",
                timestamp: null
            },
            {
                id: 6,
                text: "You have been given a great honor.",
                alignment: "start",
                name: "Doni Gey",
                avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
                bubbleStyle: "chat-bubble-primary",
                timestamp: null
            },
            {
                id: 7,
                text: "To be on the Council at your age.",
                alignment: "end",
                name: "Doni Gey",
                avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
                bubbleStyle: "chat-bubble-warning",
                timestamp: null
            },
            {
                id: 8,
                text: "It's never happened before.",
                alignment: "end",
                name: "Doni Gey",
                avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
                bubbleStyle: "chat-bubble-warning",
                timestamp: null
            }
        ];

        return (
            <div className='bg-base-100 h-[90vh] flex flex-col border-2 border-primary rounded-r-2xl'>
                <div className='flex w-full bg-teal border-b-2 shadow-primary border-primary p-2 justify-between items-center'>
                    <div className='flex items-center gap-3'>
                        <button onClick={() => navigate(`/`)} className='text-2xl bg-primary rounded-xl p-1 '><IoMdArrowRoundBack />  </button>
                        <img src="data:image/jpeg;base64,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" alt="Avatar" className='w-10 h-10 rounded-full' />
                        <p className='font-bold text-2xl'>Mafia Game</p>
                    </div>
                    <div>
                        <label className="input rounded-2xl bg-base-300 w-72 flex items-center gap-2 border-primary border-2">
                            <svg className="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input type="search" className="grow bg-transparent outline-none" placeholder="Search" />
                        </label>
                    </div>
                </div>

                <div className='flex-1 overflow-y-auto p-4 space-y-2 items-center '>
                    {chatMessages.map((message, index) => (
                        <div className="chat chat-start" key={index}>
                           <img src={message.avatar} alt="" className="size-14 relative top-13"/>
                        <div className="chat-bubble chat-bubble-primary flex flex-col">
                            <span>{message.text}</span>
                            <span className='text-end text-xs'>20:00</span>
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
                            placeholder="Type a message..."
                            className="input input-bordered w-full border border-primary"
                        />
                        {showEmojiPicker && (
                            <div className="absolute bottom-full right-0 z-10">
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}
                    </div>
                    <button onClick={() => setShowEmojiPicker(prev => !prev)} className="btn">😊</button>
                    <div
                        className="absolute bottom-full right-0 z-10"
                        style={{ transform: 'scale(1.5)', transformOrigin: 'bottom right' }}
                    >
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>

                    <button onClick={handleSendMessage} className="btn btn-primary">
                        <FaRegPaperPlane />
                    </button>
                </div>
            </div>
        );
    };

    export default GameChat;
