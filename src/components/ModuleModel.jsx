import { useForm } from "react-hook-form";

const ModuleModal = ({ isVisible, onClose, onSubmit }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const submitHandler = (data) => {
        onSubmit(data); // Pass the data to the parent component
        reset(); // Reset the form after submission
        onClose(); // Close the modal
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-700">Add Module</h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        &#x2715;
                    </button>
                </div>
                <form onSubmit={handleSubmit(submitHandler)}>
                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Module Title</label>
                        <input
                            type="text"
                            {...register("title", { required: "Module title is required" })}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter module title"
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            rows="4"
                            placeholder="Enter module description"
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    {/* Start Time */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Start Time</label>
                        <input
                            type="datetime-local"
                            {...register("startTime", { required: "Start time is required" })}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime.message}</p>}
                    </div>

                    {/* End Time */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">End Time</label>
                        <input
                            type="datetime-local"
                            {...register("endTime", { required: "End time is required" })}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
                        >
                            Save Module
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModuleModal;
