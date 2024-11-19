
import { Link, Route, Routes, useNavigate, Navigate } from "react-router-dom";
import React, { useState } from 'react';
import { nav } from "./navs";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import { AuthData } from "../../store/AuthWrapper";
import AuthMiddleware from "../../middleware/Auth";


export const RenderRoutes = () => {
    const { user } = AuthData()
    console.log(user)
    const renderRoutes = (routes) =>
        routes.map((route, index) => {
            if (route.isPrivate && !user?.isAuthenticated) {
                return <Route key={index} path={route.path} element={<Navigate to="/auth/login" replace />} />;
            }

            if (route.children) {
                
                return (
                    
                    <Route key={index} path={route.path} element={route.element}>
            
                        {renderRoutes(route.children)}
                            
                    </Route>
                    
                );
            }

            return <Route key={index} path={route.path} element={route.element} />;
        });

    return <Routes>{renderRoutes(nav)}</Routes>;
    }

export const RenderMenu = () => {
    const [loading, setLoading] = useState(false)
    const { user ,logout} = AuthData()
    console.log(user)
    // const logout = useLogout()
    
    const navigate = useNavigate()

    async function onLogout() {
        setLoading(true);
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            console.log('Logout successful');
            setLoading(false);
        }
    }
    const MenuItem = ({ r }) => (
        <div className="menuItem">
            <Link to={r.path}>{r.name}</Link>
        </div>
    );
    // Helper function to flatten the nav structure
    const flattenNav = (routes) => {
        const flatMenu = [];
        routes.forEach((r) => {
            if (r.isMenu) flatMenu.push(r);
            if (r.children) flatMenu.push(...flattenNav(r.children));
        });
        return flatMenu;
    };

    const menuItems = flattenNav(nav);
    return (
        <div className="menu">
            {menuItems.filter((r) => r.isMenu).map((r, i) => (
                <MenuItem key={i} r={r} />
            ))}

            {user.isAuthenticated ?
                <div className="menuItem"><Link to={'#'} onClick={logout}>Log out</Link></div>
                :
                <div className="menuItem"><Link to={'/auth/login'}>Login</Link></div>}
        </div>
    )
}
