import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

const GameCard = ({ card }) => {
  const [visible, setVisible] = useState(false);
  console.log("card", card);
  useEffect(() => {
    if (!card) return setVisible(false);

    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timeout);
  }, [card?.img, card?.title, card?.role]);

  if (!card) {
    return (
      <div className="p-4 mt-10">
        <p className="text-center text-red-400 font-semibold text-lg">
          ⛔ Rol aniqlanmagan
        </p>
      </div>
    );
  }

  // Выбор картинки в зависимости от роли
  const roleImages = {
    mafia: "/unnamed.png",
    detective: "/unnamed(1).jpg",
    doctor: "/unnamed(2).jpg",
    peaceful: "/unnamed(3).jpg",
  };
  
  let roleImage = roleImages[card.gameRole] || card.img;
  

  console.log("card", card);
console.log("roleImage", roleImage);
  return (
    <div className={`p-4 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div
        className={`w-full h-full rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between ${
          visible ? 'scale-100' : 'scale-95'
        } transition-all duration-500`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 bg-purple-500/30 text-purple-300 rounded-full flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
          <h3 className="text-white text-lg font-bold">Your Role</h3>
        </div>

        {/* Role Image */}
        <div className="relative mx-auto mb-4">
          <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-white/20 shadow-md">
            <img
              src={roleImage}
              alt={card?.gameRole}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/565/565547.png";
              }}
            />
          </div>

          <div className="absolute -bottom-2 -right-2 p-2 bg-pink-500/70 backdrop-blur-md rounded-full border border-white/10">
            <Eye className="text-white w-4 h-4" />
          </div>
        </div>

        {/* Role Info */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold capitalize text-white">{card?.gameRole}</h2>
          <p className="text-white/70 text-sm leading-relaxed">{card?.title}</p>
        </div>

        {/* Role Tag */}
        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow">
            <Eye className="w-4 h-4" />
            <span className="capitalize">{card.role}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
