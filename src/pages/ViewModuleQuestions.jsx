import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleModule } from "../features/module/moduleSlice";
import { Link } from "react-router-dom";
const ViewModuleQuestions = () => {
    const { courseId, moduleId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentModule, loading, error } = useSelector(
        (state) => state.modules
    );

    useEffect(() => {
        dispatch(fetchSingleModule(moduleId));
    }, [dispatch, moduleId]);

    const handleBack = () => {
        // navigate to something like /courses/:courseId/modules
        navigate(`/courses/${courseId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gray-900 text-gray-200 font-mono p-6">
                <p className="text-green-400">Loading module details...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen w-full bg-gray-900 text-gray-200 font-mono p-6">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }
    if (!currentModule) {
        return (
            <div className="min-h-screen w-full bg-gray-900 text-gray-200 font-mono p-6">
                <p>No module found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full pt-20 bg-gray-900 text-gray-200 font-mono">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md">
                <div>
                    <h1 className="text-xl font-bold text-green-400">
                        Module: {currentModule.title}
                    </h1>
                    <h1 className="text-sm font-bold text-red-400">
                        Description: {currentModule.description}
                    </h1>
                </div>
                <button
                    onClick={handleBack}
                    className="
            bg-gray-600 
            text-gray-100 
            px-4 py-2 
            rounded 
            hover:bg-gray-500
            transition 
            shadow-md
          "
                >
                    Back
                </button>
            </div>

            {/* Info Section */}
            <div className="px-6 py-4 border-b border-gray-700 bg-gray-800 text-sm">
                <p className="text-gray-400">
                    Start Time:{" "}
                    <span className="text-gray-300">
                        {new Intl.DateTimeFormat("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        }).format(new Date(currentModule.startTime))}
                    </span>
                </p>
                <p className="text-gray-400">
                    End Time:{" "}
                    <span className="text-gray-300">
                        {new Intl.DateTimeFormat("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        }).format(new Date(currentModule.endTime))}
                    </span>
                </p>
                <p className="text-gray-400">
                    Teacher Name: <span className="text-gray-300">{currentModule.teacher?.name}</span>
                </p>
            </div>


            {/* Questions Table */}
            <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-green-300">
                    Questions in This Module
                </h2>

                {currentModule.questions?.length === 0 ? (
                    <p className="text-gray-400">No questions added to this module yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse bg-gray-800">
                            <thead>
                                <tr className="bg-gray-700 text-gray-300 uppercase text-xs tracking-wider">
                                    <th className="p-4 text-left font-medium">Question Title</th>
                                    <th className="p-4 text-left font-medium">Difficulty</th>
                                    <th className="p-4 text-left font-medium">Category</th>
                                    <th className="p-4 text-left font-medium">Tags</th>
                                    <th className="p-4 text-left font-medium">Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentModule.questions.map((subdoc) => {
                                    const q = subdoc.question; // e.g. { _id, title, difficulty, category, tags }
                                    if (!q) return null;
                                    return (
                                        <tr
                                            key={q._id}
                                            className="border-b border-gray-700 hover:bg-gray-700 transition"
                                        >
                                            {/* Question Title */}
                                            <td className="p-4 text-green-200">
                                                <Link
                                                    to={`/admin/questions/${q._id}`}
                                                    className="hover:underline capitalize"
                                                >
                                                    {q.title}
                                                </Link>
                                            </td>

                                            {/* Difficulty */}
                                            <td className="p-4 text-yellow-300">{q.difficulty}</td>

                                            {/* Category */}
                                            <td className="p-4 text-blue-300">{q.category}</td>

                                            {/* Tags */}
                                            <td className="p-4 text-purple-300">{q.tags?.join(", ") || "N/A"}</td>

                                            {/* Marks */}
                                            <td className="p-4 text-blue-300">{subdoc.marks || "N/A"}</td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewModuleQuestions;
