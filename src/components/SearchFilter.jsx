import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Modal from "./Modal"; // Modal for Add to Course
import { searchCourses, fetchCategories } from "../features/course/courseSlice";

const SearchFilter = () => {
    const [showModal, setShowModal] = useState(false); // State for Add to Course Modal
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [selectedCategory, setSelectedCategory] = useState(""); // State for category selection
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Get user data

    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate hook for redirection

    const { categories = [], loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.courses);

    useEffect(() => {
        dispatch(fetchCategories()); // Fetch categories when the component mounts
    }, [dispatch]);

    // Function to handle search functionality
    const handleSearch = () => {
        const teacherId = userInfo?.data?._id; // Extract teacher ID

        if (!teacherId) {
            alert("User information is missing. Please log in again.");
            return;
        }

        const query = {
            searchTerm: searchQuery.trim(),
            category: selectedCategory === "All" ? null : selectedCategory, // Set null for "All Categories"
            teacherId, // Always include the teacher ID for searches
        };

        dispatch(searchCourses(query)); // Dispatch the search action
    };

    // Function to handle "Add a Question" button click
    const handleAddQuestion = () => {
        navigate("/add-question"); // Redirect to the Add Question page
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
            {/* Greeting and Add Buttons */}
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-700">Hi, {userInfo?.data?.name}!</h2>
                {/* Add to Course Button */}
                <button
                    onClick={() => setShowModal(true)} // Open Add to Course Modal
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
                >
                    Add to Course
                </button>
                {/* Add a Question Button */}
                <button
                    onClick={handleAddQuestion} // Navigate to Add Question page
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
                >
                    Add a Question
                </button>
            </div>

            {/* Search Section */}
            <div className="flex items-center space-x-2">
                <select
                    className="px-3 py-2 border rounded-lg"
                    value={selectedCategory}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSelectedCategory(value === "All" ? "" : value);
                    }}
                >
                    <option value="All">All Categories</option>
                    {categoriesLoading ? (
                        <option>Loading...</option>
                    ) : categoriesError ? (
                        <option>Error fetching categories</option>
                    ) : Array.isArray(categories) && categories.length > 0 ? (
                        categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))
                    ) : (
                        <option>No categories available</option>
                    )}
                </select>

                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                />
                <button
                    onClick={handleSearch} // Trigger search action
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg"
                >
                    Search
                </button>
            </div>

            {/* Modal */}
            <Modal isVisible={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default SearchFilter;
