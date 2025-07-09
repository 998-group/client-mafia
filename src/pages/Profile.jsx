import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice';

const Profile = () => {
    const user = useSelector(state => state?.auth?.user?.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout())
    }
    return (
        <div className='h-full p-4 flex flex-col justify-between'>
            <div className="flex-1 flex flex-col items-center gap-5">
                <div className='size-40'>
                    <img src={user?.image} alt="" />
                </div>
                <div className='flex flex-col w-full gap-4'>
                    <p className='flex items-center justify-between w-full'>
                        <span className='font-bold text-xl'>Username:</span>
                        <span className='font-semibold text-xl'>{user?.username}</span>
                    </p>
                    <p className='flex items-center justify-between w-full'>
                        <span className='font-bold text-xl'>Role:</span>
                        <span className='font-semibold text-xl'>{user?.role}</span>
                    </p>
                </div>
            </div>
            <div className='w-full'>
                <button className='btn btn-error btn-soft w-full' onClick={() => handleLogout()}>Logout</button>
            </div>
        </div>
    )
}

export default Profile