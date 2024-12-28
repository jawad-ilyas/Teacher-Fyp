import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addCourse, updateCourse } from "../features/course/CourseSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Modal = ({ isVisible, onClose, initialValues = null }) => {
    const dispatch = useDispatch();
    const { loading, error, successMessage } = useSelector((state) => state.courses);

    // Local state to store the image preview URL
    const [imagePreview, setImagePreview] = useState(null);

    // React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm();

    // Populate form fields for editing
    useEffect(() => {
        if (initialValues) {
            setValue("name", initialValues.name);
            setValue("description", initialValues.description);
            setValue("category", initialValues.category);

            // If there's an existing image (like an image URL), show as preview
            // You might need to adjust this depending on your backend's file structure
            if (initialValues.imageUrl) {
                setImagePreview(initialValues.imageUrl);
            }
        } else {
            reset(); // Reset the form for creating a new course
            setImagePreview(null);
        }
    }, [initialValues, setValue, reset]);

    // Handle image preview
    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    // Submit handler
    const onSubmit = (data) => {

        try {
            const formData = new FormData();
            if (data.image && data.image.length > 0) {
                formData.append("image", data.image[0]);
            }

            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            formData.append("id", userInfo?.data?._id);
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("category", data.category);

            if (initialValues) {
                dispatch(updateCourse({ id: initialValues._id, courseData: formData }));
            } else {
                dispatch(addCourse(formData));
            }
            toast.success("update course   successfully!");

            reset();
            setImagePreview(null);
            onClose();
        }
        catch (err) {
            console.error("Failed to add student:", err);
            // Show an error toast
            toast.error("Failed to update course");
        }

    };

    // If not visible, don't render anything
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                        {initialValues ? "Update Course" : "Add New Course"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-lg font-semibold"
                    >
                        &#x2715;
                    </button>
                </div>

                {/* Top Section: Image Preview + Title/Subtitle */}
                <div className="flex flex-col sm:flex-row items-center mb-6 gap-4">
                    {/* Image Preview */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Course"
                                className="w-24 h-24 rounded-full object-cover border"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>
                    {/* Course Info (Name, Category, etc.) - optional short summary if needed */}
                    <div className="flex-grow">
                        <p className="text-sm text-gray-500">
                            {initialValues
                                ? "Editing existing course details."
                                : "Start by adding the required course info."}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    {/* Course Image */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {`Course Image ${initialValues ? "(Optional)" : "(Required)"}`}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("image", {
                                required: !initialValues && "Course image is required",
                            })}
                            onChange={handleImageChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.image && (
                            <p className="text-red-500 text-sm">{errors.image.message}</p>
                        )}
                    </div>

                    {/* Course Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course Name
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: "Course name is required" })}
                            placeholder="Enter course name"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Course Category */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            {...register("category", { required: "Category is required" })}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Category</option>
                            <option value="Programming">Programming</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Web Development">Web Development</option>
                        </select>
                        {errors.category && (
                            <p className="text-red-500 text-sm">{errors.category.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            rows="4"
                            {...register("description", {
                                required: "Description is required",
                            })}
                            placeholder="Enter course description"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Modal Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                        >
                            {loading
                                ? initialValues
                                    ? "Updating..."
                                    : "Saving..."
                                : initialValues
                                    ? "Update Course"
                                    : "Save Course"}
                        </button>
                    </div>

                    {/* Error & Success Messages */}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default Modal;
