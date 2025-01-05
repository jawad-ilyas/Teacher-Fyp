import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { loginUser, clearError } from "../features/user/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
    const dispatch = useDispatch();
    const { loading, error, userInfo } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        // Clear previous errors when loading the login page
        dispatch(clearError());

        // If the user is already logged in, redirect to the dashboard
        const storedUserInfo = localStorage.getItem("userInfo");
        if (userInfo || storedUserInfo) {
            navigate("/dashboard"); // Replace with your desired route
        }
    }, [dispatch, userInfo, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        console.log("Login form submitted:", data);

        try {
            const resultAction = await dispatch(loginUser(data));
            if (loginUser.fulfilled.match(resultAction)) {
                navigate("/dashboard"); // Redirect to dashboard on successful login
            } else {
                console.error("Login failed:", resultAction.payload);
            }
        } catch (err) {
            console.error("Error during login:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-4">Log in</h1>
                {error && <p className="text-red-500 text-center mb-4">{error?.message}</p>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: "Password is required" })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-teal-600 hover:underline font-medium"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
