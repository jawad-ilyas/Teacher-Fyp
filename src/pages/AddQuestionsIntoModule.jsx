import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
    fetchAllQuestions,
    fetchCategoriesAndTags,
} from "../features/questionsSlice/QuestionsSlice";

import { addQuestionsToModule } from "../features/module/moduleSlice";

const AddQuestionsIntoModuleDashboard = () => {
    const { courseId, moduleId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { questions, categories, tags, loading, error } = useSelector(
        (state) => state.Question
    );

    // 1) FILTER states
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // 2) Selection states
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

    // 3) Marks states
    // Option A: single total marks
    const [useSingleTotalMarks, setUseSingleTotalMarks] = useState(false);
    const [totalMarks, setTotalMarks] = useState(0);

    // Option B: individual marks per question
    // e.g. { "questionId1": 5, "questionId2": 10 }
    const [marksByQuestion, setMarksByQuestion] = useState({});

    // 4) Random selection
    const [randomSelectCount, setRandomSelectCount] = useState("");

    useEffect(() => {
        dispatch(fetchAllQuestions());
        dispatch(fetchCategoriesAndTags());
    }, [dispatch]);

    // -------------- FILTERING LOGIC --------------
    const filteredQuestions = questions.filter((question) => {
        // difficulty
        const difficultyMatch = selectedDifficulty
            ? question.difficulty === selectedDifficulty
            : true;

        // category
        const categoryMatch = selectedCategory
            ? question.category === selectedCategory
            : true;

        // tag
        const tagMatch = selectedTag ? question.tags.includes(selectedTag) : true;

        // search
        const searchMatch = searchQuery
            ? question.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        return difficultyMatch && categoryMatch && tagMatch && searchMatch;
    });

    // -------------- SELECTION HANDLERS --------------
    const handleToggleQuestion = (qId) => {
        setSelectedQuestionIds((prev) => {
            if (prev.includes(qId)) {
                return prev.filter((id) => id !== qId);
            } else {
                return [...prev, qId];
            }
        });
    };

    // -------------- RANDOM SELECTION --------------
    const handleRandomSelect = () => {
        // Convert randomSelectCount to a Number
        const count = parseInt(randomSelectCount, 10);

        if (isNaN(count) || count <= 0) {
            Swal.fire("Invalid Input", "Please enter a valid number for random select.", "warning");
            return;
        }

        if (count > filteredQuestions.length) {
            Swal.fire(
                "Not Enough Questions",
                `You requested ${count} but only ${filteredQuestions.length} questions are available.`,
                "info"
            );
            return;
        }

        // Shuffle the filtered questions (Fisher-Yates or a simpler method)
        const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
        // Pick 'count' number of them
        const randomPicked = shuffled.slice(0, count);

        // Their IDs
        const randomPickedIds = randomPicked.map((q) => q._id);

        // Update selectedQuestionIds with these random picks
        setSelectedQuestionIds(randomPickedIds);
    };

    // -------------- ADD SELECTED HANDLER --------------
    const handleAddSelected = async () => {
        if (!selectedQuestionIds.length) {
            Swal.fire(
                "No questions selected",
                "Please select or randomly pick some questions first",
                "info"
            );
            return;
        }

        try {
            // Build questionsData: array of { questionId, marks }
            let questionsData = [];

            if (useSingleTotalMarks) {
                // Single total mark approach
                // Distribute totalMarks evenly among all selected questions
                const perQuestion = totalMarks / selectedQuestionIds.length;
                questionsData = selectedQuestionIds.map((qId) => ({
                    questionId: qId,
                    marks: perQuestion,
                }));
            } else {
                // Individual marks approach
                questionsData = selectedQuestionIds.map((qId) => ({
                    questionId: qId,
                    marks: marksByQuestion[qId] || 0, // fallback to 0 if undefined
                }));
            }

            // Dispatch to thunk
            await dispatch(
                addQuestionsToModule({
                    moduleId,
                    courseId,
                    questionsData,
                })
            ).unwrap();

            Swal.fire("Success", "Questions added to module!", "success");
            navigate(`/courses/${courseId}/modules/${moduleId}`);
        } catch (err) {
            console.error("Failed to add questions:", err);
            Swal.fire("Error", "Could not add questions!", "error");
        }
    };
    const handleBack = () => {
        // Replace with your back navigation logic
        navigate(-1); // If you're using React Router
    };

    // -------------- RENDER --------------
    return (
        <div className="min-h-screen w-full pt-20 bg-gray-900 text-gray-200 font-mono">
            {/* Header */}
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md">
                <h1 className="text-xl font-bold text-green-400">
                    Add Questions into Module
                </h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center px-4 py-2 bg-gray-600 text-gray-100 rounded hover:bg-gray-500 transition shadow-md"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleAddSelected}
                        className="flex items-center px-4 py-2 bg-green-700 text-gray-100 rounded hover:bg-green-600 transition shadow-md"
                    >
                        Save Selected
                    </button>
                </div>
            </div>


            {/* Filter Row */}
            <div className="px-6 py-4 border-b border-gray-700 bg-gray-800">
                {/* Difficulty filters */}
                <div className="flex items-center space-x-2 mb-2">
                    <button
                        className={`px-4 py-2 rounded transition ${selectedDifficulty === ""
                            ? "bg-gray-700 text-white"
                            : "bg-gray-600 hover:bg-gray-700 text-gray-200"
                            }`}
                        onClick={() => setSelectedDifficulty("")}
                    >
                        All Levels
                    </button>
                    {["Easy", "Medium", "Hard"].map((level) => (
                        <button
                            key={level}
                            className={`px-4 py-2 rounded transition ${selectedDifficulty === level
                                ? "bg-gray-700 text-white"
                                : "bg-gray-600 hover:bg-gray-700 text-gray-200"
                                }`}
                            onClick={() => setSelectedDifficulty(level)}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                {/* Category Dropdown */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 rounded border border-gray-700 bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 mr-4"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-gray-800 capitalize">
                            {cat}
                        </option>
                    ))}
                </select>

                {/* Tags Dropdown */}
                <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="px-4 py-2 rounded border border-gray-700 bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 mr-4"
                >
                    <option value="">All Tags</option>
                    {tags.map((tag) => (
                        <option key={tag} value={tag} className="bg-gray-800 capitalize">
                            {tag}
                        </option>
                    ))}
                </select>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 rounded border border-gray-700 bg-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            {/* Marks + Random Selection Row */}
            <div className="px-6 py-4 border-b border-gray-700 bg-gray-800 flex items-center space-x-4">
                {/* Toggle between Single Total vs. Individual */}
                <div className="flex items-center space-x-2">
                    <label className="text-sm">Marking Mode:</label>
                    <div className="flex items-center space-x-1">
                        <input
                            type="radio"
                            name="markingMode"
                            checked={!useSingleTotalMarks}
                            onChange={() => setUseSingleTotalMarks(false)}
                        />
                        <span className="text-sm">Individual</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <input
                            type="radio"
                            name="markingMode"
                            checked={useSingleTotalMarks}
                            onChange={() => setUseSingleTotalMarks(true)}
                        />
                        <span className="text-sm">Single Total</span>
                    </div>
                </div>

                {/* If single total is chosen, show single total input */}
                {useSingleTotalMarks && (
                    <div>
                        <label className="mr-2 text-sm">Total Marks:</label>
                        <input
                            type="number"
                            min="0"
                            value={totalMarks}
                            onChange={(e) => setTotalMarks(Number(e.target.value))}
                            className="px-2 py-1 rounded border border-gray-700 bg-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 w-24"
                        />
                    </div>
                )}

                {/* Random selection */}
                <div className="flex items-center space-x-2 ml-auto">
                    <label className="text-sm">Random Select Count:</label>
                    <input
                        type="number"
                        min="1"
                        value={randomSelectCount}
                        onChange={(e) => setRandomSelectCount(e.target.value)}
                        className="w-20 px-2 py-1 rounded border border-gray-700 bg-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        onClick={handleRandomSelect}
                        className="px-3 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 transition"
                    >
                        Random Select
                    </button>
                </div>
            </div>

            {/* Body / Table */}
            <div className="p-6">
                {loading ? (
                    <p className="text-green-400">Loading questions...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-700 text-gray-300 uppercase text-xs tracking-wider">
                                    <th className="p-4 text-left font-medium">Select</th>
                                    <th className="p-4 text-left font-medium">Title</th>
                                    <th className="p-4 text-left font-medium">Difficulty</th>
                                    <th className="p-4 text-left font-medium">Category</th>
                                    <th className="p-4 text-left font-medium">Tags</th>
                                    {!useSingleTotalMarks && (
                                        <th className="p-4 text-left font-medium">Marks</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuestions.map((question) => (
                                    <tr
                                        key={question._id}
                                        className="border-b border-gray-700 hover:bg-gray-800 transition"
                                    >
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedQuestionIds.includes(question._id)}
                                                onChange={() => handleToggleQuestion(question._id)}
                                            />
                                        </td>
                                        <td className="p-4 text-green-200">{question.title}</td>
                                        <td className="p-4 text-yellow-300">{question.difficulty}</td>
                                        <td className="p-4 text-blue-300">{question.category}</td>
                                        <td className="p-4 text-purple-300">
                                            {question.tags.join(", ")}
                                        </td>

                                        {/* Only show individual marks input if in that mode */}
                                        {!useSingleTotalMarks && (
                                            <td className="p-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="w-16 px-2 py-1 bg-gray-600 text-white rounded"
                                                    value={marksByQuestion[question._id] || ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setMarksByQuestion((prev) => ({
                                                            ...prev,
                                                            [question._id]: Number(val),
                                                        }));
                                                    }}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                ))}

                                {filteredQuestions.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-400">
                                            No questions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddQuestionsIntoModuleDashboard;
