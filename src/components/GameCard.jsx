import React, { useEffect, useState } from 'react';

const GameCard = ({ card }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!card) return setVisible(false);

    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), 50);
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
    <div className={`p-4 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div
        className={`card w-full shadow-xl border border-base-300 bg-base-100/60 backdrop-blur-md rounded-2xl overflow-hidden transform duration-500 ease-in-out ${
          visible ? 'scale-100' : 'scale-95'
        }`}
      >
        {/* 🖼 Role Image */}
        <figure className="h-40 w-full overflow-hidden">
          <img
            src={card.img}
            alt={card.role}
            className="object-cover w-full h-full"
          />
        </figure>

        {/* 📜 Role Info */}
        <div className="p-4 space-y-2">
          <h2 className="text-xl font-bold capitalize text-primary">{card.role}</h2>
          <p className="text-sm text-base-content/70 leading-relaxed">{card.title}</p>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
