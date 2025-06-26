import React, { useEffect, useState } from 'react'
import socket from '../socket'
import { useSelector } from 'react-redux';
const DiedPeople = ({ players }) => {

  const [users, setUsers] = useState([]);
  const user = useSelector((state => state?.auth?.user))
  console.log("User", user);

  useEffect(() => {
    setUsers(players)
    console.log("PLAYERS GAME: ", players)
  },[players])

  useEffect(() => {
    socket.emit("get_game_players", user?._id)
  }, [])


  return (
    <div className='w-full flex-1 rounded-l-2xl drop-shadow-2xl h-full bg-base-300 p-2 border-2 border-primary border-r-0'>
      <div className=''>
        <ul className="list  rounded-box  shadow-xl hover:shadow-2xl transition-all overflow-y-auto flex-1 duration-300">
          <li className="p-2  text-xs opacity-60 w-full tracking-wide text-netural-content">Players List:</li>
          {users.map(user => (
            <li key={user.id} className="list-row flex  items-center gap-2 p-2 hover:bg-accent/10 rounded-lg transition">
              <img className="size-10 rounded-box" src={user.img || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIlzxQ7OQIRWzgQRZv0-6Y6J7_ecKpPitmBA&s"} alt={user.name} />
              <div className="flex justify-between w-full">
                <div className="font-medium">{user.username}</div>
                <span className={`${user.isAlive ? "text-success" : "text-error"}`}>{user.isAlive ? "Live" : "Dead"}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default DiedPeople