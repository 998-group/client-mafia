import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Users, MessageCircle, Clock, Shield, Sun, Moon,
  User, Skull, Crown, Eye, Heart, AlertCircle
} from 'lucide-react';
import GameChat from '../components/GameChat';
import GameCard from '../components/GameCard';
import Timer from '../components/Timer';
import socket from '../socket';
import DiedPeople from '../components/DiedPeople';

const Game = () => {
  const { roomId } = useParams();
  const myUserId = useSelector((state) => state.auth?.user?.user?._id);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [players, setPlayers] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [phase, setPhase] = useState("started");

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

  useEffect(() => {
    socket.emit('get_players', roomId);
    const handleUpdatePlayers = (playersFromServer) => {
      setPlayers(playersFromServer);
    };
    socket.on('update_players', handleUpdatePlayers);
    return () => socket.off('update_players', handleUpdatePlayers);
  }, [roomId]);

  useEffect(() => {
    const handleTimerUpdate = ({ timeLeft }) => {
      setTimeLeft(timeLeft);
    };
    socket.on("timer_update", handleTimerUpdate);
    return () => socket.off("timer_update", handleTimerUpdate);
  }, [roomId]);

  useEffect(() => {
    const handleGamePhase = (gameRoomData) => {
      setPhase(gameRoomData.phase);
    };
    socket.on("game_phase", handleGamePhase);
    return () => socket.off("game_phase", handleGamePhase);
  }, []);

  useEffect(() => {
    if (!myUserId || !roomId) return;

    socket.emit("get_my_role", { userId: myUserId, roomId });

    const handleReceiveRole = (role) => {
      setMyRole(role);
    };

    socket.on("your_role", handleReceiveRole);
    return () => socket.off("your_role", handleReceiveRole);
  }, [myUserId, roomId]);


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
          <p className="text-white">{progress}% Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex gap-4 text-white overflow-hidden">
      {/* Players List */}
      <div className="w-1/4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 overflow-auto">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-purple-400" />
          <h2 className="text-lg font-semibold">Players</h2>
        </div>
        <DiedPeople players={players} myRole={myRole} />
      </div>

      <div className="w-2/4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex flex-col">
        <GameChat />
      </div>

      <div className="w-1/4 flex flex-col gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
          <Timer day={phase} time={timeLeft} />
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex-1">
          {myRole ? (
            <GameCard card={myRole} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-yellow-400">\u23F3 Rolingiz yuklanmoqda...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
