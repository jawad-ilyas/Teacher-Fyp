import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchSingleStudent,
    updateSingleStudent,
    deleteSingleStudent,
} from "../features/student/studentSlice";

const StudentProfile = () => {
    const { studentId } = useParams(); // from /students/:studentId
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentStudent ="", loading, error, successMessage } = useSelector(
        (state) => state.student
    );
    useEffect(() => {
        if (currentStudent) {
            setName(currentStudent.name || "");
            setEmail(currentStudent.email || "");
        }
    }, [currentStudent]);
    // Local state for editing
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // Fetch the student on mount or whenever studentId changes
    useEffect(() => {
        dispatch(fetchSingleStudent(studentId));
    }, [studentId, dispatch]);

    // Whenever `currentStudent` changes, fill local states


    // Switch to edit mode
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        // revert changes from store
        if (currentStudent) {
            setName(currentStudent.name || "");
            setEmail(currentStudent.email || "");
        }
    };

    // Submit updates
    const handleSave = async () => {
        // dispatch an update
        try {
            const updates = { name, email };
            await dispatch(updateSingleStudent({ studentId, updates })).unwrap();
            // after successful update, exit edit mode
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update student:", err);
        }
    };

    // Delete student from DB entirely (if that's your logic)
    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this student?");
        if (!confirm) return;

        try {
            await dispatch(deleteSingleStudent(studentId)).unwrap();
            // after delete, navigate away
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
        <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Student Profile</h1>

            {/* Success message from the slice */}
            {successMessage && (
                <p className="mb-2 text-green-600">{successMessage}</p>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Student ID</label>
                <p className="mt-1 text-gray-600">{currentStudent._id}</p>
            </div>

            {/* Conditionally render either a read-only text or an editable input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                {isEditing ? (
                    <input
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                ) : (
                    <p className="mt-1 text-gray-600">{currentStudent.name}</p>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                {isEditing ? (
                    <input
                        type="email"
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                ) : (
                    <p className="mt-1 text-gray-600">{currentStudent.email}</p>
                )}
            </div>

            {/* Additional fields (role, branding, etc.) can be similarly handled. */}

            <div className="mt-6 flex space-x-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Delete Student
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentProfile;
