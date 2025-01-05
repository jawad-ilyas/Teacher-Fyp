import React from "react";
import Editor from "@monaco-editor/react";

const QuestionModule = ({ question, onClose }) => {
    if (!question) {
        return (
            <div className="bg-red-500 p-4 rounded text-white">
                <p>Question details are unavailable.</p>
            </div>
        );
    }

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
                        defaultLanguage={question.language || "javascript"}
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
                <div className="mt-6 text-right">
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
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
