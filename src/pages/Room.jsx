import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const Room = () => {
    const navigate = useNavigate();
    const roomId = 'ABC123'; // 🔁 Dinamik qilsa ham bo'ladi
    const players = [
        { id: 1, username: 'Bekzod' },
        { id: 2, username: 'Ali' },
        { id: 3, username: 'Sara' },
    ];

    const joinedPlayer = async () => {
        try {
            const request = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/game/join-room/${roomId}`, {

            })
        } catch (e) {

        } finally {

        }
    }

    const handleLeave = () => {
        // socket.emit("leave_room", { roomId, userId }) // agar socket ishlatsa
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-3xl bg-base-100 shadow-xl rounded-2xl p-6 space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-primary">🏠 Room: <span className="text-secondary">{roomId}</span></h2>
                    <p className="text-sm text-base-content/70">Waiting for players to join...</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {players.map((player) => (
                        <div
                            key={player.id}
                            className="flex items-center gap-3 p-3 bg-base-300 rounded-xl shadow-md"
                        >
                            <FaUser className="text-primary text-xl" />
                            <span className="text-base font-medium">{player.username}</span>
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
