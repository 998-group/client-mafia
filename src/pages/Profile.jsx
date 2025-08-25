import { useSelector } from 'react-redux';

const Profile = () => {
    const user = useSelector((state) => state);
    console.log("users profile: ", user);

    return (
        <div className='max-w-md mx-auto m-6 animate-fadeIn'>
            {/* Modern Profile Card */}
            <div className='bg-gradient-to-br from-base-100 via-base-100 to-base-200/80 backdrop-blur-xl border border-base-300/60 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1'>
                
                {/* Animated Header */}
                <div className='flex items-center gap-6 mb-8 group'>
                    <div className='relative'>
                        <div className='absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300'></div>
                        <img 
                            src={user?.auth?.user?.user?.image} 
                            alt="profile" 
                            className='relative w-20 h-20 rounded-full object-cover ring-4 ring-base-100 shadow-xl transform group-hover:scale-105 transition-transform duration-300' 
                        />
                        <div className='absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-success to-accent rounded-full border-4 border-base-100 shadow-lg animate-pulse'></div>
                    </div>
                    <div className='flex-1 space-y-1'>
                        <h2 className='text-2xl font-bold bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-300'>
                            {user?.auth?.user?.user?.username}
                        </h2>
                        <p className='text-base-content/70 font-medium animate-pulse'>Welcome back! ✨</p>
                    </div>
                </div>

                {/* Animated Info Cards */}
                <div className='space-y-4'>
                    {/* ID Card */}
                    <div className='group flex justify-between items-center py-4 px-5 bg-gradient-to-r from-neutral/20 to-neutral/10 rounded-2xl border border-info/30 hover:bg-content/20 hover:border-neutral/50 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-success/50    from-neutral to-neutral-focus rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300'>
                                <svg className='w-5 h-5 text-neutral-content' fill='yellow' viewBox='0 0 20 20'>
                                    <path d='M10 12a2 2 0 100-4 2 2 0 000 4z'/>
                                    <path fillRule='evenodd' d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z' clipRule='evenodd'/>
                                </svg>
                            </div>
                            <span className='text-base font-semibold text-base-content/80'>ID</span>
                        </div>
                        <span className='text-sm font-mono text-error   bg-base-100/80 px-4 py-2 rounded-xl shadow-sm border border-base-300 group-hover:bg-base-100 transition-colors duration-300'>
                            {user?.auth?.user?.user?._id?.slice(-8)}...
                        </span>
                    </div>

                    {/* Role Card */}
                    <div className='group flex justify-between items-center py-4 px-5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl border border-primary/30 hover:border-primary/50 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-r from-primary to-primary-focus rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300'>
                                <svg className='w-5 h-5 text-primary-content' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm-1 0a1 1 0 011-1h8a1 1 0 011 1v1H5V6zm4-2a1 1 0 011-1h0a1 1 0 011 1v1H9V4z' clipRule='evenodd'/>
                                </svg>
                            </div>
                            <span className='text-base font-semibold text-primary'>Role</span>
                        </div>
                        <span className='text-sm font-bold text-primary-content bg-gradient-to-r from-primary/80 to-primary px-4 py-2 rounded-full shadow-sm transform group-hover:scale-105 transition-transform duration-300'>
                            {user?.auth?.user?.user?.role}
                        </span>
                    </div>

                    {/* Status Card */}
                    <div className='group flex justify-between items-center py-4 px-5 bg-gradient-to-r from-success/20 to-success/10 rounded-2xl border border-success/30 hover:border-success/50 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-r from-success to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300'>
                                <svg className='w-5 h-5 text-success-content' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'/>
                                </svg>
                            </div>
                            <span className='text-base font-semibold text-success'>Status</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='w-3 h-3 bg-gradient-to-r from-success to-accent rounded-full animate-pulse shadow-lg'></div>
                            <span className='text-sm font-semibold text-success-content bg-gradient-to-r from-success/80 to-success px-4 py-2 rounded-full transform group-hover:scale-105 transition-transform duration-300'>
                                {user?.auth?.user?.user?.status || "Online"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
            `}</style>
        </div>
    )
}

export default Profile