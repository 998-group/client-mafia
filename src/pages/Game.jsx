import React from 'react'

const Game = () => {
    return (
        <div className='flex h-screen'>
            <div className='w-1/4 h-full bg-red-400'>
                <p>Karta</p>
            </div>
            <div className='w-2/3 h-full bg-green-400 flex flex-col'>
                <div className='h-1/3 bg-amber-500'>
                    <p>Players</p>
                </div>
                <div className='h-2/3 bg-teal-500'>
                    <p>CHAT</p>
                </div>
            </div>
            <div className='w-1/4 h-full bg-blue-400'>
                олган одамла спискаси(дравер)
                + game log
            </div>
        </div>
    )
}

export default Game