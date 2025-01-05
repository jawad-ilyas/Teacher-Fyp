import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    fetchSubmissionsForAdmin,
    deleteSubmission,
} from "../features/adminSubmissions/adminSubmissionsSlice";
import QuestionCard from "../components/QuestionCard";
import QuestionModule from "../components/QuestionModule";
import Swal from "sweetalert2";
import {
    ArrowLeftIcon,
    ClockIcon,
    DocumentArrowDownIcon,
    CodeBracketIcon,
} from "@heroicons/react/24/outline";
function AdminSubmissionsPage() {
    const dispatch = useDispatch();
    const { teacherId, courseId, moduleId } = useParams();
    const { submissions, loading, error } = useSelector((state) => state.adminSubmissions);
    const [expandedSubmission, setExpandedSubmission] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const handleViewQuestion = (question) => {
        setSelectedQuestion(question);
    };

    const handleDeleteSubmission = (submission) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action will permanently delete the submission.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                const { teacher, student, course, module } = submission;
                dispatch(
                    deleteSubmission({
                        teacherId: teacher._id,
                        studentId: student._id,
                        courseId: course._id,
                        moduleId: module._id,
                    })
                )
                    .then((response) => {
                        if (response.meta.requestStatus === "fulfilled") {
                            Swal.fire("Deleted!", "The submission has been deleted.", "success");

                            // Remove the deleted submission from the local state
                            dispatch(fetchSubmissionsForAdmin({ teacherId, courseId, moduleId }));
                        } else {
                            Swal.fire("Error!", "Failed to delete the submission.", "error");
                        }
                    })
                    .catch(() => {
                        Swal.fire("Error!", "Failed to delete the submission.", "error");
                    });
            }
        });
    };


    const handleCloseQuestionModule = () => {
        setSelectedQuestion(null);
    };

    useEffect(() => {
        if (teacherId && courseId && moduleId) {
            dispatch(fetchSubmissionsForAdmin({ teacherId, courseId, moduleId }));
        }
    }, [dispatch, teacherId, courseId, moduleId]);

    const toggleExpand = (submissionId) => {
        setExpandedSubmission((prev) => (prev === submissionId ? null : submissionId));
    };

    if (loading) {
        return <div className="text-green-400">Loading submissions...</div>;
    }

    if (error) {
        return (
            <div className="bg-gray-800  pt-20 p-4 rounded shadow text-center">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center text-sm text-gray-400 hover:text-gray-200 mr-4"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-1" />
                        Back
                    </button>
                </div>
                <h2 className="text-xl font-bold text-red-400 mb-4">No Submissions Found</h2>
                <p className="text-gray-400">
                    {error?.message}
                </p>
                <div className="mt-6 p-4 bg-gray-700 rounded">
                    <p className="text-gray-500">
                        Once submissions are available, they will appear here with detailed
                        information about the progress.
                    </p>
                </div>
            </div>
        );
    }

    if (!submissions || submissions.length === 0) {
        return (
            <div className="bg-gray-800 p-4 rounded shadow text-center">
                <h2 className="text-xl font-bold text-red-400 mb-4">No Submissions Found</h2>
                <p className="text-gray-400">
                    It seems there are no submissions available for this course yet.
                </p>
                <div className="mt-6 p-4 bg-gray-700 rounded">
                    <p className="text-gray-500">
                        Once submissions are available, they will appear here with detailed
                        information about the progress.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
            <h1 className="text-2xl font-bold text-green-400 mb-4">Admin Submissions</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse bg-gray-800 text-left text-gray-200">
                    <thead>
                        <tr className="bg-gray-700 text-gray-300">
                            <th className="p-3 border-b border-gray-600">#</th>
                            <th className="p-3 border-b border-gray-600">Module</th>
                            <th className="p-3 border-b border-gray-600">Course</th>
                            <th className="p-3 border-b border-gray-600">Teacher</th>
                            <th className="p-3 border-b border-gray-600">Student</th>
                            <th className="p-3 border-b border-gray-600">Total Marks</th>
                            <th className="p-3 border-b border-gray-600">Submission Time</th>
                            <th className="p-3 border-b border-gray-600 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((submission, index) => (
                            <React.Fragment key={submission._id}>
                                <tr className="hover:bg-gray-700">
                                    <td className="p-3 border-b border-gray-600">{index + 1}</td>
                                    <td className="p-3 border-b border-gray-600">
                                        {submission.module?.title || "N/A"}
                                    </td>
                                    <td className="p-3 border-b border-gray-600">
                                        {submission.course?.name || "N/A"}
                                    </td>
                                    <td className="p-3 border-b border-gray-600">
                                        {submission.teacher?.name || "N/A"}
                                    </td>
                                    <td className="p-3 border-b border-gray-600">
                                        {submission.student?.name || "N/A"}
                                    </td>
                                    <td className="p-3 border-b border-gray-600">
                                        {submission.totalMarks || "N/A"}
                                    </td>
                                    <td className="p-3 border-b border-gray-600">
                                        {new Date(submission.createdAt).toLocaleString() || "N/A"}
                                    </td>
                                    <td className="p-3 border-b border-gray-600 text-center">
                                        <button
                                            className="mr-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                                            onClick={() => toggleExpand(submission._id)}
                                        >
                                            {expandedSubmission === submission._id
                                                ? "Hide Questions"
                                                : "View Questions"}
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                                            onClick={() => handleDeleteSubmission(submission)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                                {expandedSubmission === submission._id && (
                                    <tr>
                                        <td colSpan={8} className="p-4 bg-gray-700">
                                            <div className="text-sm text-gray-300">
                                                <h3 className="font-bold text-green-400 mb-4">
                                                    Questions in Submission
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {submission.questions.map((question, index) => (
                                                        <QuestionCard
                                                            key={question._id}
                                                            question={question}
                                                            index={index}
                                                            onView={handleViewQuestion}
                                                        />
                                                    ))}
                                                </div>
                                                {selectedQuestion && (
                                                    <QuestionModule
                                                        question={selectedQuestion}
                                                        onClose={handleCloseQuestionModule}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminSubmissionsPage;
