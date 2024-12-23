// src/pages/TeacherProfile.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
    fetchTeacherById,
    updateTeacher,
    updateTeacherImage,
} from "../features/teacher/teacherSlice";
import {
    FaEdit,
    FaTrash,
    // For "Enrolled Students"
} from "react-icons/fa";
/**
 * Example "Delete picture" action:
 * - If you actually have an endpoint for deleting the teacher’s avatar,
 *   you can dispatch the appropriate Redux action here.
 */
async function deleteTeacherImage(teacherId, dispatch) {
    // e.g. dispatch(deleteTeacherImageAction({ teacherId }))
    // For now, just a placeholder
    console.log("Deleting teacher image for teacherId =", teacherId);
}

const TeacherProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { teacherId } = useParams();

    const { teacher, loading, error } = useSelector((state) => state.teacher);

    // Local states
    const [profileName, setProfileName] = useState("");
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("/images/default.jpg");
    const [status, setStatus] = useState("");
    const [about, setAbout] = useState("");

    // On mount or teacherId changes
    useEffect(() => {
        if (teacherId) {
            dispatch(fetchTeacherById(teacherId));
        }
    }, [teacherId, dispatch]);

    // Populate local form fields
    useEffect(() => {
        if (teacher) {
            setProfileName(teacher.name || "");
            setUsername(teacher.slug || teacherId);
            setAvatar(teacher.imageUrl || "/images/default.jpg");
            setStatus(teacher.status || "");
            setAbout(teacher.bio || "");
        }
    }, [teacher, teacherId]);

    // Handlers
    const handleBack = () => {
        navigate(-1);
    };

    const handleSaveChanges = () => {
        if (!teacherId) return;
        const updates = {
            name: profileName,
            slug: username,
            status,
            bio: about,
            // any other fields you want to update
        };
        dispatch(updateTeacher({ teacherId, updates }));
    };

    const handleImageUpload = (e) => {
        if (!teacherId) return;
        const file = e.target.files?.[0];
        if (!file) return;

        const fileURL = URL.createObjectURL(file);
        setAvatar(fileURL);

        const formData = new FormData();
        formData.append("image", file);
        dispatch(updateTeacherImage({ teacherId, formData }));
    };

    const handleDeletePicture = async () => {
        if (!teacherId) return;
        // Reset avatar to default locally:
        setAvatar("/images/default.jpg");
        // Call your "delete" logic / Redux action
        await deleteTeacherImage(teacherId, dispatch);
    };

    if (loading) return <p>Loading teacher info...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!teacher) return <p>No teacher data found.</p>;

    return (
        <div className="max-w-xl mx-auto py-8">
            {/* Back button (not in screenshot, but requested) */}
            <button
                onClick={handleBack}
                className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
                &larr; Back
            </button>

            {/* Container */}
            <div className="bg-white p-6 rounded shadow-md">
                {/* Profile Picture Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile picture
                    </label>
                    <div className="flex items-center space-x-4">
                        {/* Avatar Preview */}
                        <img
                            src={avatar}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full object-cover"
                        />

                        <div className="flex space-x-2">
                            {/* Change Picture */}
                            <label
                                className="      w-10 
              h-10 
              flex 
              items-center 
              justify-center 
              rounded-full 
              bg-blue-100 
              text-blue-600 
              hover:bg-blue-200 
              transition"
                            >
                                <FaEdit className="w-4 h-4" />

                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </label>
                            {/* Delete Picture */}

                            <button
                                onClick={handleDeletePicture}
                                title="Delete Course"
                                className="
              w-10 
              h-10 
              flex 
              items-center 
              justify-center 
              rounded-full 
              bg-red-100 
              text-red-600 
              hover:bg-red-200 
              transition
            "
                            >
                                <FaTrash className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile name
                    </label>
                    <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* Username */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400">@</span>
                        <input
                            type="text"
                            value={username}
                            readOnly
                            className="pl-7 w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-500 focus:outline-none"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Available change in 25/04/2024
                    </p>
                </div>

                {/* Status Recently */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status recently
                    </label>
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="On duty"
                    />
                </div>

                {/* About me */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        About me
                    </label>
                    <textarea
                        rows="3"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Discuss only on work hour..."
                    ></textarea>
                </div>

                {/* Save changes button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSaveChanges}
                        className="
              px-4
              py-2
              bg-teal-600
              text-white
              rounded
              hover:bg-teal-700
              transition
            "
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
