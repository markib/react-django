import { Navigate } from "react-router-dom";
import AuthMiddleware from "../../middleware/Auth";
import PersistLogin from "../PersistLogin";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import Profile from "../../pages/Profile";


export const nav = [
    {
        path: '/',
        element: <PersistLogin />,
        isPrivate: false,
        isMenu: true,
        children: [
            { index: true, element: <Home />, isPrivate: false, isMenu: true },
            { path: '/auth/login', element: <Login />, isPrivate: false, isMenu: false },
            { path: '/auth/register', element: <Register />, isPrivate: false, isMenu: true },
            {
                path: '/auth/profile',

                element: (

                    <AuthMiddleware>

                        <Profile />

                    </AuthMiddleware>

                ),

                isPrivate: true,

                isMenu: true,
            },
        ],
    },
    // {
    //     path: '*',
    //     element: <Navigate to="/" />,
    //     isPrivate: false,
    //     isMenu: true
    // },
];