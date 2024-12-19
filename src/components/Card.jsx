import { useState } from "react";
import { useDispatch } from "react-redux";
import { FaEdit, FaTrash } from "react-icons/fa";
import { addModule } from "../features/module/ModuleSlice";

import ModuleModal from "./moduleModel";
const Card = ({ title, category, image, onEdit, onDelete, courseId }) => {
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddModule = (moduleData) => {
        // Get the teacher ID from localStorage
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        // Build the payload
        console.log("printing the course id of the card component ", courseId)
        console.log("printing the teacherId of the card component ", userInfo?.data?._id)
        const payload = {
            ...moduleData,
            courseId: courseId, // Pass the course ID from props
            teacherId: userInfo?.data?._id, // Get the teacher ID from localStorage
        };

        // Dispatch the addModule action
        dispatch(addModule(payload));
        setIsModalVisible(false); // Close the modal after dispatch
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Course Image */}
            <img src={image} alt={title} className="w-full h-32 object-cover" />

            {/* Course Details */}
            <div className="p-4 flex justify-between items-center">
                {/* Left Column: Title and Category */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <p className="text-gray-600 text-sm">Category: {category}</p>
                </div>

                {/* Right Column: Icons */}
                <div className="flex space-x-3">
                    {/* Edit Icon */}
                    <FaEdit
                        onClick={onEdit}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        title="Edit Course"
                    />
                    {/* Delete Icon */}
                    <FaTrash
                        onClick={onDelete}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        title="Delete Course"
                    />
                </div>
            </div>

            {/* Add Module Button */}
            <div className="p-4 border-t">
                <button
                    onClick={() => setIsModalVisible(true)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                >
                    Add Module
                </button>
            </div>

            {/* Module Modal */}
            {isModalVisible && (
                <ModuleModal
                    isVisible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    onSubmit={handleAddModule} // Pass the handleAddModule function
                />
            )}
        </div>
    );
};

export default Card;
