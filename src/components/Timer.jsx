import React from 'react';
import { Clock, Sun, Moon, AlertCircle, Skull } from 'lucide-react';

const Timer = ({ day, time }) => {
  const formatCountdown = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatCountdown(time);

  const getPhaseLabel = () => {
    switch (day) {
      case "day": return { icon: <Sun className="w-4 h-4" />, label: "Day Phase" };
      case "night": return { icon: <Moon className="w-4 h-4" />, label: "Night Phase" };
      case "ended": return { icon: <Skull className="w-4 h-4" />, label: "Game Over" };
      case "started": return { icon: <Clock className="w-4 h-4" />, label: "Game Starting" };
      default: return { icon: <AlertCircle className="w-4 h-4" />, label: "Loading..." };
    }
  };

  const { icon, label } = getPhaseLabel();

  return (
    <div className="p-6 space-y-4">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Clock className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Time Remaining</h3>
        </div>

        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-2xl font-bold text-white">{time}s</span>
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-white/20 rounded-full animate-pulse"></div>
        </div>

        <div className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white flex items-center justify-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
};

export default Timer;