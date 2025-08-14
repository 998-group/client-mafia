import { useSelector } from 'react-redux';
import { FaMedal } from 'react-icons/fa';

const Profile = () => {
    const user = useSelector((state) => state);

    return (
        <div className="flex flex-col items-center p-4 w-full max-w-lg mx-auto">
            {/* Заголовок */}
            <div className="w-full rounded-t-2xl bg-gradient-to-r from-pink-500 to-red-500 p-2   flex items-center justify-center gap-2">
                <FaMedal className="text-yellow-300 text-2xl" />
                <h1 className="text-white text-2xl font-bold">Profile</h1>
            </div>

            {/* Карточка профиля */}
            <div className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-b-2xl p-6 flex flex-col items-center shadow-lg">
                <img
                    src={user?.auth?.user?.user?.image}
                    alt="profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <p className="mt-3 text-white text-xl font-bold">
                    {user?.auth?.user?.user?.username}
                </p>
                <span className="text-sm text-white opacity-80">user</span>
            </div>

            {/* Информация */}
            <div className="w-full mt-4 bg-white rounded-2xl shadow-lg p-4">
                <h2 className="text-lg font-bold text-center text-gray-800 mb-3">Main Information</h2>

                <div className="flex flex-col ">
                    <div className="flex justify-between bg-gray-100 p-3 rounded-xl">
                        <span className="text-gray-600 font-semibold">User ID</span>
                        <span className="text-gray-900">{user?.auth?.user?.user?._id}</span>
                    </div>
                    <div className="flex justify-between bg-gray-100 p-3 rounded-xl">
                        <span className="text-gray-600 font-semibold">Role</span>
                        <span className="text-gray-900">{user?.auth?.user?.user?.role}</span>
                    </div>
                    <div className="flex justify-between bg-gray-100 p-3 rounded-xl">
                        <span className="text-gray-600 font-semibold">Status</span>
                        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                            {user?.auth?.user?.user?.status || "Online"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
