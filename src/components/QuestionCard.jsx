
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";

const QuestionCard = ({ question, index, onEdit, onView }) => {
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
            <p className="mt-4">
                <span className="font-bold">Marks Awarded:</span> {question.marksAwarded || "N/A"}
            </p>
            <p>
                <span className="font-bold">Remarks:</span> {question.remarks || "N/A"}
            </p>
            <div className="mt-4 text-right space-x-2">
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                    onClick={() => onView(question)}
                >
                    View
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                    onClick={() => onEdit(question)}
                >
                    Edit
                </button>
            </div>
        </div>
    );
};

export default QuestionCard;
