import React, { useEffect, useState } from 'react';
import GameChat from '../components/GameChat';
import GameCard from '../components/GameCard';
import DiedPeople from '../components/DiedPeople';
import Timer from '../components/Timer';
import socket from '../socket';
import { useParams } from 'react-router-dom';

const Game = () => {
  const { roomId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState("started"); // 🆕 phase holati



  const role = {
    role: "Mafia",
    title: "Sizning rolingiz mafiya, endi siz xohlagan odamingizni o'ldira olasiz",
    img: "https://e1.pxfuel.com/desktop-wallpaper/834/909/desktop-wallpaper-3840x2160-mafia-3-logo-art-games-mafia-3.jpg",
  };

  // Loading bar effect
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

  // Get players
  useEffect(() => {
    const handleUpdatePlayers = (playersFromServer) => {
      console.log("👥 Players: ", playersFromServer);
      setPlayers(playersFromServer);
    };

    socket.emit('get_players', roomId);
    socket.on('update_players', handleUpdatePlayers);

    return () => {
      socket.off('update_players', handleUpdatePlayers);
    };
  }, [roomId]);

  // Timer updates
  useEffect(() => {
    const handleTimerUpdate = ({ timeLeft }) => {
      setTimeLeft(timeLeft);
      console.log(`⏱ Room ${roomId} - Time left: ${timeLeft} seconds`);

      if (timeLeft === 0) {
        socket.emit("game_phase", { roomId });
      }
    };

    socket.on("timer_update", handleTimerUpdate);

    return () => {
      socket.off("timer_update", handleTimerUpdate);
    };
  }, [roomId]);

  // Phase updates
  useEffect(() => {
    const handleTimerEnd = () => {
      socket.emit("game_phase", { roomId });
    };

    socket.on("timer_end", handleTimerEnd);

    return () => {
      socket.off("timer_end", handleTimerEnd);
    };
  }, [roomId]);
  useEffect(() => {
    const handleGamePhase = (gameRoomData) => {
      console.log("🌀 Phase received:", gameRoomData.phase);
      setPhase(gameRoomData.phase);

    };

    socket.on("game_phase", handleGamePhase);

    return () => {
      socket.off("game_phase", handleGamePhase);
    };
  }, []);
  useEffect(() => {
    socket.on("game_players", (gameRoom) => {
      console.log("🎭 Roles:", gameRoom.players);
      const me = gameRoom.players.find(p => p.userId === myUserId);
      if (me) {
        setMyRole(me.gameRole);
      }
    });
  }, []);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <progress className="progress progress-accent w-96" value={progress} max="100" />
        <p className="mt-2 text-lg font-bold">{progress}%</p>
      </div>
    );
  }

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
        <GameCard card={role} />
      </div>
    </div>
  );
};

export default Game;
