// src/pages/Game.jsx - Minimal fixes for your existing code
import React, { useEffect, useState } from 'react';
import {
  Users, MessageCircle, Clock, Shield, Sun, Moon,
  User, Skull, Crown, Eye, Heart, AlertCircle, Trophy,
  SkipForward, Square, RotateCcw, Home
} from 'lucide-react';
import { toast } from 'react-toastify';
import GameEndModal from '../components/GameEndModal';
import GameStatsModal from '../components/GetGameStats';
import socket from '../socket';
import DiedPeople from '../components/DiedPeople';
import GameChat from '../components/GameChat';
import Timer from "../components/Timer";
import GameCard from "../components/GameCard";

const Game = ({ roomId, myUserId, navigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [players, setPlayers] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [phase, setPhase] = useState("started");
  const [gameRoom, setGameRoom] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameEndData, setGameEndData] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [gameStats, setGameStats] = useState(null);

  // Loading animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // ✅ Get players and room info
  useEffect(() => {
    if (roomId && myUserId) {
      socket.emit('get_game_players', myUserId);
      socket.emit('get_game_status', { roomId, userId: myUserId });
    }
    
    const handleUpdatePlayers = (playersFromServer) => {
      console.log('👥 Players updated:', playersFromServer);
      setPlayers(playersFromServer || []);
      
      // ✅ Check if I have a role
      const myPlayer = playersFromServer?.find(p => p.userId === myUserId);
      if (myPlayer?.gameRole && !myRole) {
        setMyRole({
          role: myPlayer.gameRole,
          title: getRoleDescription(myPlayer.gameRole),
          img: getRoleImage(myPlayer.gameRole)
        });
      }
    };
    
    const handleGameStatus = (statusData) => {
      console.log('📊 Game status:', statusData);
      setGameRoom(statusData);
      setPhase(statusData.phase);
      setTimeLeft(statusData.timeLeft || 0);
      setIsHost(statusData.hostId === myUserId);
      setPlayers(statusData.players || []);
      
      if (statusData.phase === "ended") {
        setGameEnded(true);
        if (statusData.winner) {
          setGameEndData({
            winner: statusData.winner,
            players: statusData.players
          });
        }
      }
    };

    // ✅ Handle role assignment
    const handleRoleAssigned = (roleData) => {
      console.log('🎭 Role assigned:', roleData);
      setMyRole({
        role: roleData.role,
        title: roleData.title || getRoleDescription(roleData.role),
        img: getRoleImage(roleData.role)
      });
    };

    // ✅ Handle joined room
    const handleJoinedRoom = (roomData) => {
      console.log('📡 Joined room:', roomData);
      setGameRoom(roomData);
      setPlayers(roomData.players || []);
      setPhase(roomData.phase);
      setIsHost(roomData.hostId === myUserId);
    };

    socket.on('update_players', handleUpdatePlayers);
    socket.on('game_status', handleGameStatus);
    socket.on('role_assigned', handleRoleAssigned);
    socket.on('joined_room', handleJoinedRoom);
    
    return () => {
      socket.off('update_players', handleUpdatePlayers);
      socket.off('game_status', handleGameStatus);
      socket.off('role_assigned', handleRoleAssigned);
      socket.off('joined_room', handleJoinedRoom);
    };
  }, [roomId, myUserId, myRole]);

  // ✅ Timer updates
  useEffect(() => {
    const handleTimerUpdate = ({ timeLeft }) => {
      setTimeLeft(timeLeft);
    };
    
    const handleTimerStarted = ({ timeLeft, duration }) => {
      setTimeLeft(timeLeft ? Math.floor(timeLeft / 1000) : Math.floor(duration / 1000));
    };

    socket.on("timer_update", handleTimerUpdate);
    socket.on("timer_started", handleTimerStarted);
    
    return () => {
      socket.off("timer_update", handleTimerUpdate);
      socket.off("timer_started", handleTimerStarted);
    };
  }, []);

  // ✅ Phase changes
  useEffect(() => {
    const handlePhaseChanged = (data) => {
      console.log('🔄 Phase changed:', data);
      setPhase(data.newPhase || data.phase);
      if (data.players) {
        setPlayers(data.players);
      }
      toast.info(`🔄 Phase changed to ${data.newPhase || data.phase}`);
    };

    const handlePhaseTransition = (data) => {
      toast.info(data.message);
    };

    socket.on("phase_changed", handlePhaseChanged);
    socket.on("phase_transition", handlePhaseTransition);
    
    return () => {
      socket.off("phase_changed", handlePhaseChanged);
      socket.off("phase_transition", handlePhaseTransition);
    };
  }, []);

  // ✅ Game end events
  useEffect(() => {
    const handleGameEnded = (data) => {
      setGameEnded(true);
      setGameEndData(data);
      setPhase("ended");
      toast.success(data.message);
    };

    const handleNightResult = (data) => {
      switch (data.type) {
        case "kill":
          toast.error(`💀 ${data.message}`);
          break;
        case "save":
          toast.success(`🩺 ${data.message}`);
          break;
        default:
          toast.info(data.message);
      }
    };

    socket.on("game_ended", handleGameEnded);
    socket.on("night_result", handleNightResult);
    
    return () => {
      socket.off("game_ended", handleGameEnded);
      socket.off("night_result", handleNightResult);
    };
  }, []);

  // ✅ Helper functions
  const getRoleDescription = (role) => {
    const descriptions = {
      villager: "You are a VILLAGER. Find and eliminate all mafia members.",
      mafia: "You are a MAFIA member. Kill villagers at night and blend in during the day.",
      doctor: "You are the DOCTOR. Heal players at night to save them from attacks.",
      detective: "You are the DETECTIVE. Investigate players at night to discover their roles."
    };
    return descriptions[role] || "Unknown role";
  };

  const getRoleImage = (role) => {
    const images = {
      villager: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      mafia: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png",
      doctor: "https://cdn-icons-png.flaticon.com/512/2785/2785482.png",
      detective: "https://cdn-icons-png.flaticon.com/512/3110/3110270.png"
    };
    return images[role] || "https://cdn-icons-png.flaticon.com/512/565/565547.png";
  };

  const handleSkipPhase = () => {
    socket.emit('skip_phase', { roomId });
  };

  const handleForceEnd = () => {
    socket.emit('force_end_game', { roomId });
  };

  const handleShowStats = () => {
    if (gameEndData) {
      setGameStats(gameEndData);
      setShowStats(true);
    }
  };

  const handleRestart = () => {
    socket.emit('restart_game', { roomId, hostId: myUserId });
  };

  const handleLeaveGame = () => {
    socket.emit('leave_room', { roomId, userId: myUserId });
    if (navigate) {
      navigate('/games');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-10 h-10 text-purple-400 animate-pulse" />
            <h1 className="text-3xl font-bold text-white">Mafia Game</h1>
          </div>
          <div className="w-80 h-4 bg-white/10 rounded-full overflow-hidden border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white">{progress}% Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex gap-4 text-white overflow-hidden">
      {/* Players List */}
      <div className="w-1/4 h-full flex flex-col">
        <DiedPeople
          players={players} 
          myRole={myRole} 
          gamePhase={phase}
          roomId={roomId}
        />
      </div>

      {/* Chat */}
      <div className="w-2/4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex flex-col">
        <GameChat roomId={roomId} />
      </div>

      {/* Right Panel */}
      <div className="w-1/4 flex flex-col gap-4">
        {/* Timer and Controls */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
          <Timer day={phase} time={timeLeft} />
          
          {/* Host Controls */}
          {isHost && phase !== "ended" && phase !== "waiting" && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold text-white/80 mb-2">Host Controls:</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleSkipPhase}
                  className="btn btn-xs btn-outline btn-warning"
                  title="Skip Phase"
                >
                  <SkipForward className="w-3 h-3" />
                </button>
                <button
                  onClick={handleForceEnd}
                  className="btn btn-xs btn-outline btn-error"
                  title="End Game"
                >
                  <Square className="w-3 h-3" />
                </button>
                <button
                  onClick={handleShowStats}
                  className="btn btn-xs btn-outline btn-info"
                  title="Show Stats"
                >
                  <Trophy className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Game End Controls */}
          {gameEnded && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold text-white/80 mb-2">Game Ended:</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleShowStats}
                  className="btn btn-xs btn-outline btn-info"
                >
                  <Trophy className="w-3 h-3" />
                  Stats
                </button>
                {isHost && (
                  <button
                    onClick={handleRestart}
                    className="btn btn-xs btn-outline btn-success"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restart
                  </button>
                )}
              </div>
              <button
                onClick={handleLeaveGame}
                className="btn btn-xs btn-outline btn-secondary w-full"
              >
                <Home className="w-3 h-3" />
                Leave
              </button>
            </div>
          )}
        </div>

        {/* Role Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex-1">
          <GameCard card={myRole} />
        </div>
      </div>

      {/* Game End Modal */}
      {gameEnded && gameEndData && (
        <GameEndModal
          isOpen={gameEnded}
          gameData={gameEndData}
          onClose={() => setGameEnded(false)}
          onRestart={isHost ? handleRestart : null}
          onLeave={handleLeaveGame}
          onShowStats={handleShowStats}
        />
      )}

      {/* Game Stats Modal */}
      {showStats && gameStats && (
        <GameStatsModal
          isOpen={showStats}
          gameStats={gameStats}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
};

export default Game;