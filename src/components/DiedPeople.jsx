import React, { useEffect, useState } from 'react'
import socket from '../socket'
import { useSelector } from 'react-redux';
const DiedPeople = () => {

  const user = useSelector((state => state?.auth?.user))
  console.log("User", user);
  

  const users = [
    { id: 1, name: "Samira", img: "https://img.daisyui.com/images/profile/demo/1@94.webp", status: "live" },
    { id: 2, name: "Doniyor", img: "https://img.daisyui.com/images/profile/demo/4@94.webp", status: "dead" },
    { id: 3, name: "Usmonov", img: "https://img.daisyui.com/images/profile/demo/3@94.webp", status: "live" },
    { id: 4, name: "Madaliev", img: "https://img.daisyui.com/images/profile/demo/1@94.webp", status: "dead" },
    { id: 5, name: "Bekzod", img: "https://img.daisyui.com/images/profile/demo/4@94.webp", status: "live" },
    { id: 6, name: "Akbar", img: "https://img.daisyui.com/images/profile/demo/3@94.webp", status: "dead" },
    { id: 7, name: "Sardor", img: "https://img.daisyui.com/images/profile/demo/3@94.webp", status: "dead" },
    { id: 8, name: "Usmonov", img: "https://img.daisyui.com/images/profile/demo/3@94.webp", status: "live" },
  ];

  useEffect(() => {
    socket.emit("get_game_players", user?._id )
  }, [])


  return (
    <div className='w-full flex-1 rounded-l-2xl drop-shadow-2xl h-full bg-base-300 p-2 border-2 border-primary border-r-0'>
      <div className=''>
        <ul className="list  rounded-box  shadow-xl hover:shadow-2xl transition-all overflow-y-auto flex-1 duration-300">
          <li className="p-2  text-xs opacity-60 w-full tracking-wide text-netural-content">Players List:</li>
          {users.map(user => (
            <li key={user.id} className="list-row flex  items-center gap-2 p-2 hover:bg-accent/10 rounded-lg transition">
              <img className="size-10 rounded-box" src={user.img} alt={user.name} />
              <div className="flex justify-between w-full">
                <div className="font-medium">{user.name}</div>
                <span className={`${user.status === "live" ? "text-success" : "text-error"}`}>{user.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default DiedPeople