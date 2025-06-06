import React, { useState } from 'react';
import { FaUserAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

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
    // bu yerga API chaqiruv yozish mumkin

    try {
      const request = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await request.json();
      console.log("DATA: ", data);
      if (!request.ok) {
        throw new Error(data.error);
      };
      dispatch(login());
      navigate("/")
      toast.success("Logged successfully");
    } catch (e) {
      console.error("Server error: ", e.message);
      toast.error(e.message);
    }
  };

  return (
    <div className='w-full h-screen flex items-center justify-center relative'>
      <img
        src="https://cdn.dribbble.com/userupload/28367021/file/original-42e45cc7334d944fc3ffd100c1fa8101.jpg?resize=1024x889&vertical=center"
        className='w-full h-screen object-cover'
        alt=""
      />

      <div className='absolute top-1/2 left-1/2 py-10 px-5 w-[90%] max-w-md bg-base-300/70 backdrop-blur-md rounded-md -translate-x-1/2 -translate-y-1/2'>
        <p className='text-white text-2xl font-bold text-center mb-6'>Mafia Game – Login</p>

        <form onSubmit={handleSubmit} className='space-y-4'>

          {/* Username */}
          <label className='input input-bordered flex items-center gap-2 w-full'>
            <FaUserAlt />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className='grow bg-transparent outline-none w-full'
              value={formData.username}
              onChange={handleChange}
            />
          </label>
          {errors.username && <p className='text-red-400 text-sm'>{errors.username}</p>}

          {/* Password */}
          <label className='input input-bordered flex items-center gap-2 w-full'>
            <FaLock />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className='grow bg-transparent outline-none w-full'
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          {errors.password && <p className='text-red-400 text-sm'>{errors.password}</p>}

          {/* Submit */}
          <button type="submit" className='btn btn-primary w-full mt-4'>Sign in</button>

          <div className='flex items-center justify-center'>
            <Link to={"/register"} className='link link-error text-center'>
              Do you have not account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
