import React, { useEffect, useState } from 'react';

const GameCard = ({ card }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!card) return setVisible(false);

    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), 50); // Trigger fade-in
    return () => clearTimeout(timeout);
  }, [card?.img, card?.title, card?.role]);

  if (!card) {
    return (
      <div className="p-4 mt-10">
        <p className="text-center text-error font-semibold text-lg">
          ⛔ Rol aniqlanmagan
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden p-3 transition-all duration-500">
      <div
        className={`card bg-base-300 shadow-lg rounded-xl overflow-hidden transform transition-all duration-500 ease-in-out ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <figure className="h-40 overflow-hidden">
          <img
            src={card.img}
            alt="Role"
            className="w-full h-full object-cover"
          />
        </figure>
        <div className="p-4">
          <h2 className="card-title text-xl capitalize">{card.role}</h2>
          <p className="text-sm mt-2 text-gray-500">{card.title}</p>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
