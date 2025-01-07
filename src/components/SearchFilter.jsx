import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FaBars, FaUser, FaFilter, FaPlus, FaSearch,
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
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTeacherId, setSelectedTeacherId] = useState("");
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [activeTab, setActiveTab] = useState("allCourses"); // Track active tab ("allCourses" or "myCourses")
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo?.data?._id;
    const userRole = userInfo?.data?.role;
    const {
        categories = [], teachers = [], loading: categoriesLoading, error: categoriesError,
    } = useSelector((state) => state.courses);

    // Initial load: Fetch all courses, categories, and teachers
    useEffect(() => {
        dispatch(fetchAllCourses());
        dispatch(fetchCategories());
        dispatch(fetchTeachers());
    }, [dispatch]);

    // Tab-based data fetching
    useEffect(() => {
        if (activeTab === "myCourses") {
            if (userId) {
                dispatch(searchCourses({ teacherId: userId }));
            } else {
                alert("User information is missing. Please log in again.");
            }
        }
    }, [activeTab, dispatch, userId]);

    // Search or filter courses based on user input
    useEffect(() => {
        const queryObject = {};
        if (searchQuery.trim()) queryObject.searchTerm = searchQuery.trim();
        if (selectedCategory) queryObject.category = selectedCategory;
        if (userRole === "admin" && selectedTeacherId) {
            queryObject.teacherId = selectedTeacherId;
        } else if (userRole === "teacher" && userId) {
            queryObject.teacherId = userId;
        }
        if (activeTab === "allCourses" || activeTab === "myCourses") {
            dispatch(searchCourses(queryObject));
        }
    }, [searchQuery, selectedCategory, selectedTeacherId, userRole, userId, activeTab, dispatch]);

    const handleFetchAllCourses = () => {
        setActiveTab("allCourses"); // Switch to allCourses tab
        dispatch(fetchAllCourses()); // Explicitly dispatch all courses fetch
    };

    const handleFetchMyCourses = () => {
        setActiveTab("myCourses"); // Switch to myCourses tab
    };

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
        <div className="flex items-center justify-between bg-white shadow-sm rounded-lg px-4 py-2 space-x-4">
            <div className="flex items-center space-x-3">
                <button
                    title="Fetch All Courses"
                    onClick={handleFetchAllCourses}
                    className={`transition ${activeTab === "allCourses" ? "text-teal-600" : "text-gray-600 hover:text-teal-600"}`}
                >
                    <FaBars className="w-5 h-5" />
                </button>
                {(userRole === "admin" || userRole === "teacher") && (
                    <button
                        title="My Courses"
                        onClick={handleFetchMyCourses}
                        className={`transition ${activeTab === "myCourses" ? "text-teal-600" : "text-gray-600 hover:text-teal-600"}`}
                    >
                        <FaUser className="w-5 h-5" />
                    </button>
                )}
                <div className="relative">
                    <button
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        title="Filter"
                        className="text-gray-600 hover:text-teal-600 transition"
                    >
                        <FaFilter className="w-5 h-5" />
                    </button>
                    {showFilterMenu && (
                        <div className="absolute top-8 left-0 bg-white p-4 shadow-md rounded-lg z-10 space-y-3 w-64">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categoriesLoading ? (
                                        <option>Loading...</option>
                                    ) : categoriesError ? (
                                        <option>Error fetching categories</option>
                                    ) : categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {userRole === "admin" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                        value={selectedTeacherId}
                                        onChange={(e) => setSelectedTeacherId(e.target.value)}
                                    >
                                        <option value="">All Teachers</option>
                                        {teachers.length > 0
                                            ? teachers.map((t) => (
                                                <option key={t._id} value={t._id}>
                                                    {t.name}
                                                </option>
                                            ))
                                            : <option value="">No teachers found</option>}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    title="Add Course"
                    className="text-gray-600 hover:text-teal-600 transition"
                >
                    <FaPlus className="w-5 h-5" />
                </button>
            </div>
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
                        className="pl-8 pr-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm placeholder-gray-400"
                    />
                </div>
            </div>
            <Modal isVisible={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default SearchFilter;
