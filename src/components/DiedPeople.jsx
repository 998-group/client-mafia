import React, { useEffect, useState } from 'react';
import socket from '../socket';
import { useSelector } from 'react-redux';
import { TbSpeakerphone } from "react-icons/tb";
import { GiPistolGun } from "react-icons/gi";
import { LiaBriefcaseMedicalSolid } from "react-icons/lia";
import { FaHeartPulse } from "react-icons/fa6";
import { IoMdHeartDislike } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { LuUserRoundSearch } from "react-icons/lu";
import { toast } from "react-toastify";

const DiedPeople = ({ players, myRole }) => {
  const user = useSelector((state) => state?.auth?.user);
  const [room, setRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [myVoice, setMyVoice] = useState(false);
  const [killPlayer, setKillPlayer] = useState(false);
  const [gamePhase, setGamePhase] = useState("waiting");

  useEffect(() => {
    setUsers(players);
  }, [players]);

  useEffect(() => {
    if (user?.user?._id) {
      socket.emit("get_game_players", user.user._id);
    }
  }, [user?.user?._id]);

  useEffect(() => {
    socket.on("your_socket_id", (socketId) => {
      console.log("📡 My socket ID:", socketId);
    });

    socket.on("joined_room", (roomData) => {
      console.log("📡 My room:", roomData);
      setRoom(roomData);
    });

    socket.on("game_phase", (gamePhaseData) => {
      console.log("game_phase:", gamePhaseData.phase);
      setGamePhase(gamePhaseData.phase);
    });

    socket.on("error_message", (errorMsg) => {
      console.log(errorMsg);
      toast.error(errorMsg);
    });

    return () => {
      socket.off("your_socket_id");
      socket.off("joined_room");
      socket.off("game_phase");
      socket.off("error_message");
    };
  }, []);

  const filteredUsers = users.filter((u) =>
    u?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVoice = (userId) => {
    if (gamePhase === "waiting") {
      toast.error("⛔ O'yin hali boshlanmagan");
      return;
    }
    if (gamePhase !== "day") {
      toast.error("⛔ Ovoz berish faqat kun vaqtida");
      return;
    }
    
    socket.emit("vote_player", { 
      roomId: room?.roomId, 
      voterId: user?.user?._id,
      targetUserId: userId
    });
    setMyVoice(true);
    toast.success("Siz ovoz berdingiz!");
  };

  const handleRemoveVoice = (userId) => {
    socket.emit("remove_voice", { 
      roomId: room?.roomId, 
      userId: userId, 
      user: user?.user?._id 
    });
    setMyVoice(false);
    toast.info("Ovoz olib tashlandi");
  };

  const handleKill = (selectedPlayerId) => {
    if (gamePhase !== "night") {
      toast.error("⛔ O'ldirish faqat tun vaqtida");
      return;
    }

    if (myRole?.role !== "mafia") {
      toast.error("⛔ Siz mafia emassiz");
      return;
    }

    if (killPlayer) {
      toast.error("⛔ Siz allaqachon birovni tanladingiz");
      return;
    }

    socket.emit("mafia_kill", {
      roomId: room?.roomId,
      killerId: user?.user?._id,
      targetId: selectedPlayerId,
    });
    
    setKillPlayer(true);
    toast.success("Nishon tanlandi!");
  };

  const handleHeal = (selectedPlayerId) => {
    if (gamePhase !== "night") {
      toast.error("⛔ Davolash faqat tun vaqtida");
      return;
    }

    if (myRole?.role !== "doctor") {
      toast.error("⛔ Siz shifokor emassiz");
      return;
    }

    socket.emit("doctor_heal", {
      roomId: room?.roomId,
      doctorId: user?.user?._id,
      targetId: selectedPlayerId,
    });
    
    toast.success("Bemor davolandi!");
  };

  const handleDetect = (selectedPlayerId) => {
    if (gamePhase !== "night") {
      toast.error("⛔ Tekshirish faqat tun vaqtida");
      return;
    }

    if (myRole?.role !== "detective") {
      toast.error("⛔ Siz detektiv emassiz");
      return;
    }

    socket.emit("check_player", {
      roomId: room?.roomId,
      checkerId: user?.user?._id,
      targetUserId: selectedPlayerId,
    });
    
    toast.success("O'yinchi tekshirildi!");
  };

  return (
    <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaHeartPulse className="text-red-400" />
          O'yinchilar ({users.length})
        </h2>
        {myRole && (
          <div className="text-xs px-2 py-1 bg-purple-500/20 rounded-full text-purple-300">
            {myRole.role}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="O'yinchilarni qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Game Phase Indicator */}
      <div className="mb-4 text-center">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          gamePhase === 'day' ? 'bg-yellow-500/20 text-yellow-300' :
          gamePhase === 'night' ? 'bg-blue-500/20 text-blue-300' :
          'bg-gray-500/20 text-gray-300'
        }`}>
          {gamePhase === 'day' && '☀️ Kun'}
          {gamePhase === 'night' && '🌙 Tun'}
          {gamePhase === 'waiting' && '⏳ Kutish'}
          {gamePhase === 'started' && '🎮 Boshlandi'}
        </div>
      </div>

      {/* Players List */}
      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div
              key={u._id || u.userId}
              className={`
                bg-gradient-to-r from-white/5 to-white/10 
                rounded-xl shadow-lg px-4 py-3 
                flex items-center justify-between 
                hover:shadow-xl hover:scale-[1.02] 
                transition-all duration-300 
                border border-white/10
                ${!u.isAlive ? 'opacity-50 grayscale' : ''}
                hover:border-purple-400/30
                backdrop-blur-sm
              `}
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={u.img || `https://api.dicebear.com/7.x/thumbs/svg?seed=${u.username}`}
                    className="w-10 h-10 rounded-xl border border-white/20"
                    alt="avatar"
                  />
                  {!u.isAlive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                  )}
                </div>
                <div className="text-white font-medium max-w-24 truncate">
                  {u.username}
                </div>
                {u.votes > 0 && (
                  <div className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                    {u.votes} ovoz
                  </div>
                )}
              </div>

              {/* Role Actions */}
              <div className="flex items-center gap-2">
                {u.isAlive && u.userId !== user?.user?._id && (
                  <>
                    {/* 🔍 Detective Check */}
                    <button
                      disabled={myRole?.role !== "detective" || gamePhase !== "night"}
                      onClick={() => handleDetect(u.userId)}
                      className={`btn btn-xs btn-outline tooltip ${
                        myRole?.role !== "detective" || gamePhase !== "night" 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:bg-yellow-500/20 border-yellow-500/50 text-yellow-300"
                      }`}
                      data-tip="Tekshirish"
                    >
                      <LuUserRoundSearch />
                    </button>

                    {/* 🔫 Mafia Kill */}
                    <button
                      disabled={myRole?.role !== "mafia" || gamePhase !== "night" || killPlayer}
                      onClick={() => handleKill(u.userId)}
                      className={`btn btn-xs btn-outline tooltip ${
                        myRole?.role !== "mafia" || gamePhase !== "night" || killPlayer
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:bg-red-500/20 border-red-500/50 text-red-300"
                      }`}
                      data-tip="O'ldirish"
                    >
                      <GiPistolGun />
                    </button>

                    {/* 🩺 Doctor Heal */}
                    <button
                      disabled={myRole?.role !== "doctor" || gamePhase !== "night"}
                      onClick={() => handleHeal(u.userId)}
                      className={`btn btn-xs btn-outline tooltip ${
                        myRole?.role !== "doctor" || gamePhase !== "night"
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:bg-green-500/20 border-green-500/50 text-green-300"
                      }`}
                      data-tip="Davolash"
                    >
                      <LiaBriefcaseMedicalSolid />
                    </button>

                    {/* 📣 Voice Vote (Day phase only) */}
                    {gamePhase === "day" && (
                      <button
                        onClick={() => handleVoice(u.userId)}
                        disabled={myVoice}
                        className={`btn btn-xs btn-outline tooltip ${
                          myVoice 
                            ? "opacity-50 cursor-not-allowed" 
                            : "hover:bg-blue-500/20 border-blue-500/50 text-blue-300"
                        }`}
                        data-tip="Ovoz berish"
                      >
                        <TbSpeakerphone />
                      </button>
                    )}
                  </>
                )}

                {/* 💓 Alive / ☠️ Dead Status */}
                <div className={`flex items-center gap-1 font-semibold ${
                  u.isAlive ? "text-green-400" : "text-red-400"
                }`}>
                  {u.isAlive ? (
                    <FaHeartPulse className="animate-pulse" />
                  ) : (
                    <>
                      <IoMdHeartDislike />
                      <span className="text-xs">O'ldi</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-8">
            <div className="text-4xl mb-2">👥</div>
            <p>Hech kim topilmadi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiedPeople;