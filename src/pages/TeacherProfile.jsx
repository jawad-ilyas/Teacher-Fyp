// src/pages/TeacherProfile.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
    fetchTeacherById,
    updateTeacher,
    updateTeacherImage,
} from "../features/teacher/teacherSlice";

const TeacherProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { teacherId } = useParams();

    const { teacher, loading, error } = useSelector((state) => state.teacher);

    // Local states
    const [publicName, setPublicName] = useState("");
    const [slug, setSlug] = useState("");
    const [avatar, setAvatar] = useState("/images/default.jpg");

    const [branding, setBranding] = useState(false);
    const [reports, setReports] = useState(false);
    const [includeInEmails, setIncludeInEmails] = useState(false);

    const [twitter, setTwitter] = useState("");
    const [facebook, setFacebook] = useState("");
    const [linkedin, setLinkedin] = useState("");

    // On mount or teacherId changes
    useEffect(() => {
        if (teacherId) {
            dispatch(fetchTeacherById(teacherId));
        }
    }, [teacherId, dispatch]);

    // Populate local form fields
    useEffect(() => {
        if (teacher) {
            setPublicName(teacher.name || "");
            setSlug(teacher.slug || teacherId);
            setAvatar(teacher.imageUrl || "/images/default.jpg");

            setBranding(teacher.branding || false);
            setReports(teacher.reports || false);
            setIncludeInEmails(teacher.includeInEmails || false);

            setTwitter(teacher.twitter || "");
            setFacebook(teacher.facebook || "");
            setLinkedin(teacher.linkedin || "");
        }
    }, [teacher, teacherId]);

    // Handlers
    const handleBack = () => {
        navigate(-1);
    };

    const handleViewProfile = () => {
        // e.g. navigate to a public page, or just console.log
        console.log("Viewing public profile");
    };

    const handleSaveChanges = () => {
        if (!teacherId) return;
        const updates = {
            name: publicName,
            slug,
            branding,
            reports,
            includeInEmails,
            twitter,
            facebook,
            linkedin,
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

    const handleCancel = () => {
        console.log("Canceled changes");
    };

    if (loading) return <p>Loading teacher info...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!teacher) return <p>No teacher data found.</p>;

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <img
                        src={avatar}
                        alt={publicName}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-2xl font-semibold">{publicName}</h1>
                        <p className="text-sm text-gray-500">
                            untitledui.com/<span className="font-medium">{slug}</span>
                        </p>
                    </div>
                </div>
                <div className="space-x-2">
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleViewProfile}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                        View profile
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save changes
                    </button>
                </div>
            </div>

            {/* Main card */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Teacher Profile</h2>
                <p className="text-gray-500 mb-6">
                    Update your photo and details here.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Public Name
                        </label>
                        <input
                            type="text"
                            value={publicName}
                            onChange={(e) => setPublicName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Slug / Handle
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                </div>

                <h3 className="text-sm font-medium text-gray-700 mb-2">Profile Photo</h3>
                <div className="flex items-center space-x-4 mb-6">
                    <img
                        src={avatar}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <label className="cursor-pointer px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                        <span>Click to upload</span>
                        <input
                            type="file"
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                        />
                    </label>
                </div>

                {/* Toggles */}
                <div className="flex items-center mb-4">
                    <input
                        id="branding"
                        type="checkbox"
                        checked={branding}
                        onChange={(e) => setBranding(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="branding" className="ml-2 text-sm text-gray-700">
                        Branding
                    </label>
                </div>

                <div className="flex items-center mb-4">
                    <input
                        id="reports"
                        type="checkbox"
                        checked={reports}
                        onChange={(e) => setReports(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="reports" className="ml-2 text-sm text-gray-700">
                        Reports
                    </label>
                </div>

                <div className="flex items-center mb-6">
                    <input
                        id="includeInEmails"
                        type="checkbox"
                        checked={includeInEmails}
                        onChange={(e) => setIncludeInEmails(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="includeInEmails" className="ml-2 text-sm text-gray-700">
                        Include in Emails
                    </label>
                </div>

                {/* Social Profiles */}
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Social Profiles
                    </h3>
                    <div className="flex flex-col space-y-2">
                        <div>
                            <label className="block text-sm text-gray-600">Twitter</label>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-400">twitter.com/</span>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded px-3 py-1 w-full"
                                    value={twitter}
                                    onChange={(e) => setTwitter(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600">Facebook</label>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-400">facebook.com/</span>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded px-3 py-1 w-full"
                                    value={facebook}
                                    onChange={(e) => setFacebook(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600">LinkedIn</label>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-400">linkedin.com/company/</span>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded px-3 py-1 w-full"
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex justify-end space-x-2">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
