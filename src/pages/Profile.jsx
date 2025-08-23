import { useSelector } from 'react-redux';

const Profile = () => {
    const user = useSelector((state) => state);
    console.log("users profile: ", user);

    return (
        <div className='flex flex-col gap-6 m-4 max-w-md mx-auto'>
            {/* Profile Header Card */}
            <div className='bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border border-primary/20 w-full rounded-3xl p-4 shadow-xl'>
                <div className='flex flex-col items-center justify-center gap-6'>
                    <div className='relative'>
                        <img 
                            src={user?.auth?.user?.user?.image} 
                            alt="profile" 
                            className='w-24 h-24 border-4 border-primary rounded-full shadow-lg ring-4 ring-primary/20 object-cover' 
                        />
                        <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-base-100'></div>
                    </div>
                    <div className='text-center'>
                        <p className='text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                            {user?.auth?.user?.user?.username}
                        </p>
                        <p className='text-sm text-base-content/70 mt-1'>Welcome back!</p>
                    </div>
                </div>
            </div>

            {/* Information Card */}
            <div className='bg-base-200/80 backdrop-blur-sm border border-base-300 w-full rounded-3xl p-6 shadow-lg'>
                <div className='bg-gradient-to-r from-accent/20 to-secondary/20 border border-accent/30 w-full rounded-2xl p-4 mb-6'>
                    <p className='text-center text-xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent'>
                        Main Information
                    </p>
                </div>
                
                <div className='bg-base-100/80 backdrop-blur-sm border border-base-300/50 rounded-2xl p-6 flex flex-col gap-6 shadow-inner'>
                    {/* User ID */}
                    <div className='flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-info/10 to-info/5 border border-info/20'>
                        <span className='text-lg font-semibold text-info'>ID:</span>
                        <span className='text-sm font-mono text-warning px-3 py-1 rounded-lg '>
                            {user?.auth?.user?.user?._id}
                        </span>
                    </div>

                    {/* Role */}
                    <div className='flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20'>
                        <span className='text-lg font-semibold text-warning'>Role:</span>
                        <span className='text-lg font-bold text-warning bg-warning/20 px-4 py-1 rounded-lg border border-warning/30'>
                            {user?.auth?.user?.user?.role}
                        </span>
                    </div>

                    {/* Status */}
                    <div className='flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-success/10 to-success/5 border border-success/20'>
                        <span className='text-lg font-semibold text-success'>Status:</span>
                        <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 bg-success rounded-full animate-pulse'></div>
                            <span className='text-sm font-medium bg-success text-success-content px-4 py-2 rounded-full shadow-sm'>
                                {user?.auth?.user?.user?.satus || "Online"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile