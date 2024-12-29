import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createQuestion } from "../features/questionsSlice/QuestionsSlice";
import { useNavigate } from "react-router-dom";

const AddQuestion = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, successMessage, error } = useSelector(
        (state) => state.Question
    );

    const [questionData, setQuestionData] = useState({
        title: "",
        problemStatement: "",
        difficulty: "Easy",
        sampleTestCases: [],
        hiddenTestCases: [],
        tags: [],
        category: "",
        constraints: "",
        optimalSolution: "",
        complexity: { time: "", space: "" },
        functionSignature: "",
        hints: [],
        relatedQuestions: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuestionData((prev) => ({ ...prev, [name]: value }));
    };

    const addTestCase = (type) => {
        const testCase = { input: "", output: "" };
        setQuestionData((prev) => ({
            ...prev,
            [type]: [...prev[type], testCase],
        }));
    };

    // If you'd like to remove an existing test case on the spot (using an 'X'),
    // you can reuse the removeTestCase function from the previous snippet.
    const removeTestCase = (type, index) => {
        setQuestionData((prev) => {
            const updatedTestCases = [...prev[type]];
            updatedTestCases.splice(index, 1);
            return { ...prev, [type]: updatedTestCases };
        });
    };

    const handleSubmit = () => {
        // Filter out "empty" sample test cases where both input and output are blank
        const sanitizedSampleTestCases = questionData.sampleTestCases.filter(
            (testCase) => testCase.input.trim() !== "" || testCase.output.trim() !== ""
        );

        // (Optional) If you also want to sanitize hidden test cases, do the same:
        const sanitizedHiddenTestCases = questionData.hiddenTestCases.filter(
            (testCase) => testCase.input.trim() !== "" || testCase.output.trim() !== ""
        );

        // Build final data object
        const finalData = {
            ...questionData,
            sampleTestCases: sanitizedSampleTestCases,
            hiddenTestCases: sanitizedHiddenTestCases,
        };

        dispatch(createQuestion(finalData));
        navigate("/questionsdashboard");
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-20 text-gray-100 font-mono p-6">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-xl font-bold text-green-400 mb-4">
                    Add New Coding Question
                </h1>
                <button
                    onClick={() => navigate(`/dashboard`)}
                    className=" bg-white text-teal-600 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition"
                >
                    Back
                </button>
            </div>

            {/* Basic Information */}
            <div className="mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-lg text-yellow-300 mb-2">Basic Information</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Question Title"
                    value={questionData.title}
                    onChange={handleChange}
                    className="
            w-full
            px-4
            py-2
            mb-4
            bg-gray-800
            text-gray-100
            border border-gray-700
            rounded
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
          "
                />
                <textarea
                    name="problemStatement"
                    placeholder="Problem Statement"
                    value={questionData.problemStatement}
                    onChange={handleChange}
                    rows="6"
                    className="
            w-full
            px-4
            py-2
            mb-4
            bg-gray-800
            text-gray-100
            border border-gray-700
            rounded
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
          "
                />
                <select
                    name="difficulty"
                    value={questionData.difficulty}
                    onChange={handleChange}
                    className="
            w-full
            px-4
            py-2
            mb-4
            bg-gray-800
            text-gray-100
            border border-gray-700
            rounded
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
          "
                >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            {/* Test Cases */}
            <div className="mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-lg text-yellow-300 mb-2">Test Cases</h2>
                <div className="mb-4">
                    <h3 className="text-green-300 mb-2">Sample Test Cases</h3>
                    {questionData.sampleTestCases.map((testCase, idx) => (
                        <div key={idx} className="flex items-center mb-2">
                            <input
                                type="text"
                                placeholder="Input"
                                value={testCase.input}
                                onChange={(e) => {
                                    const newTestCases = [...questionData.sampleTestCases];
                                    newTestCases[idx].input = e.target.value;
                                    setQuestionData({
                                        ...questionData,
                                        sampleTestCases: newTestCases,
                                    });
                                }}
                                className="
                  w-1/2
                  px-2
                  py-1
                  mr-2
                  bg-gray-800
                  text-gray-100
                  border border-gray-700
                  rounded
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500
                "
                            />
                            <input
                                type="text"
                                placeholder="Output"
                                value={testCase.output}
                                onChange={(e) => {
                                    const newTestCases = [...questionData.sampleTestCases];
                                    newTestCases[idx].output = e.target.value;
                                    setQuestionData({
                                        ...questionData,
                                        sampleTestCases: newTestCases,
                                    });
                                }}
                                className="
                  w-1/2
                  px-2
                  py-1
                  bg-gray-800
                  text-gray-100
                  border border-gray-700
                  rounded
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500
                "
                            />
                            {/* Optional 'X' button to remove an individual test case */}
                            <button
                                onClick={() => removeTestCase("sampleTestCases", idx)}
                                className="ml-2 text-red-500 hover:text-red-700 font-bold"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => addTestCase("sampleTestCases")}
                        className="
              px-4
              py-2
              bg-blue-600
              text-gray-100
              rounded
              hover:bg-blue-500
              transition
            "
                    >
                        Add Sample Test Case
                    </button>
                </div>
            </div>

            {/* Tags and Categories */}
            <div className="mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-lg text-yellow-300 mb-2">Tags & Categories</h2>
                <input
                    type="text"
                    name="tags"
                    placeholder="Add Tags (comma-separated)"
                    value={questionData.tags}
                    onChange={(e) =>
                        setQuestionData({
                            ...questionData,
                            tags: e.target.value.split(","),
                        })
                    }
                    className="
            w-full
            px-4
            py-2
            mb-4
            bg-gray-800
            text-gray-100
            border border-gray-700
            rounded
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
          "
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={questionData.category}
                    onChange={handleChange}
                    className="
            w-full
            px-4
            py-2
            bg-gray-800
            text-gray-100
            border border-gray-700
            rounded
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
          "
                />
            </div>

            {/* Error and Success Messages */}
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {successMessage && <p className="text-green-400 mb-2">{successMessage}</p>}

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className={`
          px-6 py-2
          rounded
          text-gray-100
          ${loading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-500 transition"
                    }
        `}
            >
                {loading ? "Submitting..." : "Submit Question"}
            </button>
        </div>
    );
};

export default AddQuestion;
