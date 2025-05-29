import React, { useState } from 'react';
import { FaUserAlt, FaEnvelope, FaLock, FaArrowAltCircleLeft } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../redux/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()
  const dispatch = useDispatch();

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
      const request = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const response = await request.json()
      console.log(response);

      if (request.ok) {
        toast.success("Register success", { theme: "colored" })
        dispatch(register({ user: response, token: "token" }))
        navigate("/")
      }

    }
    catch (e) {
      console.error(e)
      toast.error(e)
    }
  };

  return (
    <div className='w-full h-screen flex items-center justify-center relative'>
      {/* Background image */}
      <img
        src="https://cdn.dribbble.com/userupload/28367021/file/original-42e45cc7334d944fc3ffd100c1fa8101.jpg?resize=1024x889&vertical=center"
        className='absolute inset-0 w-full h-full object-cover z-0'
        alt="Background"
      />

      {/* Overlay */}
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm z-10'></div>

      {/* Register box */}
      <div className='relative z-20 w-[90%] max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl text-white'>

        {/* Back button */}
        <button
          className='absolute top-4 left-4 text-white text-2xl hover:text-gray-300 transition'
          onClick={() => navigate("/login")}
        >
          <FaArrowAltCircleLeft />
        </button>

        <h2 className='text-3xl font-bold text-center mb-6 drop-shadow-md'>📝 Mafia Game – Register</h2>

        <form onSubmit={handleSubmit} className='space-y-5'>

          {/* Username input */}
          <div>
            <label className='input input-bordered flex items-center gap-3 bg-white/10 text-white'>
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
            <label className='input input-bordered flex items-center gap-3 bg-white/10 text-white'>
              <FaLock />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className='bg-transparent outline-none w-full placeholder-white/80 text-white'
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className='text-xl text-white/70 hover:text-white transition'
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
            className='btn btn-primary w-full mt-2 transition-all duration-300 hover:scale-105 shadow-md'
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
