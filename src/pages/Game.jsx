import React from 'react'
import { useSelector } from 'react-redux';
import GameChat from './GameChat';
import GameCard from './GameCard';
import DiedPeople from './DiedPeople';

const Game = () => {

    return (
        <div className='flex h-screen '>
            <div className='w-1/3 flex justify-center h-full'>
                <GameCard/>
            </div>
            <div className='w-2/3 h-full flex flex-col'>
                <div className='h-1/3'>
                    <p>Players</p>
                </div>
                <div className='h-2/3 w-full justify-center flex-1'>
                    <GameChat/>
                </div>
            </div>
            <div className='w-1/4 h-full'>
                <DiedPeople/>
            </div>
        </div>
    )
}

export default Game