import React from 'react';
import { Trophy, Medal, Award, Crown, Star } from 'lucide-react';

// Mock data for demonstration
const mockLeaderBoard = [
  { username: 'ProGamer2024', role: 'user', avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', _id: '1' },
  { username: 'SkillMaster', role: 'user', avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', _id: '2' },
  { username: 'GameNinja', role: 'user', avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', _id: '3' },
  { username: 'PlayerOne', role: 'user', avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', _id: '4' },
  { username: 'CoolGamer', role: 'user', avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', _id: '5' },
  { username: 'FastFingers', role: 'user', avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', _id: '6' },
  { username: 'QuickThink', role: 'user', avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', _id: '7' },
  { username: 'BrainPower', role: 'user', avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', _id: '8' },
];

const ModernCenterPanel = ({ leaderBoard = mockLeaderBoard }) => {

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1: return <Medal className="w-5 h-5 text-gray-300" />;
      case 2: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <Star className="w-4 h-4 text-blue-400" />;
    }
  };

  const getRankGradient = (index) => {
    switch (index) {
      case 0: return 'from-yellow-500/30 to-amber-500/30 border-yellow-400/30';
      case 1: return 'from-gray-300/20 to-slate-400/20 border-gray-300/30';
      case 2: return 'from-amber-600/20 to-orange-500/20 border-amber-600/30';
      default: return 'from-blue-500/10 to-purple-500/10 border-blue-400/20';
    }
  };

  const getRoleColor = (role) => {
    const roleColors = {
      'admin': 'text-red-400 bg-red-400/20',
      'moderator': 'text-orange-400 bg-orange-400/20',
      'user': 'text-blue-400 bg-blue-400/20',
    };
    return roleColors[role] || 'text-gray-400 bg-gray-400/20';
  };

  const getRoleDisplay = (role) => {
    const roleDisplay = {
      'admin': 'Admin',
      'moderator': 'Moderator', 
      'user': 'Player',
    };
    return roleDisplay[role] || 'Player';
  };

  return (
    <div className="flex-1 h-full min-w-6/12 p-5">
      <div className="h-full w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        {/* Header */}
        <div className="relative z-10 bg-gradient-to-r from-yellow-600/20 via-orange-500/20 to-red-600/20 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center justify-center gap-4 py-6 px-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">!</span>
              </div>
            </div>
            <div className="text-center">
              <h2 className="font-bold text-3xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Leaderboard
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                Top {leaderBoard.length} Players
              </p>
            </div>
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="flex-1 overflow-y-auto relative z-10 p-4">
          <div className="space-y-3">
            {leaderBoard
              ?.map((item, idx) => (
                <div
                  key={idx}
                  className={`group relative bg-gradient-to-r ${getRankGradient(idx)} backdrop-blur-sm border rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20`}
                >
                  {/* Rank indicator */}
                  <div className="absolute -left-2 -top-2 w-8 h-8 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                    <span className="text-xs font-bold text-white">#{idx + 1}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Left side - Rank icon and user info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-full overflow-hidden">
                        {item?.avatar ? (
                          <img 
                            src={item.avatar} 
                            alt={item?.username}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center" style={{ display: item?.avatar ? 'none' : 'flex' }}>
                          {getRankIcon(idx)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-white text-lg truncate">
                            {item?.username}
                          </h3>
                          {idx < 3 && (
                            <div className="flex">
                              {Array.from({ length: 3 - idx }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(item?.role)}`}>
                            {getRoleDisplay(item?.role)}
                          </span>
                          {idx === 0 && (
                            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded-full">
                              TOP PLAYER
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Join date or ID */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        #{idx + 1}
                      </div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">
                        Rank
                      </div>
                    </div>
                  </div>

                  {/* Progress bar removed since no score data */}

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                </div>
              ))}
          </div>

          {/* Empty state */}
          {(!leaderBoard || leaderBoard.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Trophy className="w-20 h-20 mb-4 opacity-30" />
              <h3 className="text-xl font-semibold mb-2">No Players Yet</h3>
              <p className="text-sm text-center max-w-xs">
                Waiting for players to join the game!
              </p>
            </div>
          )}
        </div>

        {/* Footer stats */}
        <div className="relative z-10 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border-t border-white/10 p-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-lg">
                {leaderBoard.filter(user => user.role === 'admin').length}
              </div>
              <div className="text-gray-400 text-xs">ADMINS</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-blue-400 font-bold text-lg">
                {leaderBoard.length}
              </div>
              <div className="text-gray-400 text-xs">TOTAL PLAYERS</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-green-400 font-bold text-lg">
                {leaderBoard.filter(user => !user.isBan?.length).length}
              </div>
              <div className="text-gray-400 text-xs">ACTIVE PLAYERS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernCenterPanel;