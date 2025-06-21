import React from 'react'
import { useSelector } from 'react-redux';
import GameChat from './GameChat';
import GameCard from './GameCard';
import DiedPeople from './DiedPeople';

const Game = () => {

    return (
        <div className='flex h-screen p-3'>
            <div className='w-1/4 h-full'>
                <DiedPeople/>
            </div>
            <div className='w-3/4 h-full flex flex-col'>
                <div className='h-2/3 w-full justify-center flex-1'>
                    <GameChat/>
                </div>
            </div>
        </div>
    )
}

export default Game