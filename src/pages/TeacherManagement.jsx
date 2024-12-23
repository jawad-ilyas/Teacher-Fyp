// src/pages/TeacherManagement.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    fetchAllTeachers,
    fetchTeacherCoursesForSingleTeacher,
} from "../features/teacher/teacherSlice";
import TeacherCoursesModal from "../components/TeacherCoursesModal";

const TeacherManagement = () => {
    const dispatch = useDispatch();

    // For advanced filters
    const [searchTerm, setSearchTerm] = useState("");
    const [courseCountFilter, setCourseCountFilter] = useState("all");
    const [sortField, setSortField] = useState("none");

    // For teacher courses modal
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [showCoursesModal, setShowCoursesModal] = useState(false);

    // Redux state
    const { teachers, loading, error } = useSelector((state) => state.teacher);

    // Whenever these change, dispatch
    useEffect(() => {
        dispatch(
            fetchAllTeachers({
                search: searchTerm,
                courseCount: courseCountFilter,
                sortField,
            })
        );
    }, [searchTerm, courseCountFilter, sortField, dispatch]);

    const handleViewCourses = (teacher) => {
        setSelectedTeacher(teacher);
        setShowCoursesModal(true);
        dispatch(fetchTeacherCoursesForSingleTeacher(teacher._id));
    };

    const handleCloseModal = () => {
        setShowCoursesModal(false);
        setSelectedTeacher(null);
    };

    return (
        <div className="p-4">
            {/* Filter UI */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search teachers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 rounded"
                    />

                    <select
                        value={courseCountFilter}
                        onChange={(e) => setCourseCountFilter(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="all">All Teachers</option>
                        <option value="exact1">Exactly 1 course</option>
                        <option value="2plus">2+ courses</option>
                    </select>

                    <select
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="none">No Sorting</option>
                        <option value="createdAtAsc">Oldest First</option>
                        <option value="createdAtDesc">Newest First</option>
                    </select>
                </div>

            </div>

            <h1 className="text-2xl font-semibold mb-4">Find a Teacher</h1>
            {loading && <p>Loading teachers...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && teachers && teachers.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {teachers.map((teacher) => (
                        <div
                            key={teacher._id}
                            className="bg-white rounded-lg shadow p-4 flex space-x-4"
                        >
                            <Link to={`/teachers/${teacher._id}`}>
                                <img
                                    src={teacher.imageUrl || "/images/default-teacher.jpg"}
                                    alt={teacher.name}
                                    className="w-20 h-20 object-cover rounded-full"
                                />
                            </Link>

                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">{teacher.name}</h2>
                                    <div className="text-yellow-500 text-sm flex items-center">
                                        {/* rating placeholder */}
                                        {[...Array(teacher.rating || 5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className="w-4 h-4 fill-current"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 .587l3.668 7.431 8.21 1.193-5.93 5.779 1.404 8.176L12 18.896l-7.352 3.87 1.405-8.176-5.931-5.779 8.21-1.193z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm">
                                    {teacher.location || "Location not specified"}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {teacher.bio || "No bio..."}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {teacher.subjects?.map((subject) => (
                                        <span
                                            key={subject}
                                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                        >
                                            {subject}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-3 flex items-center space-x-2">
                                    <button
                                        className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
                                        onClick={() => handleViewCourses(teacher)}
                                    >
                                        View Courses
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !loading && <p>No teachers found.</p>
            )}

            {showCoursesModal && selectedTeacher && (
                <TeacherCoursesModal
                    teacher={selectedTeacher}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default TeacherManagement;
