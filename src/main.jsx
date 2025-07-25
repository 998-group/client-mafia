import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from './App.jsx'
import { persistor, store } from './redux/store.js';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PrivateRouter from './guard/PrivateRouter.jsx';
import Home from './pages/Home.jsx';
import { ToastContainer, toast } from 'react-toastify';
import Room from './pages/Room.jsx';
import Games from './pages/Games.jsx';
import Game from "./pages/Game.jsx"
import ChatGlobal from './pages/ChatGlobal.jsx';
import Profile from './pages/Profile.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRouter>
        <App />
      </PrivateRouter>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: "/",
            element: <ChatGlobal />,
          },
          {
            path: "/profile",
            element: <Profile/>,
          },
          {
            path: "/shop",
            element: <div>shop</div>,
          },
        ]
      },
      {
        path: "/games",
        element: <Games />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/room/:roomId/waiting",
    element:
      <PrivateRouter>
        <Room />
      </PrivateRouter>
  },
  {
    path: "/room/:roomId/playing",
    element:
      <PrivateRouter>
        <Game />
      </PrivateRouter>

  }

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <ToastContainer />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
