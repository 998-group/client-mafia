import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import socket from '../socket';
import {
  User, Crown, Eye, Users, DoorOpen, Play, Copy, Check, Clock,
  Sparkles, Shield, Gamepad2
} from 'lucide-react';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user?.user);

  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room ID');
    }
  };

  useEffect(() => {
    if (!user || !roomId) return;

    // ✅ Join room
    socket.emit('join_room', {
      roomId,
      userId: user._id,
      username: user.username,
    });

    // ✅ Update players list
    const handleUpdatePlayers = (players) => setPlayers(players);

    // ✅ Start game redirect
    const handleStartGame = () => {
      console.log("🚀 Game starting...");
      navigate(`/room/${roomId}/playing`);
      toast.success('Game is starting!');
    };

    socket.on('update_players', handleUpdatePlayers);
    socket.on('start_game', handleStartGame);

    return () => {
      socket.off('update_players', handleUpdatePlayers);
      socket.off('start_game', handleStartGame);
    };
  }, [user, roomId, navigate]);

  useEffect(() => {
    const currentPlayer = players.find(p => p.userId === user?._id);
    if (currentPlayer) {
      setIsReady(currentPlayer.isReady);
    }
  }, [players, user?._id]);

  const handleReady = () => {
    if (!user?._id || !roomId) return;
    socket.emit('ready', { roomId, userId: user._id });
  };

  const handleLeave = () => {
    if (!user?._id || !roomId) return;
    socket.emit('leave_room', { roomId, userId: user._id });
    navigate('/');
  };

  const readyPlayersCount = players.filter(p => p.isReady).length;
  const canStartGame = players.length >= 3 && readyPlayersCount === players.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 space-y-8">

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-purple-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Mafia Game Room</h1>
              <Sparkles className="w-10 h-10 text-yellow-400 animate-pulse" />
            </div>

            {/* Room ID */}
            <div className="flex items-center justify-center gap-3 bg-black/20 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2">
                <DoorOpen className="text-cyan-400 w-5 h-5" />
                <span className="text-lg font-semibold text-white">Room ID:</span>
                <span className="text-2xl font-mono font-bold text-cyan-400">{roomId}</span>
              </div>
              <button
                onClick={copyRoomId}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Users className="text-blue-400 w-5 h-5" />
                <span>{players.length} Players</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-green-400 w-5 h-5" />
                <span>{readyPlayersCount} Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-yellow-400 w-5 h-5" />
                <span>Waiting for all players...</span>
              </div>
            </div>
          </div>

          {/* Players Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Users className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold">Players in Room</h2>
            </div>

            {players.length === 0 ? (
              <div className="text-center py-12">
                <Gamepad2 className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/60 text-lg">No players in the room yet...</p>
                <p className="text-white/40">Share the room ID to invite friends!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map((player, index) => (
                  <div
                    key={player.userId}
                    className={`relative p-4 rounded-2xl border transition-all duration-500 hover:scale-105 ${
                      player.isReady
                        ? 'bg-green-500/20 border-green-400/50 shadow-lg shadow-green-500/20'
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                  >
                    {player.userId === user?._id && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2">
                        <Crown className="text-white w-3 h-3" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${
                        player.isReady ? 'bg-green-500/30 text-green-400' : 'bg-purple-500/30 text-purple-400'
                      }`}>
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-lg">{player.username}</span>
                          {index === 0 && (
                            <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                              Host
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {player.isReady ? (
                            <>
                              <Check className="text-green-400 w-4 h-4" />
                              <span className="text-green-400 font-medium">Ready to play!</span>
                            </>
                          ) : (
                            <>
                              <Clock className="text-yellow-400 w-4 h-4" />
                              <span className="text-yellow-400">Getting ready...</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Game Status */}
          {players.length > 0 && (
            <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-white font-semibold text-lg">Game Status</h3>
                    <p className="text-white/70">
                      {players.length < 3
                        ? `Need ${3 - players.length} more players to start`
                        : canStartGame
                          ? 'All players ready! Game can start now.'
                          : `Waiting for ${players.length - readyPlayersCount} players to get ready`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{readyPlayersCount}/{players.length}</div>
                  <div className="text-white/60 text-sm">Ready</div>
                </div>
              </div>
              <div className="mt-4 bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-700 ease-out"
                  style={{ width: `${players.length > 0 ? (readyPlayersCount / players.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              className="flex items-center gap-2 px-8 py-4 w-full sm:w-auto bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 hover:scale-105 font-semibold"
              onClick={handleLeave}
            >
              <DoorOpen className="w-5 h-5" />
              Leave Room
            </button>

            <button
              className={`flex items-center gap-2 px-8 py-4 w-full sm:w-auto rounded-xl transition-all duration-300 hover:scale-105 font-semibold ${
                isReady
                  ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 text-yellow-400 hover:text-yellow-300'
                  : 'bg-green-500/20 hover:bg-green-500/30 border border-green-400/50 text-green-400 hover:text-green-300'
              }`}
              onClick={handleReady}
              disabled={!user?._id || !roomId}
            >
              <Play className="w-5 h-5" />
              {isReady ? 'Ready!' : 'Get Ready'}
            </button>
          </div>

          {/* Minimum players warning */}
          {players.length > 0 && players.length < 3 && (
            <div className="text-center bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Minimum 3 players required to start the game</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
