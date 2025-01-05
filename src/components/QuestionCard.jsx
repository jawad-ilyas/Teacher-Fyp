import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { updateQuestionMarks } from "../features/questionMarks/questionMarksSlice";

const QuestionCard = ({ onUpdate ,submissionId, question, index, onView }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [marksAwarded, setMarksAwarded] = useState(question.marksAwarded || 0);
    const [remarks, setRemarks] = useState(question.remarks || "N/A");

    const handleMarksChange = (value) => {
        const parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > question.eachQuestionMark) {
            alert(`Marks must be between 0 and ${question.eachQuestionMark}`);
            return;
        }
        setMarksAwarded(parsedValue);
    };

    const handleSaveChanges = () => {
        if (marksAwarded < 0 || marksAwarded > question.eachQuestionMark) {
            alert(`Marks must be between 0 and ${question.eachQuestionMark}`);
            return;
        }

        const updatedQuestion = {
            submissionId: submissionId,
            questionId: question.question._id,
            marksAwarded,
            remarks,
        };

        // Dispatch Redux action to update marks
        // dispatch(updateQuestionMarks(updatedQuestion))
        //     .then(() => {
        //         alert("Marks updated successfully!");
        //         setIsEditing(false);
        //     })
        //     .catch((err) => {
        //         alert("Failed to update marks: " + err.message);
        //     });
        onUpdate(updatedQuestion);

    };

    return (
        <div className="bg-gray-800 p-4 rounded shadow border border-gray-600">
            <h4 className="font-bold text-green-300 mb-2">
                Question {index + 1}:{" "}
                <Link
                    to={`/admin/questions/${question.question?._id}`}
                    className="text-blue-400 hover:underline"
                >
                    {question.question?.title || "N/A"}
                </Link>
            </h4>
            <div className="mb-4">
                <p className="mb-2">
                    <span className="font-bold">Code:</span>
                </p>
                <Editor
                    height="200px"
                    theme="vs-dark"
                    defaultLanguage="javascript"
                    value={question.code || "// No code provided"}
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                    }}
                />
            </div>
            <div className="mt-4">
                <label className="font-bold">Marks Information:</label>
                <p className="text-green-300">
                    <span className="font-semibold">Total Marks:</span> {question.eachQuestionMark} |{" "}
                    <span className="font-semibold">Awarded Marks:</span> {marksAwarded}
                </p>
            </div>
            <div className="mt-4">
                <label className="font-bold">Marks Awarded:</label>
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
            <div className="mt-4 text-right space-x-2">
                {isEditing ? (
                    <>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                            onClick={handleSaveChanges}
                        >
                            Save
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                            onClick={() => onView(question)}
                        >
                            View
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuestionCard;
