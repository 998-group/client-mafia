import React from 'react'

const Timer = ({ day, time }) => {
    return (
        <div className='p-3 relative h-1/3'>
            <div className='w-full h-full'>
                {
                    day ? <img src="https://img.freepik.com/free-vector/illustration-sunset-sky-with-clouds_33099-2387.jpg?semt=ais_hybrid&w=740" className='w-full h-full rounded-xl' alt="" /> : <img src="https://img.freepik.com/premium-photo/contemporary-abstract-gradient-sky-background-with-naive-stars_1034924-5821.jpg" className='w-full h-full rounded-xl' alt="" />
                }
            </div>
            <div className='absolute bottom-3 right-3 bg-accent/40 text-primary px-10 rounded-xl py-1'>
                <p>
                    {day ? "День" : "Ночь"}
                </p>

                <p className=''>
                    {
                        time
                    }
                </p>
            </div>
        </div>
    )
}

export default Timer