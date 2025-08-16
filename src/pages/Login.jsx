import React, { useState } from 'react';
import { FaUserAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword]=useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log('✅ Form valid, sending to backend:', formData);
    try {
      const request = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await request.json();
      console.log("DATA: ", data);
      if (!request.ok) {
        throw new Error(data.error);
      };
      dispatch(login(data));
      navigate("/")
      toast.success("Logged successfully");
    } catch (e) {
      console.error("Server error: ", e.message);
      toast.error(e.message);
    }
  };

  return (
    <div className='w-full h-screen relative flex items-center justify-center overflow-hidden'>
      {/* Background image */}
      <img
        src="https://cdn.dribbble.com/userupload/28367021/file/original-42e45cc7334d944fc3ffd100c1fa8101.jpg?resize=1024x889&vertical=center"
        className='absolute inset-0 w-full h-full object-cover z-0'
        alt="Background"
      />

      {/* Overlay */}
      <div className='absolute inset-0 bg-black/50 z-10 backdrop-blur-sm'></div>

      {/* Login box */}
      <div className='relative z-20 w-[90%] max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl text-white'>
        <h2 className='text-3xl font-bold text-center mb-6 drop-shadow-md'>🔐 Mafia Game Login</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>

          {/* Username input */}
          <div>
            <label className='input input-bordered flex items-center gap-3 bg-white/10 text-white w-full'>
              <FaUserAlt />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className='bg-transparent outline-none w-full placeholder-white/80 text-white'
                value={formData.username}
                onChange={handleChange}
              />
            </label>
            {errors.username && <p className='text-red-300 text-sm mt-1'>{errors.username}</p>}
          </div>

          {/* Password input */}
          <div>
            <label className='input input-bordered flex items-center gap-3 bg-white/10 text-white w-full'>
              <FaLock />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                className='bg-transparent outline-none w-full placeholder-white/80 text-white'
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className='text-xl text-white/60 hover:text-white transition'
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </label>
            {errors.password && <p className='text-red-300 text-sm mt-1'>{errors.password}</p>}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className='btn btn-primary w-full mt-4 transition-all duration-300 hover:scale-105 shadow-md'
          >
            Sign in
          </button>

          {/* Link */}
          <div className='text-center mt-4'>
            <Link to="/register" className='text-white underline hover:text-blue-300 transition'>
              Don’t have an account? Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
