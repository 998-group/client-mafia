import React from "react";
import { FaCrown } from "react-icons/fa";

const LeaderBoard = ({ leaderBoard }) => {
  const getMedal = (index) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return `#${index + 1}`;
    }
  };

  

  const getRankStyling = (index) => {
    switch (index) {
      case 0: return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg transform scale-105";
      case 1: return "bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-md";
      case 2: return "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md";
      default: return "bg-base-200 hover:bg-base-300 transition-colors";
    }
  };

  return (
    <div className="h-full w-full bg-base-100 rounded-xl shadow-2xl overflow-hidden flex flex-col p-5">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-t-2xl">
        <div className="flex items-center justify-center gap-4 h-20 px-6">
          <div className="text-4xl animate-bounce">🏆</div>
          <div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-sm opacity-90">Top Players Rankings</p>
          </div>
        </div>
      </div>


      <div className="flex-1 overflow-y-auto p-4">
        {leaderBoard?.length > 0 ? (
          <div className="space-y-3">
            {leaderBoard.map((player, idx) => 
            (
             
              <div key={idx} className={`rounded-xl p-4 ${getRankStyling(idx)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold min-w-[3rem] text-center">
                      {getMedal(idx)}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {player?.username?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{player?.username}</div>
                      <div className={`text-sm opacity-75 ${idx < 3 ? "text-white" : "text-base-content"}`}>
                        {player?.role || "Player"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{player?.score || 0}</div>
                    <div className={`text-xs opacity-75 ${idx < 3 ? "text-white" : "text-base-content"}`}>points</div>
                  </div>
                </div>

                {idx < 3 && leaderBoard[0]?.score > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full" style={{ width: `${(player.score / leaderBoard[0].score) * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-primary mb-4" />
              <p className="text-base-content opacity-60">Loading leaderboard...</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-base-200 px-6 py-3 flex justify-between items-center text-sm text-base-content opacity-75">
        <span>Total Players: {leaderBoard.length}</span>
        <span>Updated: Just now</span>
      </div>
    </div>
  );
};

export default LeaderBoard;
