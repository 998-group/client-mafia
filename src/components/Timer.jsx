import React from 'react';

const Timer = ({ day, time }) => {
  const formatCountdown = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatCountdown(time);

  return (
    <div className='p-3 relative h-1/3'>
      <div className='w-full h-full'>
        {day === "day" ? (
          <img
            src="https://img.freepik.com/free-vector/illustration-sunset-sky-with-clouds_33099-2387.jpg?semt=ais_hybrid&w=740"
            className='w-full h-full rounded-xl'
            alt=""
          />
        ) : day === "night" ? (
          <img
            src="https://img.freepik.com/premium-photo/contemporary-abstract-gradient-sky-background-with-naive-stars_1034924-5821.jpg"
            className='w-full h-full rounded-xl'
            alt=""
          />
        ) : day === "started" ? (
          <img src="https://wallpapercat.com/w/full/f/b/c/1863196-1920x1080-desktop-full-hd-mafia-game-series-wallpaper-photo.jpg"
            alt=""
            className='w-full h-full rounded-xl'
          />
        ) : (
          <img src="https://c4.wallpaperflare.com/wallpaper/493/210/439/game-ends-game-ends-poster-wallpaper-preview.jpg"
            alt=""
            className='w-full h-full rounded-xl'
          />
        )}
      </div>

      <div className='absolute bottom-3 flex flex-col gap-1 right-3 bg-accent/40 text-error filter backdrop-blur-xs px-6 rounded-xl py-2'>
        <p className='font-bold'>
          {day === "day" ? "День" : day === "night" ? "Ночь" : day === "ended" ? "Конец игры" : "Старт"}
        </p>


        <span className="countdown font-mono text-2xl flex gap-0.5">
          <span style={{ "--value": hours }}>{hours.toString().padStart(2, '0')}</span>:
          <span style={{ "--value": minutes }}>{minutes.toString().padStart(2, '0')}</span>:
          <span style={{ "--value": seconds }}>{seconds.toString().padStart(2, '0')}</span>
        </span>
      </div>
    </div>
  );
};

export default Timer;
