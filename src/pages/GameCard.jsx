import React from 'react'

const GameCard = () => {

    const cards = [
        {role: "Mafia", title: "Sizning rolingiz mafiya endi siz xohlagan odamingizni o'ldira olasiz", img: "https://e1.pxfuel.com/desktop-wallpaper/834/909/desktop-wallpaper-3840x2160-mafia-3-logo-art-games-mafia-3.jpg" },
    ]
    return (
        <div className='overflow-y-auto pl-3'>
           {
            cards.map((card, index) => (
                <div className="card bg-base-100 w-[98%] my-4  shadow-sm" key={index}>
                <figure>
                    <img
                        src={card.img}
                        alt="Shoes" />
                </figure>
                <div className="p-2 bg-base-300 bg-opacity-30">
                    <h2 className="card-title">Card Title</h2>
                    <p>{card.title}</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-success-content">Okay</button>
                    </div>
                </div>
            </div>
            ))
           }
        </div>
    )
}

export default GameCard