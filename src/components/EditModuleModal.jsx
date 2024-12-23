import { useForm } from "react-hook-form";
import { useEffect } from "react";

const EditModuleModal = ({ isVisible, onClose, onSubmit, module }) => {
    const { register, handleSubmit, reset } = useForm();

    // Reset the form whenever the `module` prop changes
    console.log("module", module)
    useEffect(() => {
        if (module) {
            reset({
                title: module?.title || "",
                description: module?.description || "",
                startTime: module?.startTime ? new Date(module.startTime).toISOString().slice(0, 16) : "",
                endTime: module?.endTime ? new Date(module.endTime).toISOString().slice(0, 16) : "",
            });
        }
    }, [module, reset]);

    const handleFormSubmit = (data) => {
        onSubmit({
            ...data,
            id: module._id, // Module ID
            course: module.course, // Course ID from module
        }); // Include the module and course IDs
        onClose(); // Close the modal after submission
    };


    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Module</h2>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Title</label>
                        <input
                            type="text"
                            {...register("title")}
                            className="w-full border px-4 py-2 rounded-lg"
                            placeholder="Module Title"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Description</label>
                        <textarea
                            {...register("description")}
                            className="w-full border px-4 py-2 rounded-lg"
                            placeholder="Module Description"
                            required
                        ></textarea>
                    </div>

                    {/* Start Time */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Start Time</label>
                        <input
                            type="datetime-local"
                            {...register("startTime")}
                            className="w-full border px-4 py-2 rounded-lg"
                            required
                        />
                    </div>

                    {/* End Time */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">End Time</label>
                        <input
                            type="datetime-local"
                            {...register("endTime")}
                            className="w-full border px-4 py-2 rounded-lg"
                            required
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModuleModal;
