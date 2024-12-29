import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchSingleStudent,
    updateSingleStudent,
    deleteSingleStudent,
} from "../features/student/studentSlice";
import { FaSave, FaTimes, FaEdit, FaTrashAlt } from "react-icons/fa";
import ErrorAlert from "../components/ErrorAlert";

const StudentProfile = () => {
    const { studentId } = useParams(); // from /students/:studentId
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentStudent, loading, error, successMessage } = useSelector(
        (state) => state.student
    );

    // Local state for editing
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Fetch the student on mount or whenever studentId changes
    useEffect(() => {
        if (studentId) {
            dispatch(fetchSingleStudent(studentId));
        }
    }, [studentId, dispatch]);

    // Whenever `currentStudent` changes, fill local states
    useEffect(() => {
        if (currentStudent) {
            setName(currentStudent.name || "");
            setEmail(currentStudent.email || "");
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
            // after successful update, exit edit mode
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update student:", err);
            // Optionally, you can handle additional error logging here
        }
    };

    // Delete student
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this student?");
        if (!confirmDelete) return;

        try {
            await dispatch(deleteSingleStudent(studentId)).unwrap();
            // after delete, navigate away
            navigate("/students"); // Replace with your desired route
        } catch (err) {
            console.error("Failed to delete student:", err);
            // Optionally, you can handle additional error logging here
        }
    };

    if (loading) {
        return <p className="p-4">Loading student data...</p>;
    }

    // Display error using ErrorAlert component
    // if (error) {
    //     return <ErrorAlert message={error} />;
    // }

    if (!currentStudent) {
        return <p className="p-4">No student found.</p>;
    }

    return (
        <div className="max-w-2xl pt-40 mx-auto mt-8 bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Student Profile</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                >
                    Back
                </button>
            </div>

            {/* Success message from the slice */}
            {successMessage && (
                <p className="mb-4 text-sm text-green-600">{successMessage}</p>
            )}
            {error && (
                <p className="mb-4 text-sm text-red-600">{error}</p>
            )}

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                    <p className="mt-1 text-gray-900 text-sm font-medium bg-gray-100 p-2 rounded-md">
                        {currentStudent._id}
                    </p>
                </div>

                {/* Conditionally render either a read-only text or an editable input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    {isEditing ? (
                        <input
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    ) : (
                        <p className="mt-1 text-gray-900 text-sm bg-gray-100 p-2 rounded-md">
                            {currentStudent.name}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    {isEditing ? (
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    ) : (
                        <p className="mt-1 text-gray-900 text-sm bg-gray-100 p-2 rounded-md">
                            {currentStudent.email}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                {isEditing && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-end space-x-4">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="flex items-center px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
                        >
                            <FaSave className="mr-2" /> Save
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="flex items-center px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
                        >
                            <FaTimes className="mr-2" /> Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleEdit}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                        >
                            <FaEdit className="mr-2" /> Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                        >
                            <FaTrashAlt className="mr-2" /> Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentProfile;
