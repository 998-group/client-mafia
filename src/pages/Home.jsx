import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { ImEnter } from "react-icons/im";
import socket from "../socket";
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-toastify";

const Home = () => {
  const user = useSelector((state) => state?.auth?.user);
  const [name, setName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [roomInfo, setRoomInfo] = useState([]);
  const [leaderBoard, setLeaderBoard] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const getAllUsers = async () => {
    try {
      const request = await fetch("http://localhost:5000/api/auth/users/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const response = await request.json();
      const sortedUsers = response.sort((a, b) => b.score - a.score);
      setLeaderBoard(sortedUsers);
    } catch (err) {
      console.log("❌ Error fetching users:", err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    socket.on("update_rooms", (rooms) => {
      setRooms(rooms);
    });
    return () => socket.off("update_rooms");
  }, []);

  useEffect(() => {
    socket.emit("request_rooms", "Bekzodkrasavchik");
  }, []);

  useEffect(() => {
    socket.on("joined_room", (room) => {
      navigate(`/room/${room.roomId}/waiting`);
    });
    return () => socket.off("joined_room");
  }, []);

  const createRoom = () => {
    socket.emit("create_room", {
      hostId: user?.user?._id,
      roomName: name,
    });

    socket.once("joined_room", (room) => {
      navigate(`/room/${room.roomId}/waiting`);
    });
  };

  const joinRoom = (roomId) => {
    socket.emit("join_room", {
      roomId,
      userId: user?.user?._id,
      username: user?.user?.username,
    });
  };

  const getRoomInfo = async (roomId) => {
    document.getElementById("my_modal_2").showModal();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/game/room/${roomId}`);
      const data = await res.json();
      setRoomInfo(data.players || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleNotification = (data) => {
      if (data?.type === "error") {
        toast.error(data.message);
      }
    };
    socket.on("notification", handleNotification);
    return () => socket.off("notification", handleNotification);
  }, []);

  const getMedal = (index) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `#${index + 1}`;
    }
  };

  const getRankStyling = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg transform scale-105";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-md";
      case 2:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md";
      default:
        return "bg-base-200 hover:bg-base-300 transition-colors";
    }
  };

  return (
    <div className="flex h-screen">
      {/* LEFT PANEL */}
      <div className="flex-1 bg-base-300 p-5 flex flex-col items-center">
        <ul className="menu menu-horizontal w-full gap-5 bg-base-200 rounded-box mt-6">
          <li className={`flex-1 flex items-center justify-center ${path === "/" ? "bg-primary" : "bg-base-100"}`}>
            <Link to="/">
              <FiMessageCircle className="text-2xl text-success" />
            </Link>
          </li>
          <li className={`flex-1 flex items-center justify-center ${path === "/profile" ? "bg-primary" : "bg-base-100"}`}>
            <Link to="/profile">
              <CgProfile className="text-2xl text-warning" />
            </Link>
          </li>
          <li className={`flex-1 flex items-center justify-center ${path === "/shop" ? "bg-primary" : "bg-base-100"}`}>
            <Link to="/shop">
              <MdOutlineLocalGroceryStore className="text-2xl text-info" />
            </Link>
          </li>
        </ul>

        <div className="flex-1 bg-base-100 rounded-xl overflow-y-auto w-full mt-2">
          <Outlet />
        </div>
      </div>

      {/* CENTER PANEL - LEADERBOARD */}
      <div className="flex-1 h-full min-w-6/12 p-5">
        <div className="h-full w-full bg-base-100 rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
            <div className="flex items-center justify-center gap-4 h-20 px-6">
              <div className="text-4xl animate-bounce">🏆</div>
              <div>
                <h1 className="text-2xl font-bold">Leaderboard</h1>
                <p className="text-sm opacity-90">Top Players Rankings</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {leaderBoard?.length > 0 ? (
              <div className="space-y-3">
                {leaderBoard.map((player, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 transition-all duration-300 hover:shadow-lg ${getRankStyling(idx)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold min-w-[3rem] text-center">
                          {getMedal(idx)}
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {player?.username?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">
                            {player?.username || "Unknown"}
                          </div>
                          <div className={`text-sm opacity-75 ${idx < 3 ? 'text-white' : 'text-base-content'}`}>
                            {player?.role || "Player"}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold">{player?.score || 0}</div>
                        <div className={`text-xs opacity-75 ${idx < 3 ? 'text-white' : 'text-base-content'}`}>
                          points
                        </div>
                      </div>
                    </div>

                    {idx < 3 && leaderBoard[0]?.score > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                          <div
                            className="bg-white h-2 rounded-full"
                            style={{ width: `${(player.score / leaderBoard[0].score) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                  <p className="text-base-content opacity-60">Loading leaderboard...</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-base-200 px-6 py-3 flex justify-between items-center text-sm text-base-content opacity-75">
            <span>Total Players: {leaderBoard.length}</span>
            <span>Updated: Just now</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (ROOMS) */}
      <div className="flex-1 bg-base-300 flex flex-col">
        <div className="flex items-center justify-between p-2 bg-error">
          <p className="font-bold text-xl">Rooms:</p>
          <button
            className="btn btn-soft btn-error"
            onClick={() => document.getElementById("create_room_modal").showModal()}
          >
            Create Room
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {rooms.length > 0 ? (
            <>
              <div className="flex items-center justify-between p-2">
                <div className="w-10">ID</div>
                <div className="w-1/4">Room</div>
                <div className="w-1/4 text-center">Players</div>
                <div className="w-1/4 text-end">Phase</div>
                <div className="w-1/4 text-end">Action</div>
              </div>
              {rooms.map((item, idx) => (
                <div key={idx} className="flex items-center text-xs justify-between p-2">
                  <div className="w-10">{idx + 1}</div>
                  <div className="w-1/4">{item.roomName}</div>
                  <div className="w-1/4 text-center">{item.players?.length || 0}</div>
                  <div className="w-1/4 text-end capitalize">{item.phase}</div>
                  <div className="w-1/4 flex items-center gap-1 justify-end">
                    <button className="btn btn-xs btn-soft btn-error" onClick={() => getRoomInfo(item.roomId)}>
                      <MdOutlineRemoveRedEye />
                    </button>
                    <button className="btn btn-xs btn-soft btn-error" onClick={() => joinRoom(item.roomId)}>
                      <ImEnter />
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="p-4">Rooms is empty</p>
          )}
        </div>

        {/* Create Room Modal */}
        <dialog id="create_room_modal" className="modal">
          <div className="modal-box">
            <p className="font-bold text-lg mb-4">Create Room</p>
            <input
              type="text"
              placeholder="Room Name"
              className="input input-primary w-full"
              onChange={(e) => setName(e.target.value)}
            />
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-soft btn-error mr-3">Close</button>
                <button type="button" className="btn btn-soft btn-success" onClick={createRoom}>
                  Create
                </button>
              </form>
            </div>
          </div>
        </dialog>

        {/* Room Info Modal */}
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box max-w-2xl">
            <h2 className="font-bold text-xl mb-4">Players in Room</h2>
            <div className="grid gap-3">
              {roomInfo.length > 0 ? (
                roomInfo.map((player, index) => (
                  <div key={index} className="p-2 rounded bg-base-100 shadow">
                    <p><strong>Username:</strong> {player.username}</p>
                    <p><strong>Role:</strong> {player.role}</p>
                  </div>
                ))
              ) : (
                <p>No players found.</p>
              )}
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Home;
