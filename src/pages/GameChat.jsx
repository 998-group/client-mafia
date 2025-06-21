import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaRegPaperPlane } from "react-icons/fa";
import EmojiPicker from 'emoji-picker-react';

const GameChat = () => {
    const user = useSelector(state => state.auth.user.user.username);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiClick = (emojiData) => {
        setMessage(prev => prev + emojiData.emoji);
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;
        console.log("Send:", message);
        setMessage('');
    };

    return (
        <div className='bg-base-100 h-full flex flex-col'>
            <div className='flex w-full bg-teal border-b-2 border-error shadow shadow-error p-2 rounded-b-xl justify-between items-center'>
                <div className='flex items-center gap-3'>
                    <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Avatar" className='w-10 h-10' />
                    <p className='font-bold text-2xl'>{user}</p>
                </div>
                <div>
                    <label className="input rounded-2xl bg-base-300 w-72 flex items-center gap-2 border-error border-2">
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

            <div className='flex-1 overflow-y-auto p-4 space-y-2'>
                <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-primary">What kind of nonsense is this</div>
                </div>
                <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-primary">Put me on the Council and not make me a Master!??</div>
                </div>
                <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-primary">That's never been done in the history of the Jedi.</div>
                </div>
                <div className="chat chat-end">
                    <div className="chat-bubble chat-bubble-warning">It's insulting!</div>
                </div>
                <div className="chat chat-end">
                    <div className="chat-bubble chat-bubble-warning">Calm down, Anakin.</div>
                </div>
                <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-primary">You have been given a great honor.</div>
                </div>
                <div className="chat chat-end">
                    <div className="chat-bubble chat-bubble-warning">To be on the Council at your age.</div>
                </div>
                <div className="chat chat-end">
                    <div className="chat-bubble chat-bubble-warning">It's never happened before.</div>
                </div>
            </div>

            <div className="p-4 border-t border-base-300 flex items-end gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="input input-bordered w-full"
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
