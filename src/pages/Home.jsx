import React, { useState } from "react";

const Home = () => {
  const [leaderBoard] = useState([
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

  const sortedLeaderBoard = [...leaderBoard].sort((a, b) => b.score - a.score);

  return (
    <div className="flex h-screen">
      {/* LEFT PANEL */}
      <div className="flex-1 bg-base-300 h-full flex flex-col p-5 items-center">
        <figure>
          <img
            src=""
            alt="User"
            className="size-32 rounded-full bg-base-100 border border-primary"
          />
        </figure>
        <p className="mt-5 font-semibold text-xl">Anivar Jonka❤️</p>

        <ul className="w-full mt-10 space-y-5">
          <li className="flex justify-between">
            <p>Role:</p>
            <p>Admin</p>
          </li>
          <li className="flex justify-between">
            <p>Email:</p>
            <p>Bekzodkrasavchik@gmail.com</p>
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

          {/* LIST */}
          <div className="flex-1 overflow-y-auto divide-y divide-base-200">
            {sortedLeaderBoard.map((item, index) => {
              let bg = "";
              if (index === 0) bg = "bg-green-600 text-white font-bold";
              else if (index === 1) bg = "bg-green-400 text-white font-bold";
              else if (index === 2) bg = "bg-green-300 text-white f ont-bold";

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 ${bg}`}
                >
                  <div className="w-10 text-center">{index + 1}</div>
                  <div className="w-1/3">{item.username}</div>
                  <div className="w-1/3 text-center capitalize">{item.role}</div>
                  <div className="w-1/3 text-end">{item.score}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (bo‘sh) */}
      <div className="flex-1 bg-base-300 h-full"></div>
    </div>
  );
};

export default Home;
