import React, { useState } from 'react';
import { FaUserAlt, FaEnvelope, FaLock, FaArrowAltCircleLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log('✅ Form valid, sending to backend:', formData);
    // bu yerga API chaqiruv yozish mumkin
  };

  return (
    <div className='w-full h-screen flex items-center justify-center relative'>
      <img
        src="https://cdn.dribbble.com/userupload/28367021/file/original-42e45cc7334d944fc3ffd100c1fa8101.jpg?resize=1024x889&vertical=center"
        className='w-full h-screen object-cover'
        alt=""
      />

      <div className='absolute top-1/2 left-1/2 py-10 px-5 w-[90%] max-w-md bg-base-300/70 backdrop-blur-md rounded-md -translate-x-1/2 -translate-y-1/2'>
        <div className='relative'>
          <button className='btn btn-sm absolute -top-9 -left-4 z-10' onClick={() => navigate("/login")}><FaArrowAltCircleLeft /></button>
          <p className='text-white text-2xl font-bold text-center mb-6'>Mafia Game – Register</p>
        </div>

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
          <button type="submit" className='btn btn-primary w-full mt-4'>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
