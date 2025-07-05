// ✅ Full fixed Game.jsx (with always-emitted timer and roles)
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

  // ⏳ Loading splash (progress bar)
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

  // 📥 Timer update listener
  useEffect(() => {
    const handleTimerUpdate = ({ timeLeft }) => {
      console.log("⏰ Timer received:", timeLeft);
      setTimeLeft(timeLeft);
    };
    socket.on("timer_update", handleTimerUpdate);
    return () => socket.off("timer_update", handleTimerUpdate);
  }, []);

  // 📥 Game phase listener
  useEffect(() => {
    const handleGamePhase = (gameRoomData) => {
      console.log("🎯 Phase:", gameRoomData.phase);
      setPhase(gameRoomData.phase);
    };
    socket.on("game_phase", handleGamePhase);
    return () => socket.off("game_phase", handleGamePhase);
  }, []);

  // 📥 update_players listener
  useEffect(() => {
    const handleUpdatePlayers = (playersFromServer) => {
      setPlayers(playersFromServer);
    };
    socket.on("update_players", handleUpdatePlayers);
    return () => socket.off("update_players", handleUpdatePlayers);
  }, []);

  // 📥 game_players listener (used to extract my role)
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

  // 📤 get_players emit (fetch current state)
  useEffect(() => {
    if (roomId) {
      socket.emit("get_players", roomId);
    }
  }, [roomId]);

  // 🎭 Role images
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

  // 🎭 Role descriptions
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

  // 💡 Splash screen loader
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <progress className="progress progress-accent w-96" value={progress} max="100" />
        <p className="mt-2 text-lg font-bold">{progress}%</p>
      </div>
    );
  }

  // 👇 return() qismi keyin yoziladi...


  return (
    <div className="flex h-screen p-3">
      <div className="w-1/4 h-full flex-1 flex flex-col">
        <DiedPeople players={players} />
      </div>

      <div className="w-2/4 h-full flex flex-col">
        <div className="h-full w-full justify-center flex-1">
          <GameChat />
        </div>
      </div>

      <div className="w-1/4 h-full flex flex-col">
        <Timer day={phase} time={timeLeft} />
        {myRole ? (
          <GameCard card={myRole} />
        ) : (
          <div className="text-center text-warning mt-5">⏳ Rolingiz yuklanmoqda...</div>
        )}
      </div>
    </div>
  );
};

export default Game;