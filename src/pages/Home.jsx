import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-toastify";
import LeaderBoard from "../components/LeaderBoard";
import RoomPanel from "../components/RoomPanel"

const Home = () => {
  const user = useSelector((state) => state?.auth?.user);
  const [leaderBoard, setLeaderBoard] = useState([]);
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const request = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/users/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const response = await request.json();
      console.log(response)
      if (Array.isArray(response)) {
        setLeaderBoard(response);
      } else {
        setLeaderBoard([]);
        toast.error(response.message || "Failed to fetch users.");
      }
    } catch (err) {
      console.log("❌ Error fetching users:", err);
      setLeaderBoard([]);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

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
              <CgProfile className="text-2xl text-warning" />
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

      {/* CENTER PANEL - LEADERBOARD */}
      <div className="w-2/4">
        <LeaderBoard leaderBoard={leaderBoard} />

      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1">
        <RoomPanel />
      </div>
    </div>
  );
};

export default Home;
