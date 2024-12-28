import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, updateUserProfile } from "../features/userProfile/UserProfile";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // For navigation

    const { user, loading, error, successMessage } = useSelector(
        (state) => state.userProfile
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        // Fetch user profile data on page load
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        // Populate the form fields with user data when fetched
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                password: "",
            });
        }
    }, [user, reset]);

    const onSubmit = (data) => {
        const updatedData = {
            name: data.name,
            password: data.password || undefined, // Only send password if it's provided
        };

        dispatch(updateUserProfile(updatedData));
    };

    return (
        <div className="relative max-w-xl mx-auto mt-20 px-6 py-20 bg-white shadow-md rounded-lg">
            {/* Back Button (top-left corner) */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-8 left-4 text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition"
            >
                &larr; Back
            </button>

            {/* Heading */}
            <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                My Profile
            </h1>

            {/* Error or Success Messages */}
            {error && (
                <p className="text-red-500 mb-4 text-center">{error}</p>
            )}
            {successMessage && (
                <p className="text-green-500 mb-4 text-center">{successMessage}</p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name Field */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="
              w-full
              border
              rounded-md
              px-4
              py-2
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
                        placeholder="Enter your name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Email Field (read-only) */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        {...register("email")}
                        className="
              w-full
              border
              rounded-md
              px-4
              py-2
              bg-gray-100
              text-gray-500
              cursor-not-allowed
            "
                        readOnly
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        New Password
                    </label>
                    <input
                        type="password"
                        {...register("password", {
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        })}
                        className="
              w-full
              border
              rounded-md
              px-4
              py-2
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
                        placeholder="Enter a new password (optional)"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="text-right">
                    <button
                        type="submit"
                        disabled={loading}
                        className="
              px-5
              py-2
              bg-teal-600
              text-white
              font-medium
              rounded-md
              hover:bg-teal-700
              transition
              disabled:opacity-50
            "
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;
