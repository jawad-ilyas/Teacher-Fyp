// src/components/RegistrationForm.jsx
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
// import { registerUser } from '../features/user/userSlice';

const RegistrationForm = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const dispatch = useDispatch();

    const { loading, error, teacherinfo } = useSelector((state) => state.user);

    const onSubmit = (data) => {
        // Dispatch the registerUser thunk
        // dispatch(registerUser(data));
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

            {error && <div className="mb-4 text-red-500">{error}</div>}
            {teacherinfo && <div className="mb-4 text-green-500">Registration Successful!</div>}

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name Field */}
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>

                {/* Email Field */}
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email address"
                            }
                        })}
                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>

                {/* Password Field */}
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                        className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>

                {/* Confirm Password Field */}
                <div className="mb-6">
                    <label className="block text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) => value === watch('password') || "Passwords do not match"
                        })}
                        className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm;
