import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GameChat from '../components/GameChat';
import GameCard from '../components/GameCard';
import DiedPeople from '../components/DiedPeople';
import Timer from '../components/Timer';
import socket from '../socket';

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
        return prev + 1;
      });
    }, 1);
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-base-200 text-base-content">
        <progress className="progress progress-warning w-72" value={progress} max="100" />
        <p className="mt-4 text-lg font-bold tracking-wider">{progress}% Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen gap-4 p-3 bg-base-100 text-base-content">
      {/* Left - Players List */}
      <div className="w-1/4 bg-base-200 border border-base-300 rounded-xl shadow-md">
        <DiedPeople players={players} myRole={myRole} />
      </div>

      {/* Center - Chat */}
      <div className="w-2/4 bg-base-200 border border-base-300 rounded-xl shadow-md">
        <GameChat />
      </div>

      {/* Right - Timer and Role Card */}
      <div className="w-1/4 flex flex-col gap-4">
        <div className="bg-base-200 border border-base-300 rounded-xl shadow-md">
          <Timer day={phase} time={timeLeft} />
        </div>
        <div className="bg-base-200 border border-base-300 rounded-xl shadow-md flex-1 overflow-hidden">
          {myRole ? (
            <GameCard card={myRole} />
          ) : (
            <div className="text-center text-warning mt-5">⏳ Rolingiz yuklanmoqda...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
