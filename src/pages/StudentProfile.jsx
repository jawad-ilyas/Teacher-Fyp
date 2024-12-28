import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchSingleStudent,
    updateSingleStudent,
    deleteSingleStudent,
} from "../features/student/studentSlice";

const StudentProfile = () => {
    const { studentId } = useParams(); // e.g. /students/:studentId
    const { courseId } = useParams();  // e.g. /courses/:courseId
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentStudent = "", loading, error, successMessage } = useSelector(
        (state) => state.student
    );

    // Local state for editing
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    // NEW: For updating the student's password
    const [password, setPassword] = useState("");

    // Fetch the student on mount or whenever studentId changes
    useEffect(() => {
        dispatch(fetchSingleStudent(studentId));
    }, [studentId, dispatch]);

    // When currentStudent changes in Redux, update local states
    useEffect(() => {
        if (currentStudent) {
            setName(currentStudent.name || "");
            setEmail(currentStudent.email || "");
            // We do NOT display or store the existing password, so we keep password field blank
            setPassword("");
        }
    }, [currentStudent]);

    // Switch to edit mode
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        if (currentStudent) {
            setName(currentStudent.name || "");
            setEmail(currentStudent.email || "");
            setPassword("");
        }
    };

    // Submit updates
    const handleSave = async () => {
        try {
            // Build the updates object
            const updates = { name, email };
            // If the admin entered a new password, add it to updates
            if (password.trim()) {
                updates.password = password;
            }

            await dispatch(updateSingleStudent({ studentId, updates })).unwrap();

            // After successful update, exit edit mode
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update student:", err);
        }
    };

    // Delete student
    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this student?");
        if (!confirm) return;

        try {
            await dispatch(deleteSingleStudent(studentId)).unwrap();
            // After deleting, perhaps navigate back to an admin dashboard
            navigate("/somewhere-else");
        } catch (err) {
            console.error("Failed to delete student:", err);
        }
    };

    if (loading) {
        return <p className="p-4">Loading student data...</p>;
    }
    if (error) {
        return <p className="p-4 text-red-500">{error}</p>;
    }
    if (!currentStudent) {
        return <p className="p-4">No student found.</p>;
    }

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-xl font-bold text-green-400 mb-4">Student Profile</h1>
                <button
                    onClick={() => navigate(`/courses/${courseId}/enrolled-students`)}
                    className="bg-white text-teal-600 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition"
                >
                    Back
                </button>
            </div>

            {successMessage && (
                <p className="mb-4 text-sm text-green-600">{successMessage}</p>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Student ID</label>
                <p className="mt-1 text-gray-800 text-sm font-medium">
                    {currentStudent._id}
                </p>
            </div>

            {/* Name Field */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Name</label>
                {isEditing ? (
                    <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                ) : (
                    <p className="mt-1 text-gray-800 text-sm">{currentStudent.name}</p>
                )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Email</label>
                {isEditing ? (
                    <input
                        type="email"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                ) : (
                    <p className="mt-1 text-gray-800 text-sm">{currentStudent.email}</p>
                )}
            </div>

            {/* NEW: Password Field (only visible in edit mode) */}
            {isEditing && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">New Password</label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep the current password"
                    />
                </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentProfile;
