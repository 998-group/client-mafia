// src/components/GameCard.jsx - Enhanced Game Card with Role Icons
import React, { useEffect, useState } from 'react';
import { Eye, Shield, Target, Stethoscope, Users } from 'lucide-react';

const GameCard = ({ card, userId, phase }) => {
  const [visible, setVisible] = useState(false);

  // ✅ Role configurations with proper images and descriptions
  const roleConfig = {
    mafia: {
      icon: <Target className="w-6 h-6" />,
      color: "from-red-500 to-red-700",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      image: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png",
      title: "You are a MAFIA member. Kill villagers at night and blend in during the day.",
      description: "Eliminate all villagers to win"
    },
    villager: {
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      title: "You are a VILLAGER. Find and eliminate all mafia members.",
      description: "Vote out the mafia to win"
    },
    doctor: {
      icon: <Stethoscope className="w-6 h-6" />,
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      image: "https://cdn-icons-png.flaticon.com/512/2785/2785482.png",
      title: "You are the DOCTOR. Heal players at night to save them from mafia attacks.",
      description: "Save the innocent, win with villagers"
    },
    detective: {
      icon: <Shield className="w-6 h-6" />,
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      image: "https://cdn-icons-png.flaticon.com/512/3110/3110270.png",
      title: "You are the DETECTIVE. Investigate players at night to discover their roles.",
      description: "Find the mafia, win with villagers"
    }
  };

  useEffect(() => {
    if (!card) return setVisible(false);

    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, [card?.role]);

  // ✅ If no card/role assigned yet
  if (!card || !card.role) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-500/20 rounded-full flex items-center justify-center animate-pulse">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Waiting for Role...</h3>
            <p className="text-sm text-white/60">Your role will be assigned when the game starts</p>
          </div>
        </div>
      </div>
    );
  }

  const config = roleConfig[card.role] || roleConfig.villager;

  return (
    <div className={`p-6 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'} h-full`}>
      <div
        className={`
          w-full h-full rounded-2xl p-6 
          ${config.bgColor} backdrop-blur-xl 
          border ${config.borderColor} shadow-xl 
          flex flex-col justify-between 
          ${visible ? 'scale-100' : 'scale-95'} 
          transition-all duration-500
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-gradient-to-r ${config.color}`}>
              {config.icon}
            </div>
            <h3 className="text-white text-lg font-bold">Your Role</h3>
          </div>
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${config.color} text-white text-sm font-medium`}>
            {phase || 'waiting'}
          </div>
        </div>

        {/* Role Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className={`w-32 h-32 rounded-2xl overflow-hidden border-4 ${config.borderColor} shadow-lg`}>
              <img
                src={config.image}
                alt={card.role}
                className="w-full h-full object-cover bg-white/10"
                onError={(e) => {
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/565/565547.png";
                }}
              />
            </div>
            <div className={`absolute -bottom-2 -right-2 p-2 bg-gradient-to-r ${config.color} rounded-full border-2 border-white`}>
              {config.icon}
            </div>
          </div>
        </div>

        {/* Role Info */}
        <div className="text-center space-y-4 flex-1">
          <div>
            <h2 className={`text-2xl font-bold capitalize bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
              {card.role}
            </h2>
            <p className="text-white/80 text-sm leading-relaxed mt-2">
              {config.title}
            </p>
          </div>

          {/* Role objective */}
          <div className={`p-3 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
            <h4 className="text-white font-semibold text-sm mb-1">Objective:</h4>
            <p className="text-white/70 text-xs">{config.description}</p>
          </div>

          {/* Phase-specific instructions */}
          {phase === 'night' && (
            <div className="p-3 rounded-lg bg-black/20 border border-white/10">
              <h4 className="text-white font-semibold text-sm mb-1">Night Actions:</h4>
              <p className="text-white/70 text-xs">
                {card.role === 'mafia' && 'Choose a player to eliminate'}
                {card.role === 'doctor' && 'Choose a player to heal'}
                {card.role === 'detective' && 'Choose a player to investigate'}
                {card.role === 'villager' && 'Sleep and wait for day phase'}
              </p>
            </div>
          )}

          {phase === 'day' && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <h4 className="text-white font-semibold text-sm mb-1">Day Phase:</h4>
              <p className="text-white/70 text-xs">
                Discuss with other players and vote to eliminate suspects
              </p>
            </div>
          )}
        </div>

        {/* Bottom tip */}
        <div className="mt-4 text-center">
          <div className="text-xs text-white/50 italic">
            🤫 Keep your role secret!
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;