import React, { useEffect, useState } from 'react'
import { IoIosSend } from 'react-icons/io'
import socket from '../socket'
import { useSelector } from 'react-redux'
const ChatGlobal = () => {
    const [input, setInput] = useState('');
    const user = useSelector((state) => state?.auth?.user);
    const [msg, setMsg] = useState([])
    const sendMessage = async () => {
        socket.emit('send_message', { message: input, user: user });
        setInput("")
    }
    useEffect(() => {
        socket.on('receive_message', (message) => {
            console.log("message", message)
            setMsg(prev => [...prev, message])
        })

        return () => {
            socket.off('receive_message');
        }
    }, [])
    return (
        <div className='h-full p-4 flex flex-col gap-2'>
            <div className='flex-1 flex flex-col'>
                {msg.map((item, index) => (
                    <div key={index} className="chat chat-start">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt={item.sender?.username || 'User'}
                                    src={item.sender?.avatar || 'https://via.placeholder.com/40'}
                                />
                            </div>
                        </div>
                        <div className='chat-header font-semibold text-sm'>{item.sender.username}</div>
                        <div className="chat-bubble text-sm">{item.text}</div>
                    </div>
                ))}
            </div>
            <div className=' flex items-center'>
                <input type="text" placeholder='Type your message' value={input} onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) { sendMessage() } }} onChange={(e) => setInput(e.target.value)} className='input flex-1 w-full input-primary rounded-r-none' />
                <button className='btn btn-primary rounded-l-none' onClick={() => sendMessage()}>
                    <IoIosSend className='text-2xl' />
                </button>
            </div>
        </div>
    )
}

export default ChatGlobal