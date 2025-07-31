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
import User from '../../../server-mafia/src/models/User';

const DiedPeople = ({ players, myRole }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [myVoice, setMyVoice] = useState(false);
  const user = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    setUsers(players);
  }, [players]);

  useEffect(() => {
    socket.emit("get_game_players", user?._id);
  }, []);

  const filteredUsers = users.filter((u) =>
    u?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVoice = (userId) => {
    socket.emit("vote_player", { selected: userId, user: user.user?._id });
    setMyVoice(true);
  };

  const handleRemoveVoice = (userId) => {
    socket.emit("remove_voice", { userId, user: user.user?._id });
    setMyVoice(false);
  };

  return (
    <div className="h-full w-full flex flex-col p-3 rounded-2xl bg-base-200 border border-base-300">
      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search players..."
          className="input input-bordered w-full"
        />
      </div>

      {/* Player List */}
      <div className="overflow-y-auto flex-1 space-y-2 pr-1">
        <h2 className="text-sm text-base-content/60 font-semibold mb-2">Players:</h2>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div
              key={u._id}
              className="bg-base-100 rounded-xl shadow-md px-3 py-2 flex items-center justify-between hover:shadow-lg transition"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <img
                  src={u.img || "https://api.dicebear.com/7.x/thumbs/svg?seed=" + u.username}
                  className="w-10 h-10 rounded-xl border border-base-300"
                  alt="avatar"
                />
                <div className="text-base font-medium">{u.username}</div>
              </div>

              <div className="flex items-center gap-2">
                {u.isAlive && (
                  <>
                    {/* 🔍 Detective */}
                    <button
                      disabled={myRole?.role !== "detective"}
                      className="btn btn-xs btn-outline tooltip btn-warning"
                      data-tip="Detect"
                    >
                      <LuUserRoundSearch />
                    </button>

                    {/* 🔫 Mafia */}
                    <button
                      disabled={myRole?.role !== "mafia"}
                      className="btn btn-xs btn-outline tooltip btn-error"
                      data-tip="Eliminate"
                    >
                      <GiPistolGun />
                    </button>

                    {/* 🩺 Doctor */}
                    <button
                      disabled={myRole?.role !== "doctor"}
                      className="btn btn-xs btn-outline tooltip btn-success"
                      data-tip="Heal"
                    >
                      <LiaBriefcaseMedicalSolid />
                    </button>

                    {/* 📣 Voice Vote */}
                    {myVoice ? (
                      <button
                        onClick={() => handleRemoveVoice(u._id)}
                        className="btn btn-xs btn-outline btn-error tooltip"
                        data-tip="Remove vote"
                      >
                        <ImCross />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVoice(u._id)}
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
                      <span className="text-xs">Alive</span>
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
