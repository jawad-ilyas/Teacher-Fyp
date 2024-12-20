import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Retrieve user info from localStorage

    if (!userInfo || !userInfo.data) {
        // If no user info is found, redirect to login
        return <Navigate to="/login" />;
    }

    // If authenticated, render the child component
    return children;
};

export default ProtectedRoute;
