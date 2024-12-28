import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";

import {
    fetchEnrolledStudents,
    removeEnrolledStudent,
} from "../features/student/enrolledStudentsSlice";

/**
 * A small dropdown for row-level actions (View, Edit, Delete).
 * Updated to an icon or stylized button. 
 */
const DropdownAction = ({ onView, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="
          flex
          items-center
          justify-center
          w-8
          h-8
          bg-gray-100
          text-gray-600
          rounded-full
          hover:bg-gray-200
          transition
        "
                title="Actions"
            >
                •••
            </button>
            {open && (
                <div
                    className="
            absolute
            right-0
            mt-1
            w-36
            bg-white
            border
            border-gray-200
            rounded
            shadow-lg
            z-10
          "
                >
                    <button
                        onClick={() => {
                            setOpen(false);
                            onView();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        View Info
                    </button>
                    <button
                        onClick={() => {
                            setOpen(false);
                            onEdit();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Edit Info
                    </button>
                    <button
                        onClick={() => {
                            setOpen(false);
                            onDelete();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

/**
 * Optional: A small badge component if you want color-coded status.
 * If you don't want color coding, you can remove or simplify this.
 */
const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-200";
    let textColor = "text-gray-700";
    const label = status; // e.g., "active" or "inactive"

    if (status === "active") {
        bgColor = "bg-green-100";
        textColor = "text-green-700";
    } else if (status === "inactive") {
        bgColor = "bg-red-100";
        textColor = "text-red-700";
    }

    return (
        <span
            className={`
        px-2
        py-1
        rounded-full
        text-xs
        font-medium
        capitalize
        ${bgColor}
        ${textColor}
      `}
        >
            {label}
        </span>
    );
};

const ShowEnrolledStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courseId } = useParams();

    // Redux state
    const { students, loading, error } = useSelector(
        (state) => state.enrolledStudents
    );

    // Local states for search/filter/sort
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("nameAsc");
    const [statusFilter, setStatusFilter] = useState("all");

    // Fetch data on mount
    useEffect(() => {
        dispatch(fetchEnrolledStudents(courseId)).then((res) => {
            console.log("Enrolled students data:", res);
        });
    }, [courseId, dispatch]);

    // Handlers
    const handleBack = () => {
        navigate(-1);
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleViewInfo = (studentId) => {
        navigate(`/course/${courseId}/students/${studentId}`);
    };
    const handleEditInfo = (studentId) => {
        navigate(`/students/${studentId}`);
    };

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

    if (loading) {
        return <p className="p-4">Loading enrolled students...</p>;
    }
    if (error) {
        return <p className="p-4 text-red-500">{error}</p>;
    }

    // Filter + Search + Sort
    const filteredStudents = students
        // Filter by status
        .filter((enroll) => {
            if (!enroll?.student) return false;
            if (statusFilter === "active") return enroll.status === "active";
            if (statusFilter === "inactive") return enroll.status === "inactive";
            return true; // "all" => no filter
        })
        // Search name/email
        .filter((enroll) => {
            const term = searchTerm.toLowerCase();
            const name = enroll.student.name?.toLowerCase() || "";
            const email = enroll.student.email?.toLowerCase() || "";
            return name.includes(term) || email.includes(term);
        })
        // Sort
        .sort((a, b) => {
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
        <div className="min-h-screen pt-20 bg-gray-50">
            {/* TOP BAR */}
            <div className="flex items-center justify-between p-4 bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleBack}
                        className="text-sm font-medium text-teal-600 hover:underline"
                    >
                        &larr; Back
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800">
                        Enrolled Students
                    </h1>
                </div>
            </div>

            {/* SEARCH / FILTER / SORT BAR */}
            <div
                className="
          flex flex-col
          sm:flex-row
          items-center
          justify-between
          bg-white
          shadow
          rounded-lg
          mx-4
          mt-4
          px-4
          py-3
          space-y-3
          sm:space-y-0
        "
            >
                {/* Search input */}
                <div className="w-full sm:w-auto flex items-center">
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="
              w-full
              sm:w-64
              border
              border-gray-300
              rounded-md
              px-3
              py-2
              focus:outline-none
              focus:ring-2
              focus:ring-teal-500
              text-sm
              placeholder-gray-400
            "
                    />
                </div>

                {/* Status Filter */}
                {/* <div className="flex items-center space-x-2">
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="
              border
              border-gray-300
              rounded-md
              px-3
              py-2
              focus:outline-none
              focus:ring-2
              focus:ring-teal-500
              text-sm
            "
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div> */}

                {/* Sort Option */}
                <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Sort by:</label>
                    <select
                        value={sortOption}
                        onChange={handleSortChange}
                        className="
              border
              border-gray-300
              rounded-md
              px-3
              py-2
              focus:outline-none
              focus:ring-2
              focus:ring-teal-500
              text-sm
            "
                    >
                        <option value="nameAsc">Name (A-Z)</option>
                        <option value="nameDesc">Name (Z-A)</option>
                        <option value="dateAsc">Enroll Date (Oldest)</option>
                        <option value="dateDesc">Enroll Date (Newest)</option>
                    </select>
                </div>
            </div>

            {/* SINGLE TABLE */}
            <div className="mt-4 px-4">
                <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                {/* <th className="px-4 py-3 text-left">Enrolled Date</th> */}
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredStudents.map((enroll) => (
                                <tr key={enroll.student._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-800">
                                        {enroll.student.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {enroll.student.email}
                                    </td>
                                    {/* <td className="px-4 py-3 text-gray-600">
                                        {enroll.enrolledDate || "N/A"}
                                    </td> */}
                                    <td className="px-4 py-3">
                                        <StatusBadge status={enroll.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <DropdownAction
                                            onView={() => handleViewInfo(enroll.student._id)}
                                            onEdit={() => handleEditInfo(enroll.student._id)}
                                            onDelete={() => handleDelete(enroll.student._id)}
                                        />
                                    </td>
                                </tr>
                            ))}

                            {/* "No students found" row */}
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
