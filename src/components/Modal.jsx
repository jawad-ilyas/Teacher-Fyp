import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addCourse, updateCourse } from "../features/course/CourseSlice";
import { useEffect } from "react";
const Modal = ({ isVisible, onClose, initialValues = null }) => {
    const dispatch = useDispatch();
    const { loading, error, successMessage } = useSelector((state) => state.courses);

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
        } else {
            reset(); // Reset the form for creating a new course
        }
    }, [initialValues, setValue, reset]);

    // Submit handler
    const onSubmit = (data) => {
        const formData = new FormData();
        if (data.image) formData.append("image", data.image[0]);

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        console.log('User Info from Local Storage:', userInfo?.data?._id);

        formData.append("id", userInfo?.data?._id);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("category", data.category);

        if (initialValues) {
            dispatch(updateCourse({ id: initialValues._id, courseData: formData }));
        } else {
            dispatch(addCourse(formData));
        }

        reset();
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-700">
                        {initialValues ? "Update Course" : "Add New Course"}
                    </h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        &#x2715;
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Course Image
                        </label>
                        <input
                            type="file"
                            {...register("image")}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Course Name
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: "Course name is required" })}
                            placeholder="Enter course name"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Category
                        </label>
                        <select
                            {...register("category", { required: "Category is required" })}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="">Select Category</option>
                            <option value="Programming">Programming</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Web Development">Web Development</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            rows="4"
                            {...register("description", { required: "Description is required" })}
                            placeholder="Enter course description"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
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
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default Modal;
