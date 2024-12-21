import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchQuestionById } from "../features/questionsSlice/QuestionsSlice";
import Editor from "@monaco-editor/react";
import axios from "axios";

const ShowQuestion = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedQuestion, loading, error } = useSelector((state) => state.Question);

    const [code, setCode] = useState(""); // Code written by the user
    const [output, setOutput] = useState(""); // Output from the compiler
    const [languageId, setLanguageId] = useState(54); // Default to C++ (Judge0 language_id)

    // Fetch question details when component mounts
    useEffect(() => {
        dispatch(fetchQuestionById(id));
    }, [dispatch, id]);

    // Function to handle code execution using Judge0 API
    const handleRunCode = async () => {
        const requestData = {
            source_code: code, // Code written by the user
            language_id: languageId, // Programming language ID
            stdin: "", // Standard input (optional)
        };

        try {
            // Submit the code for execution
            const submissionResponse = await axios.post(
                `${compilerAPI}?base64_encoded=true&wait=false&fields=*`,
                requestData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-rapidapi-host": "judge029.p.rapidapi.com",
                        "x-rapidapi-key": "03792f3ef2msh0a399f9707481e0p161bd2jsnff0604eef7e1", // Replace with your actual RapidAPI key
                    },
                }
            );

            const token = submissionResponse.data.token;

            // Poll for the result
            const resultResponse = await axios.get(
                `${compilerAPI}/${token}?base64_encoded=true&fields=*`,
                {
                    headers: {
                        "x-rapidapi-host": "judge029.p.rapidapi.com",
                        "x-rapidapi-key": "03792f3ef2msh0a399f9707481e0p161bd2jsnff0604eef7e1", // Replace with your actual RapidAPI key
                    },
                }
            );

            const decodedOutput = atob(resultResponse.data.stdout || resultResponse.data.stderr || "No Output");
            setOutput(decodedOutput); // Display the decoded output
        } catch (error) {
            setOutput("Error running code. Please try again.");
        }
    };


    if (loading) return <p>Loading question...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="flex flex-col md:flex-row p-4 min-h-screen bg-gray-50">
            {/* Left Panel: Problem Description */}
            <div className="md:w-1/3 bg-white shadow p-4 rounded-lg">
                <h1 className="text-2xl font-bold mb-4">{selectedQuestion?.title}</h1>
                <p className="text-gray-700 mb-4">{selectedQuestion?.problemStatement}</p>
                <h2 className="text-lg font-semibold mb-2">Examples:</h2>
                <ul className="list-disc ml-6 mb-4">
                    {selectedQuestion?.sampleTestCases?.map((example, index) => (
                        <li key={index} className="mb-2">
                            <strong>Input:</strong> {example.input} <br />
                            <strong>Output:</strong> {example.output}
                        </li>
                    ))}
                </ul>
                <h2 className="text-lg font-semibold mb-2">Constraints:</h2>
                <ul className="list-disc ml-6">
                    {selectedQuestion?.constraints?.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                    ))}
                </ul>
            </div>

            {/* Right Panel: Code Editor and Output */}
            <div className="md:w-2/3 md:ml-4 mt-4 md:mt-0">
                <div className="bg-white shadow p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Code Editor</h2>
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-600">Language:</label>
                        <select
                            value={languageId}
                            onChange={(e) => setLanguageId(Number(e.target.value))}
                            className="px-3 py-2 border rounded"
                        >
                            <option value={54}>C++</option>
                            <option value={71}>Python 3</option>
                            <option value={62}>Java</option>
                            <option value={63}>JavaScript</option>
                        </select>
                    </div>
                    <Editor
                        height="300px"
                        defaultLanguage="cpp"
                        theme="vs-dark"
                        defaultValue="// Write your code here"
                        onChange={(value) => setCode(value)}
                    />
                    <button
                        onClick={handleRunCode}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Run Code
                    </button>
                </div>

                {/* Output Section */}
                <div className="bg-white shadow p-4 mt-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Output</h2>
                    <pre className="bg-gray-100 p-4 rounded">{output || "Your output will appear here."}</pre>
                </div>
            </div>
        </div>
    );
};

export default ShowQuestion;
