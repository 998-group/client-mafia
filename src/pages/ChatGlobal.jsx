import React, { useEffect, useState } from 'react'
import { IoIosSend } from 'react-icons/io'
import socket from '../socket'
import { useSelector } from 'react-redux'
import { data } from 'react-router-dom'
const ChatGlobal = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    console.log('message in global', messages)
    
    const user = useSelector((state) => state?.auth?.user);

    const sendMessage = async () => {
        socket.emit('send_message', { message: input, user: user}, 
            (message) => {
                console.log("message ::", message)
            }
        )

        setInput('');
    }

    useEffect(() => {
        socket.on('receive_message', (message) => {
            setMessages(prev => [...prev, message]);
        })

        return () => {
            socket.off('receive_message');
        }
    }, [])


    return (
        <div className="h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-3/4 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '30px 30px'
                }}
            ></div>

            <div className="relative h-full p-4 flex flex-col gap-2">
                {/* Messages container */}
                <div className="flex-1 flex flex-col overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {messages.map((message, index) => (
                        <div key={index} className="flex items-start max-w-80 break-words gap-3 group">
                            {/* Avatar with glow effect */}
                            <div className="relative">
                                <img
                                    src={message.sender.avatar}
                                    alt="user"
                                    className="w-10 h-10 rounded-full border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/25 transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-cyan-400/50"
                                />
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-75 blur animate-pulse"></div>
                            </div>

                            {/* Message bubble */}
                            <div className="flex-1 max-w-[70%] key">
                                <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-600/50 rounded-xl p-4 shadow-lg transition-all duration-300 hover:border-cyan-400/50 hover:shadow-cyan-400/20">
                                    <span className="font-semibold text-xs bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2 block">
                                        {message.sender.username}
                                    </span>
                                    <p className="text-gray-100 leading-relaxed">{message.text}</p>
                                </div>

                                {/* Message effects */}
                                <div className="flex items-center gap-2 mt-2 opacity-60">
                                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-gray-400">12:3{index + 4}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl shadow-lg">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Enter quantum message..."
                            value={input}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && input.trim()) {
                                    sendMessage()
                                }
                            }}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-slate-900/80 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none"></div>
                    </div>

                    <button
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white p-3 rounded-lg shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-400/40 hover:scale-105 active:scale-95"
                        onClick={() => sendMessage()}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #06b6d4, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #0891b2, #7c3aed);
        }
      `}</style>
        </div>
    )
}

export default ChatGlobal