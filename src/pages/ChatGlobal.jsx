import React, { useEffect, useState } from 'react'
import { IoIosSend } from 'react-icons/io'
import socket from '../socket'
import { useSelector } from 'react-redux'
const ChatGlobal = () => {
    const [input, setInput] = useState('');
    const user = useSelector((state) => state?.auth?.user);
    const sendMessage = async () => {
        socket.emit('send_message', { message: input, user: user });
    }
    useEffect(() => {
        socket.on('receive_message', (message) => {
            console.log("message", message)
        })

        return () => {
            socket.off('receive_message');
        }
    }, [])
    return (
        <div className='h-full p-4 flex flex-col gap-2'>
            <div className='flex-1 flex flex-col'>

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