import React from 'react';
import { Trophy, Users, Clock, Skull, Crown, Home, RotateCcw, BarChart3, X } from 'lucide-react';

const GameEndModal = ({ 
  isOpen, 
  gameData, 
  onClose, 
  onRestart = null, 
  onLeave, 
  onShowStats 
}) => {
  if (!isOpen || !gameData) return null;

  const { winner, message, finalPlayers, gameStats, duration } = gameData;

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const winnerPlayers = finalPlayers?.filter(p => p.isWinner) || [];
  const loserPlayers = finalPlayers?.filter(p => !p.isWinner) || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        
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
              <Trophy className={`w-12 h-12 ${winner === 'mafia' ? 'text-red-400' : 'text-green-400'}`} />
              <h2 className="text-3xl font-bold text-white">Game Over!</h2>
            </div>
            
            <div className={`text-xl font-semibold mb-2 ${winner === 'mafia' ? 'text-red-400' : 'text-green-400'}`}>
              {winner === 'mafia' ? '🔥 Mafia Victory!' : '🎉 Village Victory!'}
            </div>
            
            <p className="text-white/80">{message}</p>
          </div>
        </div>

        {/* Game Stats Summary */}
        {gameStats && (
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Game Summary
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">{gameStats.totalPlayers}</div>
                <div className="text-xs text-white/60">Total Players</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Crown className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">{gameStats.survivors}</div>
                <div className="text-xs text-white/60">Survivors</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Skull className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">{gameStats.casualties}</div>
                <div className="text-xs text-white/60">Casualties</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Clock className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">{gameStats.turns}</div>
                <div className="text-xs text-white/60">Turns</div>
              </div>
            </div>
            
            {duration && (
              <div className="mt-4 text-center">
                <span className="text-white/60">Game Duration: </span>
                <span className="text-white font-semibold">{formatDuration(duration)}</span>
              </div>
            )}
          </div>
        )}

        {/* Winners */}
        {winnerPlayers.length > 0 && (
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Winners ({winnerPlayers.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {winnerPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{player.username}</div>
                    <div className="text-sm text-green-400 capitalize">{player.role}</div>
                  </div>
                  {player.isAlive && (
                    <div className="ml-auto">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Alive
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Losers */}
        {loserPlayers.length > 0 && (
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
              <Skull className="w-5 h-5" />
              Defeated ({loserPlayers.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {loserPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    {player.isAlive ? (
                      <Users className="w-5 h-5 text-red-400" />
                    ) : (
                      <Skull className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{player.username}</div>
                    <div className="text-sm text-red-400 capitalize">{player.role}</div>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      player.isAlive 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {player.isAlive ? 'Alive' : 'Dead'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={onShowStats}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              View Stats
            </button>
            
            {onRestart && (
              <button
                onClick={onRestart}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restart Game
              </button>
            )}
            
            <button
              onClick={onLeave}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              <Home className="w-4 h-4" />
              Leave Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEndModal;