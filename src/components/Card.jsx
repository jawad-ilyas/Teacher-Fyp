import { FaEdit, FaTrash } from "react-icons/fa"; // Importing icons for Edit and Delete

const Card = ({ title, category, image, onEdit, onDelete }) => {
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
        </div>
    );
};

export default Card;
