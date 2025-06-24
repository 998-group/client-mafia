import React, { useState } from 'react'

const DiedPeople = () => {
    const [searchQuery, setSerchQuery] = useState('');

    const users = [
        { id: 1, name: "Samira", img: "https://img.daisyui.com/images/profile/demo/1@94.webp" },
        { id: 2, name: "Doniyor", img: "https://img.daisyui.com/images/profile/demo/4@94.webp" },
        { id: 3, name: "Usmonov", img: "https://img.daisyui.com/images/profile/demo/3@94.webp" },
        { id: 4, name: "Madaliev", img: "https://img.daisyui.com/images/profile/demo/1@94.webp" },
        { id: 5, name: "Bekzod", img: "https://img.daisyui.com/images/profile/demo/4@94.webp" },
        { id: 6, name: "Akbar", img: "https://img.daisyui.com/images/profile/demo/3@94.webp" },
        { id: 7, name: "Sardor", img: "https://img.daisyui.com/images/profile/demo/3@94.webp" },
        { id: 8, name: "Usmonov", img: "https://img.daisyui.com/images/profile/demo/3@94.webp" },
      ];
    
      const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div>
       <div className='w-full rounded-2xl drop-shadow-2xl h-[79vh] p-3 mt-6 bg-base-300 border-2 border-primary'>
        <label className="input flex items-center">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" className="grow " placeholder="Search the peoples"
            onChange={(e) => setSearchQuery(e.target.value)} />
        </label>

        <div className='mt-4'>
          <ul className="list bg-base-100 rounded-box  shadow-xl hover:shadow-2xl transition-all overflow-y-auto flex-1 max-h-[460px] duration-300">
            <li className="p-4 pb-2 text-xs opacity-60 w-full tracking-wide">Friend List:</li>
            {filteredUsers.map(user => (
              <li key={user.id} className="list-row flex  items-center gap-2 p-2 hover:bg-accent/10 rounded-lg transition">
                <img className="size-10 rounded-box" src={user.img} alt={user.name} />
                <div className="flex flex-col">
                  <div className="font-medium">{user.name}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}

export default DiedPeople