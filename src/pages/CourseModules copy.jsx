import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    fetchModulesByCourse,
    deleteModule,
    updateModule,
} from "../features/module/moduleSlice";
import EditModuleModal from "../components/EditModuleModal";
import {
    FaPlus, // Add Question 
    FaEye, // View Questions 
    FaEdit, // Edit Module
    FaTrash, // Delete Module
    FaFileAlt // View Submissions
} from "react-icons/fa";
const CourseModules = () => {
    const { courseId } = useParams();
    const { teacherId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const teacherinfo = JSON.parse(localStorage.getItem("teacherinfo"));

    let verifyId = teacherinfo?.data?._i;

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
        dispatch(fetchModulesByCourse({ courseId, teacherId }));
    }, [dispatch, courseId, teacherId]);

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
    function goToAddQuestions(courseId, moduleId) {
        navigate(`/addquestionsintomodule/${courseId}/${moduleId}`);
    }
    function goToViewQuestions(courseId, moduleId) {
        navigate(`/courses/${courseId}/modules/${moduleId}`);
    }
    return (
        <div className="min-h-screen bg-gray-50">
            {/* HERO SECTION */}
            <div className="relative bg-teal-600 text-white py-10 pt-28 px-6 sm:px-12 rounded-b-3xl shadow-md">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/dashboard`)}
                    className="absolute top-20 left-8 bg-white text-teal-600 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition"
                >
                    Back
                </button>

                {/* Course Title / Subtitle */}
                <div className="mt-8 sm:mt-0">
                    <h1 className="text-xl pt-4 sm:text-2xl font-bold">
                        {course ? course.name : "Loading..."}
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-teal-100">
                        {course ? course.description : "Loading..."}
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
                {error && <p className="text-red-500">{error?.message}</p>}

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
                                    onClick={() => goToAddQuestions(courseId, module?._id)}
                                    className="flex items-center text-gray-600 hover:text-teal-600 text-sm"
                                    title="Add Questions"
                                >
                                    <FaPlus className="mr-1" />
                                    Add
                                </button>
                                <button
                                    onClick={() => goToViewQuestions(courseId, module?._id)}
                                    className="flex items-center text-gray-600 hover:text-teal-600 text-sm"
                                    title="View Questions"
                                >
                                    <FaEye className="mr-1" />
                                    View
                                </button>
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
                                <button
                                    onClick={() =>
                                        navigate(`/adminsubmissions/${module?.teacher}/${module?.course}/${module._id}`)
                                    }
                                    className="flex items-center text-gray-600 hover:text-teal-600 text-sm"
                                    title="View Submissions"
                                >
                                    <FaFileAlt className="mr-1" />
                                    Submissions
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
