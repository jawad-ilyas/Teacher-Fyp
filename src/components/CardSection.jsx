import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Modal from "./Modal";
import Card from "./Card";
import { searchCoursesByUser, deleteCourse } from "../features/course/CourseSlice";

const CardSection = () => {
    const dispatch = useDispatch();
    const { courses, loading, error } = useSelector((state) => state.courses);

    const [selectedCourse, setSelectedCourse] = useState(null); // For update
    const [showModal, setShowModal] = useState(false); // Modal visibility

    // Fetch all courses on component load
    useEffect(() => {
        dispatch(searchCoursesByUser());
    }, [dispatch]);

    // Open modal for creating or updating a course
    const handleEdit = (course) => {
        setSelectedCourse(course); // Pass course data for editing
        setShowModal(true); // Show the modal
    };

    // Close the modal
    const closeModal = () => {
        setSelectedCourse(null); // Reset selected course
        setShowModal(false); // Hide the modal
    };

    // Handle course deletion
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteCourse(id)).then(() => {
                    Swal.fire("Deleted!", "Your course has been deleted.", "success");
                });
            }
        });
    };

    // Display loading state
    if (loading) {
        return <p className="text-center text-gray-500">Loading courses...</p>;
    }

    // Display error state
    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    // Display empty state
    if (courses.length === 0) {
        return <p className="text-center text-gray-500">No courses found.</p>;
    }
    console.log("courses", courses)
    return (
        <div>
            {/* Course Cards */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <Card
                        key={course._id}
                        courseId={course._id}
                        title={course?.name}
                        category={course?.category}
                        description={course?.description}
                        teacher={course?.teacher?.name}
                        image={course?.imageUrl}
                        onEdit={() => handleEdit(course)} // Open edit modal
                        onDelete={() => handleDelete(course._id)} // Trigger delete confirmation
                    />
                ))}
            </div>

            {/* Create or Update Modal */}
            {showModal && (
                <Modal
                    isVisible={showModal}
                    onClose={closeModal}
                    initialValues={selectedCourse} // Pass selected course for editing, null for creating
                />
            )}
        </div>
    );
};

export default CardSection;
