// 🚨 FIXED Timer Component with Proper Socket Integration
// src/components/Timer.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Sun, Moon, AlertCircle, Skull, Play, Pause, Settings } from 'lucide-react';
import { useSelector } from 'react-redux';
import socket from '../socket';

const Timer = ({ roomId, day, time, isHost = false }) => {
  const [currentTime, setCurrentTime] = useState(time || 0);
  const [currentPhase, setCurrentPhase] = useState(day || "waiting");
  const [isActive, setIsActive] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Get user info from Redux
  const user = useSelector((state) => state.auth?.user);
  const userId = user?._id || user?.user?._id;

  // Track socket connection status
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(socket?.connected || false);
    };

    checkConnection();
    
    if (socket) {
      socket.on('connect', checkConnection);
      socket.on('disconnect', checkConnection);
    }

    return () => {
      if (socket) {
        socket.off('connect', checkConnection);
        socket.off('disconnect', checkConnection);
      }
    };
  }, []);

  // Update time from props
  useEffect(() => {
    if (typeof time === 'number' && time !== currentTime) {
      console.log(`⏰ Timer props updated: ${time}s`);
      setCurrentTime(time);
      setIsActive(time > 0);
    }
  }, [time, currentTime]);

  // Update phase from props
  useEffect(() => {
    if (day && day !== currentPhase) {
      console.log(`🎮 Phase props updated: ${day}`);
      setCurrentPhase(day);
    }
  }, [day, currentPhase]);

  // Socket event handlers
  const handleTimerUpdate = useCallback(({ timeLeft, phase, roomId: updateRoomId }) => {
    // Only update if it's for our room
    if (updateRoomId && updateRoomId !== roomId) {
      return;
    }
    
    console.log(`⏰ Timer update received: ${timeLeft}s, phase: ${phase}`);
    setCurrentTime(timeLeft);
    if (phase) setCurrentPhase(phase);
    setIsActive(timeLeft > 0);
  }, [roomId]);

  const handleTimerEnd = useCallback(({ roomId: endRoomId }) => {
    if (endRoomId && endRoomId !== roomId) {
      return;
    }
    
    console.log(`⏰ Timer ended for room ${roomId}`);
    setCurrentTime(0);
    setIsActive(false);
  }, [roomId]);

  const handleTimerStarted = useCallback(({ roomId: timerRoomId, duration }) => {
    if (timerRoomId !== roomId) {
      return;
    }
    
    console.log(`⏰ Timer started: ${duration}s`);
    setCurrentTime(duration);
    setIsActive(true);
  }, [roomId]);

  const handleTimerCleared = useCallback(({ roomId: clearedRoomId }) => {
    if (clearedRoomId !== roomId) {
      return;
    }
    
    console.log(`⏰ Timer cleared for room ${roomId}`);
    setCurrentTime(0);
    setIsActive(false);
  }, [roomId]);

  const handleTimerStatus = useCallback(({ roomId: statusRoomId, timeLeft, hasTimer }) => {
    if (statusRoomId !== roomId) {
      return;
    }
    
    console.log(`🔍 Timer status received: ${timeLeft}s, hasTimer: ${hasTimer}`);
    if (hasTimer && timeLeft !== null) {
      setCurrentTime(timeLeft);
      setIsActive(timeLeft > 0);
    } else {
      setCurrentTime(0);
      setIsActive(false);
    }
  }, [roomId]);

  const handleGamePhase = useCallback(({ phase, roomId: phaseRoomId }) => {
    if (phaseRoomId && phaseRoomId !== roomId) {
      return;
    }
    
    console.log(`🎮 Phase changed: ${phase}`);
    setCurrentPhase(phase);
  }, [roomId]);

  const handleError = useCallback((error) => {
    console.error(`❌ Timer error:`, error);
    // You might want to show a toast notification here
  }, []);

  // Socket event listeners setup
  useEffect(() => {
    if (!socket || !roomId || !isConnected) {
      console.log(`⚠️ Timer setup skipped: socket=${!!socket}, roomId=${roomId}, connected=${isConnected}`);
      return;
    }

    console.log(`🔌 Setting up timer socket listeners for room ${roomId}`);

    // Register event listeners with proper callbacks
    socket.on("timer_update", handleTimerUpdate);
    socket.on("timer_end", handleTimerEnd);
    socket.on("timer_started", handleTimerStarted);
    socket.on("timer_cleared", handleTimerCleared);
    socket.on("timer_status", handleTimerStatus);
    socket.on("game_phase", handleGamePhase);
    socket.on("error", handleError);

    // Request current timer status
    console.log(`🔍 Requesting timer status for room ${roomId}`);
    socket.emit("get_timer_status", { roomId });

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up timer listeners for room ${roomId}`);
      socket.off("timer_update", handleTimerUpdate);
      socket.off("timer_end", handleTimerEnd);
      socket.off("timer_started", handleTimerStarted);
      socket.off("timer_cleared", handleTimerCleared);
      socket.off("timer_status", handleTimerStatus);
      socket.off("game_phase", handleGamePhase);
      socket.off("error", handleError);
    };
  }, [
    roomId, 
    isConnected,
    handleTimerUpdate,
    handleTimerEnd,
    handleTimerStarted,
    handleTimerCleared,
    handleTimerStatus,
    handleGamePhase,
    handleError
  ]);

  // Format countdown display
  const formatCountdown = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatCountdown(time);

  const getPhaseLabel = () => {
    switch (day) {
      case "day": return { icon: <Sun className="w-4 h-4" />, label: "Day Phase" };
      case "night": return { icon: <Moon className="w-4 h-4" />, label: "Night Phase" };
      case "ended": return { icon: <Skull className="w-4 h-4" />, label: "Game Over" };
      case "started": return { icon: <Clock className="w-4 h-4" />, label: "Game Starting" };
      default: return { icon: <AlertCircle className="w-4 h-4" />, label: "Loading..." };
    }
  };

  const phaseInfo = getPhaseInfo();

  // Timer control functions (host only)
  const handleStartTimer = (duration = 60) => {
    if (!isHost || !roomId || !userId || !isConnected) {
      console.warn(`❌ Cannot start timer: isHost=${isHost}, roomId=${roomId}, userId=${userId}, connected=${isConnected}`);
      return;
    }
    
    console.log(`⏰ Host starting timer: ${duration}s for room ${roomId}`);
    socket.emit("start_timer", { 
      roomId, 
      duration, 
      hostId: userId // ✅ Fixed: Use proper userId from Redux
    });
  };

  const handleClearTimer = () => {
    if (!isHost || !roomId || !userId || !isConnected) {
      console.warn(`❌ Cannot clear timer: isHost=${isHost}, roomId=${roomId}, userId=${userId}, connected=${isConnected}`);
      return;
    }
    
    console.log(`⏰ Host clearing timer for room ${roomId}`);
    socket.emit("clear_timer", { roomId, adminId: userId });
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
              <Settings className="w-4 h-4 text-yellow-400" />
            </button>
          )}
          {!isConnected && (
            <AlertCircle className="w-4 h-4 text-red-400" title="Disconnected" />
          )}
        </div>

        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-2xl font-bold text-white">
              {hours.toString().padStart(2, '0')}:
              {minutes.toString().padStart(2, '0')}:
              {seconds.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-white/20 rounded-full animate-pulse"></div>
        </div>

        {/* Timer Status */}
        {currentTime > 0 && (
          <div className="text-xs text-gray-400">
            {urgency === 'critical' && "⚠️ Time running out!"}
            {urgency === 'warning' && "⏰ Less than 30 seconds"}
            {urgency === 'normal' && `⏱️ ${currentTime} seconds remaining`}
          </div>
        )}

        {/* Connection Status */}
        {!isConnected && (
          <div className="text-xs text-red-400">
            🔌 Disconnected - Timer may not be accurate
          </div>
        )}

        {/* Host Controls */}
        {isHost && showControls && (
          <div className="mt-4 p-3 bg-black/30 rounded-lg space-y-2">
            <div className="text-xs text-gray-400 mb-2">Host Timer Controls</div>
            <div className="flex gap-2 justify-center flex-wrap">
              <button
                onClick={() => handleStartTimer(30)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-xs transition-colors"
                disabled={isActive || !isConnected}
                title={!isConnected ? "Disconnected" : isActive ? "Timer already running" : "Start 30 second timer"}
              >
                30s
              </button>
              <button
                onClick={() => handleStartTimer(60)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-xs transition-colors"
                disabled={isActive || !isConnected}
                title={!isConnected ? "Disconnected" : isActive ? "Timer already running" : "Start 1 minute timer"}
              >
                1min
              </button>
              <button
                onClick={() => handleStartTimer(180)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-xs transition-colors"
                disabled={isActive || !isConnected}
                title={!isConnected ? "Disconnected" : isActive ? "Timer already running" : "Start 3 minute timer"}
              >
                3min
              </button>
              <button
                onClick={handleClearTimer}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded text-xs transition-colors"
                disabled={!isActive || !isConnected}
                title={!isConnected ? "Disconnected" : !isActive ? "No timer running" : "Stop timer"}
              >
                Stop
              </button>
            </div>
            {!isConnected && (
              <div className="text-xs text-red-400 mt-2">
                ⚠️ Cannot control timer while disconnected
              </div>
            )}
          </div>
        )}

        {/* Debug Info (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-black/20 rounded text-xs text-gray-500 space-y-1">
            <div>Room: {roomId}</div>
            <div>Phase: {currentPhase}</div>
            <div>Time: {currentTime}s</div>
            <div>Active: {isActive ? 'Yes' : 'No'}</div>
            <div>Host: {isHost ? 'Yes' : 'No'}</div>
            <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
            <div>UserId: {userId || 'Not available'}</div>
            <button
              onClick={() => socket?.emit("get_timer_status", { roomId })}
              className="mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs"
              disabled={!isConnected}
            >
              Refresh Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;