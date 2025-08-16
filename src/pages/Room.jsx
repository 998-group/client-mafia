// src/pages/Room.jsx - Complete fix based on your GitHub structure

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
    error: null,
    roomName: '',
    currentTurn: 1
  });
  const [isLeaving, setIsLeaving] = useState(false);
  const [hostId, setHostId] = useState(null);

  // Validation checks
  useEffect(() => {
    if (!user?._id) {
      toast.error('User not authenticated');
      navigate('/login');
      return;
    }

    if (!roomId || roomId === 'undefined') {
      toast.error('Invalid room ID');
      navigate('/');
      return;
    }
  }, [user, roomId, navigate]);

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
    console.log('🔄 Players updated:', newPlayers);
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
    setGameState(prev => ({ ...prev, phase: 'started' }));
    navigate(`/room/${roomId}/playing`);
  }, [navigate, roomId]);

  const handleGamePhase = useCallback((gameData) => {
    console.log('🎮 Game phase updated:', gameData);
    if (gameData?.phase) {
      setGameState(prev => ({ 
        ...prev, 
        phase: gameData.phase,
        loading: false,
        currentTurn: gameData.currentTurn || prev.currentTurn,
        roomName: gameData.roomName || prev.roomName
      }));
      
      if (gameData.hostId) {
        setHostId(gameData.hostId);
      }

      if (gameData.players && Array.isArray(gameData.players)) {
        setPlayers(gameData.players);
      }
    }
  }, []);

  const handleJoinedRoom = useCallback((roomData) => {
    console.log('✅ Successfully joined room:', roomData);
    if (roomData) {
      setGameState(prev => ({ 
        ...prev, 
        phase: roomData.phase || 'waiting',
        loading: false,
        error: null,
        roomName: roomData.roomName || '',
        currentTurn: roomData.currentTurn || 1
      }));
      
      if (roomData.hostId) {
        setHostId(roomData.hostId);
      }
      
      if (roomData.players && Array.isArray(roomData.players)) {
        setPlayers(roomData.players);
        // Update current user's ready status
        const currentPlayer = roomData.players.find(p => p.userId === user?._id);
        if (currentPlayer) {
          setIsReady(currentPlayer.isReady);
        }
      }
    }
  }, [user?._id]);

  const handleNewHost = useCallback((data) => {
    console.log('👑 New host assigned:', data);
    if (data?.newHostId) {
      setHostId(data.newHostId);
      if (data.newHostId === user?._id) {
        toast.info('You are now the host!');
      } else if (data.newHostUsername) {
        toast.info(`${data.newHostUsername} is now the host`);
      }
    }
  }, [user?._id]);

  const handleRoomClosed = useCallback(() => {
    toast.warning('Room has been closed');
    navigate('/');
  }, [navigate]);

  const handleSocketError = useCallback((error) => {
    console.error('❌ Socket error:', error);
    const errorMessage = error?.message || 'An error occurred';
    
    // Don't show loading errors if we already have data
    if (errorMessage.includes('timeout') && players.length > 0) {
      return;
    }
    
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
  }, [navigate, players.length]);

  const handleNotification = useCallback((notification) => {
    if (notification?.type && notification?.message) {
      toast[notification.type](notification.message);
    }
  }, []);

  // Socket connection effect
  useEffect(() => {
    if (!user?._id || !roomId) return;

    console.log('🚪 Attempting to join room:', roomId, 'with user:', user.username);

    // Set up socket listeners
    socket.on('update_players', handleUpdatePlayers);
    socket.on('start_game', handleStartGame);
    socket.on('game_phase', handleGamePhase);
    socket.on('joined_room', handleJoinedRoom);
    socket.on('new_host', handleNewHost);
    socket.on('room_closed', handleRoomClosed);
    socket.on('error', handleSocketError);
    socket.on('notification', handleNotification);

    // Join room
    setGameState(prev => ({ ...prev, loading: true, error: null }));
    
    socket.emit('join_room', {
      roomId: roomId,
      userId: user._id,
      username: user.username,
    });

    // Set up join timeout
    const joinTimeout = setTimeout(() => {
      if (gameState.loading) {
        setGameState(prev => ({ 
          ...prev, 
          error: 'Failed to join room - connection timeout',
          loading: false 
        }));
      }
    }, 10000); // 10 second timeout

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
  }, [user, roomId]); // Remove other dependencies to prevent loops

  // Action handlers
  const toggleReady = () => {
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
    
    // Navigate after a short delay
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  // Computed values
  const currentPlayer = players.find(p => p?.userId === user?._id);
  const isHost = hostId === user?._id;
  const readyPlayersCount = players.filter(p => p?.isReady).length;
  const canStartGame = players.length >= 3 && readyPlayersCount === players.length && gameState.phase === 'waiting';

  // Redirect to game if phase changed
  useEffect(() => {
    if (gameState.phase === 'started' || gameState.phase === 'night' || gameState.phase === 'day') {
      navigate(`/room/${roomId}/playing`);
    }
  }, [gameState.phase, roomId, navigate]);

  // Loading state
  if (gameState.loading && players.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Joining room...</p>
          <p className="text-gray-400 text-sm mt-2">Room ID: {roomId}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (gameState.error && players.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Room Error</h2>
          <p className="text-red-400 mb-2">{gameState.error}</p>
          <p className="text-gray-400 text-sm mb-4">Room ID: {roomId}</p>
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
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {gameState.roomName || 'Game Room'}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-400">Room ID: {roomId}</p>
                    <button
                      onClick={copyRoomId}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="Copy Room ID"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{players.length}/10</div>
                  <div className="text-xs text-gray-400">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{readyPlayersCount}</div>
                  <div className="text-xs text-gray-400">Ready</div>
                </div>
                <button
                  onClick={handleLeave}
                  disabled={isLeaving}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <DoorOpen className="w-4 h-4" />
                  <span>{isLeaving ? 'Leaving...' : 'Leave'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Game Status</h3>
                  <p className="text-gray-400 capitalize">
                    {gameState.phase === 'waiting' ? 'Waiting for players' : 
                     gameState.phase === 'started' ? 'Game started' : 
                     `Phase: ${gameState.phase}`}
                  </p>
                </div>
              </div>
              
              {gameState.phase === 'waiting' && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleReady}
                    className={`px-6 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                      isReady 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>{isReady ? '✓ Ready' : 'Not Ready'}</span>
                  </button>
                  
                  {isHost && canStartGame && (
                    <button
                      onClick={() => toast.info('All players must be ready to start the game')}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Game</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Ready status indicator */}
            {gameState.phase === 'waiting' && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <p className="text-sm text-gray-400">
                  {players.length < 3 ? 
                    `Need ${3 - players.length} more players to start` :
                    readyPlayersCount === players.length ?
                      'All players ready! Game can start.' :
                      `${players.length - readyPlayersCount} players not ready`
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Players List */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Players ({players.length})
            </h3>
            
            {players.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No players found</p>
                <p className="text-gray-500 text-sm mt-2">Waiting for players to join...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {players.map((player, index) => {
                  const isPlayerHost = hostId === player.userId;
                  const isCurrentUser = user?._id === player.userId;
                  
                  return (
                    <div
                      key={player.userId || index}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isCurrentUser 
                          ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-400' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center relative ${
                            isPlayerHost ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-gray-600 to-gray-700'
                          }`}>
                            {isPlayerHost ? (
                              <Crown className="w-6 h-6 text-white" />
                            ) : (
                              <User className="w-6 h-6 text-white" />
                            )}
                            {player.isAlive && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-white flex items-center space-x-2">
                              <span>{player.username || 'Unknown Player'}</span>
                              {isCurrentUser && (
                                <span className="text-xs bg-purple-600 px-2 py-1 rounded-full">You</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-400">
                              {isPlayerHost ? '👑 Host' : '🎮 Player'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-1">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            player.isReady 
                              ? 'bg-green-600/20 text-green-400 border border-green-400/30' 
                              : 'bg-yellow-600/20 text-yellow-400 border border-yellow-400/30'
                          }`}>
                            {player.isReady ? '✓ Ready' : '⏳ Not Ready'}
                          </div>
                          {player.isAlive !== undefined && (
                            <div className={`px-2 py-1 rounded-full text-xs ${
                              player.isAlive 
                                ? 'bg-green-600/20 text-green-400' 
                                : 'bg-red-600/20 text-red-400'
                            }`}>
                              {player.isAlive ? '💚 Alive' : '💀 Dead'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;