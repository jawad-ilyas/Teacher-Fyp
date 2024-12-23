import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";

import {
    fetchEnrolledStudents,
    removeEnrolledStudent,
} from "../features/student/enrolledStudentsSlice";

/**
 * ShowEnrolledStudents
 *
 * This component fetches the real list of enrolled students for a given course from the Redux slice,
 * provides a table with searching, sorting, filtering, and a "delete" action.
 */
const ShowEnrolledStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courseId } = useParams(); // from /courses/:courseId/enrolled-students

    // Redux state from enrolledStudentsSlice
    const { students, loading, error } = useSelector((state) => state.enrolledStudents);

    // Local states for filtering, sorting, searching
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("nameAsc");
    const [statusFilter, setStatusFilter] = useState("all");

    // On mount or courseId change, fetch from the server
    useEffect(() => {
        dispatch(fetchEnrolledStudents(courseId)).then((res) => {
            console.log("Enrolled students data:", res);
        });
    }, [courseId, dispatch]);


    // “Back” button
    const handleBack = () => {
        navigate(-1);
    };

    // Searching
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Sorting
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Filter by status
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // In ShowEnrolledStudents
    const handleViewInfo = (studentId) => {
        navigate(`/students/${studentId}`);
    };
    const handleEditInfo = (studentId) => {
        navigate(`/students/${studentId}`);
        // or any logic you like
    };


    // Delete / Remove
    const handleDelete = (studentId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This student will be removed from the course!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#a5a5a5",
            confirmButtonText: "Yes, delete them!",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(removeEnrolledStudent({ courseId, studentId }))
                    .unwrap()
                    .then(() => {
                        Swal.fire("Deleted!", "The student has been removed.", "success");
                    })
                    .catch((err) => {
                        console.error("Failed to remove student:", err);
                        Swal.fire("Error", "Could not remove the student.", "error");
                    });
            }
        });
    };

    // If loading or error
    if (loading) {
        return <p className="p-4">Loading enrolled students...</p>;
    }
    if (error) {
        return <p className="p-4 text-red-500">{error}</p>;
    }

    // We have an array of objects: { student: { _id, name, email, role }, status: ... }
    // So let's rename them in the sort/filter logic for clarity
    const filteredStudents = students
        .filter((enroll) => {
            const stStatus = enroll.status; // e.g. "active", "inactive"
            if (statusFilter === "all") return true;
            if (statusFilter === "active") return stStatus === "active";
            if (statusFilter === "inactive") return stStatus === "inactive";
            return true;
        })
        .filter((enroll) => enroll && enroll.student)
        .filter((enroll) => {
            const term = (searchTerm || "").toLowerCase();
            const name = enroll.student.name?.toLowerCase() || "";
            const email = enroll.student.email?.toLowerCase() || "";
            return name.includes(term) || email.includes(term);
        })

        .sort((a, b) => {
            // a.student.name, a.enrolledDate ? etc.
            // If your backend doesn't store enrolledDate in the subdoc, you might not have a date to sort on
            // For demonstration, assume there's an "enrolledDate" field in the main doc
            if (sortOption === "nameAsc") {
                return a.student.name?.localeCompare(b.student.name);
            } else if (sortOption === "nameDesc") {
                return b.student.name?.localeCompare(a.student.name);
            } else if (sortOption === "dateAsc") {
                return new Date(a.enrolledDate) - new Date(b.enrolledDate);
            } else if (sortOption === "dateDesc") {
                return new Date(b.enrolledDate) - new Date(a.enrolledDate);
            }
            return 0;
        });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header / Top bar */}
            <div className="flex items-center px-4 py-3 bg-white shadow">
                <button
                    onClick={handleBack}
                    className="mr-3 text-blue-600 font-bold hover:underline"
                >
                    &larr; Back
                </button>
                <h1 className="text-xl font-semibold">Enrolled Students</h1>
            </div>

            {/* Filters Row */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                {/* Left: Search and Filter */}
                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* Right: Sorting */}
                <div className="flex items-center space-x-2">
                    <label className="font-medium text-gray-700">Sort by:</label>
                    <select
                        value={sortOption}
                        onChange={handleSortChange}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="nameAsc">Name (A-Z)</option>
                        <option value="nameDesc">Name (Z-A)</option>
                        <option value="dateAsc">Enrolled Date (Oldest)</option>
                        <option value="dateDesc">Enrolled Date (Newest)</option>
                    </select>
                </div>
            </div>

            {/* Students Table */}
            <div className="p-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg shadow">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Name</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Email</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Enrolled Date</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Status</th>
                                <th className="px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((enroll) => (
                                <tr key={enroll.student._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{enroll.student.name}</td>
                                    <td className="px-4 py-2">{enroll.student.email}</td>
                                    <td className="px-4 py-2">{enroll.enrolledDate || "N/A"}</td>
                                    <td className="px-4 py-2 capitalize">{enroll.status}</td>
                                    <td className="px-4 py-2">
                                        {/* Actions Dropdown or buttons */}
                                        <div className="relative inline-block text-left">
                                            <DropdownAction
                                                onView={() => handleViewInfo(enroll.student._id)}
                                                onEdit={() => handleEditInfo(enroll.student._id)}
                                                onDelete={() => handleDelete(enroll.student._id)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center text-gray-500 py-4">
                                        No students found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShowEnrolledStudents;


const DropdownAction = ({ onView, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
            >
                Actions
            </button>
            {open && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                    <button
                        onClick={() => {
                            setOpen(false);
                            onView();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        View Info
                    </button>
                    <button
                        onClick={() => {
                            setOpen(false);
                            onEdit();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        Edit Info
                    </button>
                    <button
                        onClick={() => {
                            setOpen(false);
                            onDelete();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};
