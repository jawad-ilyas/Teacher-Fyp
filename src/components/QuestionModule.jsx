import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import Swal from "sweetalert2";

const QuestionModule = ({ question, onClose, onUpdate }) => {
    const maxMarks = question?.marks || 10; // Maximum marks for the question.
    const [marksAwarded, setMarksAwarded] = useState(question.marksAwarded || 0);
    const [remarks, setRemarks] = useState(question.remarks || "N/A");
    const [isEditing, setIsEditing] = useState(false);

    const handleMarksChange = (value) => {
        const parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue)) return;
        if (parsedValue < 0) {
            Swal.fire("Invalid Input", "Marks cannot be negative.", "error");
        } else if (parsedValue > maxMarks) {
            Swal.fire(
                "Invalid Input",
                `Marks cannot exceed the maximum allowed marks (${maxMarks}).`,
                "error"
            );
        } else {
            setMarksAwarded(parsedValue);
        }
    };

    const handleSaveChanges = () => {
        Swal.fire({
            title: "Save Changes?",
            text: "Do you want to save the updates to this question?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, save it!",
        }).then((result) => {
            if (result.isConfirmed) {
                onUpdate({ ...question, marksAwarded, remarks });
                Swal.fire("Saved!", "The question has been updated.", "success");
                setIsEditing(false);
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded shadow-lg border border-gray-700 w-full max-w-3xl p-6">
                <h3 className="font-bold text-green-300 mb-4 text-xl">
                    {question.question?.title || "N/A"}
                </h3>
                <div className="mb-4">
                    <p className="mb-2">
                        <span className="font-bold">Code:</span>
                    </p>
                    <Editor
                        height="300px"
                        theme="vs-dark"
                        defaultLanguage={question.language || "Cpp"}
                        value={question.code || "// No code provided"}
                        options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                        }}
                    />
                </div>
                <div className="mt-4">
                    <label className="font-bold">Marks Awarded (Max: {maxMarks}):</label>
                    {isEditing ? (
                        <input
                            type="number"
                            value={marksAwarded}
                            onChange={(e) => handleMarksChange(e.target.value)}
                            className="bg-gray-700 text-white rounded p-2 mt-1 block w-full"
                        />
                    ) : (
                        <p className="text-green-300">{marksAwarded}</p>
                    )}
                </div>
                <div className="mt-4">
                    <label className="font-bold">Remarks:</label>
                    {isEditing ? (
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="bg-gray-700 text-white rounded p-2 mt-1 block w-full"
                        />
                    ) : (
                        <p className="text-gray-300">{remarks}</p>
                    )}
                </div>
                <div className="mt-6 text-right">
                    {isEditing ? (
                        <>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 mr-2"
                                onClick={handleSaveChanges}
                            >
                                Save Changes
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                    )}
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 ml-2"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionModule;
