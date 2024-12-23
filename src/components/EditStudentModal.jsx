// EditStudentModal.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSingleStudent, updateSingleStudent } from "../features/student/studentSlice";

const EditStudentModal = ({ studentId, isVisible, onClose }) => {
    const dispatch = useDispatch();
    const { currentStudent, loading, error, successMessage } = useSelector((state) => state.student);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (isVisible) {
            dispatch(fetchSingleStudent(studentId));
        }
    }, [isVisible, studentId, dispatch]);

    useEffect(() => {
        if (currentStudent) {
            setName(currentStudent.name || "");
            setEmail(currentStudent.email || "");
        }
    }, [currentStudent]);

    const handleSave = async () => {
        try {
            await dispatch(updateSingleStudent({ studentId, updates: { name, email } })).unwrap();
            onClose(); // close the modal if success
        } catch (err) {
            console.error("Failed to update student:", err);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Edit Student</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-600">{successMessage}</p>}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditStudentModal;
