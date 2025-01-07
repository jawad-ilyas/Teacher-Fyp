import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const teacherinfo = JSON.parse(localStorage.getItem("teacherinfo"));

    // If no teacherinfo or no token
    if (!teacherinfo || !teacherinfo?.data?.token) {
        return <Navigate to="/login" />;
    }

    // If you're strictly requiring the role "teacher"
    if (teacherinfo?.data.role !== "teacher") {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
