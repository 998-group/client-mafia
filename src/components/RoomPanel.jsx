import React, { useState, useEffect, useCallback } from 'react';
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
    const [loading, setLoading] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [joiningRoomId, setJoiningRoomId] = useState(null);
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth?.user?.user);

    // Socket event handlers
    const handleUpdateRooms = useCallback((newRooms) => {
        setRooms(Array.isArray(newRooms) ? newRooms : []);
    }, []);

    const handleJoinedRoom = useCallback((room) => {
        if (room?.roomId) {
            setIsJoining(false);
            setJoiningRoomId(null);
            navigate(`/room/${room.roomId}/waiting`);
            console.log("Navigated to: ", `/room/${room.roomId}/waiting`);
        }
    }, [navigate]);

    const handleSocketError = useCallback((error) => {
        setIsJoining(false);
        setJoiningRoomId(null);
        setLoading(false);
        toast.error(error?.message || "An error occurred");
    }, []);

    useEffect(() => {
        // Request rooms on mount
        socket.emit('request_rooms');
        
        // Set up socket listeners
        socket.on('update_rooms', handleUpdateRooms);
        socket.on('joined_room', handleJoinedRoom);
        socket.on('error', handleSocketError);

        return () => {
            socket.off('update_rooms', handleUpdateRooms);
            socket.off('joined_room', handleJoinedRoom);
            socket.off('error', handleSocketError);
        };
    }, [handleUpdateRooms, handleJoinedRoom, handleSocketError]);

    const filteredRooms = rooms.filter((room) => {
        if (!room) return false;
        const matchesSearch = room.roomName?.toLowerCase().includes(searchFilter.toLowerCase()) || false;
        const matchesPhase = phaseFilter === 'all' || room.phase === phaseFilter;
        return matchesSearch && matchesPhase;
    });

    const getPhaseColor = (phase) => {
        switch (phase) {
            case 'waiting':
                return 'text-yellow-400 bg-yellow-400/20';
            case 'started':
            case 'night':
            case 'day':
                return 'text-green-400 bg-green-400/20';
            case 'ended':
            case 'finished':
                return 'text-gray-400 bg-gray-400/20';
            default:
                return 'text-blue-400 bg-blue-400/20';
        }
    };

    const getPhaseIcon = (phase) => {
        switch (phase) {
            case 'waiting':
                return <Clock className="w-3 h-3" />;
            case 'started':
            case 'night':
            case 'day':
                return <Play className="w-3 h-3" />;
            case 'ended':
            case 'finished':
                return <Gamepad2 className="w-3 h-3" />;
            default:
                return <Clock className="w-3 h-3" />;
        }
    };

    const createRoom = () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            toast.error("Please enter a room name");
            return;
        }
        
        if (!user?._id) {
            toast.error("User not found");
            return;
        }

        if (trimmedName.length < 3 || trimmedName.length > 30) {
            toast.error("Room name must be between 3-30 characters");
            return;
        }

        setLoading(true);
        
        socket.emit("create_room", {
            hostId: user._id,
            roomName: trimmedName,
        });

        // Set timeout for create room
        const timeout = setTimeout(() => {
            setLoading(false);
            toast.error("Failed to create room - timeout");
        }, 10000);

        // Clean up on success
        const cleanup = () => {
            clearTimeout(timeout);
            setLoading(false);
            setName('');
            setShowCreateModal(false);
        };

        socket.once("joined_room", (room) => {
            cleanup();
            if (room?.roomId) {
                navigate(`/room/${room.roomId}/waiting`);
            }
        });

        socket.once("error", (error) => {
            cleanup();
            toast.error(error?.message || "Failed to create room");
        });
    };

    const joinRoom = (roomId) => {
        if (!user?._id) {
            toast.error("User not found");
            return;
        }
        
        if (!roomId) {
            toast.error("Invalid room ID");
            return;
        }

        if (isJoining) {
            toast.warning("Already joining a room...");
            return;
        }

        setIsJoining(true);
        setJoiningRoomId(roomId);

        socket.emit("join_room", {
            roomId,
            userId: user._id,
            username: user.username,
        });

        // Set timeout for join room
        const timeout = setTimeout(() => {
            setIsJoining(false);
            setJoiningRoomId(null);
            toast.error("Failed to join room - timeout");
        }, 10000);

        socket.once("joined_room", (room) => {
            clearTimeout(timeout);
            if (room?.roomId) {
                setIsJoining(false);
                setJoiningRoomId(null);
                navigate(`/room/${room.roomId}/waiting`);
            }
        });

        socket.once("error", (error) => {
            clearTimeout(timeout);
            setIsJoining(false);
            setJoiningRoomId(null);
            toast.error(error?.message || "Failed to join room");
        });
    };

    const getRoomInfo = async (room) => {
        if (!room?.roomId) {
            toast.error("Invalid room");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/game/room/${room.roomId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            setSelectedRoom(room);
            setRoomInfo(Array.isArray(data.players) ? data.players : []);
            setShowRoomInfoModal(true);
        } catch (err) {
            console.error('❌ getRoomInfo error:', err);
            toast.error("Failed to get room information");
        } finally {
            setLoading(false);
        }
    };

    const canJoinRoom = (room) => {
        if (!room) return false;
        const isRoomFull = room.players?.length >= (room.maxPlayers || 10);
        const isGameInProgress = ['started', 'night', 'day'].includes(room.phase);
        return !isRoomFull && !isGameInProgress;
    };

    const getJoinButtonText = (room) => {
        if (!room) return "Join";
        if (room.players?.length >= (room.maxPlayers || 10)) return "Full";
        if (['started', 'night', 'day'].includes(room.phase)) return "Playing";
        return "Join";
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
                        disabled={loading}
                        className="group relative px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center gap-2">
                            <Plus className={`w-5 h-5 transition ${loading ? 'animate-spin' : 'group-hover:rotate-90'}`} />
                            <span>{loading ? 'Creating...' : 'Create Room'}</span>
                        </div>
                    </button>
                </div>

                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        maxLength={50}
                    />
                    <select
                        value={phaseFilter}
                        onChange={(e) => setPhaseFilter(e.target.value)}
                        className="px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="all">All Phases</option>
                        <option value="waiting">Waiting</option>
                        <option value="started">Started</option>
                        <option value="night">Night</option>
                        <option value="day">Day</option>
                        <option value="ended">Ended</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto relative z-10 p-4 space-y-3">
                {filteredRooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Gamepad2 className="w-16 h-16 text-white/30 mb-4" />
                        <p className="text-white/60 text-lg mb-2">No rooms found</p>
                        <p className="text-white/40">Create a new room to start playing!</p>
                    </div>
                ) : (
                    filteredRooms.map((room, idx) => (
                        <div
                            key={room.roomId || idx}
                            className="group bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-200"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-3">
                                    {room.isPrivate ? (
                                        <Lock className="text-orange-400 w-4 h-4" />
                                    ) : (
                                        <Unlock className="text-green-400 w-4 h-4" />
                                    )}
                                    <h3 className="text-white font-semibold truncate max-w-[150px] text-sm">
                                        {room.roomName || 'Unnamed Room'}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getPhaseColor(
                                            room.phase
                                        )}`}
                                    >
                                        {getPhaseIcon(room.phase)} {room.phase || 'unknown'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => getRoomInfo(room)}
                                        disabled={loading}
                                        className="px-2 py-1 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                                        title="View room info"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => joinRoom(room.roomId)}
                                        disabled={!canJoinRoom(room) || isJoining}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                            canJoinRoom(room) && !isJoining
                                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                        } ${joiningRoomId === room.roomId ? 'animate-pulse' : ''}`}
                                        title={canJoinRoom(room) ? "Join room" : "Cannot join"}
                                    >
                                        {joiningRoomId === room.roomId ? (
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Joining...
                                            </div>
                                        ) : (
                                            <>
                                                <UserPlus className="w-4 h-4 inline mr-1" />
                                                {getJoinButtonText(room)}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="text-sm text-gray-300 flex justify-between items-center">
                                <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" /> 
                                    {room.players?.length || 0}/{room.maxPlayers || 10}
                                </span>
                                <span className="text-xs text-gray-400">#{idx + 1}</span>
                            </div>
                            <div className="h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${Math.min(100, ((room.players?.length || 0) / (room.maxPlayers || 10)) * 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Room Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-4">Create New Room</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Room Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter room name (3-30 characters)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    maxLength={30}
                                    disabled={loading}
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    {name.length}/30 characters
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setName('');
                                }}
                                disabled={loading}
                                className="flex-1 px-4 py-2 border border-white/20 text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createRoom}
                                disabled={!name.trim() || name.trim().length < 3 || loading}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Creating...
                                    </div>
                                ) : (
                                    'Create'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Room Info Modal */}
            {showRoomInfoModal && selectedRoom && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 p-6 rounded-xl w-full max-w-lg border border-white/20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">{selectedRoom.roomName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPhaseColor(selectedRoom.phase)}`}>
                                {selectedRoom.phase}
                            </span>
                        </div>
                        
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {roomInfo.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>No players in this room</p>
                                </div>
                            ) : (
                                roomInfo.map((player, idx) => (
                                    <div
                                        key={player.userId?._id || idx}
                                        className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 border border-white/10"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                    {(player.userId?.username || player.username || 'Player')?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-white">
                                                {player.userId?.username || player.username || 'Unknown Player'}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 text-xs">
                                            <span className={`px-2 py-1 rounded-full ${
                                                player.isAlive 
                                                    ? 'bg-green-500/20 text-green-400' 
                                                    : 'bg-red-500/20 text-red-400'
                                            }`}>
                                                {player.isAlive ? 'Alive' : 'Dead'}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full ${
                                                player.isReady 
                                                    ? 'bg-blue-500/20 text-blue-400' 
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {player.isReady ? 'Ready' : 'Not Ready'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <button
                            onClick={() => {
                                setShowRoomInfoModal(false);
                                setSelectedRoom(null);
                                setRoomInfo([]);
                            }}
                            className="w-full mt-6 px-4 py-2 border border-white/20 text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomPanel;