
import React, { useEffect, useState } from 'react'
import socket from '../socket'
import { useSelector } from 'react-redux';

const DiedPeople = ({ players }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    setUsers(players);
  }, [players]);

  useEffect(() => {
    socket.emit("get_game_players", user?._id);
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='w-full flex-1 rounded-l-2xl drop-shadow-2xl h-full bg-base-300 p-2 border-2 border-primary border-r-0'>
      <div className=''>
        <ul className="list rounded-box shadow-xl hover:shadow-2xl transition-all overflow-y-auto flex-1 duration-300">
          <li className="p-2 text-xs opacity-60 w-full tracking-wide text-base-content">Players List:</li>

          <div className="px-2 pb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search player..."
              className='input input-bordered input-primary w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200'
            />
          </div>

          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <li key={user.id} className="list-row flex items-center gap-2 p-2 hover:bg-accent/10 rounded-lg transition">
                <img className="size-10 rounded-box" src={user.img || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIlzxQ7OQIRWzgQRZv0-6Y6J7_ecKpPitmBA&s"} alt={user.username} />
                <div className="flex justify-between w-full">
                  <div className="font-medium">{user?.username}</div>
                  <span className={`${user.isAlive ? "text-success" : "text-error"}`}>
                    {user.isAlive ? "Live" : "Dead"}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <div className="text-center text-sm text-error py-4">
              ⚠️ Data not found
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DiedPeople;
