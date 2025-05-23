import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { login } from '../redux/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "ss@gmail.com",
    password: "123123123",
  })

  const handleLogin = async () => {
    const request = await fetch("http://localhost:8000/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const response = await request.json();
    if (!request.ok) {
      throw new Error(response.message)
    }
    dispatch(login(response));
    navigate("/")
    console.log("LOGIN: ", response);
  }
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='w-1/5 bg-base-300 rounded-md p-5'>
        <form onSubmit={(e) => {
          e.preventDefault(); handleLogin();
        }
        }
          className='w-full flex flex-col gap-5 my-5'>
          <div className='flex items-center justify-center'>
            <p className='font-bold text-xl text-base-content'>Login</p>
          </div>
          <div>
            <label className="input validator w-full">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input type="email" name='email' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="mail@site.com" required />
            </label>
            <div className="validator-hint hidden">Enter valid email address</div>
          </div>
          <div>
            <label className="input validator w-full">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                  ></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input
                type="password"
                required
                name='password'
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
              />
            </label>
          </div>
          <div className='flex items-center justify-center'>
            <button className='btn btn-primary'>Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login