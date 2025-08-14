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

  // Get players and room info
  useEffect(() => {
    socket.emit('get_players', roomId);
    socket.emit('get_game_status', { roomId });
    
    const handleUpdatePlayers = (playersFromServer) => {
      setPlayers(playersFromServer);
    };
    
    const handleGameStatus = (statusData) => {
      setGameRoom(statusData);
      setPhase(statusData.phase);
      setTimeLeft(statusData.timeLeft || 0);
      setIsHost(statusData.hostId === myUserId);
      
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

    socket.on('update_players', handleUpdatePlayers);
    socket.on('game_status', handleGameStatus);
    
    return () => {
      socket.off('update_players', handleUpdatePlayers);
      socket.off('game_status', handleGameStatus);
    };
  }, [roomId, myUserId]);

  // Timer updates
  useEffect(() => {
    const handleTimerUpdate = ({ timeLeft }) => {
      setTimeLeft(timeLeft);
    };
    socket.on("timer_update", handleTimerUpdate);
    return () => socket.off("timer_update", handleTimerUpdate);
  }, []);

  // Phase changes
  useEffect(() => {
    const handlePhaseChanged = (data) => {
      setPhase(data.phase);
      toast.info(`🔄 Phase changed to ${data.phase}`);
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

  // Game end events
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
        case "nokill":
          toast.info(`🌙 ${data.message}`);
          break;
      }
    };

    const handleVotingResult = (data) => {
      switch (data.type) {
        case "lynch":
          toast.error(`⚰️ ${data.message}`);
          break;
        case "tie":
          toast.warning(`🤝 ${data.message}`);
          break;
        case "novotes":
          toast.info(`🗳️ ${data.message}`);
          break;
      }
    };

    const handleRestartOption = (data) => {
      toast.info(data.message);
    };

    const handleGameRestarted = (data) => {
      setGameEnded(false);
      setGameEndData(null);
      setPhase("waiting");
      toast.success(data.message);
    };

    socket.on("game_ended", handleGameEnded);
    socket.on("night_result", handleNightResult);
    socket.on("voting_result", handleVotingResult);
    socket.on("restart_option", handleRestartOption);
    socket.on("game_restarted", handleGameRestarted);

    return () => {
      socket.off("game_ended", handleGameEnded);
      socket.off("night_result", handleNightResult);
      socket.off("voting_result", handleVotingResult);
      socket.off("restart_option", handleRestartOption);
      socket.off("game_restarted", handleGameRestarted);
    };
  }, []);

  // Get role
  useEffect(() => {
    if (!myUserId || !roomId) return;

    socket.emit("get_my_role", { userId: myUserId, roomId });

    const handleReceiveRole = (role) => {
      setMyRole(role);
    };

    socket.on("your_role", handleReceiveRole);
    return () => socket.off("your_role", handleReceiveRole);
  }, [myUserId, roomId]);

  // Host controls
  const handleSkipPhase = () => {
    socket.emit("skip_phase", { roomId, hostId: myUserId });
    toast.info("⏭️ Skipping phase...");
  };

  const handleForceEnd = () => {
    if (window.confirm("Are you sure you want to end the game?")) {
      socket.emit("force_game_end", { roomId, hostId: myUserId });
      toast.warning("🛑 Ending game...");
    }
  };

  const handleRestart = () => {
    if (window.confirm("Are you sure you want to restart the game?")) {
      socket.emit("restart_game", { roomId, hostId: myUserId });
      toast.info("🔄 Restarting game...");
    }
  };

  const handleShowStats = () => {
    socket.emit("get_game_stats", { roomId });
    
    const handleStatsReceived = (stats) => {
      setGameStats(stats);
      setShowStats(true);
    };

    socket.on("game_statistics", handleStatsReceived);
    
    // Cleanup listener after receiving stats
    setTimeout(() => {
      socket.off("game_statistics", handleStatsReceived);
    }, 5000);
  };

  const handleLeaveGame = () => {
    if (window.confirm("Are you sure you want to leave the game?")) {
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
          {myRole ? (
            <GameCard 
              card={myRole} 
              roomId={roomId} 
              userId={myUserId} 
              phase={phase}
              socket={socket}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-yellow-400">⏳ Loading your role...</p>
            </div>
          )}
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