import { useSelector } from 'react-redux';

const Profile = () => {

    const user = useSelector((state) => state);
    console.log("users profile: ", user);

    return (
        <div className='flex flex-col gap-2 m-4'>
            <div className='bg-base-300 w-full rounded-2xl p-3 '>
                <div className='flex flex-col items-center justify-center gap-4'>
                    <div>
                        <img src={user?.auth?.user?.user?.image} alt="profile" className='w-20 h-20 border-3 border-warning rounded-full' />
                    </div>
                    <div>
                        <p className='text-2xl font-bold'>{user?.auth?.user?.user?.username}</p>
                    </div>
                </div>
            </div>
            <div className='bg-base-300 w-full rounded-2xl p-3 '>

                <div className='bg-base-200 border-success w-full rounded-2xl p-1'>
                    <p className='text-center text-xl font-extrabold text-warning'>Main information</p>
                </div>

                <div className='bg-base-200 mt-4 rounded-2xl p-3 flex flex-col gap-2 '>
                    <p className='text-xl font-bold gap-3 text-warning'>User id: <span className='text-xs relative left-2 text-base-content font-medium'>{user?.auth?.user?.user?._id}</span></p>
                    <p className='text-xl font-bold gap-3 text-warning'>Role: <span className='text-xl relative left-2 text-base-content'>{user?.auth?.user?.user?.role}</span></p>
                    <p className='text-xl font-bold gap-3 text-warning' >Status: <span className='text-xs p-2 bg-success  relative left-2 text-base-content  rounded-2xl'>{user?.auth?.user?.user?.satus || "Online"}</span></p>
                </div>
            </div>
        </div>
    )
}

export default Profile
