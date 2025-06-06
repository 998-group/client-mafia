import React from 'react'
import { FaPlusSquare, FaRandom, FaDoorOpen } from 'react-icons/fa';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router-dom';
const Games = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8 text-center">
                <h1 className="text-4xl font-bold tracking-widest text-warning drop-shadow-md">MAFIA GAME</h1>

                <button className="w-full py-4 bg-warning hover:bg-warning-content text-bace-content font-bold text-xl rounded-xl shadow-md flex items-center justify-center gap-3 transition-all duration-300">
                    <Link to="/" className="flex gap-3 items-center justify-center">
                        <FaPlusSquare className="text-xl" /> Create Room
                    </Link>
                </button>


                <button className="w-full py-4 bg-info hover:bg-info-content text-base-content font-semibold text-lg rounded-xl shadow-md flex items-center justify-center gap-3 transition-all duration-300">
                    <Link to="/" className='flex gap-3 items-center justify-center'>
                        <FaDoorOpen className="text-xl" /> Join Room
                    </Link>
                </button>

                <button className="w-full py-4 bg-error hover:bg-error-content text-base-content font-semibold text-lg rounded-xl shadow-md flex items-center justify-center gap-3 transition-all duration-300">
                    <Link to={-1} className='flex gap-3 items-center justify-center'>
                        <IoMdArrowRoundBack className="text-xl" /> Back
                    </Link>
                </button>
            </div>
        </div>
    )
}

export default Games