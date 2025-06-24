import React, { useEffect, useState } from 'react';
import GameChat from './GameChat';
import GameCard from './GameCard';
import DiedPeople from './DiedPeople';

const Game = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

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
    }, 30); // 30ms * 100 = 3000ms => 3s

    return () => clearInterval(interval);
  }, []);

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
      <div className='w-1/4 h-full'>
        <DiedPeople />
      </div>
      <div className='w-3/4 h-full flex flex-col'>
        <div className='h-2/3 w-full justify-center flex-1'>
          <GameChat />
        </div>
      </div>
    </div>
  );
};

export default Game;
