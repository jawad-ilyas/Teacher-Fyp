import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert2
import { fetchAllQuestions, fetchCategoriesAndTags, deleteQuestionById } from "../features/questionsSlice/QuestionsSlice";
import QuestionEditModal from "../components/QuestionEditModal";
const QuestionsDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { questions, categories, tags, loading, error } = useSelector((state) => state.Question);

    const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
    const [selectedTag, setSelectedTag] = useState(""); // State for selected tag
    const [selectedDifficulty, setSelectedDifficulty] = useState(""); // State for selected difficulty
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for modal visibility
    const [selectedQuestion, setSelectedQuestion] = useState(null); // State for selected question
    useEffect(() => {
        dispatch(fetchAllQuestions()); // Fetch all questions on component mount
        dispatch(fetchCategoriesAndTags()); // Fetch categories and tags
    }, [dispatch]);

    const handleEdit = (question) => {
        setSelectedQuestion(question);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setIsEditModalOpen(false);
        setSelectedQuestion(null);
    };
    // Filter questions based on selected category, tag, difficulty, and search query
    const filteredQuestions = questions.filter((question) => {
        const categoryMatch = selectedCategory ? question.category === selectedCategory : true;
        const tagMatch = selectedTag ? question.tags.includes(selectedTag) : true;
        const difficultyMatch = selectedDifficulty ? question.difficulty === selectedDifficulty : true;
        const searchMatch = searchQuery
            ? question.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return categoryMatch && tagMatch && difficultyMatch && searchMatch;
    });

    // Delete Question Function
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
                dispatch(deleteQuestionById(id)) // Dispatch the updated thunk
                    .then(() => {
                        Swal.fire("Deleted!", "The question has been deleted.", "success");
                        dispatch(fetchAllQuestions()); // Refresh questions after deletion
                    })
                    .catch(() => {
                        Swal.fire("Error!", "An error occurred while deleting the question.", "error");
                    });
            }
        });
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Questions Dashboard</h1>
                <button
                    onClick={() => navigate('/addquestion')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center shadow-md"
                >
                    <FaPlus className="mr-2" />
                    Create New Question
                </button>
            </div>

            {/* Filters Section */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Difficulty Filters */}
                <div className="flex items-center space-x-2">
                    <button
                        className={`px-4 py-2 ${selectedDifficulty === '' ? 'bg-gray-300' : 'bg-gray-100'} rounded hover:bg-gray-200`}
                        onClick={() => setSelectedDifficulty('')}
                    >
                        All Levels
                    </button>
                    <button
                        className={`px-4 py-2 ${selectedDifficulty === 'Easy' ? 'bg-gray-300' : 'bg-gray-100'} rounded hover:bg-gray-200`}
                        onClick={() => setSelectedDifficulty('Easy')}
                    >
                        Easy
                    </button>
                    <button
                        className={`px-4 py-2 ${selectedDifficulty === 'Medium' ? 'bg-gray-300' : 'bg-gray-100'} rounded hover:bg-gray-200`}
                        onClick={() => setSelectedDifficulty('Medium')}
                    >
                        Medium
                    </button>
                    <button
                        className={`px-4 py-2 ${selectedDifficulty === 'Hard' ? 'bg-gray-300' : 'bg-gray-100'} rounded hover:bg-gray-200`}
                        onClick={() => setSelectedDifficulty('Hard')}
                    >
                        Hard
                    </button>
                </div>

                {/* Category Dropdown */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                {/* Tags Dropdown */}
                <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Tags</option>
                    {tags.map((tag) => (
                        <option key={tag} value={tag}>
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
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
            </div>

            {/* Questions Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <p>Loading questions...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <table className="w-full bg-white shadow-md rounded border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-4">Title</th>
                                <th className="p-4">Difficulty</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Tags</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuestions.map((question) => (
                                <tr key={question._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{question.title}</td>
                                    <td className="p-4">{question.difficulty}</td>
                                    <td className="p-4">{question.category}</td>
                                    <td className="p-4">{question.tags.join(", ")}</td>
                                    <td className="p-4">
                                        <button
                                            className="px-3 py-1 bg-green-500 text-white rounded mr-2 hover:bg-green-600"
                                            onClick={() => navigate(`/question/${question._id}`)} // Navigate to ShowQuestion with ID
                                        >
                                            View
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-yellow-500 text-white rounded mr-2 hover:bg-yellow-600"
                                            onClick={() => handleEdit(question)} // Open the modal
                                        >
                                            Edit

                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            onClick={() => handleDelete(question._id)} // Handle Delete
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {/* Edit Modal */}
            <QuestionEditModal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                question={selectedQuestion}
            />
        </div>
    );
};

export default QuestionsDashboard;
