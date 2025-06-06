import React from "react";
import { FaPlay, FaCog, FaTrophy } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-widest text-warning drop-shadow-md">MAFIA GAME</h1>

        <button className="w-full py-4 bg-warning hover:bg-warning-content text-bace-content font-bold text-xl rounded-xl shadow-md flex items-center justify-center gap-3 transition-all duration-300">
          <Link to="/games" className="flex gap-3 items-center justify-center">
            <FaPlay className="text-2xl" /> Play Game
          </Link>
        </button>

        <button className="w-full py-4 bg-base-100 hover:bg-base-300 text-base-content font-semibold text-lg rounded-xl shadow-md flex items-center justify-center gap-3 transition-all duration-300">
          <Link to="/settings" className="flex gap-3 items-center justify-center">
          <FaCog className="text-xl" /> Settings
          </Link>
        </button>

        <button className="w-full py-4 bg-info hover:bg-info-content text-base-content font-semibold text-lg rounded-xl shadow-md flex items-center justify-center gap-3 transition-all duration-300">
          <FaTrophy className="text-xl" /> Leaderboard
        </button>
      </div>
    </div>
  );
};

export default Home;
