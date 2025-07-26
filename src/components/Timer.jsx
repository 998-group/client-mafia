import React from 'react';

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
      case "day": return "🌞 Кун (Day)";
      case "night": return "🌚 Тун (Night)";
      case "ended": return "🏁 O‘yin tugadi";
      case "started": return "🚦 Boshlanishi...";
      default: return "⏳ Kuting...";
    }
  };

  const getImageForPhase = () => {
    switch (day) {
      case "day":
        return "https://img.freepik.com/free-vector/illustration-sunset-sky-with-clouds_33099-2387.jpg";
      case "night":
        return "https://img.freepik.com/premium-photo/contemporary-abstract-gradient-sky-background-with-naive-stars_1034924-5821.jpg";
      case "started":
        return "https://wallpapercat.com/w/full/f/b/c/1863196-1920x1080-desktop-full-hd-mafia-game-series-wallpaper-photo.jpg";
      default:
        return "https://c4.wallpaperflare.com/wallpaper/493/210/439/game-ends-game-ends-poster-wallpaper-preview.jpg";
    }
  };

  return (
    <div className="relative w-full h-60 rounded-xl overflow-hidden shadow-md">
      <img
        src={getImageForPhase()}
        alt="phase"
        className="w-full h-full object-cover rounded-xl"
      />

      {/* Glassy badge timer */}
      <div className="absolute bottom-3 right-3 bg-base-100/60 backdrop-blur-sm text-base-content rounded-xl px-5 py-2 border border-base-300 shadow-md">
        <p className="font-semibold text-sm">{getPhaseLabel()}</p>
        <div className="countdown font-mono text-xl tracking-wider">
          <span>{String(hours).padStart(2, '0')}</span>:
          <span>{String(minutes).padStart(2, '0')}</span>:
          <span>{String(seconds).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};

export default Timer;
