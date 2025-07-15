import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import socket from "../socket";
import GameChat from "../components/GameChat";
import GameCard from "../components/GameCard";
import DiedPeople from "../components/DiedPeople";
import Timer from "../components/Timer";

const Game = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const myUserId = useSelector(s => s.auth?.user?.user?._id);

  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState("waiting");
  const [myRole, setMyRole] = useState(null);

  useEffect(() => {
    const intv = setInterval(() => {
      setIsLoading(false);
      clearInterval(intv);
    }, 100);
    return () => clearInterval(intv);
  }, []);

  useEffect(() => {
    socket.emit("request_rooms");
    socket.on("update_rooms", setRooms);
    return () => socket.off("update_rooms", setRooms);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    socket.emit("get_room_phase", roomId);
    socket.once("room_phase", ({ phase }) => {
      if (phase !== "waiting") {
        alert("Игра уже идёт");
        navigate("/");
      }
    });
  }, [roomId, navigate]);

  useEffect(() => {
    socket.on("timer_update", data => setTimeLeft(data.timeLeft));
    return () => socket.off("timer_update");
  }, []);

  useEffect(() => {
    socket.on("game_phase", data => setPhase(data.phase));
    return () => socket.off("game_phase");
  }, []);

  useEffect(() => {
    socket.on("update_players", setPlayers);
    return () => socket.off("update_players");
  }, []);

  useEffect(() => {
    if (!myUserId) return;
    socket.on("game_players", game => {
      const me = game.players.find(p => p.userId.toString() === myUserId);
      if(me?.gameRole) {
        setMyRole({
          role: me.gameRole,
          img: getRoleImage(me.gameRole),
          title: getRoleTitle(me.gameRole),
        });
      }
    });
    return () => socket.off("game_players");
  }, [myUserId]);

  useEffect(() => {
    if (roomId) socket.emit("get_players", roomId);
  }, [roomId]);

  const getRoleImage = role => ({
    mafia: "https://...",
    detective: "https://...",
    doctor: "https://...",
    peaceful: "https://..."
  }[role] || "https://...");

  const getRoleTitle = role => ({
    mafia: "Вы — мафия",
    detective: "Вы — детектив",
    doctor: "Вы — доктор",
    peaceful: "Вы — мирный"
  }[role] || "Неизвестная роль");

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Страница игры</h1>

      <div className="mb-6">
        <h2 className="text-xl">Комнаты:</h2>
        <ul>
          {rooms.map(r => (
            <li key={r.roomId} className="mb-2">
              {r.roomName} [{r.players.length}] — {r.phase} {" "}
              {r.phase === "waiting" && (
                <button
                  className="ml-2 text-blue-600"
                  onClick={() => {
                    socket.emit("join_room", {
                      roomId: r.roomId,
                      userId: myUserId,
                      username: "Me",
                    });
                    navigate(`/game/${r.roomId}`);
                  }}
                >
                  Войти
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex space-x-4">
        <div className="w-1/4"><DiedPeople players={players}/></div>
        <div className="w-1/2"><GameChat/></div>
        <div className="w-1/4 space-y-4">
          <Timer day={phase} time={timeLeft}/>
          {myRole ? <GameCard card={myRole}/> :
            <p>Роль загружается...</p>}
        </div>
      </div>
    </div>
  );
};

export default Game;
