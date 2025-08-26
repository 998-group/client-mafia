// src/components/Timer.jsx - ENHANCED WITH FULL TIMER INTEGRATION
import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, AlertCircle, Skull, Play, Pause } from 'lucide-react';
import socket from '../socket';

const Timer = ({ roomId, day, time, isHost = false }) => {
  const [currentTime, setCurrentTime] = useState(time || 0);
  const [currentPhase, setCurrentPhase] = useState(day || "waiting");
  const [isActive, setIsActive] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  // Update time from props
  useEffect(() => {
    if (typeof time === 'number') {
      setCurrentTime(time);
      setIsActive(time > 0);
    }
  }, [time]);

  // Update phase from props
  useEffect(() => {
    if (day) {
      setCurrentPhase(day);
    }
  }, [day]);

  // Socket event listeners for timer updates
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleTimerUpdate = ({ timeLeft, phase }) => {
      console.log(`⏰ Timer update: ${timeLeft}s, phase: ${phase}`);
      setCurrentTime(timeLeft);
      if (phase) setCurrentPhase(phase);
      setIsActive(timeLeft > 0);
    };

    const handleTimerEnd = () => {
      console.log(`⏰ Timer ended for room ${roomId}`);
      setCurrentTime(0);
      setIsActive(false);
    };

    const handleTimerStarted = ({ roomId: timerRoomId, duration }) => {
      if (timerRoomId === roomId) {
        console.log(`⏰ Timer started: ${duration}s`);
        setCurrentTime(duration);
        setIsActive(true);
      }
    };

    const handleTimerCleared = ({ roomId: clearedRoomId }) => {
      if (clearedRoomId === roomId) {
        console.log(`⏰ Timer cleared for room ${roomId}`);
        setCurrentTime(0);
        setIsActive(false);
      }
    };

    const handleGamePhase = ({ phase, roomId: phaseRoomId }) => {
      if (!phaseRoomId || phaseRoomId === roomId) {
        console.log(`🎮 Phase changed: ${phase}`);
        setCurrentPhase(phase);
      }
    };

    // Register event listeners
    socket.on("timer_update", handleTimerUpdate);
    socket.on("timer_end", handleTimerEnd);
    socket.on("timer_started", handleTimerStarted);
    socket.on("timer_cleared", handleTimerCleared);
    socket.on("game_phase", handleGamePhase);

    // Request current timer status
    socket.emit("get_timer_status", { roomId });

    // Cleanup
    return () => {
      socket.off("timer_update", handleTimerUpdate);
      socket.off("timer_end", handleTimerEnd);
      socket.off("timer_started", handleTimerStarted);
      socket.off("timer_cleared", handleTimerCleared);
      socket.off("game_phase", handleGamePhase);
    };
  }, [roomId]);

  // Format countdown display
  const formatCountdown = (totalSeconds) => {
    if (totalSeconds <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatCountdown(currentTime);

  // Get phase display information
  const getPhaseInfo = () => {
    switch (currentPhase) {
      case "waiting":
        return { 
          icon: <Clock className="w-4 h-4" />, 
          label: "Waiting for Players", 
          color: "from-gray-500 to-gray-600",
          bgColor: "bg-gray-500/20",
          textColor: "text-gray-300"
        };
      case "started":
        return { 
          icon: <Play className="w-4 h-4" />, 
          label: "Game Starting", 
          color: "from-blue-500 to-purple-500",
          bgColor: "bg-blue-500/20",
          textColor: "text-blue-300"
        };
      case "night":
        return { 
          icon: <Moon className="w-4 h-4" />, 
          label: "Night Phase", 
          color: "from-purple-600 to-indigo-700",
          bgColor: "bg-purple-500/20",
          textColor: "text-purple-300"
        };
      case "day":
        return { 
          icon: <Sun className="w-4 h-4" />, 
          label: "Day Phase", 
          color: "from-yellow-400 to-orange-500",
          bgColor: "bg-yellow-500/20",
          textColor: "text-yellow-300"
        };
      case "ended":
        return { 
          icon: <Skull className="w-4 h-4" />, 
          label: "Game Over", 
          color: "from-red-600 to-red-800",
          bgColor: "bg-red-500/20",
          textColor: "text-red-300"
        };
      default:
        return { 
          icon: <AlertCircle className="w-4 h-4" />, 
          label: "Loading...", 
          color: "from-gray-500 to-gray-600",
          bgColor: "bg-gray-500/20",
          textColor: "text-gray-300"
        };
    }
  };

  const phaseInfo = getPhaseInfo();

  // Timer control functions (host only)
  const handleStartTimer = (duration = 60) => {
    if (!isHost || !roomId) return;
    
    console.log(`⏰ Host starting timer: ${duration}s`);
    socket.emit("start_timer", { 
      roomId, 
      duration, 
      hostId: socket.userId // Assume this is set when user connects
    });
  };

  const handleClearTimer = () => {
    if (!isHost || !roomId) return;
    
    console.log(`⏰ Host clearing timer`);
    socket.emit("clear_timer", { roomId });
  };

  // Get urgency level for styling
  const getUrgencyLevel = () => {
    if (currentTime <= 0) return 'ended';
    if (currentTime <= 10) return 'critical';
    if (currentTime <= 30) return 'warning';
    return 'normal';
  };

  const urgency = getUrgencyLevel();

  // Timer display component
  const TimerDisplay = () => {
    const displayTime = currentTime > 0 ? 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` :
      "00:00";

    const pulseClass = urgency === 'critical' ? 'animate-pulse' : '';
    const scaleClass = urgency === 'warning' ? 'animate-bounce' : '';

    return (
      <div className={`relative ${pulseClass}`}>
        <div className={`w-32 h-32 mx-auto bg-gradient-to-r ${phaseInfo.color} rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20 ${scaleClass}`}>
          <span className="text-3xl font-bold text-white">
            {displayTime}
          </span>
        </div>
        {isActive && (
          <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-white/20 rounded-full animate-spin-slow"></div>
        )}
        {urgency === 'critical' && (
          <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-red-400/50 rounded-full animate-ping"></div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-4">
      <div className="text-center space-y-4">
        {/* Header */}
        <div className="flex items-center justify-center gap-3">
          <Clock className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">
            {isActive ? "Time Remaining" : "Timer Inactive"}
          </h3>
          {isHost && (
            <button
              onClick={() => setShowControls(!showControls)}
              className="ml-2 p-1 rounded hover:bg-white/10 transition-colors"
              title="Timer Controls (Host)"
            >
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            </button>
          )}
        </div>

        {/* Timer Display */}
        <TimerDisplay />

        {/* Phase Indicator */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${phaseInfo.bgColor} ${phaseInfo.textColor}`}>
          {phaseInfo.icon}
          <span>{phaseInfo.label}</span>
        </div>

        {/* Timer Status */}
        {currentTime > 0 && (
          <div className="text-xs text-gray-400">
            {urgency === 'critical' && "⚠️ Time running out!"}
            {urgency === 'warning' && "⏰ Less than 30 seconds"}
            {urgency === 'normal' && `⏱️ ${currentTime} seconds remaining`}
          </div>
        )}

        {/* Host Controls */}
        {isHost && showControls && (
          <div className="mt-4 p-3 bg-black/30 rounded-lg space-y-2">
            <div className="text-xs text-gray-400 mb-2">Host Controls</div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => handleStartTimer(30)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                disabled={isActive}
              >
                30s
              </button>
              <button
                onClick={() => handleStartTimer(60)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                disabled={isActive}
              >
                1min
              </button>
              <button
                onClick={() => handleStartTimer(180)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                disabled={isActive}
              >
                3min
              </button>
              <button
                onClick={handleClearTimer}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                disabled={!isActive}
              >
                Stop
              </button>
            </div>
          </div>
        )}

        {/* Debug Info (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-black/20 rounded text-xs text-gray-500">
            <div>Room: {roomId}</div>
            <div>Phase: {currentPhase}</div>
            <div>Time: {currentTime}s</div>
            <div>Active: {isActive ? 'Yes' : 'No'}</div>
            <div>Host: {isHost ? 'Yes' : 'No'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;