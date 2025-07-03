import React, { useEffect, useState } from 'react';

const GameCard = ({ card }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), 50); // trigger fade-in
    return () => clearTimeout(timeout);
  }, [card.img, card.title, card.role]); // har safar o‘zgarsa, qayta animatsiya

  return (
    <div className='overflow-y-auto pl-3 h-2/3 overflow-hidden'>
      {card ? (
        <div
          className={`card bg-base-300 w-[98%] h-full shadow-sm transition-all duration-500 ease-in-out transform ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <figure className='max-h-40 overflow-hidden'>
            <img
              src={card.img}
              alt="Role"
              className='w-full object-cover'
            />
          </figure>
          <div className="p-2 bg-opacity-30">
            <h2 className="card-title">{card.role}</h2>
            <p className="text-sm mt-1">{card.title}</p>
          </div>
        </div>
      ) : (
        <p className="text-error text-center">ROLE IS NOT DEFINED</p>
      )}
    </div>
  );
};

export default GameCard;
