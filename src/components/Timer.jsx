// src/components/Timer.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Clock, Sun, Moon, AlertCircle, Skull, Play, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import socket from "../socket";

// 30s default
const PHASE_DURATION = 30_000;

const Timer = ({ roomId, day, time, isHost = false }) => {
  const user = useSelector((s) => s.auth?.user);
  const userId = user?._id || user?.user?._id;

  const [phase, setPhase] = useState(day || "waiting");
  const [connected, setConnected] = useState(socket?.connected ?? false);

  // ===== Internal timer state =====
  const [deadline, setDeadline] = useState(null);
  const rafRef = useRef(null);
  const emittedRef = useRef(false); // 0 ga tushganda emit faqat bir marta
  const [, force] = useState(0); // re-render trigger

  // --- format helpers ---
  const pad = (n) => String(n).padStart(2, "0");
  const getTimeLeftSec = useCallback(() => {
    if (!deadline) return 0;
    return Math.max(0, Math.floor((deadline - Date.now()) / 1000));
  }, [deadline]);

  // --- start/stop controls (UI dagi tugmalar uchun) ---
  const handleManualRestart = useCallback(() => {
    emittedRef.current = false;
    setDeadline(Date.now() + PHASE_DURATION);
  }, []);
  const handleStop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setDeadline(null);
    emittedRef.current = false;
  }, []);

  // --- socket connect indicator ---
  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
    };
  }, []);

  // --- initial start: hozirgi vaqtdan 30s yoki prop time ---
  useEffect(() => {
    if (typeof time === "number" && time > 0) {
      setDeadline(Date.now() + time * 1000);
      emittedRef.current = false;
    } else {
      setDeadline(Date.now() + PHASE_DURATION);
      emittedRef.current = false;
    }
  }, [time]);

  // --- agar parent phase (day) o'zgarsa, faqat label yangilaymiz ---
  useEffect(() => {
    if (!day) return;
    setPhase(day);
  }, [day]);

  // --- SOCKET: update_phase kelganda fazani yangilab, timer’ni 30s ga qayta ishga tushiramiz ---
  useEffect(() => {
    const onUpdatePhase = (payload) => {
      // payload { phase, roomId? } yoki string bo‘lishi mumkin
      const newPhase = typeof payload === "string" ? payload : payload?.phase;
      const r = typeof payload === "object" ? payload?.roomId : undefined;

      // agar server roomId yuborsa, tekshirib olaylik
      if (r && r !== roomId) return;

      if (newPhase) {
        setPhase(newPhase);
        if (newPhase === "ended") {
          // ended bo'lsa to'xtatamiz
          handleStop();
        } else {
          // har safar 30s dan qayta start
          emittedRef.current = false;
          setDeadline(Date.now() + PHASE_DURATION);
        }
      }
    };

    socket.on("update_phase", onUpdatePhase);
    return () => {
      socket.off("update_phase", onUpdatePhase);
    };
  }, [roomId, handleStop]);

  // --- rAF loop: 30s pasaytirish va 0 da emit (client_timer_end) ---
  useEffect(() => {
    if (!deadline) return;

    const tick = () => {
      const left = deadline - Date.now();
      if (left <= 0) {
        // stop loop
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;

        // emit faqat bir marta
        if (!emittedRef.current) {
          emittedRef.current = true;
          socket.emit("client_timer_end", { roomId, phase }); // <--- KERAKLI EMIT
        }
        return;
      }

      // UI ni yangilash
      force((n) => n + 1);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [deadline, roomId, phase]);

  // --- UI helpers (dizaynni saqlab qolish uchun) ---
  const phaseInfo = useMemo(() => {
    switch (phase) {
      case "waiting":
        return { icon: <Clock className="w-4 h-4" />, label: "Waiting", color: "from-gray-500 to-gray-600", bg: "bg-gray-500/20", text: "text-gray-300" };
      case "started":
        return { icon: <Play className="w-4 h-4" />, label: "Game Starting", color: "from-blue-500 to-purple-500", bg: "bg-blue-500/20", text: "text-blue-300" };
      case "night":
        return { icon: <Moon className="w-4 h-4" />, label: "Night Phase", color: "from-purple-600 to-indigo-700", bg: "bg-purple-500/20", text: "text-purple-300" };
      case "day":
        return { icon: <Sun className="w-4 h-4" />, label: "Day Phase", color: "from-yellow-400 to-orange-500", bg: "bg-yellow-500/20", text: "text-yellow-300" };
      case "ended":
        return { icon: <Skull className="w-4 h-4" />, label: "Game Over", color: "from-red-600 to-red-800", bg: "bg-red-500/20", text: "text-red-300" };
      default:
        return { icon: <AlertCircle className="w-4 h-4" />, label: "Loading...", color: "from-gray-500 to-gray-600", bg: "bg-gray-500/20", text: "text-gray-300" };
    }
  }, [phase]);

  const timeLeft = getTimeLeftSec();
  const m = pad(Math.floor(timeLeft / 60));
  const s = pad(timeLeft % 60);
  const urgency = timeLeft <= 0 ? "ended" : timeLeft <= 10 ? "critical" : timeLeft <= 30 ? "warning" : "normal";

  return (
    <div className="p-6 space-y-4">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Clock className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">
            {timeLeft > 0 ? "Time Remaining" : "Timer Inactive"}
          </h3>
          {isHost && (
            <button className="ml-2 p-1 rounded hover:bg-white/10 transition-colors" title="Timer Controls (Host)" onClick={(e)=>e.stopPropagation()}>
              <Settings className="w-4 h-4 text-yellow-400" />
            </button>
          )}
          {!connected && <AlertCircle className="w-4 h-4 text-red-400" title="Disconnected" />}
        </div>

        {/* Timer circle */}
        <div className={`relative ${urgency === "critical" ? "animate-pulse" : ""}`}>
          <div className={`w-32 h-32 mx-auto bg-gradient-to-r ${phaseInfo.color} rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20 ${urgency === "warning" ? "animate-bounce" : ""}`}>
            <span className="text-3xl font-bold text-white">{m}:{s}</span>
          </div>
          {timeLeft > 0 && <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-white/20 rounded-full animate-spin-slow"></div>}
          {urgency === "critical" && <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-red-400/50 rounded-full animate-ping"></div>}
        </div>

        {/* Phase badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${phaseInfo.bg} ${phaseInfo.text}`}>
          {phaseInfo.icon}
          <span>{phaseInfo.label}</span>
        </div>

        {/* Status text */}
        {timeLeft > 0 && (
          <div className="text-xs text-gray-400">
            {urgency === "critical" && "⚠️ Time running out!"}
            {urgency === "warning" && "⏰ Less than 30 seconds"}
            {urgency === "normal" && `⏱️ ${timeLeft} seconds remaining`}
          </div>
        )}

        {/* Host quick actions (optional) */}
        {isHost && (
          <div className="mt-4 p-3 bg-black/30 rounded-lg space-y-2">
            <div className="text-xs text-gray-400 mb-2">Host Timer Controls</div>
            <div className="flex gap-2 justify-center flex-wrap">
              <button onClick={handleManualRestart} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors">
                Restart 30s
              </button>
              <button onClick={handleStop} className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors">
                Stop
              </button>
            </div>
          </div>
        )}

        {/* Debug */}

      </div>
    </div>
  );
};

export default Timer;
