import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';


const PrivateRouter = ({ children }) => {
    const auth = useSelector(state => state.auth.isAuth);
    const navigate = useNavigate();
    console.log("AUTH: ", auth);
    useEffect(() => {
      if(!auth) {
        navigate("/login")
      }
    }, [auth, navigate])
  return auth ? children : null
}

export default PrivateRouter 