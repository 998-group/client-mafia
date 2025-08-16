import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import socket from '../socket';
import {
  User, Crown, Eye, Users, DoorOpen, Play, Copy, Check, Clock,
  Sparkles, Shield, Gamepad2, AlertCircle
} from 'lucide-react';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user?.user);
  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [gameState, setGameState] = useState({
    phase: 'waiting',
    loading: true,
    error: null
  });
  const [isLeaving, setIsLeaving] = useState(false);
  const [hostId, setHostId] = useState(null);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      toast.success('Room ID copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room ID', err);
      toast.error('Failed to copy room ID');
    }
  };

  // Socket event handlers
  const handleUpdatePlayers = useCallback((newPlayers) => {
    if (Array.isArray(newPlayers)) {
      setPlayers(newPlayers);
      setGameState(prev => ({ ...prev, loading: false, error: null }));
      
      // Update current user's ready status
      const currentPlayer = newPlayers.find(p => p.userId === user?._id);
      if (currentPlayer) {
        setIsReady(currentPlayer.isReady);
      }
    }
  }, [user?._id]);

  const handleStartGame = useCallback(() => {
    console.log("🚀 Game starting...");
    toast.success('Game is starting!');
    navigate(`/room/${roomId}/playing`);
  }, [navigate, roomId]);

  const handleGamePhase = useCallback((gameData) => {
    if (gameData?.phase) {
      setGameState(prev => ({ 
        ...prev, 
        phase: gameData.phase,
        loading: false 
      }));
      
      if (gameData.hostId) {
        setHostId(gameData.hostId);
      }
    }
  }, []);

  const handleJoinedRoom = useCallback((roomData) => {
    if (roomData) {
      setGameState(prev => ({ 
        ...prev, 
        phase: roomData.phase || 'waiting',
        loading: false,
        error: null 
      }));
      
      if (roomData.hostId) {
        setHostId(roomData.hostId);
      }
      
      if (roomData.players) {
        setPlayers(roomData.players);
      }
    }
  }, []);

  const handleNewHost = useCallback((data) => {
    if (data?.newHostId) {
      setHostId(data.newHostId);
      if (data.newHostId === user?._id) {
        toast.info('You are now the host!');
      }
    }
  }, [user?._id]);

  const handleRoomClosed = useCallback(() => {
    toast.warning('Room has been closed');
    navigate('/');
  }, [navigate]);

  const handleSocketError = useCallback((error) => {
    console.error('Socket error:', error);
    const errorMessage = error?.message || 'An error occurred';
    setGameState(prev => ({ 
      ...prev, 
      error: errorMessage,
      loading: false 
    }));
    toast.error(errorMessage);
    
    // If room not found, redirect to lobby
    if (errorMessage.includes('Room not found') || errorMessage.includes('not found')) {
      setTimeout(() => navigate('/'), 2000);
    }
  }, [navigate]);

  const handleNotification = useCallback((notification) => {
    if (notification?.type && notification?.message) {
      toast[notification.type](notification.message);
    }
  }, []);

  useEffect(() => {
    if (!user?._id || !roomId) {
      setGameState(prev => ({ 
        ...prev, 
        error: 'Missing user or room information',
        loading: false 
      }));
      return;
    }

    // Join room on mount
    setGameState(prev => ({ ...prev, loading: true }));
    socket.emit('join_room', {
      roomId,
      userId: user._id,
      username: user.username,
    });

    // Set up socket listeners
    socket.on('update_players', handleUpdatePlayers);
    socket.on('start_game', handleStartGame);
    socket.on('game_phase', handleGamePhase);
    socket.on('joined_room', handleJoinedRoom);
    socket.on('new_host', handleNewHost);
    socket.on('room_closed', handleRoomClosed);
    socket.on('error', handleSocketError);
    socket.on('notification', handleNotification);

    // Set up cleanup timeout
    const joinTimeout = setTimeout(() => {
      setGameState(prev => ({ 
        ...prev, 
        error: 'Failed to join room - timeout',
        loading: false 
      }));
    }, 500000);

    return () => {
      clearTimeout(joinTimeout);
      socket.off('update_players', handleUpdatePlayers);
      socket.off('start_game', handleStartGame);
      socket.off('game_phase', handleGamePhase);
      socket.off('joined_room', handleJoinedRoom);
      socket.off('new_host', handleNewHost);
      socket.off('room_closed', handleRoomClosed);
      socket.off('error', handleSocketError);
      socket.off('notification', handleNotification);
    };
  }, [user, roomId, handleUpdatePlayers, handleStartGame, handleGamePhase, 
      handleJoinedRoom, handleNewHost, handleRoomClosed, handleSocketError, handleNotification]);

  const handleReady = () => {
    if (!user?._id || !roomId) {
      toast.error('Missing user or room information');
      return;
    }
    
    if (gameState.phase !== 'waiting') {
      toast.warning('Cannot change ready status - game is not in waiting phase');
      return;
    }

    socket.emit('ready', { roomId, userId: user._id });
  };

  const handleLeave = () => {
    if (!user?._id || !roomId) {
      toast.error('Missing user or room information');
      return;
    }

    if (isLeaving) return;

    setIsLeaving(true);
    socket.emit('leave_room', { roomId, userId: user._id });
    
    // Navigate immediately for better UX
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const readyPlayersCount = players.filter(p => p?.isReady).length;
  const canStartGame = players.length >= 3 && readyPlayersCount === players.length && gameState.phase === 'waiting';
  const isHost = hostId === user?._id;
  const currentPlayer = players.find(p => p.userId === user?._id);

  // Loading state
  if (gameState.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Joining room...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (gameState.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Room Error</h2>
          <p className="text-red-400 mb-4">{gameState.error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }

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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Mafia Game Room
              </h1>
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
                <span>{players.length} Player{players.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-green-400 w-5 h-5" />
                <span>{readyPlayersCount} Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-yellow-400 w-5 h-5" />
                <span className="capitalize">{gameState.phase} Phase</span>
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
                    key={player.userId || index}
                    className={`relative p-4 rounded-2xl border transition-all duration-500 hover:scale-105 ${
                      player.isReady
                        ? 'bg-green-500/20 border-green-400/50 shadow-lg shadow-green-500/20'
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                  >
                    {/* Current user indicator */}
                    {player.userId === user?._id && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2">
                        <Crown className="text-white w-3 h-3" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${
                        player.isReady 
                          ? 'bg-green-500/30 text-green-400' 
                          : 'bg-purple-500/30 text-purple-400'
                      }`}>
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-lg">
                            {player.username || 'Unknown Player'}
                          </span>
                          {player.userId === hostId && (
                            <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                              Host
                            </div>
                          )}
                          {player.userId === user?._id && (
                            <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                              You
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
                        ? `Need ${3 - players.length} more player${3 - players.length !== 1 ? 's' : ''} to start`
                        : canStartGame
                          ? 'All players ready! Game can start now.'
                          : `Waiting for ${players.length - readyPlayersCount} player${players.length - readyPlayersCount !== 1 ? 's' : ''} to get ready`}
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
                  style={{ 
                    width: `${players.length > 0 ? (readyPlayersCount / players.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              className="flex items-center gap-2 px-8 py-4 w-full sm:w-auto bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleLeave}
              disabled={isLeaving}
            >
              <DoorOpen className="w-5 h-5" />
              {isLeaving ? 'Leaving...' : 'Leave Room'}
            </button>

            <button
              className={`flex items-center gap-2 px-8 py-4 w-full sm:w-auto rounded-xl transition-all duration-300 hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
                isReady
                  ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 text-yellow-400 hover:text-yellow-300'
                  : 'bg-green-500/20 hover:bg-green-500/30 border border-green-400/50 text-green-400 hover:text-green-300'
              }`}
              onClick={handleReady}
              disabled={!user?._id || !roomId || gameState.phase !== 'waiting'}
            >
              <Play className="w-5 h-5" />
              {isReady ? 'Not Ready' : 'Get Ready'}
            </button>
          </div>

          {/* Minimum players warning */}
          {players.length > 0 && players.length < 3 && (
            <div className="text-center bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Minimum 3 players required to start the game</span>
              </div>
            </div>
          )}

          {/* Game phase warning */}
          {gameState.phase !== 'waiting' && (
            <div className="text-center bg-blue-500/10 border border-blue-400/30 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-2 text-blue-400">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  Game is in {gameState.phase} phase - ready status cannot be changed
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;