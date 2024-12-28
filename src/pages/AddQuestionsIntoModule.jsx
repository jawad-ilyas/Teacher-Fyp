import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
    fetchAllQuestions,
    fetchCategoriesAndTags,
} from "../features/questionsSlice/QuestionsSlice";

import { addQuestionsToModule } from "../features/module/moduleSlice";
// or wherever you put that thunk

const AddQuestionsIntoModuleDashboard = () => {
    const { courseId, moduleId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { questions, categories, tags, loading, error } = useSelector(
        (state) => state.Question
    );
    // local states for filter
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // local state for which questions are selected
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

    useEffect(() => {
        dispatch(fetchAllQuestions());
        dispatch(fetchCategoriesAndTags());
    }, [dispatch]);

    // handle toggling checkboxes
    const handleToggleQuestion = (qId) => {
        setSelectedQuestionIds((prev) => {
            if (prev.includes(qId)) {
                return prev.filter((id) => id !== qId);
            } else {
                return [...prev, qId];
            }
        });
    };

    // Filter logic (similar to your QuestionsDashboard)
    const filteredQuestions = questions.filter((question) => {
        // match difficulty
        const difficultyMatch = selectedDifficulty
            ? question.difficulty === selectedDifficulty
            : true;

        // match category
        const categoryMatch = selectedCategory
            ? question.category === selectedCategory
            : true;

        // match tag
        const tagMatch = selectedTag
            ? question.tags.includes(selectedTag)
            : true;

        // match search
        const searchMatch = searchQuery
            ? question.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        return difficultyMatch && categoryMatch && tagMatch && searchMatch;
    });

    // on “Add Selected”
    const handleAddSelected = async () => {
        if (!selectedQuestionIds.length) {
            Swal.fire("No questions selected", "Please select some questions first", "info");
            return;
        }
        try {
            await dispatch(
                addQuestionsToModule({
                    moduleId,
                    courseId,
                    questionIds: selectedQuestionIds,
                })
            ).unwrap();
            Swal.fire("Success", "Questions added to module!", "success");
            // optionally navigate back to module page
            navigate(`/courses/${courseId}/modules/${moduleId}`);
        } catch (err) {
            console.error("Failed to add questions:", err);
            Swal.fire("Error", "Could not add questions!", "error");
        }
    };

    return (
        <div className="min-h-screen w-full pt-20 bg-gray-900 text-gray-200 font-mono">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md">
                <h1 className="text-xl font-bold text-green-400">
                    Add Questions into Module
                </h1>
                <button
                    onClick={handleAddSelected}
                    className="flex items-center px-4 py-2 bg-green-700 text-gray-100 rounded hover:bg-green-600 transition shadow-md"
                >
                    Save Selected
                </button>
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
                        <option key={cat} value={cat} className="bg-gray-800">
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
                        <option key={tag} value={tag} className="bg-gray-800">
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
                                    </tr>
                                ))}
                                {filteredQuestions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-gray-400">
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
