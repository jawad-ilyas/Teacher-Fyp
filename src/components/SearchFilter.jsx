import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";

// Actions we’ll assume exist or you’ll create in the slice:
import {
    searchCourses,
    fetchCategories,
    fetchAllCourses,
    // You’ll create this to fetch teacher list
    fetchTeachers
} from "../features/course/courseSlice";

const SearchFilter = () => {
    const [showModal, setShowModal] = useState(false);

    // Search inputs
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTeacherId, setSelectedTeacherId] = useState("");

    // Get user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo?.data?._id;
    const userRole = userInfo?.data?.role; // "admin", "teacher", "student", etc.

    const dispatch = useDispatch();

    // Read categories and teachers from Redux
    const {
        categories = [],
        teachers = [],     // <--- We’ll assume you’ll fetch & store teachers in slice
        loading: categoriesLoading,
        error: categoriesError,
    } = useSelector((state) => state.courses);

    // Fetch categories & teachers on mount
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchTeachers()); // <--- new action you’ll implement
    }, [dispatch]);

    /**
     * 1) If you still want a button to fetch all courses explicitly.
     */
    const handleFetchAllCourses = () => {
        dispatch(fetchAllCourses());
    };

    /**
     * 2) If user (admin or teacher) wants to explicitly see their courses only.
     */
    const handleFetchMyCourses = () => {
        if (!userId) {
            alert("User information is missing. Please log in again.");
            return;
        }
        dispatch(searchCourses({ teacherId: userId }));
    };

    /**
     * 3) Because we don't want a separate "Teacher Filter" button,
     *    we can remove it or keep it. For demonstration, we’ll keep it
     *    but you may not need it if you're auto-searching.
     */
    const handleTeacherFilter = () => {
        if (!selectedTeacherId) {
            alert("Select a teacher first.");
            return;
        }
        dispatch(searchCourses({ teacherId: selectedTeacherId }));
    };

 
    useEffect(() => {
        // Build our query object
        const queryObject = {};

        // Search term
        if (searchQuery.trim()) {
            queryObject.searchTerm = searchQuery.trim();
        }

        // Category
        if (selectedCategory) {
            // If user picks "All Categories", we set selectedCategory = ""
            // so it means “no category filter.” If you want to handle that differently,
            // adjust as needed.
            queryObject.category = selectedCategory;
        }

        // Teacher logic:
        if (userRole === "admin") {
            // Admin sees all unless they choose a teacher
            if (selectedTeacherId) {
                queryObject.teacherId = selectedTeacherId;
            }
        } else if (userRole === "teacher") {
            // A teacher only sees their own courses
            if (userId) {
                queryObject.teacherId = userId;
            }
        }
        // For a "student," you might not filter by teacher at all, or you might
        // have some logic that only shows courses the student’s enrolled in, etc.

        // If we do want real-time searching, dispatch each time:
        dispatch(searchCourses(queryObject));

        // We run this effect any time these states or userRole change
    }, [searchQuery, selectedCategory, selectedTeacherId, userRole, userId, dispatch]);

    /**
     * 5) If you still want a manual search button, you can keep handleSearch,
     *    but it’s optional now because we do auto-search in the useEffect.
     */
    const handleSearch = () => {
        // Same logic as in the useEffect, but manual.
        const queryObject = {};
        if (searchQuery.trim()) queryObject.searchTerm = searchQuery.trim();
        if (selectedCategory) queryObject.category = selectedCategory;

        // Admin or teacher logic
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
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
            {/* Left side: Greeting & Buttons */}
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-700">
                    Hi, {userInfo?.data?.name}!
                </h2>

                {/* 1) Add to Course => opens modal for creating a course */}
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
                >
                    Add to Course
                </button>

                {/* 2) Fetch All Courses */}
                <button
                    onClick={handleFetchAllCourses}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
                >
                    Fetch All Courses
                </button>

                {/* 3) Fetch My Courses */}
                {(userRole === "admin" || userRole === "teacher") && (
                    <button
                        onClick={handleFetchMyCourses}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
                    >
                        Fetch My Courses
                    </button>
                )}
            </div>

            {/* Right side: Filters (Category, Teacher, Search Query) */}
            <div className="flex items-center space-x-2">
                {/* Category Dropdown */}
                <select
                    className="px-3 py-2 border rounded-lg"
                    value={selectedCategory}
                    onChange={(e) =>
                        setSelectedCategory(e.target.value === "All" ? "" : e.target.value)
                    }
                >
                    <option value="">All Categories</option>
                    {categoriesLoading ? (
                        <option>Loading...</option>
                    ) : categoriesError ? (
                        <option>Error fetching categories</option>
                    ) : Array.isArray(categories) && categories.length > 0 ? (
                        categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))
                    ) : (
                        <option>No categories available</option>
                    )}
                </select>

                {/* Teacher Dropdown (only show if admin, or if you want teachers to pick other teachers) */}
                {userRole === "admin" && (
                    <select
                        className="px-3 py-2 border rounded-lg"
                        value={selectedTeacherId}
                        onChange={(e) => setSelectedTeacherId(e.target.value)}
                    >
                        <option value="">All Teachers</option>
                        {teachers.length > 0 ? (
                            teachers.map((teacher) => (
                                <option key={teacher._id} value={teacher._id}>
                                    {teacher.name}
                                </option>
                            ))
                        ) : (
                            <option>No teachers found</option>
                        )}
                    </select>
                )}

                {/* Search box */}
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                />

              
            </div>

            {/* (Optional) button to filter specifically by teacher selection */}
            {/* Could be removed if you rely solely on the auto-search in the useEffect */}
            {/* <div>
                <button
                    onClick={handleTeacherFilter}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                    Filter By Selected Teacher
                </button>
            </div> */}

            {/* Modal for "Add to Course" */}
            <Modal isVisible={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default SearchFilter;
