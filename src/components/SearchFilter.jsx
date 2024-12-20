import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { searchCourses, fetchCategories } from "../features/course/courseSlice";

const SearchFilter = () => {
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [selectedCategory, setSelectedCategory] = useState(""); // State for category selection
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Get user data

    const dispatch = useDispatch();
    const { categories = [], loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.courses);

    useEffect(() => {
        dispatch(fetchCategories()); // Fetch categories when the component mounts
    }, [dispatch]);

    const handleSearch = () => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Get user data
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

       

        dispatch(searchCourses(query)); // Dispatch the updated thunk
    };


    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
            {/* Greeting and Add to Course Button */}
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-700">Hi, {userInfo?.data?.name}!</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
                >
                    Add to Course
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
                    onClick={handleSearch}
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
