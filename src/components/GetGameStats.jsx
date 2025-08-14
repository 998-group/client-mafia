import React from 'react';
import { BarChart3, Users, Skull, Crown, Clock, Target, Shield, Eye, X } from 'lucide-react';

const GameStatsModal = ({ isOpen, gameStats, onClose }) => {
  if (!isOpen || !gameStats) return null;

  const { stats, players, phase, turn, winner, roomId } = gameStats;

  const getRoleIcon = (role) => {
    switch (role) {
      case 'mafia':
        return <Target className="w-4 h-4 text-red-400" />;
      case 'doctor':
        return <Shield className="w-4 h-4 text-green-400" />;
      case 'detective':
        return <Eye className="w-4 h-4 text-blue-400" />;
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'mafia':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'doctor':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'detective':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Game Statistics</h2>
            </div>
            
            <div className="text-white/60">
              Room: <span className="text-white font-mono">{roomId}</span>
              {winner && (
                <span className="ml-4">
                  Winner: <span className={`font-semibold ${winner === 'mafia' ? 'text-red-400' : 'text-green-400'}`}>
                    {winner}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Game Overview */}
        {stats && (
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Game Overview
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalPlayers}</div>
                <div className="text-xs text-white/60">Total Players</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <Crown className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.survivors}</div>
                <div className="text-xs text-white/60">Survivors</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <Skull className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.casualties}</div>
                <div className="text-xs text-white/60">Casualties</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{turn}</div>
                <div className="text-xs text-white/60">Turns Played</div>
              </div>
            </div>

            {/* Role Distribution */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                <Target className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{stats.mafiaCount}</div>
                <div className="text-xs text-red-400">Mafia</div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{stats.villagerCount}</div>
                <div className="text-xs text-blue-400">Villagers</div>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{stats.survivalRate}%</div>
                <div className="text-xs text-green-400">Survival Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Player Details */}
        {players && players.length > 0 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Player Details ({players.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`rounded-lg p-3 border ${getRoleColor(player.role)} flex items-center gap-3`}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
                    {getRoleIcon(player.role)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-white">{player.username}</div>
                    <div className="text-sm opacity-80 capitalize">
                      {phase === "ended" ? player.role : "Hidden"}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-medium ${player.isAlive ? 'text-green-400' : 'text-red-400'}`}>
                      {player.isAlive ? 'Alive' : 'Dead'}
                    </div>
                    {player.votes > 0 && (
                      <div className="text-xs text-white/60">
                        {player.votes} votes
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="p-6 border-t border-white/10">
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStatsModal;