import { Outlet, Link } from 'react-router-dom';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user information from localStorage
    localStorage.removeItem("userInfo");
    // Redirect to login page
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gray-100">

      <Header />

      {/* Main Content */}
      <main className=" ">
        <Outlet />
        <ToastContainer position="top-right" autoClose={3000} />

      </main>
    </div>
  );
};

export default App;
