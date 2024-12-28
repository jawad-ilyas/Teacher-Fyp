import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateQuestion } from "../features/questionsSlice/QuestionsSlice";

const QuestionEditModal = ({ isOpen, onClose, question }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: "",
        difficulty: "Easy",
        category: "",
        tags: [],
        problemStatement: "",
    });

    // Sync formData with question prop
    useEffect(() => {
        if (question) {
            setFormData({
                title: question.title || "",
                difficulty: question.difficulty || "Easy",
                category: question.category || "",
                tags: question.tags || [],
                problemStatement: question.problemStatement || "",
            });
        }
    }, [question]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateQuestion({ id: question._id, questionData: formData }))
            .then(() => {
                onClose(); // Close the modal
            })
            .catch((error) => {
                console.error("Error updating question:", error);
            });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className=" p-6 bg-white text-black rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Question</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Difficulty</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Tags</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags.join(", ")}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    tags: e.target.value.split(",").map((tag) => tag.trim()),
                                }))
                            }
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Problem Statement</label>
                        <textarea
                            name="problemStatement"
                            value={formData.problemStatement}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuestionEditModal;
