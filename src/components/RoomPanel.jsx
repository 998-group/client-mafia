import React, { useState, useEffect } from 'react';
import { Eye, Plus, Users, Gamepad2, Lock, Unlock, UserPlus, Play, Clock } from 'lucide-react';
import socket from '../socket';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RoomPanel = () => {
    const [rooms, setRooms] = useState([]);
    const [roomInfo, setRoomInfo] = useState([]);
    const [name, setName] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRoomInfoModal, setShowRoomInfoModal] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');
    const [phaseFilter, setPhaseFilter] = useState('all');
    const navigate = useNavigate(); 
    const user = useSelector((state) => state.auth?.user?.user);

    console.log(user)

    useEffect(() => {
        socket.emit("request_rooms");
        socket.on("update_rooms", setRooms);
        return () => socket.off("update_rooms");
    }, []);

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.roomName.toLowerCase().includes(searchFilter.toLowerCase());
        const matchesPhase = phaseFilter === 'all' || room.phase === phaseFilter;
        return matchesSearch && matchesPhase;
    });

    const getPhaseColor = (phase) => {
        switch (phase) {
            case 'waiting': return 'text-yellow-400 bg-yellow-400/20';
            case 'started':
            case 'night':
            case 'day':
            case 'playing': return 'text-green-400 bg-green-400/20';
            case 'finished':
            case 'ended': return 'text-gray-400 bg-gray-400/20';
            default: return 'text-blue-400 bg-blue-400/20';
        }
    };

    const getPhaseIcon = (phase) => {
        switch (phase) {
            case 'waiting': return <Clock className="w-3 h-3" />;
            case 'playing':
            case 'started':
            case 'night':
            case 'day': return <Play className="w-3 h-3" />;
            case 'finished':
            case 'ended': return <Gamepad2 className="w-3 h-3" />;
            default: return <Clock className="w-3 h-3" />;
        }
    };

    const createRoom = () => {
        if (!name.trim()) return;
        if (!user) return toast.error("User not found");

        socket.emit("create_room", {
            hostId: user._id,
            roomName: name,
        });

        setName('');
        setShowCreateModal(false);
    };

    const joinRoom = (roomId) => {
        if (!user) return toast.error("User not found");
        console.log({
            roomId,
            userId: user._id,
            username: user.username,
        })
        socket.emit("join_room", {
            roomId,
            userId: user._id,
            username: user.username,
        });
          socket.once("joined_room", (room) => {
    navigate(`/room/${room.roomId}/waiting`);
    console.log("Navigated to: ", `/room/${room.roomId}/waiting`);
  });
    };

    const getRoomInfo = async (room) => {
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/game/room/${room.roomId}`);
            const data = await res.json();
            setSelectedRoom(room);
            setRoomInfo(data.players || []);
            setShowRoomInfoModal(true);
        } catch (err) {
            console.error("❌ getRoomInfo error:", err);
        }
    };

    return (
        <div className="flex-1 h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 px-6 py-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <Gamepad2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Game Rooms</h2>
                            <p className="text-sm text-gray-400">{filteredRooms.length} active rooms</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="group relative px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:scale-105 transition"
                    >
                        <div className="flex items-center gap-2">
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition" />
                            <span>Create Room</span>
                        </div>
                    </button>
                </div>

                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 placeholder-gray-400"
                    />
                    <select
                        value={phaseFilter}
                        onChange={(e) => setPhaseFilter(e.target.value)}
                        className="px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20"
                    >
                        <option value="all">All</option>
                        <option value="waiting">Waiting</option>
                        <option value="started">Started</option>
                        <option value="night">Night</option>
                        <option value="day">Day</option>
                        <option value="ended">Ended</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto relative z-10 p-4 space-y-3">
                {filteredRooms.map((room, idx) => (
                    <div key={room.roomId} className="group bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                {room.isPrivate ? <Lock className="text-orange-400" /> : <Unlock className="text-green-400" />}
                                <h3 className="text-white font-semibold truncate w-[100px] text-xs">{room.roomName}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getPhaseColor(room.phase)}`}>
                                    {getPhaseIcon(room.phase)} {room.phase}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => getRoomInfo(room)} className="btn btn-xs btn-outline text-white">
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => joinRoom(room.roomId)}
                                    disabled={room.players.length >= room.maxPlayers || room.phase === 'playing'}
                                    className="btn btn-xs btn-success"
                                >
                                    <UserPlus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="text-sm text-gray-300 flex justify-between">
                            <span><Users className="inline-block w-4 h-4" /> {room.players.length}/{room.maxPlayers || 24}</span>
                            <span>#{idx + 1}</span>
                        </div>
                        <div className="h-1 bg-white/10 mt-2 rounded-full">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${(room.players.length / room.maxPlayers) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Create New Room</h3>
                        <input
                            type="text"
                            placeholder="Room name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                            maxLength={30}
                        />
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setShowCreateModal(false)} className="btn flex-1 btn-outline w-full">Cancel</button>
                            <button onClick={createRoom} className="btn flex-1 btn-primary w-full" disabled={!name.trim()}>Create</button>
                        </div>
                    </div>
                </div>
            )}

            {showRoomInfoModal && selectedRoom && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 p-6 rounded-xl w-full max-w-lg">
                        <h3 className="text-xl font-bold text-white mb-4">{selectedRoom.roomName}</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {roomInfo.map((player, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2">
                                    <span className="text-white">{player.userId?.username}</span>
                                    <div className="flex gap-2 text-xs">
                                        <span className={`badge ${player.isAlive ? 'badge-success' : 'badge-error'}`}>
                                            {player.isAlive ? 'Alive' : 'Dead'}
                                        </span>
                                        <span className={`badge ${player.isReady ? 'badge-info' : 'badge-warning'}`}>
                                            {player.isReady ? 'Ready' : 'Not Ready'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowRoomInfoModal(false)} className="btn btn-outline mt-4 w-full">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomPanel;
