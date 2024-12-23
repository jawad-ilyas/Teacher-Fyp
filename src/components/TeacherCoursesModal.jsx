import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherCoursesForSingleTeacher } from "../features/teacher/teacherSlice";

const TeacherCoursesModal = ({ teacher, onClose }) => {
    const dispatch = useDispatch();

    const { teacherCourses, loading, error } = useSelector((state) => state.teacher);

    // On load, fetch this teacher’s courses if not already fetched
    useEffect(() => {
        if (teacher && teacher._id) {
            dispatch(fetchTeacherCoursesForSingleTeacher(teacher._id));
        }
    }, [teacher, dispatch]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {/* Modal content */}
            <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[80%] overflow-auto">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                        {teacher.name}'s Courses
                    </h2>
                    <button onClick={onClose} className="text-red-500 font-bold">
                        X
                    </button>
                </div>

                {loading && <p>Loading courses...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}

                {!loading && teacherCourses && teacherCourses.length > 0 ? (
                    <table className="min-w-full border">
                        <thead className="border-b">
                            <tr>
                                <th className="p-2 text-left">Course Name</th>
                                <th className="p-2 text-left">Category</th>
                                <th className="p-2 text-left">Enrolled Students</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teacherCourses.map((course) => (
                                <tr key={course._id} className="border-b">
                                    <td className="p-2">{course.name}</td>
                                    <td className="p-2">{course.category}</td>
                                    <td className="p-2">
                                        {/* Show number of enrolled students, or list them */}
                                        {course.enrolledStudents?.length || 0}
                                        {/* Optionally show them in a dropdown or nested table */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !loading && <p>No courses found for this teacher.</p>
                )}
            </div>
        </div>
    );
};

export default TeacherCoursesModal;
