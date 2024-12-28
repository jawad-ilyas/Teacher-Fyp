import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const AddStudentModal = ({ isVisible, onClose, onSubmit }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // Submit handler
    const handleFormSubmit = async (data) => {
        try {
            console.log("[AddStudentModal] Submitting student data:", data);
            // Wait for the parent 'onSubmit' to complete
            await onSubmit(data);

            // If successful, show a toast
            toast.success("Student added successfully!");

            // Reset the form and close the modal
            reset();
            onClose();
        } catch (err) {
            console.error("Failed to add student:", err);
            // Show an error toast
            toast.error("Failed to add student!");
        }
    };

    if (!isVisible) return null; // Do not render if not visible

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Add a Student</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-lg font-semibold"
                    >
                        &#x2715;
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    {/* Student Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Student Email
                        </label>
                        <input
                            type="email"
                            {...register("email", { required: "Student email is required" })}
                            placeholder="Enter student email"
                            className="
                w-full
                border
                rounded-lg
                px-4
                py-2
                focus:outline-none
                focus:ring-2
                focus:ring-teal-400
              "
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className="
                px-4
                py-2
                bg-gray-200
                text-gray-700
                rounded-md
                hover:bg-gray-300
                transition
              "
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="
                px-4
                py-2
                bg-teal-600
                text-white
                rounded-md
                hover:bg-teal-700
                transition
              "
                        >
                            Add Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
