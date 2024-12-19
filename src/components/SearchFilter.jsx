import  { useState } from "react";
import Modal from "./Modal";

const SearchFilter = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
            {/* Greeting and Add to Course Button */}
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-700">Hi, Barbara!</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
                >
                    Add to Course
                </button>
            </div>

            {/* Search Section */}
            <div className="flex items-center space-x-2">
                <select className="px-3 py-2 border rounded-lg">
                    <option>Programming</option>
                    <option>Data Science</option>
                </select>
                <input
                    type="text"
                    placeholder="Search..."
                    className="px-4 py-2 border rounded-lg"
                />
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg">
                    Search
                </button>
            </div>

            {/* Modal */}
            <Modal isVisible={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default SearchFilter;
