import React, { use, useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { ImEnter } from "react-icons/im";
import socket from "../socket"

const Home = () => {
  const [leaderBoard, setLeaderBoard] = useState([
    { username: "Bekzod", role: "admin", email: "bekzodmirzaaliyev27@gmail.com", score: 1200 },
    { username: "Aziz", role: "user", email: "aziz12@mail.com", score: 950 },
    { username: "Shahzod", role: "user", email: "shahzod99@mail.com", score: 870 },
    { username: "Dilshod", role: "moderator", email: "dilshod00@gmail.com", score: 1020 },
    { username: "Lola", role: "user", email: "lola_queen@mail.ru", score: 1100 },
    { username: "Sardor", role: "user", email: "sardor_dev@gmail.com", score: 980 },
    { username: "Nilufar", role: "user", email: "nilufar89@mail.com", score: 920 },
    { username: "Alisher", role: "moderator", email: "alisher_mod@mail.com", score: 1040 },
    { username: "Javohir", role: "user", email: "javohir22@gmail.com", score: 890 },
    { username: "Kamila", role: "user", email: "kamila_star@mail.com", score: 970 },
    { username: "Diyor", role: "user", email: "diyor77@gmail.com", score: 860 },
    { username: "Zilola", role: "user", email: "zilola_uz@mail.com", score: 940 },
    { username: "Mirjalol", role: "admin", email: "mir_admin@mail.com", score: 1150 },
    { username: "Ulugbek", role: "user", email: "ulugbek34@gmail.com", score: 880 },
    { username: "Madina", role: "user", email: "madina_00@mail.com", score: 1000 },
    { username: "Rustam", role: "moderator", email: "rustam_dev@mail.com", score: 1070 },
    { username: "Yulduz", role: "user", email: "yulduz_star@mail.ru", score: 930 },
    { username: "Amir", role: "user", email: "amir88@gmail.com", score: 950 },
    { username: "Shoxrux", role: "user", email: "shoxrux01@mail.com", score: 870 },
    { username: "Otabek", role: "user", email: "otabek@team.com", score: 990 },
  ]);
  const user = useSelector(state => state?.auth?.user)
  const [name, setName] = useState("")
  const [rooms, setRooms] = useState([])
  const [createRoomID, setCreateRoomID] = useState(null)
  const navigate = useNavigate()
  const [roomInfo, setRoomInfo] = useState()
  console.log("USER: ", user)
  const sortingLeaderBoard = leaderBoard.sort((a, b) => b.score - a.score);

  const createRoom = async () => {
    try {
      const request = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/game/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostId: user?.user?._id, roomName: name })
      })

      const response = await request.json()
      console.log("RESPONSE", response)

      if (request.ok) {
        toast.success("Room created successfully", { theme: "colored" })
        setCreateRoomID(response.newGame?.roomId)
        // navigate(`/room/${response.newGame?.roomId}`)
        JoinRoom(response.newGame?.roomId)
      }

    } catch (e) {
      console.log("server error", e)
    } finally {

    }
  }

  const JoinRoom = async (roomID) => {
    try {
      const request = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/game/join-room/${roomID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.user?._id })
      })

      const response = await request.json()
      console.log("RESPONSE", response.message)

      if (request.ok) {
        toast.success("Room joined successfully", { theme: "colored" })
        navigate(`/room/${roomID}/waiting`)
      }

    } catch (e) {
      console.log("server error: ", e)
    } finally {

    }

  }


  useEffect(() => {
    socket.on("player_joined", ({ userId }) => {
      console.log("PLAYER JOINED: ", userId)
    })
  }, [])

  const getRoominfo = async (roomId) => {
    document.getElementById('my_modal_2').showModal()

    console.log("ROOM ID: ", roomId);

    try {
      const request = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/game/room/${roomId}`)
      const response = await request.json()
      console.log("Room Info", response.players);
      setRoomInfo(response.players)
    } catch (error) {
      console.log(error);

    }
  }

  const getRoom = async () => {
    try {
      const request = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/game/all`)
      const response = await request.json()
      console.log("RES", response)
      setRooms(response.games)
    } catch (e) {
      console.log("server error: ", e)
    }
  }

  useEffect(() => {
    getRoom()
  }, [])


  return (
    <div className="flex h-screen">
      {/* LEFT PANEL */}
      <div className="flex-1 bg-base-300 h-full flex flex-col p-5 items-center">
        <figure>
          <img
            src={user?.user?.image}
            alt="User"
            className="size-32 rounded-full bg-base-100 border border-primary"
          />
        </figure>
        <p className="mt-5 font-semibold text-xl">{user?.user?.username}</p>

        <ul className="w-full mt-10 space-y-5">
          <li className="flex justify-between">
            <p>Role:</p>
            <p>{user?.user?.role}</p>
          </li>

          {/* Ban Info */}
          <li className="flex items-center justify-between gap-2">
            <p className="font-semibold text-lg w-1/3">Ban:</p>
            <div className="tooltip tooltip-error w-1/3" data-tip="5 дней">
              <button className="btn btn-soft btn-error w-full">Days</button>
            </div>
            <div className="tooltip tooltip-error w-1/3" data-tip="Doni boq bogani uchun">
              <button className="btn btn-soft btn-error w-full">Reason</button>
            </div>
          </li>

          {/* Mute Info */}
          <li className="flex items-center justify-between gap-2">
            <p className="font-semibold text-lg w-1/3">Mute:</p>
            <div className="tooltip tooltip-error w-1/3" data-tip="5 дней">
              <button className="btn btn-soft btn-error w-full">Days</button>
            </div>
            <div className="tooltip tooltip-error w-1/3" data-tip="Doni boq bogani uchun">
              <button className="btn btn-soft btn-error w-full">Reason</button>
            </div>
          </li>
        </ul>
      </div>

      {/* CENTER PANEL */}
      <div className="flex-1 h-full min-w-6/12 p-5">
        <div className="h-full w-full rounded-xl bg-base-300 drop-shadow-xl overflow-y-auto flex flex-col">
          <div className="flex items-center justify-center gap-5 h-24 bg-error">
            <img src="./cup.png" className="size-24" alt="Cup" />
            <p className="font-bold text-3xl tracking-wider">Leaderboard</p>
          </div>

          <div className='flex-1 overflow-y-auto'>
            {
              sortingLeaderBoard.length > 0 ? (
                sortingLeaderBoard.map((item, id) => (
                  <div key={id} className={`flex items-center justify-between p-2 ${id === 2 ? "bg-success/30" : id === 1 ? "bg-success/70" : id === 0 ? "bg-success/100" : ""}`}>
                    <div className='w-10'>{id + 1}</div>
                    <div className='w-1/3'>{item.username}</div>
                    <div className='w-1/3 text-center'>{item.role}</div>
                    <div className='w-1/3 text-end'>{item.score}</div>
                  </div>
                ))
              ) : (
                <p>LeaderBoard is empty</p>
              )
            }
          </div>
        </div>
      </div>
      <div className='flex-1 bg-base-300 h-full flex flex-col'>
        <div className='flex items-center justify-between p-2 bg-error'>
          <p className='font-bold text-xl'>Rooms: </p>
          <button className='btn btn-soft btn-error' onClick={() => document.getElementById('my_modal_1').showModal()}>Create Room</button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <p className="font-bold text-lg mb-4">Hello {user?.username}! Please Create Room</p>
              <input type="text" placeholder="Room Name" className="input input-primary w-full" onChange={(e) => setName(e.target.value)} />
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-soft btn-error mr-5">Close</button>
                  <button className="btn btn-soft btn-success min-w-[230px]" onClick={createRoom}>Create</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {
            rooms.length > 0 ? (
              <>
                <div>
                  <div className="flex items-center justify-between p-2">
                    <div className='w-10'>ID</div>
                    <div className='w-1/4'>Room</div>
                    <div className='w-1/4 text-center'>Players</div>
                    <div className='w-1/4 text-end'>Phase</div>
                    <div className='w-1/4 text-end'>Action</div>
                  </div>
                </div>
                {rooms.map((item, id) => (
                  <div key={id} className="flex items-center text-xs justify-between p-2">
                    <div className='w-10'>{id + 1}</div>
                    <div className='w-1/4'>{item.roomName}</div>
                    <div className='w-1/4 text-center'>{item.players.length}</div>
                    <div className='w-1/4 text-end capitalize'>{item.phase}</div>
                    <div className="w-1/4 flex items-center gap-1 justify-end">
                      <button className="btn btn-xs btn-soft btn-error" onClick={() => getRoominfo(item?.roomId)}><MdOutlineRemoveRedEye /></button>
                      <dialog id="my_modal_2" className="modal">
                        <div className="modal-box max-w-2xl">
                          <h2 className="font-bold text-xl mb-4">
                            Players in room: <span className="text-primary">{item.roomName}</span>
                          </h2>

                          <div className="grid gap-3">
                            {roomInfo?.length > 0 ? (
                              roomInfo.map((player, id) => (
                                <div
                                  key={id}
                                  className="flex items-center justify-between bg-base-200 p-4 rounded-xl shadow"
                                >
                                  <div className="font-semibold text-base-content">
                                    {player.userId.username}
                                  </div>

                                  <div className="flex gap-2 items-center">
                                    <span
                                      className={`badge px-3 py-1 text-xs font-semibold ${player.isAlive ? 'badge-success' : 'badge-error'
                                        }`}
                                    >
                                      {player.isAlive ? 'Alive' : 'Dead'}
                                    </span>

                                    <span
                                      className={`badge px-3 py-1 text-xs font-semibold ${player.isReady ? 'badge-info' : 'badge-warning'
                                        }`}
                                    >
                                      {player.isReady ? 'Ready' : 'Not ready'}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-base-content">No players in this room.</p>
                            )}
                          </div>

                          <div className="modal-action mt-5">
                            <form method="dialog">
                              <button
                                className="btn"
                                onClick={() => document.getElementById('my_modal_2').close()}
                              >
                                Close
                              </button>
                            </form>
                          </div>
                        </div>
                      </dialog>


                      <button className="btn btn-xs btn-soft btn-error" onClick={() => JoinRoom(item?.roomId)}><ImEnter /></button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p>Rooms is empty</p>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
