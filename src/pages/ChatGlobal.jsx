import React, { useEffect, useState } from 'react'
import { IoIosSend } from 'react-icons/io'
import socket from '../socket'
import { useSelector } from 'react-redux'
import { data } from 'react-router-dom'
const ChatGlobal = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const user = useSelector((state) => state?.auth?.user);

    const sendMessage = async () => {
        socket.emit('send_message', { message: input, user: user })
    }

    useEffect(() => {
        socket.on('receive_message', (message) => {
            console.log("message", message)
            setMessages(prev => [...prev, message]);
        })

        return () => {
            socket.off('receive_message');
        }
    }, [])

  
    return (
        <div className='h-full p-4 flex flex-col gap-2'>
            <div className='flex-1 flex flex-col'>
                {
                    messages.map((text, index) => {
                        return (
                            <div className='flex items-center gap-2 my-3' key={index}>
                                <img src={text?.sender?.avatar} alt="user" className='w-10 h-10 rounded-full' />
                                <p className='chat-bubble w-[50%] flex flex-col'>
                                    <span className='font-semibold text-xs text-success'>{text?.sender?.username}</span>
                                    {text?.text}
                                </p>
                            </div>
                        )
                    })
                }
            </div>
            <div className=' flex items-center'>
                <input type="text" placeholder='Type your message' onChange={(e) => setInput(e.target.value)} className='input flex-1 w-full input-primary rounded-r-none' />
                <button className='btn btn-primary rounded-l-none' onClick={() => sendMessage()}>
                    <IoIosSend className='text-2xl' />
                </button>
            </div>
        </div>
    )
}
 
export default ChatGlobal