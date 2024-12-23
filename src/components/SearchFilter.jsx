import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FaBars,        // "Structure" icon example
    FaThLarge,     // "Grid" icon example
    FaFilter,      // Filter icon
    FaSort,        // Sort icon
    FaPlus,        // Action icon (Add Course)
    FaSync,        // Action icon (Fetch All)
    FaUser,        // Action icon (Fetch My Courses)
    FaEllipsisH,   // "More" icon
    FaSearch,      // For search
    FaCog,         // (Optional) for settings
} from "react-icons/fa";

import Modal from "./Modal";

// Actions from your Redux slice:
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

    // For toggling a “filter” dropdown (category, teacher, etc.)
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Get user info from localStorage
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

    // Fetch categories and teachers on mount
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchTeachers());
    }, [dispatch]);

    // === Existing Handler Logic (same as your code) ===
    const handleFetchAllCourses = () => {
        dispatch(fetchAllCourses());
    };
    const handleFetchMyCourses = () => {
        if (!userId) {
            alert("User information is missing. Please log in again.");
            return;
        }
        dispatch(searchCourses({ teacherId: userId }));
    };

    // “Auto search” on changes
    useEffect(() => {
        const queryObject = {};

        // Search term
        if (searchQuery.trim()) {
            queryObject.searchTerm = searchQuery.trim();
        }
        // Category
        if (selectedCategory) {
            queryObject.category = selectedCategory;
        }
        // Teacher logic
        if (userRole === "admin") {
            if (selectedTeacherId) {
                queryObject.teacherId = selectedTeacherId;
            }
        } else if (userRole === "teacher") {
            // Teacher sees their own courses
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
        rounded-full
        shadow-md
        px-4
        py-2
        space-x-2
      "
        >
            {/* LEFT ICONS (Structure, Grid, Filter, Sort, etc.) */}
            <div className="flex items-center space-x-4">
                {/* structure */}
                <button
                    title="Structure (Fetch All Courses)"
                    onClick={handleFetchAllCourses}
                    className="
            flex items-center
            text-gray-600
            hover:text-blue-600
            transition
          "
                >
                    <FaBars className="w-5 h-5" />
                </button>

                {/* grid */}
                {(userRole === "admin" || userRole === "teacher") && (
                    <button
                        title="My Courses"
                        onClick={handleFetchMyCourses}
                        className="
              flex items-center
              text-gray-600
              hover:text-blue-600
              transition
            "
                    >
                        <FaUser className="w-5 h-5" />
                    </button>
                )}

                {/* filter */}
                <div className="relative">
                    <button
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        title="Filter"
                        className="
              flex items-center
              text-gray-600
              hover:text-blue-600
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
                shadow-lg
                rounded-xl
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
                    rounded-lg
                    text-sm
                    focus:outline-none
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
                      rounded-lg
                      text-sm
                      focus:outline-none
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

                {/* sort (stubbed - no functionality in your code yet) */}
           

                {/* action -> Add Course Modal */}
                <button
                    onClick={() => setShowModal(true)}
                    title="Add Course"
                    className="
            flex items-center
            text-gray-600
            hover:text-blue-600
            transition
          "
                >
                    <FaPlus className="w-5 h-5" />
                </button>

                {/* another action -> Refresh All Courses */}
                <button
                    onClick={handleFetchAllCourses}
                    title="Refresh / Fetch All Courses"
                    className="
            flex items-center
            text-gray-600
            hover:text-blue-600
            transition
          "
                >
                    <FaSync className="w-5 h-5" />
                </button>

                {/* optionally, “more” menu if you want a dropdown for additional actions */}
               
            </div>

            {/* RIGHT SIDE: SEARCH & SETTINGS (optional) */}
            <div className="flex items-center space-x-3">
                {/* Search Input */}
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
              rounded-full
              focus:outline-none
              focus:border-blue-500
              text-sm
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
