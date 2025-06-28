import React, { useEffect, useState } from 'react';
import GameChat from '../components/GameChat';
import GameCard from '../components/GameCard';
import DiedPeople from '../components/DiedPeople';
import Timer from '../components/Timer';
import socket from '../socket';
import { useParams } from 'react-router-dom';

const Game = () => {
    const { roomId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [players, setPlayers] = useState([])
    const role = { role: "Mafia", title: "Sizning rolingiz mafiya endi siz xohlagan odamingizni o'ldira olasiz", img: "https://e1.pxfuel.com/desktop-wallpaper/834/909/desktop-wallpaper-3840x2160-mafia-3-logo-art-games-mafia-3.jpg" }
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsLoading(false); // 👈 Bu yerda loading tugaydi
                    return 100;
                }
                return prev + 1;
            });
        }, 1); // 30ms * 100 = 3000ms => 3s

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleUpdatePlayers = (playersFromServer) => {
            console.log("Players: ", playersFromServer);
            setPlayers(playersFromServer);
        };
        socket.emit('get_players', roomId);
        socket.on('update_players', handleUpdatePlayers);

        return () => {
            socket.off('update_players', handleUpdatePlayers);
        };
    }, []);

    useEffect(() => {
        console.log("DEBuG:", players);
    }, [players])
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <progress className="progress progress-accent w-96" value={progress} max="100"></progress>
                <p className="mt-2 text-lg font-bold">{progress}%</p>
            </div>
        );
    }

    return (
        <div className='flex h-screen p-3'>
            <div className='w-1/4 h-full flex-1 flex flex-col'>
                <DiedPeople players={players} />
            </div>
            <div className='w-2/4 h-full flex flex-col'>
                <div className='h-3/3 w-full justify-center flex-1'>
                    <GameChat />
                </div>
            </div>
            <div className='w-1/4 h-full flex flex-col'>
                <Timer day={true} time={"05:00"} />
                <GameCard card={role} />
            </div>
        </div>
    );
};

export default Game;
