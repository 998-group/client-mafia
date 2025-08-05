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
    socket.emit("add_voice", { selected: userId, user: user.user?._id });
    setMyVoice(true);
  };

  const handleRemoveVoice = (userId) => {
    socket.emit("remove_voice", { userId, user: user.user?._id });
    setMyVoice(false);
  };

  return (
    <div className="h-full w-full flex flex-col p-3 rounded-2xl  backdrop-blur-xl shadow-2xl">
      <div className="mb-3 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search players..."
          className="input w-full pl-10 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/50 border-violet-300 text-violet-900 placeholder-violet-400 transition-all"
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-violet-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 space-y-2 pr-1 scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-transparent hover:scrollbar-thumb-violet-400">
        <h2 className="text-sm text-violet-700 font-semibold mb-2 uppercase tracking-wider">Players</h2>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div
              key={u._id}
              className="bg-gradient-to-r from-violet-50 to-white/80 rounded-xl shadow-sm px-3 py-2 flex items-center justify-between border border-violet-200/70 hover:shadow-xl hover:from-violet-100 hover:to-white transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <img
                    src={u.img || "https://api.dicebear.com/7.x/thumbs/svg?seed=" + u.username}
                    className="w-10 h-10 rounded-xl border-2 border-violet-300 group-hover:border-violet-500 transition-all"
                    alt="avatar"
                  />
                  {!u.isAlive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-800/50 to-violet-900/70 backdrop-blur-sm rounded-xl border-2 border-violet-900/60 flex items-center justify-center">
                      <IoMdHeartDislike className="text-violet-100 text-xl animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="text-base font-semibold bg-gradient-to-r from-violet-600 to-violet-900 bg-clip-text text-transparent transition-all group-hover:brightness-110">
                  {u.username}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {u.isAlive && (
                  <>
                    {/* Detective */}
                    <div className="tooltip tooltip-bottom" data-tip="Detect">
                      <button
                        disabled={myRole?.role !== "detective"}
                        className={`btn btn-xs btn-circle btn-outline shadow-md active:scale-95 transition-all duration-150 ${myRole?.role !== "detective"
                            ? "btn-disabled opacity-40"
                            : "bg-violet-100 border-violet-400 text-violet-800 hover:bg-violet-200 hover:scale-110"
                          }`}
                      >
                        <LuUserRoundSearch className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Mafia */}
                    <div className="tooltip tooltip-bottom" data-tip="Eliminate">
                      <button
                        disabled={myRole?.role !== "mafia"}
                        className={`btn btn-xs btn-circle btn-outline shadow-md active:scale-95 transition-all duration-150 ${myRole?.role !== "mafia"
                            ? "btn-disabled opacity-40"
                            : "bg-violet-700 border-violet-800 text-violet-50 hover:bg-violet-800 hover:scale-110"
                          }`}
                      >
                        <GiPistolGun className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Doctor */}
                    <div className="tooltip tooltip-bottom" data-tip="Heal">
                      <button
                        disabled={myRole?.role !== "doctor"}
                        className={`btn btn-xs btn-circle btn-outline shadow-md active:scale-95 transition-all duration-150 ${myRole?.role !== "doctor"
                            ? "btn-disabled opacity-40"
                            : "bg-violet-500 border-violet-600 text-white hover:bg-violet-600 hover:scale-110"
                          }`}
                      >
                        <LiaBriefcaseMedicalSolid className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Voice Vote */}
                    <div className="tooltip tooltip-bottom" data-tip={myVoice ? "Remove vote" : "Give vote"}>
                      {myVoice ? (
                        <button
                          onClick={() => handleRemoveVoice(u._id)}
                          className="btn btn-xs btn-circle btn-outline bg-violet-200 border-violet-400 text-violet-800 hover:bg-violet-300 hover:scale-110 transition-transform"
                        >
                          <ImCross className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVoice(u._id)}
                          className="btn btn-xs btn-circle btn-outline bg-violet-500 border-violet-600 text-white hover:bg-violet-600 hover:scale-110 transition-transform"
                        >
                          <TbSpeakerphone className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* Status Badge */}
                <div className={`badge badge-sm ${u.isAlive ? "bg-violet-500 text-white" : "bg-violet-900 text-violet-100"} gap-1 px-2 py-1.5 border-0`}>
                  {u.isAlive ? (
                    <>
                      <FaHeartPulse className="animate-pulse w-3 h-3" />
                      <span className="text-xs">Alive</span>
                    </>
                  ) : (
                    <>
                      <IoMdHeartDislike className="w-3 h-3" />
                      <span className="text-xs">Dead</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-violet-800/80">
            <svg className="w-10 h-10 mb-2 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <span className="font-medium">No players found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiedPeople;
