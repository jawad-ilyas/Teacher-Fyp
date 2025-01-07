import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchUserProfile,
    updateUserProfile,
    updateUserProfileImage,
} from "../features/userProfile/UserProfile";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineCloudUpload } from "react-icons/ai"; // Icons for preview and upload

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, loading, error, successMessage } = useSelector(
        (state) => state.userProfile
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    const openPreviewModal = () => setIsPreviewModalOpen(true);
    const closePreviewModal = () => setIsPreviewModalOpen(false);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                password: "",
            });
            if (user.imageUrl) {
                setImagePreview(user.imageUrl);
            }
        }
    }, [user, reset]);

    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            if (!["image/jpeg", "image/png"].includes(file.type)) {
                toast.error("Only JPEG and PNG images are allowed.");
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size should not exceed 2MB.");
                return;
            }

            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImageUpload = () => {
        if (!selectedFile) {
            toast.error("No new image selected to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        // Log FormData key-value pairs for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`FormData Key: ${key}, Value: ${value}`);
        }

        dispatch(updateUserProfileImage(formData));
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        const dynamicData = {
            name: data.name,
            password: data.password || null, // Only add if not empty
        };

        // Loop through dynamic properties and append to FormData
        for (const key in dynamicData) {
            if (dynamicData[key]) {
                formData.append(key, dynamicData[key]);
            }
        }

        // Log FormData key-value pairs for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`FormData Key: ${key}, Value: ${value}`);
        }

        dispatch(updateUserProfile(formData));
    };
    return (
        <div className="relative max-w-xl mx-auto mt-20 px-6 py-20 bg-white shadow-md rounded-lg">
            <button
                onClick={() => navigate(-1)}
                className="absolute top-8 left-4 text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition"
            >
                &larr; Back
            </button>

            <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                My Profile
            </h1>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {successMessage && (
                <p className="text-green-500 mb-4 text-center">{successMessage}</p>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                encType="multipart/form-data"
            >
                <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 group">
                        {imagePreview ? (
                            <>
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={openPreviewModal}
                                        className="text-white mx-2 hover:text-gray-300"
                                    >
                                        <AiOutlineEye size={24} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleImageUpload}
                                        className="text-white mx-2 hover:text-gray-300"
                                    >
                                        <AiOutlineCloudUpload size={24} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <span className="text-gray-500 flex items-center justify-center h-full">
                                No Image
                            </span>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("image")}
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        {...register("email")}
                        className="w-full border rounded-md px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                        readOnly
                    />
                </div>

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
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter a new password (optional)"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </div>
            </form>

            {isPreviewModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
                        <button
                            onClick={closePreviewModal}
                            className="float-right text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <div className="clear-both" />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-w-full h-auto mt-4 rounded"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
