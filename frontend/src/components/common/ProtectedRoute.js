import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';



const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    // console.log("Is Authenticated:", user); // Log this value
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
       
    }

    return children;
};

export default ProtectedRoute;