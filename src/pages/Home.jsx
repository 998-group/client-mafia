import React, { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { ImEnter } from "react-icons/im";
import socket from "../socket";
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

const Home = () => {
  const user = useSelector((state) => state?.auth?.user);
  console.log("USER: ", user);
  const [name, setName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [roomInfo, setRoomInfo] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [leaderBoard, setLeaderBoard] = useState([]).sort((a, b) => b.score - a.score)
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
    console.log("USERS", response);
    setLeaderBoard(response);
  } catch (err) {
    console.log("❌ Error fetching users:", err);
  }
};

  useEffect(() => {
    getAllUsers() 
  }, [])
  // 🔁 Real-time rooms listener
  useEffect(() => {
    socket.on("update_rooms", (rooms) => {
      setRooms(rooms);
    });
    return () => socket.off("update_rooms");
  }, []);

  useEffect(() => {
    socket.emit("request_rooms", "Bekzodkrasavchik");
  }, []);

  // 🎯 Redirect to waiting room after joining
  useEffect(() => {
    socket.on("joined_room", (room) => {
      navigate(`/room/${room.roomId}/waiting`);
    });
    return () => socket.off("joined_room");
  }, []);

  // ➕ Create new room
  const createRoom = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/game/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostId: user?.user?._id,
          roomName: name,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Room created successfully");
        joinRoom(data.newGame.roomId);
      }
    } catch (e) {
      console.error("Server error:", e);
    }
  };

  // 🔗 Join to room via socket
  const joinRoom = (roomId) => {
    socket.emit("join_room", {
      roomId,
      userId: user?.user?._id,
      username: user?.user?.username,
    });
  };

  // 👁 Get players in room
  const getRoomInfo = async (roomId) => {
    document.getElementById("my_modal_2").showModal();
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/game/room/${roomId}`);
      const data = await res.json();
      setRoomInfo(data.players || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* LEFT PANEL */}
      <div className="flex-1 bg-base-300 p-5 flex flex-col items-center">
        <ul className="menu menu-horizontal  w-full gap-5 bg-base-200 rounded-box mt-6">
          <li className={`flex-1 flex items-center justify-center ${path === '/' ? "bg-primary" : "bg-base-100"}`}>
            <Link to="/">
              <FiMessageCircle className="text-2xl text-success" />
            </Link>
          </li>

          <li className={`flex-1 flex items-center justify-center ${path === '/profile' ? "bg-primary" : "bg-base-100"}`}>
            <Link to="/profile">
              <CgProfile className="text-2xl  text-warning" />
            </Link>
          </li>

          <li className={`flex-1 flex items-center justify-center ${path === '/shop' ? "bg-primary" : "bg-base-100"}`}>
            <Link to="/shop">
              <MdOutlineLocalGroceryStore className="text-2xl text-info" />
            </Link>
          </li>

        </ul>
        <div className="flex-1 bg-base-100 rounded-xl overflow-y-auto w-full mt-2">
          <Outlet />
        </div>
      </div>

      {/* CENTER PANEL */}
      <div className="flex-1 h-full min-w-6/12 p-5">
        <div className="h-full w-full bg-base-300 rounded-xl drop-shadow-xl overflow-y-auto flex flex-col">
          <div className="flex items-center justify-center gap-5 h-24 bg-error">
            <img src="./cup.png" className="size-24" alt="Cup" />
            <p className="font-bold text-3xl">Leaderboard</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {leaderBoard.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2 ${idx === 0 ? "bg-success/100" : idx === 1 ? "bg-success/70" : idx === 2 ? "bg-success/30" : ""
                  }`}
              >
                <div className="w-10">{idx + 1}</div>
                <div className="w-1/3">{item?.username}</div>
                <div className="w-1/3 text-center">{item?.role}</div>
                <div className="w-1/3 text-end">{item?.score}</div>
              </div>
            ))}
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

        {/* Room list */}
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
                  <div className="w-1/4 text-center">{item.players.length}</div>
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
                <button className="btn btn-soft btn-success" onClick={createRoom}>
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
                roomInfo.map((player, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-base-200 p-4 rounded-xl shadow">
                    <div>{player.userId?.username}</div>
                    <div className="flex gap-2">
                      <span className={`badge ${player.isAlive ? "badge-success" : "badge-error"}`}>
                        {player.isAlive ? "Alive" : "Dead"}
                      </span>
                      <span className={`badge ${player.isReady ? "badge-info" : "badge-warning"}`}>
                        {player.isReady ? "Ready" : "Not ready"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No players in this room.</p>
              )}
            </div>
            <div className="modal-action mt-5">
              <form method="dialog">
                <button className="btn" onClick={() => document.getElementById("my_modal_2").close()}>
                  Close
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Home;
