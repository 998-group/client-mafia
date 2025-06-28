import React from 'react'

const GameCard = ({ card }) => {

    return (
        <div className='overflow-y-auto pl-3 h-2/3 overflow-hidden'>
            {
                card ? (
                    <div className="card bg-base-300 w-[98%] overflow-hidden h-full  shadow-sm" >
                        <figure>
                            <img
                                src={card.img}
                                alt="Shoes" />
                        </figure>
                        <div className="p-2  bg-opacity-30">
                            <h2 className="card-title">{card.role}</h2>
                            <p>{card.title}</p>
                        </div>
                    </div>
                ) : (
                    <p>ROLE IS NOT DEFINED</p>
                )
            }
        </div >
    )
}

export default GameCard