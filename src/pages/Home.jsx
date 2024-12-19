// src/pages/Home.jsx
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-semibold mb-4">Welcome to My FYP!</h1>
            <p className="mb-6 text-gray-600">
                This is the home page. Navigate to register to create your account.
            </p>
            <Link
                to="/register"
                className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
                Get Started
            </Link>
        </div>
    );
};

export default Home;
