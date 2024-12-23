import { fetchModulesByCourse, deleteModule, updateModule } from "../features/module/moduleSlice";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect } from "react";
import EditModuleModal from "../components/EditModuleModal";
import { useNavigate } from "react-router-dom";
const CourseModules = () => {
    const { courseId } = useParams(); // Get courseId from the URL
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { modules, loading, error } = useSelector((state) => state.modules);
    const { courses } = useSelector((state) => state.courses);
    const course = courses.find((course) => course._id === courseId);

    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [currentModule, setCurrentModule] = useState(null);

    useEffect(() => {
        dispatch(fetchModulesByCourse(courseId)); // Fetch modules for the course
    }, [dispatch, courseId]);

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

    const handleEdit = (module) => {
        setCurrentModule(module);
        setEditModalVisible(true);
    };

    const handleEditSubmit = (updatedModule) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const teacherId = userInfo?.data?._id; // Get teacher ID from local storage

        if (!teacherId) {
            Swal.fire("Error", "Teacher ID is missing. Please log in again.", "error");
            return;
        }

        dispatch(
            updateModule({
                ...updatedModule,
                id: currentModule._id, // Module ID
                courseId: currentModule.courseId, // Course ID from the current module
                teacherId, // Teacher ID
            })
        );
        setEditModalVisible(false);
    };


    return (
        <div className="p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 bg-darkGreenColor text-white px-4 py-2 rounded-lg hover:bg-gray-400"
            >
                Back111111
            </button>

            <h1 className="text-2xl text-darkGreenColor font-semibold mb-6">
               Course :  {course ? course.name : "Loading..."}
            </h1>

            <div className="space-y-8">
                {modules.map((module, index) => (
                    <div key={module._id} className="bg-[#F2F5F6] rounded-lg shadow-md p-6 flex items-start space-x-4">
                        <div className="text-darkGreenColor text-2xl font-bold flex items-center justify-center w-10 h-10 rounded-full border-2 border-darkGreenColor">
                            {index + 1}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                {module.title}
                            </h3>
                            <p className="text-xl text-gray-600 mb-4">{module.description}</p>
                            <div className="text-lg text-gray-500 space-y-1">
                                <p>
                                    <span className="font-bold">Start:</span>{" "}
                                    {new Date(module.startTime).toLocaleString()}
                                </p>
                                <p>
                                    <span className="font-bold">End:</span>{" "}
                                    {new Date(module.endTime).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <button
                                onClick={() => handleEdit(module)}
                                className="flex items-center text-black px-3 py-2 rounded-lg hover:text-blue-700"
                            >
                                <FaEdit className="mr-1" />
                            </button>
                            <button
                                onClick={() => handleDelete(module._id)}
                                className="flex items-center text-black px-3 py-2 rounded-lg hover:text-red-700"
                            >
                                <FaTrash className="mr-1" />
                            </button>
                        </div>
                    </div>
                ))}
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
