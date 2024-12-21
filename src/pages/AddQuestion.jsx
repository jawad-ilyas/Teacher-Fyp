import  { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createQuestion } from '../features/questionsSlice/QuestionsSlice';

const AddQuestion = () => {
    const dispatch = useDispatch();
    const { loading, successMessage, error } = useSelector((state) => state.Question);

    const [questionData, setQuestionData] = useState({
        title: '',
        problemStatement: '',
        difficulty: 'Easy',
        sampleTestCases: [],
        hiddenTestCases: [],
        tags: [],
        category: '',
        constraints: '',
        optimalSolution: '',
        complexity: { time: '', space: '' },
        functionSignature: '',
        hints: [],
        relatedQuestions: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuestionData((prev) => ({ ...prev, [name]: value }));
    };

    const addTestCase = (type) => {
        const testCase = { input: '', output: '' };
        setQuestionData((prev) => ({
            ...prev,
            [type]: [...prev[type], testCase],
        }));
    };

    const handleSubmit = () => {
        dispatch(createQuestion(questionData));
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Add New Question</h1>

            {/* Basic Information */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Basic Information</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Question Title"
                    value={questionData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                />
                <textarea
                    name="problemStatement"
                    placeholder="Problem Statement"
                    value={questionData.problemStatement}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                    rows="6"
                />
                <select
                    name="difficulty"
                    value={questionData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            {/* Test Cases */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Test Cases</h2>
                <div className="mb-4">
                    <h3 className="text-gray-600">Sample Test Cases</h3>
                    {questionData.sampleTestCases.map((testCase, idx) => (
                        <div key={idx} className="flex items-center mb-2">
                            <input
                                type="text"
                                placeholder="Input"
                                value={testCase.input}
                                onChange={(e) => {
                                    const newTestCases = [...questionData.sampleTestCases];
                                    newTestCases[idx].input = e.target.value;
                                    setQuestionData({ ...questionData, sampleTestCases: newTestCases });
                                }}
                                className="w-1/2 px-2 py-1 border border-gray-300 rounded mr-2"
                            />
                            <input
                                type="text"
                                placeholder="Output"
                                value={testCase.output}
                                onChange={(e) => {
                                    const newTestCases = [...questionData.sampleTestCases];
                                    newTestCases[idx].output = e.target.value;
                                    setQuestionData({ ...questionData, sampleTestCases: newTestCases });
                                }}
                                className="w-1/2 px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                    ))}
                    <button
                        onClick={() => addTestCase('sampleTestCases')}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Add Sample Test Case
                    </button>
                </div>
            </div>

            {/* Tags and Categories */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Tags & Categories</h2>
                <input
                    type="text"
                    name="tags"
                    placeholder="Add Tags (comma-separated)"
                    value={questionData.tags}
                    onChange={(e) => setQuestionData({ ...questionData, tags: e.target.value.split(',') })}
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={questionData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                />
            </div>

            {/* Error and Success Messages */}
            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className={`px-6 py-2 text-white rounded ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                    }`}
                disabled={loading}
            >
                {loading ? 'Submitting...' : 'Submit Question'}
            </button>
        </div>
    );
};

export default AddQuestion;
