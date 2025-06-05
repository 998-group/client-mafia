import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import socket from '../socket';

const Room = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const auth = useSelector(state => state.auth); // Reduxdan token, user olinadi
  const user = auth.user; // { id, username }

  const [players, setPlayers] = useState([]);

  // ⬅️ Kirishda `join_room` jo'natish
  useEffect(() => {
    if (user && roomId) {
      socket.emit('join_room', {
        roomId,
        userId: user.id,
        username: user.username,
      });
    }

    // ➡️ Chiqishda `leave_room`
    return () => {
      if (user && roomId) {
        socket.emit('leave_room', {
          roomId,
          userId: user.id,
        });
      }
    };
  }, [user, roomId]);

  // 🟢 Real-time playerlar holatini olish
  useEffect(() => {
    const handleUpdatePlayers = (playersFromServer) => {
      setPlayers(playersFromServer);
    };

    socket.on('update_players', handleUpdatePlayers);

    return () => {
      socket.off('update_players', handleUpdatePlayers);
    };
  }, []);

  const handleLeave = () => {
    socket.emit("leave_room", { roomId, userId: user.id });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-base-100 shadow-xl rounded-2xl p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">
            🏠 Room: <span className="text-secondary">{roomId}</span>
          </h2>
          <p className="text-sm text-base-content/70">Waiting for players to join...</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {players.map((player) => (
            <div
              key={player.userId}
              className="flex items-center gap-3 p-3 bg-base-300 rounded-xl shadow-md"
            >
              <FaUser className="text-primary text-xl" />
              <div className="flex flex-col">
                <span className="text-base font-medium">{player.username}</span>
                <span className={`text-xs ${player.isReady ? 'text-success' : 'text-warning'}`}>
                  {player.isReady ? 'Ready' : 'Not ready'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button className="btn btn-error btn-wide" onClick={handleLeave}>
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
