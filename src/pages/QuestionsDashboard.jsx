import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
    fetchAllQuestions,
    fetchCategoriesAndTags,
    deleteQuestionById,
} from "../features/questionsSlice/QuestionsSlice";
import QuestionEditModal from "../components/QuestionEditModal";

const QuestionsDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { questions, categories, tags, loading, error } = useSelector(
        (state) => state.Question
    );

    // Local states for filters, search, modal
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        dispatch(fetchAllQuestions());
        dispatch(fetchCategoriesAndTags());
    }, [dispatch]);

    // Open modal for editing
    const handleEdit = (question) => {
        setSelectedQuestion(question);
        setIsEditModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsEditModalOpen(false);
        setSelectedQuestion(null);
    };

    // Filter logic
    const filteredQuestions = questions.filter((question) => {
        const categoryMatch = selectedCategory
            ? question.category === selectedCategory
            : true;
        const tagMatch = selectedTag ? question.tags.includes(selectedTag) : true;
        const difficultyMatch = selectedDifficulty
            ? question.difficulty === selectedDifficulty
            : true;
        const searchMatch = searchQuery
            ? question.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        return categoryMatch && tagMatch && difficultyMatch && searchMatch;
    });

    // Delete question with confirmation
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteQuestionById(id))
                    .then(() => {
                        Swal.fire("Deleted!", "The question has been deleted.", "success");
                        dispatch(fetchAllQuestions());
                    })
                    .catch(() => {
                        Swal.fire(
                            "Error!",
                            "An error occurred while deleting the question.",
                            "error"
                        );
                    });
            }
        });
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 text-gray-200 font-mono">
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md">
                <h1 className="text-xl font-bold text-green-400">
                    Questions Dashboard
                </h1>
                <button
                    onClick={() => navigate("/addquestion")}
                    className="
            flex items-center
            px-4 py-2
            bg-green-700
            text-gray-100
            rounded
            hover:bg-green-600
            transition
            shadow-md
          "
                >
                    <FaPlus className="mr-2" />
                    Create New Question
                </button>
            </div>

            {/* FILTERS */}
            <div className="px-6 py-4 border-b border-gray-700 bg-gray-800">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Difficulty Filters */}
                    <div className="flex items-center space-x-2">
                        <button
                            className={`
                px-4 py-2
                rounded
                transition
                ${selectedDifficulty === ""
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-600 hover:bg-gray-700 text-gray-200"
                                }
              `}
                            onClick={() => setSelectedDifficulty("")}
                        >
                            All Levels
                        </button>
                        <button
                            className={`
                px-4 py-2
                rounded
                transition
                ${selectedDifficulty === "Easy"
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-600 hover:bg-gray-700 text-gray-200"
                                }
              `}
                            onClick={() => setSelectedDifficulty("Easy")}
                        >
                            Easy
                        </button>
                        <button
                            className={`
                px-4 py-2
                rounded
                transition
                ${selectedDifficulty === "Medium"
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-600 hover:bg-gray-700 text-gray-200"
                                }
              `}
                            onClick={() => setSelectedDifficulty("Medium")}
                        >
                            Medium
                        </button>
                        <button
                            className={`
                px-4 py-2
                rounded
                transition
                ${selectedDifficulty === "Hard"
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-600 hover:bg-gray-700 text-gray-200"
                                }
              `}
                            onClick={() => setSelectedDifficulty("Hard")}
                        >
                            Hard
                        </button>
                    </div>

                    {/* Category Dropdown */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="
              px-4 py-2
              rounded
              border border-gray-700
              bg-gray-600
              text-white
              focus:outline-none
              focus:ring-2 focus:ring-green-500
            "
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option className="bg-gray-800" key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    {/* Tags Dropdown */}
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="
              px-4 py-2
              rounded
              border border-gray-700
              bg-gray-600
              text-white
              focus:outline-none
              focus:ring-2 focus:ring-green-500
            "
                    >
                        <option value="">All Tags</option>
                        {tags.map((tag) => (
                            <option className="bg-gray-800" key={tag} value={tag}>
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
                        className="
              px-4 py-2
              rounded
              border border-gray-700
              bg-gray-600
              text-gray-100
              placeholder-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-green-500
              flex-grow
              sm:flex-grow-0
              sm:w-64
            "
                    />
                </div>
            </div>

            {/* QUESTIONS TABLE */}
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
                                    <th className="p-4 text-left font-medium">Title</th>
                                    <th className="p-4 text-left font-medium">Difficulty</th>
                                    <th className="p-4 text-left font-medium">Category</th>
                                    <th className="p-4 text-left font-medium">Tags</th>
                                    <th className="p-4 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuestions.map((question) => (
                                    <tr
                                        key={question._id}
                                        className="border-b border-gray-700 hover:bg-gray-800 transition"
                                    >
                                        <td className="p-4 text-green-200">{question.title}</td>
                                        <td className="p-4 text-yellow-300">{question.difficulty}</td>
                                        <td className="p-4 text-blue-300">{question.category}</td>
                                        <td className="p-4 text-purple-300">
                                            {question.tags.join(", ")}
                                        </td>
                                        <td className="p-4">
                                            {/* VIEW */}
                                            <button
                                                className="
                          px-3 py-1
                          bg-green-600
                          text-gray-100
                          rounded
                          mr-2
                          hover:bg-green-500
                          transition
                        "
                                                onClick={() => navigate(`/question/${question._id}`)}
                                            >
                                                View
                                            </button>
                                            {/* EDIT */}
                                            <button
                                                className="
                          px-3 py-1
                          bg-yellow-600
                          text-gray-100
                          rounded
                          mr-2
                          hover:bg-yellow-500
                          transition
                        "
                                                onClick={() => handleEdit(question)}
                                            >
                                                Edit
                                            </button>
                                            {/* DELETE */}
                                            <button
                                                className="
                          px-3 py-1
                          bg-red-600
                          text-gray-100
                          rounded
                          hover:bg-red-500
                          transition
                        "
                                                onClick={() => handleDelete(question._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {filteredQuestions.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-4 text-center text-gray-400"
                                        >
                                            No questions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* EDIT MODAL */}
            <QuestionEditModal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                question={selectedQuestion}
            />
        </div>
    );
};

export default QuestionsDashboard;
