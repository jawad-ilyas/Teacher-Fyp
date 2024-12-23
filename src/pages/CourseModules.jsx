import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

import {
    fetchModulesByCourse,
    deleteModule,
    updateModule,
} from "../features/module/moduleSlice";
import EditModuleModal from "../components/EditModuleModal";

const CourseModules = () => {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State from Redux
    const { modules, loading, error } = useSelector((state) => state.modules);
    const { courses } = useSelector((state) => state.courses);

    // Find the current course from Redux
    const course = courses.find((c) => c._id === courseId);

    // Local states
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [currentModule, setCurrentModule] = useState(null);

    // Fetch modules on mount
    useEffect(() => {
        dispatch(fetchModulesByCourse(courseId));
    }, [dispatch, courseId]);

    // Delete a module
    const handleDelete = (moduleId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteModule(moduleId));
                Swal.fire("Deleted!", "Your module has been deleted.", "success");
            }
        });
    };

    // Edit a module
    const handleEdit = (module) => {
        setCurrentModule(module);
        setEditModalVisible(true);
    };

    // Submit edited module
    const handleEditSubmit = (updatedModule) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const teacherId = userInfo?.data?._id;

        if (!teacherId) {
            Swal.fire("Error", "Teacher ID is missing. Please log in again.", "error");
            return;
        }

        dispatch(
            updateModule({
                ...updatedModule,
                id: currentModule._id,
                courseId: currentModule.courseId,
                teacherId,
            })
        );
        setEditModalVisible(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* HERO SECTION */}
            <div className="relative bg-teal-600 text-white py-10 px-6 sm:px-12 rounded-b-3xl shadow-md">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 bg-white text-teal-600 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition"
                >
                    Back
                </button>

                {/* Course Title / Subtitle */}
                <div className="mt-8 sm:mt-0">
                    <h1 className="text-3xl sm:text-4xl font-bold">
                        {course ? course.name : "Loading..."}
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-teal-100">
                        A brief description or tagline for the course can go here.
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT: Modules */}
            <div className="mt-8 px-6 sm:px-12">
                {/* Heading for Modules */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Module’s elements
                </h2>

                {loading && <p>Loading modules...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {/* List of Modules as "cards" */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
                    {modules.map((module) => (
                        <div
                            key={module._id}
                            className="
                bg-white
                rounded-lg
                shadow-sm
                p-5
                relative
                hover:shadow-md
                transition
              "
                        >
                            {/* Module Title */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {module.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-3">
                                {module.description}
                            </p>

                            {/* Times */}
                            <div className="text-xs text-gray-500 space-y-1 mb-4">
                                <p>
                                    <span className="font-semibold">Start:</span>{" "}
                                    {new Date(module.startTime).toLocaleString()}
                                </p>
                                <p>
                                    <span className="font-semibold">End:</span>{" "}
                                    {new Date(module.endTime).toLocaleString()}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => handleEdit(module)}
                                    className="flex items-center text-gray-600 hover:text-teal-600 text-sm"
                                    title="Edit Module"
                                >
                                    <FaEdit className="mr-1" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(module._id)}
                                    className="flex items-center text-gray-600 hover:text-red-600 text-sm"
                                    title="Delete Module"
                                >
                                    <FaTrash className="mr-1" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Modal */}
            <EditModuleModal
                isVisible={isEditModalVisible}
                onClose={() => setEditModalVisible(false)}
                onSubmit={handleEditSubmit}
                module={currentModule}
            />
        </div>
    );
};

export default CourseModules;
