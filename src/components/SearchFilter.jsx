import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FaBars,       // "Structure" icon
    FaUser,       // "My Courses" icon
    FaFilter,     // Filter icon
    FaPlus,       // Add Course
    FaSync,       // Refresh
    FaSearch,     // Search
} from "react-icons/fa";

import Modal from "./Modal";
import {
    searchCourses,
    fetchCategories,
    fetchAllCourses,
    fetchTeachers,
} from "../features/course/courseSlice";

const SearchFilter = () => {
    const dispatch = useDispatch();

    // Local states
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTeacherId, setSelectedTeacherId] = useState("");
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Read user info
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo?.data?._id;
    const userRole = userInfo?.data?.role; // "admin", "teacher", "student", etc.

    // Redux state
    const {
        categories = [],
        teachers = [],
        loading: categoriesLoading,
        error: categoriesError,
    } = useSelector((state) => state.courses);

    // Fetch categories & teachers on mount
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchTeachers());
    }, [dispatch]);

    // Existing handler: Fetch All
    const handleFetchAllCourses = () => {
        dispatch(fetchAllCourses());
    };

    // Existing handler: Fetch My Courses
    const handleFetchMyCourses = () => {
        if (!userId) {
            alert("User information is missing. Please log in again.");
            return;
        }
        dispatch(searchCourses({ teacherId: userId }));
    };

    // Auto-search on changes (same logic)
    useEffect(() => {
        const queryObject = {};

        if (searchQuery.trim()) {
            queryObject.searchTerm = searchQuery.trim();
        }
        if (selectedCategory) {
            queryObject.category = selectedCategory;
        }

        if (userRole === "admin") {
            if (selectedTeacherId) {
                queryObject.teacherId = selectedTeacherId;
            }
        } else if (userRole === "teacher") {
            if (userId) {
                queryObject.teacherId = userId;
            }
        }

        dispatch(searchCourses(queryObject));
    }, [
        searchQuery,
        selectedCategory,
        selectedTeacherId,
        userRole,
        userId,
        dispatch,
    ]);

    // Manual search button (optional)
    const handleSearch = () => {
        const queryObject = {};
        if (searchQuery.trim()) queryObject.searchTerm = searchQuery.trim();
        if (selectedCategory) queryObject.category = selectedCategory;

        if (userRole === "admin" && selectedTeacherId) {
            queryObject.teacherId = selectedTeacherId;
        } else if (userRole === "teacher" && userId) {
            queryObject.teacherId = userId;
        }
        dispatch(searchCourses(queryObject));
    };

    return (
        <div
            className="
        flex
        items-center
        justify-between
        bg-white
        shadow-sm
        rounded-lg
        px-4
        py-2
        space-x-4
      "
        >
            {/* LEFT ICON GROUP */}
            <div className="flex items-center space-x-3">
                {/* Fetch All (Structure) */}
                <button
                    title="Fetch All Courses"
                    onClick={handleFetchAllCourses}
                    className="
            text-gray-600
            hover:text-teal-600
            transition
          "
                >
                    <FaBars className="w-5 h-5" />
                </button>

                {/* My Courses (admin/teacher only) */}
                {(userRole === "admin" || userRole === "teacher") && (
                    <button
                        title="My Courses"
                        onClick={handleFetchMyCourses}
                        className="
              text-gray-600
              hover:text-teal-600
              transition
            "
                    >
                        <FaUser className="w-5 h-5" />
                    </button>
                )}

                {/* Filter Icon -> toggles filter dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        title="Filter"
                        className="
              text-gray-600
              hover:text-teal-600
              transition
            "
                    >
                        <FaFilter className="w-5 h-5" />
                    </button>

                    {/* FILTER DROPDOWN */}
                    {showFilterMenu && (
                        <div
                            className="
                absolute
                top-8
                left-0
                bg-white
                p-4
                shadow-md
                rounded-lg
                z-10
                space-y-3
                w-64
              "
                        >
                            {/* Category dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    className="
                    w-full
                    px-3
                    py-2
                    border
                    rounded-md
                    text-sm
                    focus:outline-none
                    focus:ring-1
                    focus:ring-teal-500
                  "
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        setSelectedCategory(
                                            e.target.value === "All" ? "" : e.target.value
                                        )
                                    }
                                >
                                    <option value="">All Categories</option>
                                    {categoriesLoading ? (
                                        <option>Loading...</option>
                                    ) : categoriesError ? (
                                        <option>Error fetching</option>
                                    ) : categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))
                                    ) : (
                                        <option>No categories available</option>
                                    )}
                                </select>
                            </div>

                            {/* Teacher dropdown (only for admin) */}
                            {userRole === "admin" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Teacher
                                    </label>
                                    <select
                                        className="
                      w-full
                      px-3
                      py-2
                      border
                      rounded-md
                      text-sm
                      focus:outline-none
                      focus:ring-1
                      focus:ring-teal-500
                    "
                                        value={selectedTeacherId}
                                        onChange={(e) => setSelectedTeacherId(e.target.value)}
                                    >
                                        <option value="">All Teachers</option>
                                        {teachers.length > 0 ? (
                                            teachers.map((t) => (
                                                <option key={t._id} value={t._id}>
                                                    {t.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option>No teachers found</option>
                                        )}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Add Course */}
                <button
                    onClick={() => setShowModal(true)}
                    title="Add Course"
                    className="
            text-gray-600
            hover:text-teal-600
            transition
          "
                >
                    <FaPlus className="w-5 h-5" />
                </button>

                {/* Refresh All */}
                <button
                    onClick={handleFetchAllCourses}
                    title="Refresh All Courses"
                    className="
            text-gray-600
            hover:text-teal-600
            transition
          "
                >
                    <FaSync className="w-5 h-5" />
                </button>
            </div>

            {/* RIGHT SIDE: SEARCH */}
            <div className="flex items-center space-x-2">
                <div className="relative">
                    <FaSearch
                        onClick={handleSearch}
                        title="Search"
                        className="absolute left-2 top-2 text-gray-400 cursor-pointer"
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="
              pl-8
              pr-3
              py-1
              border
              border-gray-300
              rounded-md
              focus:outline-none
              focus:ring-1
              focus:ring-teal-500
              text-sm
              placeholder-gray-400
            "
                    />
                </div>
            </div>

            {/* MODAL for “Add to Course” */}
            <Modal isVisible={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default SearchFilter;
