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
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState("started");
  const [myRole, setMyRole] = useState(null);

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
    if (!myUserId) return;
    const handleGamePlayers = (gameRoom) => {
      const me = gameRoom.players.find(
        (p) => p.userId?.toString() === myUserId?.toString()
      );
      if (!me || !me.gameRole) return;

      const roleData = {
        role: me.gameRole,
        img: getRoleImage(me.gameRole),
        title: getRoleTitle(me.gameRole),
      };
      setMyRole(roleData);
    };
    socket.on("game_players", handleGamePlayers);
    return () => socket.off("game_players", handleGamePlayers);
  }, [myUserId]);

  const getRoleImage = (role) => {
    switch (role) {
      case "mafia":
        return "https://e1.pxfuel.com/desktop-wallpaper/834/909/desktop-wallpaper-3840x2160-mafia-3-logo-art-games-mafia-3.jpg";
      case "doctor":
        return "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
      case "detective":
        return "https://cdn-icons-png.flaticon.com/512/3480/3480795.png";
      case "peaceful":
        return "https://cdn-icons-png.flaticon.com/512/1053/1053244.png";
      default:
        return "https://cdn-icons-png.flaticon.com/512/565/565547.png";
    }
  };

  const getRoleTitle = (role) => {
    switch (role) {
      case "mafia":
        return "Siz mafiya roligidasiz. Tunda biror odamni o‘ldira olasiz.";
      case "doctor":
        return "Siz doctor roligidasiz. Har tunda bir odamni davolay olasiz.";
      case "detective":
        return "Siz detective roligidasiz. Kim mafiya ekanini aniqlay olasiz.";
      case "peaceful":
        return "Siz oddiy fuqaro. Faqat ovoz berishda qatnashasiz.";
      default:
        return "Rol aniqlanmadi.";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "mafia": return <Skull className="w-4 h-4" />;
      case "doctor": return <Heart className="w-4 h-4" />;
      case "detective": return <Eye className="w-4 h-4" />;
      case "peaceful": return <User className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "mafia": return "text-red-400 border-red-500/30";
      case "doctor": return "text-green-400 border-green-500/30";
      case "detective": return "text-blue-400 border-blue-500/30";
      case "peaceful": return "text-gray-400 border-gray-500/30";
      default: return "text-gray-400 border-gray-500/30";
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
          <p className="text-white">{progress}% Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex gap-4 text-white overflow-hidden">
      {/* Players List */}
      <div className="w-1/4 h-full flex flex-col">
        <DiedPeople players={players} myRole={myRole} />
      </div>

      {/* Game Chat */}
      <div className="w-2/4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex flex-col">
        <GameChat />
      </div>

      {/* Right - Timer & Role Card */}
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
