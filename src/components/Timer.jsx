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
                {day ? (
                    <img
                        src="https://img.freepik.com/free-vector/illustration-sunset-sky-with-clouds_33099-2387.jpg?semt=ais_hybrid&w=740"
                        className='w-full h-full rounded-xl'
                        alt=""
                    />
                ) : (
                    <img
                        src="https://img.freepik.com/premium-photo/contemporary-abstract-gradient-sky-background-with-naive-stars_1034924-5821.jpg"
                        className='w-full h-full rounded-xl'
                        alt=""
                    />
                )}
            </div>

            <div className='absolute bottom-3 right-3 bg-accent/40 text-primary px-6 rounded-xl py-2'>
                <p className='mb-1 text-center font-bold'>
                    {day ? "День" : "Ночь"}
                </p>

                <span className="countdown font-mono text-2xl flex gap-1">
                    <span style={{ "--value": hours }}>{hours.toString().padStart(2, '0')}</span>:
                    <span style={{ "--value": minutes }}>{minutes.toString().padStart(2, '0')}</span>:
                    <span style={{ "--value": seconds }}>{seconds.toString().padStart(2, '0')}</span>
                </span>
            </div>
        </div>
    );
};

export default Timer;
