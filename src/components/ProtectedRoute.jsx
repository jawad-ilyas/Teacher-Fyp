import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Retrieve user info from localStorage

    // Check if user is logged in
    if (!userInfo || !userInfo.data) {
        return <Navigate to="/login" />;
    }

    // Check if the user's role is "admin"
    if (userInfo.data.role !== "admin") {
        return <Navigate to="/login" />;
    }

    // If authenticated and has "admin" role, render the child component
    return children;
};

export default ProtectedRoute;
