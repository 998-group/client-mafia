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
import {toast } from "react-toastify"
const DiedPeople = ({ players, myRole, roomId }) => {
  const user = useSelector((state) => state?.auth?.user);
  // const [room, setRoom] = useState()
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [myVoice, setMyVoice] = useState(false);
  const [killPlayer, setKillPlayer] = useState(false)
  const [gamePhase, setGamePhase] = useState()
  // console.log("room", room);

  useEffect(() => {
    setUsers(players);
  }, [players]);

  useEffect(() => {
    socket.emit("get_game_players", user?._id);
  }, []);
  useEffect(() => {
    socket.on("your_socket_id", (socketId) => {
      console.log("📡 My socket ID:", socketId);
    });
  }, []);
  useEffect(() => {
    // socket.on("joined_room", (roomId) => {
    //   console.log("📡 My room ID:", roomId);
    //   setRoom(roomId.roomId);

    //   // kerak bo‘lsa Redux, context, yoki local state-ga saqlashingiz mumkin
    // });
  }, []);
  useEffect(() => {
    socket.on("game_phase", (gamephase) => {
      console.log("game_phase:", gamephase.phase);
      setGamePhase(gamephase.phase)
    });
  }, []);
  useEffect(() => {
    socket.on("error_message", (errorMsg) => {
      console.log( errorMsg);
      toast.error(errorMsg);
    });
  
    return () => {
      socket.off("error_message");
    };
  }, []);



  const filteredUsers = users.filter((u) =>
    u?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVoice = (userId) => {
    if (gamePhase === "started") {
      toast.error("⛔ Hali o‘yin boshlanmadi");
      return;
    }
    socket.emit("add_voice", { roomId: roomId, selected: userId, user: user.user?._id });
    setMyVoice(true);
    toast.success("Siz oyinchiga ovoz berdingiz")
    console.log("add_voice", { roomId: roomId, selected: userId, user: user.user?._id })

  };
  const handleKill = (selectedPlayerId) => {
    if (gamePhase === "started") {
      toast.error("⛔ Hali o‘yin boshlanmadi");
      return;
    }
    console.log("🔫 handleKill chaqirildi:", selectedPlayerId);

    if (!selectedPlayerId) {
      console.warn("❗ selectedPlayerId yo‘q");
      return;
    }

    if (!user?.user?._id) {
      console.warn("❗ Foydalanuvchi ID yo‘q (user.user._id)");
      return;
    }

    console.log("✅ mafia_kill:", {
      selected: selectedPlayerId,
      user: user.user._id,
      roomId: roomId
    });
    socket.emit("mafia_kill", {
      roomId: roomId,
      killerId: user.user._id,
      targetId: selectedPlayerId,
    });
    toast.success("Siz oyinchini otdingiz")


    setKillPlayer(true);
  };

  const handleHeal = (selectedPlayerId) => {
    console.log("🩺 handleHeal:", selectedPlayerId);
  
    if (gamePhase === "started") {
      toast.error("⛔ Hali o‘yin boshlanmadi");
      return;
    }
    if (!selectedPlayerId || !user?.user?._id || !roomId) {
      toast.error("⚠️ Ma'lumotlar yetarli emas");
      return;
    }
  
    socket.emit("doctor_heal", {
      roomId: roomId,
      doctorId: user.user._id,
      targetId: selectedPlayerId
    });
  
    toast.success("🩺 Siz bemorni davoladingiz");
  };
  
  const handleRemoveVoice = (userId) => {
    socket.emit("remove_voice", { roomId: roomId, userId, user: user.user?._id });
    toast.success("Siz ovozingizni qaytarib oldingiz")
    console.log("remove_voice", { roomId: roomId, selected: userId, user: user.user?._id })
    setMyVoice(false);
  };

  return (
    <div className="h-full w-full flex flex-col p-4 rounded-3xl bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 border border-primary/20 shadow-xl backdrop-blur-sm">
      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search players..."
          className="input input-bordered w-full bg-base-200/50 border-primary/30 focus:border-primary focus:bg-base-100 transition-all duration-300 shadow-md hover:shadow-lg"
        />
      </div>

      {/* Player List */}
      <div className="overflow-y-auto flex-1 space-y-2 pr-1">
        <h2 className="text-sm text-base-content/60 font-semibold mb-2">Players:</h2>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div
              key={u._id}
              className={`
                bg-gradient-to-r from-base-100 via-base-50 to-base-100 
                rounded-2xl shadow-lg px-4 py-3 
                flex items-center justify-between 
                hover:shadow-xl hover:scale-[1.02] 
                transition-all duration-300 
                border border-base-300/50
                ${!u.isAlive ? 'opacity-70 grayscale-[0.3]' : ''}
                hover:border-primary/30
                backdrop-blur-sm
              `}
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <img
                  src={u.img || "https://api.dicebear.com/7.x/thumbs/svg?seed=" + u.username}
                  className="w-10 h-10 rounded-xl border border-base-300"
                  alt="avatar"
                />
                <div className="text-base font-medium max-w-24 truncate">{u.username}</div>
              </div>

              {/* Role Actions */}
              <div className="flex items-center gap-2">
                {u.isAlive && (
                  <>
                    {/* 🔍 Detective */}
                    <button
                      disabled={myRole?.role !== "detective"}
                      className={`btn btn-xs btn-outline tooltip ${myRole?.role !== "detective" ? "btn-disabled" : "btn-warning"}`}
                      data-tip="Detect"
                    >
                      <LuUserRoundSearch />
                    </button>

                    {/* 🔫 Mafia */}
                    <button
                      disabled={myRole?.role !== "mafia"}
                      onClick={() => handleKill(u.userId)}
                      className={`btn btn-xs btn-outline tooltip ${myRole?.role !== "mafia" ? "btn-disabled" : "btn-error"}`}
                      data-tip="Eliminate"
                    >
                      <GiPistolGun />
                    </button>

                    {/* 🩺 Doctor */}
                    <button
                      disabled={myRole?.role !== "doctor"}
                      onClick={() => handleHeal(u.userId)}
                      className={`btn btn-xs btn-outline tooltip ${myRole?.role !== "doctor" ? "btn-disabled" : "btn-success"}`}
                      data-tip="Heal"
                    >
                      <LiaBriefcaseMedicalSolid />
                    </button>

                    {/* 📣 Voice Vote */}
                    {myVoice ? (
                      <button
                        onClick={() => handleRemoveVoice(u.userId)}
                        className="btn btn-xs btn-outline btn-error tooltip"
                        data-tip="Remove vote"
                      >
                        <ImCross />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVoice(u.userId)}
                        className="btn btn-xs btn-outline btn-info tooltip"
                        data-tip="Give vote"
                      >
                        <TbSpeakerphone />
                      </button>
                    )}
                  </>
                )}

                {/* 💓 Alive / ☠️ Dead */}
                <div className={`flex items-center gap-1 font-semibold ${u.isAlive ? "text-success" : "text-error"}`}>
                  {u.isAlive ? (
                    <>
                      <FaHeartPulse className="animate-pulse" />
                    </>
                  ) : (
                    <>
                      <IoMdHeartDislike />
                      <span className="text-xs">Dead</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-error mt-4">⚠️ No players found</div>
        )}
      </div>
    </div>
  );
};

export default DiedPeople;